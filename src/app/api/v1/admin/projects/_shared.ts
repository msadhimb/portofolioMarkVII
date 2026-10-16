import type { SupabaseClient } from "@supabase/supabase-js"

export const SLUG_PATTERN = /^[a-z0-9-]+$/

export type MetricInput = { label: string; value: string }
export type DecisionInput = { title: string; detail: string }

export type TranslationInput = {
  title?: string
  tagline?: string
  description?: string
  problem?: string
  role?: string
  period?: string
  context?: string
  highlights?: string[]
  metrics?: MetricInput[]
  decisions?: DecisionInput[]
}

export type ProjectPayload = {
  slug?: string
  image?: string
  demo_url?: string | null
  repository_url?: string | null
  featured?: boolean
  sort_order?: number
  technologies?: string[]
  translations?: { id?: TranslationInput; en?: TranslationInput }
}

export const validateProjectPayload = (
  body: ProjectPayload,
  options: { requireSlug?: boolean } = {}
): string[] => {
  const issues: string[] = []
  const { requireSlug = true } = options

  if (requireSlug && (!body.slug || !SLUG_PATTERN.test(body.slug))) {
    issues.push("Slug wajib diisi dengan huruf kecil, angka, atau strip.")
  }
  for (const locale of ["id", "en"] as const) {
    const translation = body.translations?.[locale]
    if (!translation) {
      issues.push(`Terjemahan "${locale}" wajib ada.`)
      continue
    }
    if (!translation.title?.trim()) {
      issues.push(`Judul (${locale}) wajib diisi.`)
    }
  }
  if (
    body.sort_order !== undefined &&
    (!Number.isInteger(body.sort_order) || body.sort_order < 0)
  ) {
    issues.push("Urutan harus bilangan bulat >= 0.")
  }
  return issues
}

const byOrder = (
  a: { sort_order?: number | null },
  b: { sort_order?: number | null }
) => (a.sort_order ?? 0) - (b.sort_order ?? 0)

type TechnologyRow = { name: string; sort_order?: number | null }
type HighlightRow = {
  project_id: string
  locale: string
  body: string
  sort_order?: number | null
}
type MetricRow = {
  project_id: string
  locale: string
  label: string
  value: string
  sort_order?: number | null
}
type DecisionRow = {
  project_id: string
  locale: string
  title: string
  detail?: string | null
  sort_order?: number | null
}

type ProjectTranslationRow = {
  locale: string
  title: string
  tagline?: string | null
  description?: string | null
  problem?: string | null
  role?: string | null
  period?: string | null
  context?: string | null
}

type ProjectWithRelations = {
  id: string
  slug: string
  image?: string | null
  demo_url?: string | null
  repository_url?: string | null
  featured?: boolean | null
  sort_order?: number | null
  project_translations?: ProjectTranslationRow[] | null
  project_technologies?: TechnologyRow[] | null
}

export type ProjectChildRows = {
  highlights: HighlightRow[]
  metrics: MetricRow[]
  decisions: DecisionRow[]
}

const EMPTY_CHILDREN: ProjectChildRows = { highlights: [], metrics: [], decisions: [] }

export const toAdminProject = (
  project: ProjectWithRelations,
  children: ProjectChildRows = EMPTY_CHILDREN
) => ({
  slug: project.slug,
  image: project.image ?? "",
  demo_url: project.demo_url ?? null,
  repository_url: project.repository_url ?? null,
  featured: project.featured ?? false,
  sort_order: project.sort_order ?? 0,
  technologies: [...(project.project_technologies ?? [])]
    .sort(byOrder)
    .map((row) => row.name),
  translations: Object.fromEntries(
    (project.project_translations ?? []).map((row) => [
      row.locale,
      {
        title: row.title,
        tagline: row.tagline ?? "",
        description: row.description ?? "",
        problem: row.problem ?? "",
        role: row.role ?? "",
        period: row.period ?? "",
        context: row.context ?? "",
        highlights: children.highlights
          .filter((item) => item.project_id === project.id && item.locale === row.locale)
          .sort(byOrder)
          .map((item) => item.body),
        metrics: children.metrics
          .filter((item) => item.project_id === project.id && item.locale === row.locale)
          .sort(byOrder)
          .map((item) => ({ label: item.label, value: item.value })),
        decisions: children.decisions
          .filter((item) => item.project_id === project.id && item.locale === row.locale)
          .sort(byOrder)
          .map((item) => ({ title: item.title, detail: item.detail ?? "" })),
      },
    ])
  ),
})

export const PROJECT_WITH_RELATIONS =
  "*, project_translations(*), project_technologies(name, sort_order)"

export const fetchProjectChildren = async (
  supabase: SupabaseClient,
  projectIds: string[]
): Promise<{ data: ProjectChildRows | null; error: string | null }> => {
  if (projectIds.length === 0) return { data: EMPTY_CHILDREN, error: null }

  const [highlightsRes, metricsRes, decisionsRes] = await Promise.all([
    supabase
      .from("project_highlights")
      .select("project_id, locale, body, sort_order")
      .in("project_id", projectIds),
    supabase
      .from("project_metrics")
      .select("project_id, locale, label, value, sort_order")
      .in("project_id", projectIds),
    supabase
      .from("project_decisions")
      .select("project_id, locale, title, detail, sort_order")
      .in("project_id", projectIds),
  ])

  const firstError = highlightsRes.error ?? metricsRes.error ?? decisionsRes.error

  if (firstError) return { data: null, error: firstError.message }

  return {
    data: {
      highlights: (highlightsRes.data ?? []) as HighlightRow[],
      metrics: (metricsRes.data ?? []) as MetricRow[],
      decisions: (decisionsRes.data ?? []) as DecisionRow[],
    },
    error: null,
  }
}

