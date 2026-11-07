# API reference

All endpoints live under `/api/v1` in `src/app/api/v1/`. 20 route files total.
There is **no shared auth middleware** — every admin handler enforces its own guard.

## 1. Conventions

### Auth

- **Public routes**: anon Supabase client (`createClient()` from `@/lib/supabase/server`),
  no `getUser()` call.
- **Admin routes** (copy-pasted guard in every handler):

```ts
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return NextResponse.json(
    { error: "Unauthorized.", message: "Sesi tidak valid. Silakan login kembali." },
    { status: 401 }
  )
}
```

Any authenticated user passes — there is no role/claim check (mirrors RLS
`for all to authenticated`). Writes use the cookie-bound client, not service-role
(the exception is `POST /api/v1/visits`, which uses `createAdminClient()` in `after()`).

### Pagination

- Query params: `page` (≥1), `per_page`.
- Defaults / caps: public reads default **6–10**, max **50**; admin default **10**
  (visits: **20**), max **100**.
- Envelope: `{ data, pagination: { page, per_page, total, total_pages } }`.

### Locale

Every public read accepts `locale` — strict `en` else falls back to `id`.
Responses echo `locale` and a `variant` (`"card"` | `"detail"`).

### Error shape

```json
{ "error": "…", "message": "…", "detail?": "…", "data": { "issues": ["…"] } }
```

Messages are **Indonesian**. Status codes:

| Code | Meaning |
|---|---|
| 401 | not authenticated (admin guard) |
| 404 | resource/locale missing |
| 409 | duplicate slug (Postgres `23505`) |
| 413 | visits payload > 8192 bytes |
| 422 | `validate*Payload()` returned issues |
| 500 | Supabase/relation failure (create rolls back parent delete) |
| 502/503 | chat upstream errors (404→502, other→503) |

## 2. Endpoint catalog

