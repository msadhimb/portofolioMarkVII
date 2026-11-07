# Frontend patterns

How to write files in this repository. Mirror the nearest existing feature —
the rules below describe what the code already does.

## 1. Anatomy of a feature slice

### Public feature — `src/components/Projects/`

```
src/components/Projects/
├── index.tsx              # orchestrator: i18n registration + query + JSX
├── i18n/en.ts             # export default locale (flat camelCase keys)
├── i18n/id.ts             # same keys, Indonesian
├── store/index.ts         # Zustand API wrapper (stateless, axios calls only)
├── store/type/index.ts    # interface ProjectStore
└── helper/template.ts     # placeholder/fallback data when API is empty
```

Optional subfolders only when needed: `components/` (feature-local UI), `hooks/`,
`form/`, `validation/`, `table/`. Shared UI (`ProjectCard`, `Reveal`, `SectionHeading`)
lives outside the feature, in `src/components/` at top level or `ui/`.

### Admin feature — `src/view/Admin/Projects/` (canonical full example)

```
src/view/Admin/Projects/
├── index.tsx                              # orchestrator page-view
├── components/ProjectDialog/index.tsx     # create/edit dialog (RHF + mutations)
├── components/ProjectDetailDialog/index.tsx
├── form/index.ts                          # type, defaultValues, mappers (NO schema)
├── validation/index.ts                    # Yup schema only
├── hooks/useProjectsMutation.ts           # ADMIN_PROJECTS_KEY + create/update/delete
├── store/index.ts (+ store/type/)         # axios CRUD wrappers
└── table/columns.tsx                      # TanStack columns + row types
```

No `i18n/` in admin — UI strings are hardcoded Indonesian.
Study order when cloning: **Skills → Awards → Experiences → Projects** (simplest → richest).

Shared admin pieces live in `src/view/Admin/components/`:
`DataTable`, `FormParts`, `DetailParts`, `getErrorMessage`.

## 2. How to write a component file

### Order of contents inside a TSX file

1. imports
2. types and local constants
3. component declaration (`export const X = () => { ... }`)
4. hooks / state (top level, never inside conditionals)
5. helper functions (declare **before** any `useEffect` that uses them)
6. `useEffect`
7. UI config (column defs, motion presets)
8. `return` JSX

### Naming

| Thing                 | Convention                                          | Example                          |
| --------------------- | --------------------------------------------------- | -------------------------------- |
| Feature folder        | PascalCase                                          | `src/components/ChatbotSection/` |
| Unit file             | `index.tsx` / `index.ts`                            | `Projects/index.tsx`             |
| Nested component      | `PascalCaseFolder/index.tsx`                        | `ProjectDialog/index.tsx`        |
| Hooks                 | `useXMutation.ts`, `useX.ts`                        | `useProjectsMutation.ts`         |
| Table files           | `columns.tsx`, `RowActions.tsx`, `TableToolbar.tsx` | —                                |
| Helpers               | `helper/*.ts(x)` inside the feature                 | `helper/fadeUp.ts`               |
| shadcn / shared admin | kebab-case                                          | `data-table-features.ts`         |
| Booleans              | `is/has/can/should` prefix                          | `isPending`, `hasNextPage`       |
| Handlers              | `handle*`                                           | `handleAdd`, `handleDelete`      |
| Query hooks           | `use…Query` (usually inline in component)           | `useSiteSettings`                |
| Mutations             | `useCreateX / useUpdateX / useDeleteX`              | `useDeleteAward`                 |

- Exports: **named** for components/views (`export const Projects = () => …`);
  **default** export only for App Router pages/layouts and i18n `locale` objects.
- Avoid generic names: `data`, `item`, `value`, `temp`.

### Code style

- Prettier: no semicolons, double quotes, printWidth 80, `prettier-plugin-tailwindcss`.
- **No comments.** Never write `//`, `/* */`, or JSDoc in new code. Existing comments stay as they are.
- **No local constants at module scope.** A constant used by only one file goes _inside_ the function/component that uses it (`const perPage = 20` inside the component, not `const PER_PAGE = 20` above it). Only constants exported and consumed by other files sit at module scope (`ADMIN_PROJECTS_KEY`, `SLUG_PATTERN`, `SELECT`).
- **Simple over complex.** The plainest working code wins — no premature abstraction, no clever one-liners.
- `cn()` from `@/lib/utils` (twMerge + clsx) for conditional classes; Tailwind classes only.
- Icons: `lucide-react`, size via `className="size-4"`.
- `any` is tolerated by ESLint but prefer real types in stores/tables.

## 3. i18n (public features only)

