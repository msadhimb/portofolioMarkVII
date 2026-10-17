import type { AdminExperience } from "../table/columns"

export type ExperienceFormData = {
  slug: string
  startDate: string
  endDate: string
  stacks: string
  org: string
  idRole: string
  idContext: string
  idPoints: string
  enRole: string
  enContext: string
  enPoints: string
}

export const experienceDefaultValues: ExperienceFormData = {
  slug: "",
  startDate: "",
  endDate: "",
  stacks: "",
  org: "",
  idRole: "",
  idContext: "",
  idPoints: "",
  enRole: "",
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
    startDate: experience.start_date ?? "",
    endDate: experience.end_date ?? "",
    stacks: toLines(experience.stacks ?? []),
    org: experience.org ?? "",
    idRole: id.role ?? "",
    idContext: id.context ?? "",
    idPoints: toLines(id.points ?? []),
    enRole: en.role ?? "",
    enContext: en.context ?? "",
    enPoints: toLines(en.points ?? []),
  }
}

export const experienceFormToPayload = (values: ExperienceFormData, slug: string) => {
  const translation = (prefix: "id" | "en") => ({
    role: values[`${prefix}Role`].trim(),
    context: values[`${prefix}Context`].trim(),
    points: fromLines(values[`${prefix}Points`]),
  })

  return {
    slug,
    start_date: values.startDate || null,
    end_date: values.endDate || null,
    org: values.org.trim(),
    stacks: fromLines(values.stacks),
    translations: {
      id: translation("id"),
      en: translation("en"),
    },
  }
}
