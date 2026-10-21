import type { PaginationMeta } from "@/lib/pagination"

export type VisitRange = "7d" | "30d" | "90d"

export type VisitorRow = {
  visitor_id: string
  first_seen: string
  last_seen: string
  visit_count: number
  pageview_count: number
  entry_path: string | null
  last_path: string | null
  device_type: string
  browser: string | null
  os: string | null
  country: string | null
  region: string | null
  city: string | null
  timezone: string | null
  language: string | null
  ip_hash: string | null
  is_bot: boolean
}

export type VisitDailyPoint = {
  day: string
  pageviews: number
  visitors: number
}

export type VisitBreakdown = {
  label: string
  pageviews: number
}

export type VisitSummary = {
  pageviews: number
  visitors: number
  todayPageviews: number
  online: number
}

export type VisitResponse = {
  data: VisitorRow[]
  pagination: PaginationMeta
  summary: VisitSummary
  daily: VisitDailyPoint[]
  pages: VisitBreakdown[]
  countries: VisitBreakdown[]
  devices: VisitBreakdown[]
}

export type VisitQuery = {
  range: VisitRange
  page: number
  perPage: number
  search?: string
  device?: string
}

export type AdminVisitStore = {
  getAdminVisits: (params: VisitQuery) => Promise<VisitResponse>
}
