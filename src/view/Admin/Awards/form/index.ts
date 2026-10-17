import type { AdminAward } from "../table/columns"

export type AwardFormData = {
  slug: string
  category: string
  issueDate: string
  expiryDate: string
  credentialId: string
  credentialUrl: string
  skills: string
  idTitle: string
  idIssuer: string
  idDescription: string
  enTitle: string
  enIssuer: string
  enDescription: string
}

export const awardDefaultValues: AwardFormData = {
  slug: "",
  category: "certificate",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
  skills: "",
  idTitle: "",
  idIssuer: "",
  idDescription: "",
  enTitle: "",
  enIssuer: "",
  enDescription: "",
}

export const toLines = (items: string[]): string => items.join("\n")

export const fromLines = (value: string): string[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

export const awardToFormValues = (award: AdminAward): AwardFormData => {
  const id = award.translations?.id ?? {}
  const en = award.translations?.en ?? {}

  return {
    slug: award.slug,
    category: award.category ?? "certificate",
    issueDate: award.issue_date ?? "",
    expiryDate: award.expiry_date ?? "",
    credentialId: award.credential_id ?? "",
    credentialUrl: award.credential_url ?? "",
    skills: toLines(award.skills ?? []),
    idTitle: id.title ?? "",
    idIssuer: id.issuer ?? "",
    idDescription: id.description ?? "",
    enTitle: en.title ?? "",
    enIssuer: en.issuer ?? "",
    enDescription: en.description ?? "",
  }
}

export const awardFormToPayload = (values: AwardFormData, slug: string) => {
  const translation = (prefix: "id" | "en") => ({
    title: values[`${prefix}Title`].trim(),
    issuer: values[`${prefix}Issuer`].trim(),
    description: values[`${prefix}Description`].trim(),
  })

  return {
    slug,
    category: values.category,
    issue_date: values.issueDate.trim(),
    expiry_date: values.expiryDate.trim() || null,
    credential_id: values.credentialId.trim() || null,
    credential_url: values.credentialUrl.trim() || null,
    skills: fromLines(values.skills),
    translations: {
      id: translation("id"),
      en: translation("en"),
    },
  }
}
