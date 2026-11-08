# AGENTS.md — AI Agent Guide for portofolioMarkVII

> Read this file first. It is the single entry point for AI coding agents working in this
> repository. Detailed documentation lives in [`docs/`](docs/) — read only the file you need.

## 1. Project snapshot

Personal portfolio site (salmanbaqy.dev) for "Muhamad Salman Adhim Baqy": a public marketing
site plus a private admin CMS.

| Item | Value |
|---|---|
| Framework | Next.js **16.1.7** (App Router, Turbopack), React **19**, TypeScript **5.9** strict |
| Styling | Tailwind CSS **v4**, shadcn/ui (style `radix-nova`, `src/components/ui/`), lucide icons |
| Data / DB | Supabase (Postgres + Storage) via `@supabase/ssr` |
| Server state | TanStack React Query |
| Client state | Zustand (no `persist`) |
| Forms | react-hook-form + **Yup** (`yupResolver`) |
| i18n | i18next, per-feature `i18n/en.ts` + `i18n/id.ts`, locales `id` (default) and `en` |
| Package manager | **pnpm** (use `pnpm`, never `npm`/`yarn`) |
| Path alias | `@/*` → `./src/*` |
| Animations | framer-motion (`Reveal` wrapper) |

### Commands

```bash
pnpm dev          # next dev --turbopack
pnpm build        # next build
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit
pnpm format       # prettier --write "**/*.{ts,tsx}"
```

Known quirks:
- `pnpm i18n:validate` is **broken** (`scripts/validate-translations.mjs` does not exist). Validate i18n keys manually.
- A stale `package-lock.json` exists next to `pnpm-lock.yaml` — always use **pnpm**.
- No test framework and no CI are configured.
- ESLint has `no-explicit-any`, `no-unused-vars`, `exhaustive-deps` turned **off**.

## 2. Hard rules (never break without explicit instruction)

1. **Data flow** is always `Component → React Query hook → Axios service (Zustand API wrapper) → /api/v1`. Components never call `axios`/`fetch` directly.
2. **React Query owns server state** (keys, cache, invalidation). **Zustand owns UI/workflow state** only. Never mirror server responses into Zustand.
3. **Feature-oriented folders only.** Each feature is a self-contained slice (`index.tsx` orchestrator + `components/ form/ validation/ hooks/ table/ store/ i18n/ helper/`, create subfolders only when needed).
4. **i18n is per-feature**: `i18n/en.ts` + `i18n/id.ts` with the same flat camelCase keys; namespace = feature name. Admin views are hardcoded Indonesian (existing convention — do not introduce i18n there unless asked).
5. **Forms**: `validation/index.ts` = Yup schema only; `form/index.ts` = types, `defaultValues`, mappers only.
6. **Auth**: public content via anon client; admin API routes must call `supabase.auth.getUser()` and return JSON 401; service-role client (`createAdminClient`) is server-only and used for writes that bypass RLS (analytics).
7. **Never** change: router structure, package manager, HTTP client, auth model, API contracts (`/api/v1` shapes), DB schema (`supabase/*.sql`), or delete routes — without explicit instruction.
8. **Never** commit, push, touch `.env*`, or install dependencies for small needs without being asked.
9. Keep changes **minimal and local**; follow the pattern of the nearest existing feature before inventing a new one.
10. **No comments.** Never write `//`, `/* */`, or JSDoc in code. Existing comments stay untouched. Explain intent through clear names, not comments.
11. **No local constants at module scope.** A constant used by only one file lives *inside* the function/component that uses it (e.g. `PER_PAGE`, `RANGE_OPTIONS`, `EMPTY_SUMMARY`). Only exported constants shared across files may sit at module scope (`ADMIN_PROJECTS_KEY`, `SLUG_PATTERN`, route `SELECT` strings).
12. **Simple over complex.** Solve it with the plainest code that works. No premature abstraction, no clever one-liners, no extra layers.

## 3. Skills

Reusable step-by-step procedures. Follow the one matching your task; always study the
referenced exemplar file first and mirror it.

### skill: add-feature (public UI section)

1. Create `src/components/<PascalCaseFeature>/` with `index.tsx` (orchestrator) + `i18n/en.ts` + `i18n/id.ts`.
2. In `index.tsx`: register bundles on render (`i18next.addResourceBundle("id", ...)` / `("en", ...)`), then `useTranslation("<FeatureName>")`.
3. Fetch server data with `useQuery`/`useInfiniteQuery` using key `["<feature>", "feed", i18n.language]` and a store API wrapper; render loading with `Shimmer`, empty state with `t("empty")`.
4. Wrap sections in the shared `Reveal` animation component; respect `useReducedMotion`.
5. Expose the feature from `src/view/Main` (or the relevant view) — do not touch routing files.
- Exemplars: `src/components/Projects/index.tsx`, `src/components/Awards/`.

