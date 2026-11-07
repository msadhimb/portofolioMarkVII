# Architecture

Overview of the technical architecture of portofolioMarkVII. Read together with
[AGENTS.md](../AGENTS.md) (hard rules + skills) and
[frontend-patterns.md](frontend-patterns.md) (how to write code here).

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js **16.1.7** App Router | Turbopack for dev (`pnpm dev`), ESM (`"type": "module"`) |
| UI | React **19**, TypeScript **5.9** strict | `@/*` → `./src/*` |
| Styling | Tailwind CSS **v4** (`@tailwindcss/postcss`, `@theme inline` in `globals.css`) | dark mode via `next-themes` class strategy |
| Components | shadcn/ui, style `radix-nova`, `baseColor: neutral` | primitives in `src/components/ui/` (kebab-case) |
| Icons | `lucide-react` | always `className="size-4"` |
| Animation | framer-motion | shared `Reveal` wrapper, `MotionConfig reducedMotion="user"` |
| Database | Supabase (Postgres) | SQL in `supabase/*.sql` — never edit deployed schema without instruction |
| Auth | Supabase SSR (`@supabase/ssr`) | session refreshed in `src/proxy.ts`; API routes re-check with `auth.getUser()` |
| HTTP | Axios instance `src/services/client.ts`, `baseURL = /api/v1` | 401 refresh-retry, 403/503 redirects |
| Server state | TanStack React Query | provider `src/components/QueryProvider/index.tsx` |
| Client state | Zustand | no `persist`; API-wrapper stores + UI stores |
| Forms | react-hook-form + **Yup** (`yupResolver`) | `zod` is installed but unused |
| i18n | i18next + react-i18next | `lng: "id"`, `fallbackLng: "id"`, resources are TS bundles per feature |
| Validation | Yup (forms) + server-side `validate*Payload()` | messages hardcoded Indonesian |
| Chatbot | OpenAI SDK → Ollama Cloud | `src/app/api/v1/chat/route.ts` + `knowledge.ts` (RAG tools) |

## 2. Repository layout

```
portofolioMarkVII/
├── AGENTS.md                  # AI agent entry point (skills + hard rules)
├── docs/                      # this documentation
├── ai-engineering-rules.md    # historical convention doc (Indonesian)
├── package.json / pnpm-lock.yaml
├── next.config.mjs            # only: supabase remote image host
├── tsconfig.json              # strict, bundler, @/* alias
├── eslint.config.mjs          # flat config, eslint-config-next
├── postcss.config.mjs / components.json (shadcn) / .prettierrc
├── supabase/                  # schema.sql, seed.sql, *_schema.sql, migrations (raw SQL)
├── public/
└── src/
    ├── proxy.ts               # Next 16 middleware replacement → supabase session refresh
    ├── i18n.ts / i18n/config.ts
    ├── app/
    │   ├── layout.tsx         # provider stack: Query → Theme → Tooltip → MobileMotion → Language
    │   ├── page.tsx           # home (Navbar + MainView + Footer + VisitorTracker)
    │   ├── (public)/          # projects/[slug]
    │   ├── admin/             # login, dashboard/{projects,skills,experiences,awards,visitors}
    │   └── api/v1/            # public reads + chat/cv/settings/visits + admin/*
    ├── components/            # public feature slices (~50 folders)
    ├── view/                  # Main · Project · Admin/*
    ├── data/                  # static typed content (*.en.ts / *.id.ts) + localized.ts
    ├── services/client.ts     # Axios client
    ├── helper/server/         # rateLimit, pagination, parseUserAgent, visitMetadata, wibDate, formatters
    ├── lib/                   # utils.ts (cn), supabase/{client,server,admin,proxy}.ts, pagination.ts
    └── hooks/                 # useSiteSettings, use-mobile
```

### Two feature trees (same internal pattern)

| Tree | Audience | i18n | Examples |
|---|---|---|---|
| `src/components/<PascalCase>/` | public site sections | yes, `i18n/en.ts` + `i18n/id.ts` | `Hero`, `Projects`, `Contact`, `Navbar`, `ChatbotSection` |
| `src/view/Admin/<PascalCase>/` | admin CMS screens | no (hardcoded Indonesian) | `Projects`, `Skills`, `Experiences`, `Awards`, `Visitors` |