### Public reads

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/projects` | paginated project cards from view `project_list` + `featured` list. Query: `locale`, `slug` (detail-via-list mode), `page`, `per_page` (6/50) |
| GET | `/api/v1/projects/[slug]` | full detail (metrics, decisions, highlights) + `related[]`. 404 if missing |
| GET | `/api/v1/experiences` | paginated cards from `experience_list`, `start_date` desc. Query: `locale`, `slug`, `page`, `per_page` (10/50) |
| GET | `/api/v1/experiences/[slug]` | single detail, 404 if missing |
| GET | `/api/v1/awards` | paginated from `award_list`, `sort_order` desc. Query: `locale`, `category` (`certificate\|award\|honor`), `slug`, `page`, `per_page` (6/50) |
| GET | `/api/v1/awards/[slug]` | single detail, 404 if missing |
| GET | `/api/v1/skills` | skill groups from `skill_group_list` → `{ slug, title, note, items }`. Query: `locale`, `page`, `per_page` (10/50) |
| GET | `/api/v1/settings` | site banner settings (`site_settings` id=1). **Never fails** — always 200 with `{ data, fallback }` |
| GET | `/api/v1/cv` | streams CV PDF (bucket `cv`, `cv_mark_vii.pdf`) as attachment; `Cache-Control: no-store`; falls back to 307 redirect to public URL |

### Public write / special

| Method | Path | Notes |
|---|---|---|
| PUT | `/api/v1/cv` | **admin**: multipart `file`, must be `application/pdf` (else 422), upsert to Storage |
| GET | `/api/v1/chat` | config probe → `{ model, ready, cloud }` |
| POST | `/api/v1/chat` | streaming RAG chat (Ollama Cloud via OpenAI SDK, tools in `knowledge.ts`). Body `{ messages[], locale? }`; keeps last **12** messages, **4000** chars each; plain-text stream; 60s timeout, 1 retry. **No auth, no rate limit** |
| POST | `/api/v1/visits` | analytics beacon. **Rate limited** (60/min per IP-hash → silent 204). Rejects >8192 bytes (413). Skips `/(admin\|api\|_next)` paths and bots. Sets visitor/session cookies; writes deferred via `after()` + `createAdminClient()` → RPC `record_site_visit` |

### Admin CRUD (`auth.getUser()` required)

| Method | Path | Notes |
|---|---|---|
| GET, POST | `/api/v1/admin/projects` | list (`page`,`per_page` 10/100, `search` on slug/title) / create (`ProjectPayload`) |
| GET, PUT, DELETE | `/api/v1/admin/projects/[slug]` | detail / update (delete-and-replace relations) / delete |
| GET, POST | `/api/v1/admin/experiences` | search spans `role`/`org` translations via `fetchTranslationIds` |
| GET, PUT, DELETE | `/api/v1/admin/experiences/[slug]` | detail / update / delete |
| GET, POST | `/api/v1/admin/awards` | search on `title`/`issuer` translations; ordered `sort_order` desc |
| GET, PUT, DELETE | `/api/v1/admin/awards/[slug]` | detail / update / delete |
| GET, POST | `/api/v1/admin/skills` | search on `title` translation; `sort_order` asc |
| GET, PUT, DELETE | `/api/v1/admin/skills/[slug]` | detail / update / delete |
| GET | `/api/v1/admin/visits` | analytics dashboard payload (`force-dynamic`). Query: `page`,`per_page` 20/100, `range` `7d\|30d\|90d`, `device`, `search`. Returns `VisitResponse` = `data` + `pagination` + `summary` + `daily` + `pages`/`countries`/`devices` (top-8) |

`PATCH` is not used anywhere. Only `visits` routes export `export const dynamic = "force-dynamic"`.

## 3. Admin `_shared.ts` pattern

Each admin segment owns a sibling `_shared.ts` (there is no global one):

| Export | Purpose |
|---|---|
| `SLUG_PATTERN` (`/^[a-z0-9-]+$/`) | shared regex (also `DATE_PATTERN`, `YEAR_PATTERN`, `URL_PATTERN`, `ALLOWED_CATEGORIES`) |
| `XPayload` + `XTranslationInput` | request body types (translations `{ id?, en? }`) |
| `validateXPayload(body, { requireSlug })` | returns `string[]` of Indonesian issues (→ 422) |
| `X_WITH_RELATIONS` | select string, e.g. `"*, project_translations(*), project_technologies(name, sort_order)"` |
| `fetchAdminX(supabase, options)` | list/detail query with pagination + search |
| `writeXRelations(supabase, id, body)` | inserts child rows, `sort_order` from array index |
| `deleteXRelations(supabase, id)` | clears child tables |
| `toAdminX(row, children?)` | row → admin DTO |

### Write flow (POST / PUT)

1. `validateXPayload` → issues? **422** `{ error, message, data: { issues } }`.
2. POST: insert parent; duplicate slug (`23505`) → **409**.
3. Relations: **create** = `writeXRelations`, on failure delete parent and return 500.
   **update** = `deleteXRelations` → `writeXRelations` (delete-and-replace).
4. Success → **201** (create, `{ data: { slug }, message }`) or **200** (update).

Study order: `admin/skills/` (smallest) → `admin/awards/` → `admin/experiences/` →
`admin/projects/` (richest: highlights/metrics/decisions).

## 4. Server helpers (`src/helper/server/`)

| File | Exports |
|---|---|
| `rateLimit.ts` | `isRateLimited(key, limit = 60, windowMs = 60_000)` — in-memory Map, per-instance only; used only by `POST /visits` (throttled → **204**, not 429) |
| `pagination.ts` | see [state-and-data.md §4](state-and-data.md#4-pagination-helpers) |
| `parseUserAgent.ts` | `parseUserAgent(ua)` → `{ deviceType, browser, os, isBot }` |
| `visitMetadata.ts` | `VISITOR_COOKIE`, `SESSION_COOKIE`, TTLs, `getClientIp`, `hashIp` (SHA-256 + `VISIT_HASH_SALT`), `getGeo` (Vercel headers) |
| `wibDate.ts` | `toWibDate()` → `YYYY-MM-DD` in `Asia/Jakarta` |
| `format*/` | `toProjectCard`, `toProject`, `toExperience`, `toAward` + row types |

## 5. Chat endpoint details

- Env: `OLLAMA_BASE_URL` (default `https://ollama.com/v1`), `OLLAMA_API_KEY`, `OLLAMA_MODEL`
  (default `gpt-oss:20b`).
- Two-phase: tool-calling pass (`get_profile`, `get_projects`, `get_experiences`,
  `get_skills`, `get_awards_and_certificates` from `knowledge.ts`) then streaming final pass;
  falls back to direct streaming if tools unsupported.
- System prompt built by `buildSystemPrompt(locale)`.
- Headers: `Content-Type: text/plain; charset=utf-8`, `Cache-Control: no-cache, no-transform`,
  `X-Ollama-Model`.
- Upstream mapping: 401/429 passthrough, 404 → **502**, other → **503** (localized message).
