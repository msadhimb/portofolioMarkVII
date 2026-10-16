import type { SupabaseClient } from "@supabase/supabase-js"

export const SLUG_PATTERN = /^[a-z0-9-]+$/

export type SkillGroupTranslationInput = {
  title?: string
  note?: string
}

export type SkillGroupPayload = {
  slug?: string
  sort_order?: number
  items?: string[]
  translations?: { id?: SkillGroupTranslationInput; en?: SkillGroupTranslationInput }
}

export const validateSkillGroupPayload = (
  body: SkillGroupPayload,
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

type SkillGroupTranslationRow = {
  locale: string
  title: string
  note?: string | null
}

type SkillGroupItemRow = { name: string; sort_order?: number | null }

type SkillGroupWithRelations = {
  slug: string
  sort_order?: number | null
  skill_group_translations?: SkillGroupTranslationRow[] | null
  skill_group_items?: SkillGroupItemRow[] | null
}

export const toAdminSkillGroup = (group: SkillGroupWithRelations) => ({
  slug: group.slug,
  sort_order: group.sort_order ?? 0,
  items: [...(group.skill_group_items ?? [])].sort(byOrder).map((row) => row.name),
  translations: Object.fromEntries(
    (group.skill_group_translations ?? []).map((row) => [
      row.locale,
      { title: row.title, note: row.note ?? "" },
    ])
  ),
})

export const SKILL_GROUP_WITH_RELATIONS =
  "*, skill_group_translations(*), skill_group_items(name, sort_order)"

export const writeSkillGroupRelations = async (
  supabase: SupabaseClient,
  skillGroupId: string,
  body: SkillGroupPayload
): Promise<string | null> => {
  try {
    const translations = (["id", "en"] as const).map((locale) => {
      const translation = body.translations?.[locale] ?? {}
      return {
        skill_group_id: skillGroupId,
        locale,
        title: translation.title?.trim() ?? "",
        note: translation.note?.trim() ?? "",
      }
    })

    const { error: translationError } = await supabase
      .from("skill_group_translations")
      .insert(translations)

    if (translationError) return translationError.message

    const items = (body.items ?? [])
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name, index) => ({
        skill_group_id: skillGroupId,
        name,
        sort_order: index,
      }))

    if (items.length > 0) {
      const { error: itemError } = await supabase.from("skill_group_items").insert(items)
      if (itemError) return itemError.message
    }

    return null
  } catch (err) {
    return err instanceof Error ? err.message : String(err)
  }
}

export const deleteSkillGroupRelations = async (supabase: SupabaseClient, skillGroupId: string) => {
  for (const table of ["skill_group_items", "skill_group_translations"]) {
    const { error } = await supabase.from(table).delete().eq("skill_group_id", skillGroupId)
    if (error) return error.message
  }
  return null
}
