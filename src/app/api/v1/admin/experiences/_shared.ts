import type { SupabaseClient } from "@supabase/supabase-js"

export const SLUG_PATTERN = /^[a-z0-9-]+$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export type ExperienceTranslationInput = {
  role?: string
  context?: string
  points?: string[]
}

export type ExperiencePayload = {
  slug?: string
  start_date?: string | null
  end_date?: string | null
  org?: string
  stacks?: string[]
  translations?: { id?: ExperienceTranslationInput; en?: ExperienceTranslationInput }
}

export const validateExperiencePayload = (
  body: ExperiencePayload,
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
    if (!translation.role?.trim()) {
      issues.push(`Peran (${locale}) wajib diisi.`)
    }
  }
  if (!body.org?.trim()) {
    issues.push("Organisasi wajib diisi.")
  }
  for (const [label, value] of [
    ["Tanggal mulai", body.start_date],
    ["Tanggal selesai", body.end_date],
  ] as const) {
    if (value && !DATE_PATTERN.test(value)) {
      issues.push(`${label} harus format YYYY-MM-DD.`)
    }
  }
  return issues
}

const byOrder = (
  a: { sort_order?: number | null },
  b: { sort_order?: number | null }
) => (a.sort_order ?? 0) - (b.sort_order ?? 0)

type ExperiencePointRow = { body: string; locale: string; sort_order?: number | null }
type ExperienceStackRow = { name: string; sort_order?: number | null }
type ExperienceTranslationRow = {
  locale: string
  period?: string | null
  role: string
  org: string
  context?: string | null
}

type ExperienceWithRelations = {
  slug: string
  start_date?: string | null
  end_date?: string | null
  org?: string | null
  experience_translations?: ExperienceTranslationRow[] | null
  experience_points?: ExperiencePointRow[] | null
  experience_stacks?: ExperienceStackRow[] | null
}

export const toAdminExperience = (experience: ExperienceWithRelations) => {
  const pointsByLocale: Record<string, string[]> = {}

  for (const point of [...(experience.experience_points ?? [])].sort(byOrder)) {
    if (!pointsByLocale[point.locale]) pointsByLocale[point.locale] = []
    pointsByLocale[point.locale].push(point.body)
  }

  return {
    slug: experience.slug,
    start_date: experience.start_date ?? null,
    end_date: experience.end_date ?? null,
    org: experience.org ?? "",
    stacks: [...(experience.experience_stacks ?? [])]
      .sort(byOrder)
      .map((row) => row.name),
    translations: Object.fromEntries(
      (experience.experience_translations ?? []).map((row) => [
        row.locale,
        {
          period: row.period ?? "",
          role: row.role,
          org: row.org,
          context: row.context ?? "",
          points: pointsByLocale[row.locale] ?? [],
        },
      ])
    ),
  }
}

export const EXPERIENCE_WITH_RELATIONS =
  "*, experience_translations(*), experience_points(body, locale, sort_order), experience_stacks(name, sort_order)"

const withOrder = (items: string[] | undefined, key: string) =>
  (items ?? [])
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name, index) => ({ [key]: name, sort_order: index }))

export const writeExperienceRelations = async (
  supabase: SupabaseClient,
  experienceId: string,
  body: ExperiencePayload
): Promise<string | null> => {
  try {
    const translations = (["id", "en"] as const).map((locale) => {
      const translation = body.translations?.[locale] ?? {}
      return {
        experience_id: experienceId,
        locale,
        role: translation.role?.trim() ?? "",
        context: translation.context?.trim() ?? "",
      }
    })

    const { error: translationError } = await supabase
      .from("experience_translations")
      .insert(translations)

    if (translationError) return translationError.message

    const { error: orgError } = await supabase
      .from("experiences")
      .update({ org: body.org?.trim() ?? "" })
      .eq("id", experienceId)

    if (orgError) return orgError.message

    const stacks = withOrder(body.stacks, "name").map((row) => ({
      ...row,
      experience_id: experienceId,
    }))

    if (stacks.length > 0) {
      const { error: stackError } = await supabase
        .from("experience_stacks")
        .insert(stacks)
      if (stackError) return stackError.message
    }

    for (const locale of ["id", "en"] as const) {
      const points = withOrder(body.translations?.[locale]?.points, "body").map(
        (row) => ({ ...row, experience_id: experienceId, locale })
      )

      if (points.length > 0) {
        const { error: pointError } = await supabase
          .from("experience_points")
          .insert(points)
        if (pointError) return pointError.message
      }
    }

    return null
  } catch (err) {
    return err instanceof Error ? err.message : String(err)
  }
}

export const deleteExperienceRelations = async (supabase: SupabaseClient, experienceId: string) => {
  for (const table of [
    "experience_points",
    "experience_stacks",
    "experience_translations",
  ]) {
    const { error } = await supabase.from(table).delete().eq("experience_id", experienceId)
    if (error) return error.message
  }
  return null
}
