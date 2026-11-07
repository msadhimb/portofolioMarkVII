# Workflows

Checklists for making changes safely in this repository.

## 1. Before coding

1. Read [AGENTS.md](../AGENTS.md) hard rules — especially the never-do list.
2. **Locate the nearest existing feature/API that does something similar** and read it
   fully (files, hooks, i18n, validation). Mirror it; do not invent a new pattern.
3. Identify every touchpoint of what you are about to change:
   - the component + its `i18n/{en,id}.ts` keys
   - its query keys and the mutations that invalidate them
   - the store functions and the API route behind them
   - permissions/session behavior (admin guard, 401/403/503 handling)
4. Prefer the smallest change that solves the problem.

## 2. While coding

Follow the file conventions in [frontend-patterns.md](frontend-patterns.md):

- **No comments** in new code — no `//`, no `/* */`, no JSDoc. Use clear names instead.
- **No local constants at module scope** — a constant used by one file lives inside
  the function/component that uses it. Only cross-file exports (`ADMIN_PROJECTS_KEY`,
  `SLUG_PATTERN`, `SELECT`) sit at module scope.
- **Simple over complex** — plainest working code; no premature abstraction.
- Keep `index.tsx` an orchestrator; push logic into `hooks/`, `helper/`, `form/`.
- Data flow: component → React Query hook → `clientApi` store → `/api/v1`. Never call
  `axios`/`fetch` from a component.
- Add/extend **both** `i18n/en.ts` and `i18n/id.ts` with identical keys (public features).
- Forms: schema in `validation/index.ts`, types/mappers in `form/index.ts`.
- New admin endpoints: copy the guard + `_shared.ts` pattern; validate server-side.
- After mutations, invalidate the admin key **and** the public key.
- Preserve a11y (labels, focus, `aria-*`), responsive behavior, and reduced-motion support.
- Never hardcode secrets; keep service-role/Ollama keys server-only.

## 3. After coding (mandatory)

1. Remove unused imports/variables.
2. Verify i18n keys match across `en.ts` / `id.ts` (the `i18n:validate` script is broken).
3. Run:

```bash
pnpm lint
pnpm typecheck
```

4. If the change touches rendering, run `pnpm build` once before reporting done.
5. Report: which files changed and why, plus any risk (API contract, auth, DB).

## 4. Task recipes

| Task | Recipe |
|---|---|
| New public section | skill `add-feature` in [AGENTS.md](../AGENTS.md) |
| New/changed endpoint | skill `add-api-route` + [api-reference.md](api-reference.md) |
| New admin form/dialog | skill `add-form` (exemplar: `src/view/Admin/Skills/`) |
| New translation keys | skill `add-translation` |
| Full admin domain | skill `admin-crud` (order: Skills → Awards → Experiences → Projects) |
| State/cache question | [state-and-data.md](state-and-data.md) |
| Folder/placement question | [architecture.md §5](architecture.md#5-foldering-rules) |

## 5. Do NOT do this without explicit instruction

- Change the router structure, add/remove route files, or rename URL segments.
- Swap the package manager, HTTP client, data layer, auth model, or i18n library.
- Alter API contracts (`/api/v1` request/response shapes) or DB schema (`supabase/*.sql`).
- Edit deployed SQL migrations or RLS policies.
- Commit, push, amend history, or open PRs (unless explicitly asked).
- Modify `.env*` files or commit secrets.
- Add dependencies for small needs (use what exists: Tailwind, shadcn, lucide, framer-motion).
- Overwrite existing shadcn/ui components; add new ones individually.
- Introduce i18n into admin views or Yup messages (they are intentionally hardcoded Indonesian).
- Centralize per-feature i18n into `src/i18n`.
- Write comments (`//`, JSDoc) in new code.
- Hoist file-local constants to module scope — keep them inside the function that uses them.
- Reach for complex code when simple code works (no premature abstraction, no clever one-liners).
- Put business components in `src/components/ui/`.
- Mirror server responses into Zustand, or create a global store for single-feature state.
- Weaken/flatten errors to 200; keep 401/403/404/409/422/503 semantics.

## 6. Known quirks (do not "fix" silently)

- `pnpm i18n:validate` fails — `scripts/validate-translations.mjs` does not exist.
- Dual lockfiles: `package-lock.json` is stale; **pnpm** is authoritative.
- `src/services/client.ts` imports `next-auth/react` though NextAuth is not configured
  (Supabase is the real auth).
- `src/view/Admin/Login` uses `validations/` (plural) while every other feature uses `validation/`.
- `zod` is installed but unused — forms use Yup.
- ESLint disables `no-explicit-any`, `no-unused-vars`, `exhaustive-deps`.
- No tests and no CI exist; `pnpm lint` + `pnpm typecheck` are the only gates.

## 7. Priority order when trade-offs appear

behavior → security → API/DB contract → local feature pattern → repository structure →
avoid premature abstraction → smallest possible change → verify (lint/typecheck).
