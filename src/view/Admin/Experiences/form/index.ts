import type { AdminExperience } from "../table/columns"

export type ExperienceFormData = {
  slug: string
  sortOrder: number
  startDate: string
  endDate: string
  stacks: string
  idPeriod: string
  idRole: string
  idOrg: string
  idContext: string
  idPoints: string
  enPeriod: string
  enRole: string
  enOrg: string
  enContext: string
  enPoints: string
}

export const experienceDefaultValues: ExperienceFormData = {
  slug: "",
  sortOrder: 0,
  startDate: "",
  endDate: "",
  stacks: "",
  idPeriod: "",
  idRole: "",
  idOrg: "",
  idContext: "",
  idPoints: "",
  enPeriod: "",
  enRole: "",
  enOrg: "",
  enContext: "",
  enPoints: "",
}

export const toLines = (items: string[]): string => items.join("\n")

export const fromLines = (value: string): string[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

export const experienceToFormValues = (experience: AdminExperience): ExperienceFormData => {
  const id = experience.translations?.id ?? {}
  const en = experience.translations?.en ?? {}

  return {
    slug: experience.slug,
    sortOrder: experience.sort_order ?? 0,
    startDate: experience.start_date ?? "",
    endDate: experience.end_date ?? "",
    stacks: toLines(experience.stacks ?? []),
    idPeriod: id.period ?? "",
    idRole: id.role ?? "",
    idOrg: id.org ?? "",
    idContext: id.context ?? "",
    idPoints: toLines(id.points ?? []),
    enPeriod: en.period ?? "",
    enRole: en.role ?? "",
    enOrg: en.org ?? "",
    enContext: en.context ?? "",
    enPoints: toLines(en.points ?? []),
  }
}

export const experienceFormToPayload = (values: ExperienceFormData, slug: string) => {
  const translation = (prefix: "id" | "en") => ({
    period: values[`${prefix}Period`].trim(),
    role: values[`${prefix}Role`].trim(),
    org: values[`${prefix}Org`].trim(),
    context: values[`${prefix}Context`].trim(),
    points: fromLines(values[`${prefix}Points`]),
  })

  return {
    slug,
    sort_order: Number(values.sortOrder) || 0,
    start_date: values.startDate || null,
    end_date: values.endDate || null,
    stacks: fromLines(values.stacks),
    translations: {
      id: translation("id"),
      en: translation("en"),
    },
  }
}
