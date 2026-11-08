# State & data layer

The single most important convention in this repo: **server state and client state
are strictly separated**, and components never talk to HTTP directly.

```
Component (src/components/X, src/view/X)
  → React Query hook (useQuery / useMutation, key constants, invalidation)
    → Zustand store function (thin Axios wrapper, no state)
      → clientApi (src/services/client.ts, baseURL /api/v1)
        → Next.js route (src/app/api/v1/**)
          → Supabase
```

## 1. React Query (server state)

- Provider: `src/components/QueryProvider/index.tsx` (module-level `new QueryClient()`),
  mounted in `src/app/layout.tsx`.
- Query keys are **plain arrays**. Conventions in use:

| Key | Where |
|---|---|
| `["projects", "feed", i18n.language]` | public infinite feed |
| `["project", slug, i18n.language]` | detail |
| `["awards", "feed", lang, category]` | filtered feed |
| `ADMIN_PROJECTS_KEY = ["admin", "projects"]` | exported constant per admin domain |
| `["admin", "visits", range, device, page, search]` | analytics |
| `["site-settings"]`, `["chatbot", "model"]` | misc |

- **Mutation hooks** live in `hooks/useXMutation.ts` and export the key constant.
  Real excerpt from `src/view/Admin/Projects/hooks/useProjectsMutation.ts`:

```ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAdminProjects } from "../store"

export const ADMIN_PROJECTS_KEY = ["admin", "projects"]

const invalidateProjectQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  queryClient.invalidateQueries({ queryKey: ADMIN_PROJECTS_KEY })
  queryClient.invalidateQueries({ queryKey: ["projects"] })
}

export const useCreateProject = () => {
  const { createProject } = useAdminProjects()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: unknown) => createProject(body),
    onSuccess: () => invalidateProjectQueries(queryClient),
  })
}
```

- The store is destructured **before** `useMutation` (`const { createProject } = useAdminProjects()`).
- `useUpdateProject` takes `{ slug, body }`, `useDeleteProject` takes `slug`.
- Always invalidate **both** the admin key and the public key after a write.
- Public feeds often use `useInfiniteQuery` (`initialPageParam: 1`,
  `getNextPageParam` from `pagination`, `staleTime: 60_000`).
- Loading UI → `Shimmer`; empty UI → `t("empty")`.
- Query hooks are normally written **inline in the component**; only extract a
  `use…Query` file when reused (exemplar: `src/hooks/useSiteSettings.ts`).

## 2. Zustand (client/UI state)

Two kinds of stores coexist.

### 2a. API-wrapper stores — no state, only functions

Hold **no state**, only functions that call `clientApi`. React Query owns all
caching; never mirror responses into the store.

Real excerpt from `src/view/Admin/Projects/store/index.ts`:

```ts
"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { toPageQuery, unwrapList } from "@/lib/pagination"
import { ProjectAdminStore } from "./type"

export const useAdminProjects = create<ProjectAdminStore>()((set, get) => ({
  getAdminProjects: async (params) => {
    const res = await clientApi({
      url: `/admin/projects?${toPageQuery({
        page: params?.page ?? 1,
        perPage: params?.perPage ?? 100,
        search: params?.search ?? "",
      })}`,
      method: "GET",
    })
    return res
  },
  createProject: async (body: any) => {
    const res = await clientApi({
      url: `/admin/projects`,
      method: "POST",
      data: body,
    })
    return res.data
  },
}))
```

The paired type file `store/type/index.ts` is a plain interface of functions:

```ts
export interface ProjectAdminStore {
  getAdminProjects: (params?: PageParams) => Promise<any>
  createProject: (body: any) => Promise<any>
  updateProject: (slug: string, body: any) => Promise<any>
  deleteProject: (slug: string) => Promise<any>
}
```

Notes:
- `set`/`get` appear in the signature but API wrappers rarely use them.
- Return shape: lists return the envelope `res`, mutations return `res.data`.

### 2b. UI/workflow stores — real state + actions

Excerpt from `src/components/ActionModal/store/index.ts`:

```ts
"use client"

import { create } from "zustand"
import type { ActionModalStore } from "./type"

export const useActionModal = create<ActionModalStore>()((set) => ({
  modalActions: {
    success: true,
    isOpen: false,
    descText: "",
    infoText: "",
    doubleButton: false,
    closeButton: false,
    link: undefined,
    onCancel: undefined,
    onConfirm: undefined,
  },
  openModalActions: (props) =>
    set({
      modalActions: {
        ...props,
        isOpen: true,
      },
    }),
  closeModalActions: () =>
    set((state) => ({
      modalActions: {
        ...state.modalActions,
        isOpen: false,
      },
    })),
}))
```

