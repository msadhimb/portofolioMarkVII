import type { AwardCategory, AwardItem } from "@/data/profile"

/** Bentuk mentah 1 baris view public.award_list. */
export type AwardRow = {
  slug: string
  category: AwardCategory
  issue_date: string
  expiry_date: string | null
  credential_id: string | null
  credential_url: string | null
  locale: string
  title: string
  issuer: string
  description: string
  skills: string[]
  created_at: string
}

/** Bentuk yang dikirim API (1:1 dengan tipe AwardItem). */
export type AwardApi = AwardItem