Other views: `src/view/Main` (home composition), `src/view/Project`
(case study, namespace `CaseStudy`), `src/view/Admin/Login`.

## 3. Routing map

### Public pages
- `/` → `src/app/page.tsx` → `MainView`
- `/projects/[slug]` → `src/app/(public)/projects/[slug]` (static params from `projectSlugs`)

### Admin pages
- `/admin/login`
- `/admin/dashboard` + `/admin/dashboard/{projects,skills,experiences,awards,visitors}`

### API
Versioned under `/api/v1` — see [api-reference.md](api-reference.md).

## 4. Request lifecycle

1. **`src/proxy.ts`** (Next 16 middleware replacement) runs for almost all paths:
   - builds a cookie-bound Supabase server client, refreshes session via `getClaims()`
   - redirects unauthenticated users away from `/admin/dashboard*` → `/admin/login`
   - redirects authenticated users off `/admin/login` → `/admin/dashboard`
2. **Server Components / API routes** create their own client per request with
   `createClient()` from `@/lib/supabase/server`.
3. **Admin API handlers** enforce a second, JSON-level guard:
   `auth.getUser()` → 401 `{ error: "Unauthorized.", message: "Sesi tidak valid..." }`.
4. **Client Components** fetch through `clientApi` (Axios) → React Query cache.

There is **no role check anywhere** — any authenticated Supabase user is an "admin".
This mirrors the DB (RLS: `for all to authenticated` on admin-writable tables).

## 5. Foldering rules

1. **Feature-oriented.** A feature owns everything it needs:
   `index.tsx` (orchestrator) + optional `components/ form/ validation/ hooks/ table/ store/ i18n/ helper/`.
2. **Create a subfolder only when needed.** A thin feature is just `index.tsx` + `i18n/`
   (e.g. `src/components/Contact/`).
3. **`index.tsx` is the orchestrator** — it wires i18n, queries, handlers, and JSX.
   Business logic moves to `hooks/`, `helper/`, `form/` etc.
4. **Split files at ~600 lines** by responsibility; `index.tsx` keeps orchestration only.
5. **Shared code rule**: code used by ≥2 features with a stable API moves to
   `src/components/Forms/`, `src/view/Admin/components/`, `src/helper/`, or `src/lib/`.
   Single-feature code stays inside the feature.
6. **shadcn primitives live only in `src/components/ui/`** — never put business
   components there. Add shadcn components one by one (`npx shadcn@latest add <x>`),
   never overwrite existing ones.

## 6. Static data layer

`src/data/` holds typed fallback/content data with `.en.ts` / `.id.ts` variants;
types live in the non-suffixed file. The single consumption hub is
`src/data/localized.ts` (`getProjects(locale)`, `getExperiences(locale)`, `siteConfig`, …).
Static data doubles as a **fallback** when the API returns empty (e.g. Awards store,
Projects placeholder cards).

## 7. Analytics subsystem

- Client beacon: `VisitorTracker` in the home layout → `POST /api/v1/visits`
  (rate-limited, 60/min/IP-hash, returns 204 when throttled, writes deferred via `after()`).
- Cookies: `portfolio_visitor` (1y), `portfolio_visit_session` (30m).
- Writes bypass RLS with `createAdminClient()` → RPC `record_site_visit`.
- Admin dashboard: `/admin/dashboard/visitors` → `GET /api/v1/admin/visits`
  (range `7d|30d|90d`, device filter, summary + daily series + top pages/countries/devices).
- SQL: `supabase/analytics_schema.sql`.

## 8. Environment variables

See `.env.example`. Client-visible: `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` also accepted).
Server-only: `SUPABASE_SERVICE_ROLE_KEY`, `VISIT_HASH_SALT`, `OLLAMA_API_KEY`,
`OLLAMA_BASE_URL`, `OLLAMA_MODEL`. Never expose service-role or Ollama keys to the client bundle.
