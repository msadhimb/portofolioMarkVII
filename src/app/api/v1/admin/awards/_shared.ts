import type { SupabaseClient } from "@supabase/supabase-js"

export const SLUG_PATTERN = /^[a-z0-9-]+$/
const YEAR_PATTERN = /^\d{4}$/
const URL_PATTERN = /^https?:\/\//
const ALLOWED_CATEGORIES = ["certificate", "award", "honor"] as const

export type AwardTranslationInput = {
  title?: string
  issuer?: string
  description?: string
}

export type AwardPayload = {
  slug?: string
  category?: string
  issue_date?: string | null
  expiry_date?: string | null
  credential_id?: string | null
  credential_url?: string | null
  skills?: string[]
  translations?: { id?: AwardTranslationInput; en?: AwardTranslationInput }
}

export const validateAwardPayload = (
  body: AwardPayload,
  options: { requireSlug?: boolean } = {}
): string[] => {
  const issues: string[] = []
  const { requireSlug = true } = options

  if (requireSlug && (!body.slug || !SLUG_PATTERN.test(body.slug))) {
    issues.push("Slug wajib diisi dengan huruf kecil, angka, atau strip.")
  }
  if (
    !body.category ||
    !(ALLOWED_CATEGORIES as readonly string[]).includes(body.category)
  ) {
    issues.push("Kategori harus salah satu dari certificate, award, atau honor.")
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
    if (!translation.issuer?.trim()) {
      issues.push(`Penerbit (${locale}) wajib diisi.`)
    }
    if (!translation.description?.trim()) {
      issues.push(`Deskripsi (${locale}) wajib diisi.`)
    }
  }
  if (!body.issue_date?.trim() || !YEAR_PATTERN.test(body.issue_date.trim())) {
    issues.push("Tahun terbit wajib 4 digit (contoh: 2024).")
  }
  if (body.expiry_date?.trim() && !YEAR_PATTERN.test(body.expiry_date.trim())) {
    issues.push("Tahun kadaluarsa harus 4 digit (contoh: 2026).")
  }
  if (body.credential_url?.trim() && !URL_PATTERN.test(body.credential_url.trim())) {
    issues.push("URL kredensial harus diawali http:// atau https://.")
  }
  return issues
}

const byOrder = (
  a: { sort_order?: number | null },
  b: { sort_order?: number | null }
) => (a.sort_order ?? 0) - (b.sort_order ?? 0)

type AwardSkillRow = { name: string; sort_order?: number | null }
type AwardTranslationRow = {
  locale: string
  title: string
  issuer: string
  description: string
}

type AwardWithRelations = {
  slug: string
  category: string
  issue_date?: string | null
  expiry_date?: string | null
  credential_id?: string | null
  credential_url?: string | null
  award_translations?: AwardTranslationRow[] | null
  award_skills?: AwardSkillRow[] | null
}

export const toAdminAward = (award: AwardWithRelations) => {
  return {
    slug: award.slug,
    category: award.category,
    issue_date: award.issue_date ?? "",
    expiry_date: award.expiry_date ?? "",
    credential_id: award.credential_id ?? "",
    credential_url: award.credential_url ?? "",
    skills: [...(award.award_skills ?? [])].sort(byOrder).map((row) => row.name),
    translations: Object.fromEntries(
      (award.award_translations ?? []).map((row) => [
        row.locale,
        {
          title: row.title ?? "",
          issuer: row.issuer ?? "",
          description: row.description ?? "",
        },
      ])
    ),
  }
}

export const AWARD_WITH_RELATIONS =
  "*, award_translations(*), award_skills(name, sort_order)"

const withOrder = (items: string[] | undefined, key: string) =>
  (items ?? [])
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name, index) => ({ [key]: name, sort_order: index }))

export const writeAwardRelations = async (
  supabase: SupabaseClient,
  awardId: string,
  body: AwardPayload
): Promise<string | null> => {
  try {
    const translations = (["id", "en"] as const).map((locale) => {
      const translation = body.translations?.[locale] ?? {}
      return {
        award_id: awardId,
        locale,
        title: translation.title?.trim() ?? "",
        issuer: translation.issuer?.trim() ?? "",
        description: translation.description?.trim() ?? "",
      }
    })

    const { error: translationError } = await supabase
      .from("award_translations")
      .insert(translations)

    if (translationError) return translationError.message

    const skills = withOrder(body.skills, "name").map((row) => ({
      ...row,
      award_id: awardId,
    }))

    if (skills.length > 0) {
      const { error: skillError } = await supabase
        .from("award_skills")
        .insert(skills)
      if (skillError) return skillError.message
    }

    return null
  } catch (err) {
    return err instanceof Error ? err.message : String(err)
  }
}

export const deleteAwardRelations = async (
  supabase: SupabaseClient,
  awardId: string
) => {
  for (const table of ["award_skills", "award_translations"]) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("award_id", awardId)
    if (error) return error.message
  }
  return null
}