Other UI stores: `useConfirmModal`, ChatbotSection store.

### Conventions

- Folder `store/index.ts` (sometimes `.tsx`), types in `store/type/index.ts`.
- Curried form always: `create<StoreType>()((set, get) => ({ ... }))`.
- `"use client"` is always the first line.
- Hook naming: `use<Purpose>` — `useProjects`, `useAdminProjects`, `useActionModal`.
- **No `persist`** anywhere (language lives in raw `localStorage` via `LanguageProvider`,
  theme via `next-themes`).
- Local constants stay inside the functions that use them; only constants exported
  to other files sit at module scope.

## 3. Axios client — `src/services/client.ts`

```ts
const axiosInterceptorInstance = axios.create({ baseURL: `/api/v1`, timeout: 1000000 })

export default async function clientApi(payload: AxiosRequestConfig) { ... }
```

Response interceptor behavior:
- **401** → retry once with `getSession()`, otherwise `signOut()`
- **403** → redirect to `/admin/profil`
- **503** → redirect to `/503`

`clientApi` returns `response.data`.

Rules:
- Stores call `clientApi({ url, method, data })`; components call store functions only.
- Return shape is inconsistent by design: list endpoints return the envelope
  (`res`), single-item endpoints return `res.data`. Normalize with `unwrapList<T>()`.
- Errors are re-thrown as `{ message, status, code, data }` — UI reads them via
  `getErrorMessage` from `src/helper/getErrorMessage.ts`.
- `next-auth/react` imports in the interceptor are vestigial; real auth is Supabase.

## 4. Pagination helpers

`src/lib/pagination.ts` (client side):

| Export | Purpose |
|---|---|
| `toPageQuery({ page, perPage, ... })` | build `page=&per_page=` query string |
| `unwrapList<T>(res)` | extract `data[]` from the envelope |
| `Paginated<T>`, `PageParams` | types |

`src/helper/server/pagination.ts` (route handlers):

| Export | Signature |
|---|---|
| `parsePaginationParams(searchParams, { defaultPage, defaultPerPage, maxPerPage })` | clamps `page`/`per_page` |
| `toSupabaseRange({ page, perPage })` | `{ from, to }` inclusive range |
| `buildPaginationMeta(params, total)` | `{ page, per_page, total, total_pages }` |
| `paginated(data, meta)` | `{ data, pagination }` envelope |
| `sanitizeLikeParam(value)` | strips `[%(),"]\` and slices to 80 chars (protects PostgREST `.or()`) |
| `fetchTranslationIds(supabase, table, fkColumn, textColumns, search)` | search inside `*_translations` |

## 5. Static data (`src/data/`)

- Types in the non-suffixed file (`projects.ts`, `profile.ts`, `experiences.ts`).
- Content in `projects.en.ts` / `projects.id.ts` etc. (`export const projects: Project[]`).
- **Single hub**: `src/data/localized.ts` — `getProjects(locale)`, `getExperiences(locale)`,
  `getSkillGroups(locale)`, `getAwards(locale)`, `getProject(locale, slug)`, `projectSlugs`,
  `siteConfig`.
- Consumers: `components/Hero`, `app/(public)/projects/[slug]` (static params),
  `app/api/v1/chat/knowledge.ts`.
- Static data is also a **fallback layer** when the API returns empty (Awards store,
  Projects placeholder `helper/template.ts`).

## 6. Supabase clients — pick the right one

| File | Signature | Use when |
|---|---|---|
| `src/lib/supabase/client.ts` | `createClient()` → `createBrowserClient` | browser / Client Components: sign-in, auth UI |
| `src/lib/supabase/server.ts` | `await createClient()` → `createServerClient` (cookies) | API routes, Server Components — **new client per request** |
| `src/lib/supabase/admin.ts` | `createAdminClient()` (service role, `persistSession:false`) | **server-only** writes that bypass RLS (analytics RPC). Never import client-side. |
| `src/lib/supabase/proxy.ts` | `updateSession(request)` | called from `src/proxy.ts` (middleware): cookie sync + `getClaims()` + route guards |

Rules:
- Public content → anon client (`createClient()`), no `getUser()` needed.
- Admin API routes → `auth.getUser()` guard, **JSON 401** (never an HTML redirect).
- Service-role key must never leave the server bundle.
- `getSession()` is not used in API routes; only `getUser()` / `getClaims()`.

## 7. Site settings hook

`src/hooks/useSiteSettings.ts` → query key `["site-settings"]` → `GET /api/v1/settings`
(which never fails; returns a hardcoded fallback with `fallback: true`).