export type AdminProjectListOptions = {
  slug?: string
  page?: number
  perPage?: number
  search?: string
}

export const fetchAdminProjects = async (
  supabase: SupabaseClient,
  options?: string | AdminProjectListOptions
) => {
  const opts: AdminProjectListOptions =
    typeof options === "string" ? { slug: options } : (options ?? {})
  const { slug, search } = opts

  let matchingIds: string[] | null = null
  if (search?.trim()) {
    const { data: titleMatches, error: titleError } = await supabase
      .from("project_translations")
      .select("project_id")
      .ilike("title", `%${search.trim().replace(/[%(),"]/g, "")}%`)

    if (titleError) return { data: null, error: titleError.message, total: 0 }

    matchingIds = [
      ...new Set(
        ((titleMatches ?? []) as { project_id: string }[]).map(
          (row) => row.project_id
        )
      ),
    ]
  }

  let query = supabase
    .from("projects")
    .select(PROJECT_WITH_RELATIONS, { count: "exact" })
    .order("sort_order", { ascending: true })

  if (slug) query = query.eq("slug", slug)

  if (search?.trim()) {
    const clean = search.trim().replace(/[%(),"]/g, "")
    if (matchingIds && matchingIds.length > 0) {
      query = query.or(`slug.ilike.%${clean}%,id.in.(${matchingIds.join(",")})`)
    } else {
      query = query.ilike("slug", `%${clean}%`)
    }
  }

  // Mode paginasi (list admin). Mode slug tidak dipaginasi.
  if (!slug && opts.page !== undefined && opts.perPage !== undefined) {
    const from = (opts.page - 1) * opts.perPage
    query = query.range(from, from + opts.perPage - 1)
  }

  const { data: projects, error: projectsError, count } = await query

  if (projectsError)
    return { data: null, error: projectsError.message, total: 0 }

  const rows = (projects ?? []) as ProjectWithRelations[]
  const { data: children, error: childrenError } = await fetchProjectChildren(
    supabase,
    rows.map((row) => row.id)
  )

  if (childrenError || !children)
    return { data: null, error: childrenError, total: 0 }

  return {
    data: rows.map((row) => toAdminProject(row, children)),
    error: null,
    total: count ?? rows.length,
  }
}

const withOrder = (items: string[] | undefined, key: string) =>
  (items ?? [])
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name, index) => ({ [key]: name, sort_order: index }))

export const writeProjectRelations = async (
  supabase: SupabaseClient,
  projectId: string,
  body: ProjectPayload
): Promise<string | null> => {
  try {
    const translations = (["id", "en"] as const).map((locale) => {
      const translation = body.translations?.[locale] ?? {}
      return {
        project_id: projectId,
        locale,
        title: translation.title?.trim() ?? "",
        tagline: translation.tagline?.trim() ?? "",
        description: translation.description?.trim() ?? "",
        problem: translation.problem?.trim() ?? "",
        role: translation.role?.trim() ?? "",
        period: translation.period?.trim() ?? "",
        context: translation.context?.trim() ?? "",
      }
    })

    const { error: translationError } = await supabase
      .from("project_translations")
      .insert(translations)

    if (translationError) return translationError.message

    const technologies = withOrder(body.technologies, "name").map((row) => ({
      ...row,
      project_id: projectId,
    }))

    if (technologies.length > 0) {
      const { error: technologyError } = await supabase
        .from("project_technologies")
        .insert(technologies)
      if (technologyError) return technologyError.message
    }

    for (const locale of ["id", "en"] as const) {
      const translation = body.translations?.[locale] ?? {}

      const highlights = withOrder(translation.highlights, "body").map((row) => ({
        ...row,
        project_id: projectId,
        locale,
      }))

      if (highlights.length > 0) {
        const { error: highlightError } = await supabase
          .from("project_highlights")
          .insert(highlights)
        if (highlightError) return highlightError.message
      }

      const metrics = (translation.metrics ?? [])
        .filter((metric) => metric.label?.trim() && metric.value?.trim())
        .map((metric, index) => ({
          project_id: projectId,
          locale,
          label: metric.label.trim(),
          value: metric.value.trim(),
          sort_order: index,
        }))

      if (metrics.length > 0) {
        const { error: metricError } = await supabase
          .from("project_metrics")
          .insert(metrics)
        if (metricError) return metricError.message
      }

      const decisions = (translation.decisions ?? [])
        .filter((decision) => decision.title?.trim())
        .map((decision, index) => ({
          project_id: projectId,
          locale,
          title: decision.title.trim(),
          detail: decision.detail?.trim() ?? "",
          sort_order: index,
        }))

      if (decisions.length > 0) {
        const { error: decisionError } = await supabase
          .from("project_decisions")
          .insert(decisions)
        if (decisionError) return decisionError.message
      }
    }

    return null
  } catch (err) {
    return err instanceof Error ? err.message : String(err)
  }
}

export const deleteProjectRelations = async (supabase: SupabaseClient, projectId: string) => {
  for (const table of [
    "project_decisions",
    "project_metrics",
    "project_highlights",
    "project_technologies",
    "project_translations",
  ]) {
    const { error } = await supabase.from(table).delete().eq("project_id", projectId)
    if (error) return error.message
  }
  return null
}
