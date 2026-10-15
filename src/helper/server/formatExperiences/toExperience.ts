import type { ExperienceApi, ExperienceRow } from "./type"

export const toExperience = (row: ExperienceRow): ExperienceApi => ({
  slug: row.slug,
  period: row.period ?? "",
  role: row.role ?? "",
  org: row.org ?? "",
  context: row.context ?? "",
  points: row.points ?? [],
  stack: row.stack ?? [],
})
