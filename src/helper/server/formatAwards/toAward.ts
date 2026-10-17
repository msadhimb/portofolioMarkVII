import type { AwardApi, AwardRow } from "./type"

export const toAward = (row: AwardRow): AwardApi => ({
  slug: row.slug,
  title: row.title ?? "",
  issuer: row.issuer ?? "",
  category: row.category,
  issueDate: row.issue_date ?? "",
  expiryDate: row.expiry_date ?? undefined,
  credentialId: row.credential_id ?? undefined,
  credentialUrl: row.credential_url ?? undefined,
  description: row.description ?? "",
  skills: row.skills ?? [],
})
