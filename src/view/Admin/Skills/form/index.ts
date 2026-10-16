import type { AdminSkillGroup } from "../table/columns"

export type SkillGroupFormData = {
  slug: string
  sortOrder: number
  items: string
  idTitle: string
  idNote: string
  enTitle: string
  enNote: string
}

export const skillGroupDefaultValues: SkillGroupFormData = {
  slug: "",
  sortOrder: 0,
  items: "",
  idTitle: "",
  idNote: "",
  enTitle: "",
  enNote: "",
}

export const toLines = (items: string[]): string => items.join("\n")

export const fromLines = (value: string): string[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

export const skillGroupToFormValues = (group: AdminSkillGroup): SkillGroupFormData => {
  const id = group.translations?.id ?? {}
  const en = group.translations?.en ?? {}

  return {
    slug: group.slug,
    sortOrder: group.sort_order ?? 0,
    items: toLines(group.items ?? []),
    idTitle: id.title ?? "",
    idNote: id.note ?? "",
    enTitle: en.title ?? "",
    enNote: en.note ?? "",
  }
}

export const skillGroupFormToPayload = (values: SkillGroupFormData, slug: string) => ({
  slug,
  sort_order: Number(values.sortOrder) || 0,
  items: fromLines(values.items),
  translations: {
    id: { title: values.idTitle.trim(), note: values.idNote.trim() },
    en: { title: values.enTitle.trim(), note: values.enNote.trim() },
  },
})