File `src/components/Projects/i18n/en.ts`:

```ts
const locale = {
  eyebrow: "Selected Projects",
  showing: "Showing {{shown}} of {{total}} projects",
  empty: "No projects yet.",
}
export default locale
```

`i18n/id.ts` must contain **exactly the same flat camelCase keys**.

Register + use inside the component:

```tsx
import en from "./i18n/en"
import id from "./i18n/id"

export const Projects = () => {
  i18next.addResourceBundle("id", "Projects", id)
  i18next.addResourceBundle("en", "Projects", en)
  const { t, i18n } = useTranslation("Projects")
```

Typical calls: `t("eyebrow")`, `t("showing", { shown, total })`, `t("steps", { returnObjects: true })`.

Rules:

- **Namespace = feature name** (exceptions exist: `ChatbotSection` → `Chatbot`,
  `src/view/Project` → `CaseStudy` — keep the existing namespace if you touch one).
- Never centralize strings into `src/i18n`; keep bundles co-located.
- Default locale is `id`; `src/i18n/config.ts` exports `locales`, `defaultLocale`, `isLocale()`.
- Include `i18n.language` in React Query keys so data refetches on language switch.
- Admin UI and Yup messages are **not** i18n'd (hardcoded Indonesian).

## 4. Forms

Chain: `Form UI → react-hook-form → Yup schema → mutation hook → store (Axios) → API`.

```
validation/index.ts   export const schemaX = yup.object().shape({ ... })
form/index.ts         XFormData, xDefaultValues, xToFormValues(), xFormToPayload()
```

Dialog pattern (`components/XDialog/index.tsx`):

```tsx
const form = useForm<XFormData>({
  resolver: yupResolver(schemaX) as unknown as Resolver<XFormData>,
  defaultValues: xDefaultValues,
  mode: "onTouched",
})
```

- Field primitives are shared and domain-agnostic: `src/components/Forms/`
  (`FormInput`, `FormSelect`, `FormTextArea`, `FormNumber`, `FormSwitch`, `FormImageUpload`)
  — props `label / error / hint / required / disabled`, a11y via `aria-invalid` + `aria-describedby`.
- Shell: `DialogModal` + `FormTabBar` / `FormSectionCard` with tabs `umum | id | en`;
  per-tab error badges via `countErrorsByPrefix(errors, { en, id, umum })`.
- Arrays: `useFieldArray` (`idMetrics`, `enMetrics`, …).
- Server always re-validates: `validate*Payload()` in the route's `_shared.ts`.

## 5. Animation & motion

Canonical reveal wrapper (`Reveal`):

```tsx
<motion.div
  initial={{ opacity: 0, y: isMobile ? 12 : 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: isMobile ? "-30px" : "-80px" }}
  transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
  style={{ willChange: "transform, opacity" }}
>
```

- Respect reduced motion: `Reveal` early-returns a plain `div` when
  `useReducedMotion()` is set; the app is wrapped in `<MotionConfig reducedMotion="user">`.
- Dashboard card entrances: `src/view/Admin/Dashboard/helper/fadeUp.ts`.
- Loading skeletons use the `Shimmer` component (`shimmer-from-structure` class).

## 6. Theming & UI kit

- Global CSS: `src/app/globals.css` — `@custom-variant dark`, `@theme inline` mapping
  `--color-*` tokens, `:root` (light "lab" palette) and `.dark` (warm terminal palette).
- Dark mode: `next-themes` (`attribute="class"`, `defaultTheme="system"`), plus a `ThemeHotkey`
  that toggles on the `d` key (ignored while typing).
- shadcn primitives: `src/components/ui/*.tsx`, kebab-case. Config in `components.json`.
  Add missing primitives one by one; never overwrite existing ones; keep business
  components out of `ui/`.
- Accessibility: preserve labels, focus states, `aria-*` when editing forms/tables/dialogs.

## 7. Modals & tables (admin)

- Modals stay thin; destructive actions always go through the confirm modal
  (`ConfirmModal` / `ActionModal` UI stores in `src/components/`).
- Table files: `table/columns.tsx` (+ optional `RowActions.tsx`), rendered by shared
  `DataTable` with `searchColumnId`.
- After any mutation, invalidate queries (see [state-and-data.md](state-and-data.md))
  and show explicit status (loading/disabled/error) in the dialog.

## 8. File split guidelines

- Split any file around **600 lines** or when a second responsibility appears.
- `index.tsx` keeps orchestration only: hooks + handlers + JSX skeleton.
- Types for a store go to `store/type/index.ts`; form types stay in `form/index.ts`.
- Server-only helpers go to `src/helper/server/` (never import them client-side).
