import type { Experience } from "@/data/profile"

/** Bentuk mentah 1 baris view public.experience_list. */
export type ExperienceRow = {
  slug: string
  sort_order: number
  locale: string
  period: string
  role: string
  org: string
  context: string
  points: string[]
  stack: string[]
}

/** Bentuk yang dikirim API (1:1 dengan tipe Experience + slug untuk key). */
export type ExperienceApi = Experience & {
  slug: string
}