### skill: add-api-route

1. Public read → `src/app/api/v1/<resource>/route.ts` (anon `createClient()` from `@/lib/supabase/server`).
2. Admin CRUD → `src/app/api/v1/admin/<resource>/route.ts` + `[slug]/route.ts` with the copied `auth.getUser()` 401 guard, and a sibling `_shared.ts` holding `*Payload` type, `validate*Payload()` (returns `string[]`, Indonesian messages), `*_WITH_RELATIONS` select string, `write*Relations()`, `delete*Relations()`, `toAdmin*()`.
3. Use helpers from `@/helper/server/pagination` (`parsePaginationParams`, `paginated`, `sanitizeLikeParam`, `fetchTranslationIds`).
4. Status codes: 401 unauthorized, 404 missing, 409 duplicate slug, 422 validation, 500 Supabase error. Error shape: `{ error, message, detail? }`.
5. Public reads accept `locale` (`en` else `id`), `page`, `per_page` (max 50 public / 100 admin).
- Exemplars: `src/app/api/v1/admin/skills/` (smallest full CRUD), `src/app/api/v1/projects/route.ts` (public read).

### skill: add-form (admin dialog)

1. `validation/index.ts` → `export const schemaX = yup.object().shape({...})` with Indonesian messages.
2. `form/index.ts` → `XFormData`, `xDefaultValues`, `xToFormValues()`, `xFormToPayload()` (never the schema).
3. `store/index.ts` → Zustand API wrapper calling `clientApi({ url, method, data })`.
4. `hooks/useXMutation.ts` → export `ADMIN_X_KEY = ["admin","x"]`, `useCreateX/useUpdateX/useDeleteX`; each `onSuccess` invalidates `ADMIN_X_KEY` **and** the public key (`["x"]`).
5. Dialog in `components/XDialog/index.tsx`: `useForm` + `resolver: yupResolver(schemaX) as unknown as Resolver<XFormData>`, `mode: "onTouched"`, field primitives from `src/components/Forms/*`, tabs `umum | id | en` via `FormTabBar`/`FormSectionCard`, `countErrorsByPrefix` for per-tab error badges.
6. Table columns in `table/columns.tsx` using shared `DataTable` from `src/components/DataTable/`.
- Exemplar: `src/view/Admin/Skills/` (clone this shape).

### skill: add-translation

1. Add the **same flat camelCase keys** to the feature's `i18n/en.ts` and `i18n/id.ts`.
2. Namespace is registered in the component: `i18next.addResourceBundle("<locale>", "<Feature>", bundle)` + `useTranslation("<Feature>")`.
3. Interpolate with `t("key", { count })`; use `t("steps", { returnObjects: true })` for arrays.
4. If the feature has no `i18n/` folder yet, create it — do not centralize into `src/i18n`.
5. Remember: admin UI strings are hardcoded Indonesian; Yup messages are hardcoded too.

### skill: admin-crud (full stack)

Mirror an existing domain end to end (preferred order of study: **Skills → Awards → Experiences → Projects**):

1. SQL: table + `*_translations` child tables in `supabase/*_schema.sql` (never edit deployed schema without instruction).
2. API: `src/app/api/v1/admin/<x>/` with `_shared.ts` (see *add-api-route*).
3. Store: `src/view/Admin/<X>/store/index.ts` + `store/type/index.ts`.
4. Mutations: `hooks/use<X>Mutation.ts` with key constants and invalidation.
5. Form/validation/dialog/table as in *add-form*.
6. View orchestrator: `src/view/Admin/<X>/index.tsx` — `useQuery` + `unwrapList<T>(data)` + dialogs; register the route page under `src/app/(admin)/dashboard/<x>/page.tsx`.
7. Public read API + `src/components/<X>/` feed if the content is public.

## 4. Documentation map

| Need | File |
|---|---|
| Stack, folder tree, foldering rules, routing | [docs/architecture.md](docs/architecture.md) |
| Writing files, feature slice anatomy, naming, i18n, UI/motion | [docs/frontend-patterns.md](docs/frontend-patterns.md) |
| React Query / Zustand / Axios / Supabase clients / static data | [docs/state-and-data.md](docs/state-and-data.md) |
| Endpoint catalog, request/response contracts, errors | [docs/api-reference.md](docs/api-reference.md) |
| Pre/post coding checklist, do-not-do list | [docs/workflows.md](docs/workflows.md) |
| Historical conventions (Indonesian, 750 lines) | [ai-engineering-rules.md](ai-engineering-rules.md) |

## 5. Working agreement

Before coding: locate the nearest existing feature/API and read it fully.
After coding: remove unused imports, run `pnpm lint` and `pnpm typecheck`, then report
what changed (files + why). Priority: behavior → security → API/DB contract → local pattern
→ repo structure → smallest possible change.
