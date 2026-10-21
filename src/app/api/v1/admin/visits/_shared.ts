import type { SupabaseClient } from "@supabase/supabase-js"
import {
  buildPaginationMeta,
  type PaginationParams,
  toSupabaseRange,
} from "@/helper/server/pagination"
import { toWibDate } from "@/helper/server/wibDate"

export type VisitRange = "7d" | "30d" | "90d"

export const VISIT_RANGES: VisitRange[] = ["7d", "30d", "90d"]

const RANGE_DAYS: Record<VisitRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
}

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
  pagination: ReturnType<typeof buildPaginationMeta>
  summary: VisitSummary
  daily: VisitDailyPoint[]
  pages: VisitBreakdown[]
  countries: VisitBreakdown[]
  devices: VisitBreakdown[]
}

export type AdminVisitParams = PaginationParams & {
  range: VisitRange
  search: string
  device: string | null
}

export const parseVisitRange = (value: string | null): VisitRange =>
  value === "7d" || value === "90d" ? value : "30d"

const shiftWibDay = (day: string, delta: number) => {
  const date = new Date(`${day}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

const fillDaily = (
  rows: { day: string; pageviews: number; visitors: number }[],
  fromDay: string,
  today: string
): VisitDailyPoint[] => {
  const map = new Map(rows.map((row) => [String(row.day), row]))
  const points: VisitDailyPoint[] = []
  const cursor = new Date(`${fromDay}T00:00:00Z`)
  const end = new Date(`${today}T00:00:00Z`)

  while (cursor <= end) {
    const day = cursor.toISOString().slice(0, 10)
    const row = map.get(day)
    points.push({
      day,
      pageviews: Number(row?.pageviews ?? 0),
      visitors: Number(row?.visitors ?? 0),
    })
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  return points
}

const aggregate = (
  rows: Record<string, unknown>[],
  key: string
): VisitBreakdown[] => {
  const map = new Map<string, number>()

  for (const row of rows) {
    const label = String(row[key] ?? "unknown")
    map.set(label, (map.get(label) ?? 0) + Number(row.pageviews ?? 0))
  }

  return [...map.entries()]
    .map(([label, pageviews]) => ({ label, pageviews }))
    .sort((a, b) => b.pageviews - a.pageviews)
    .slice(0, 8)
}

export const fetchAdminVisits = async (
  supabase: SupabaseClient,
  params: AdminVisitParams
): Promise<{ data: VisitResponse | null; error: string | null }> => {
  const days = RANGE_DAYS[params.range]
  const today = toWibDate()
  const fromDay = shiftWibDay(today, -(days - 1))
  const fromIso = new Date(`${fromDay}T00:00:00+07:00`).toISOString()
  const onlineSince = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const { from: rangeFrom, to: rangeTo } = toSupabaseRange(params)

  let visitorQuery = supabase
    .from("site_visitors")
    .select("*", { count: "exact" })
    .gte("last_seen", fromIso)
    .order("last_seen", { ascending: false })

  if (params.device) {
    visitorQuery = visitorQuery.eq("device_type", params.device)
  }

  if (params.search) {
    visitorQuery = visitorQuery.or(
      [
        `visitor_id.ilike.%${params.search}%`,
        `city.ilike.%${params.search}%`,
        `country.ilike.%${params.search}%`,
        `last_path.ilike.%${params.search}%`,
      ].join(",")
    )
  }

  const [
    visitorsRes,
    pageviewCountRes,
    visitorCountRes,
    todayRes,
    onlineRes,
    dailyRes,
    pageRes,
    countryRes,
    deviceRes,
  ] = await Promise.all([
    visitorQuery.range(rangeFrom, rangeTo),
    supabase
      .from("site_visits")
      .select("*", { count: "exact", head: true })
      .gte("created_at", fromIso),
    supabase
      .from("site_visitors")
      .select("*", { count: "exact", head: true })
      .gte("last_seen", fromIso),
    supabase
      .from("site_visit_daily")
      .select("pageviews")
      .eq("day", today)
      .maybeSingle(),
    supabase
      .from("site_visitors")
      .select("*", { count: "exact", head: true })
      .gte("last_seen", onlineSince),
    supabase
      .from("site_visit_daily")
      .select("day, pageviews, visitors")
      .gte("day", fromDay)
      .lte("day", today)
      .order("day"),
    supabase
      .from("site_visit_page_daily")
      .select("path, pageviews")
      .gte("day", fromDay)
      .lte("day", today),
    supabase
      .from("site_visit_country_daily")
      .select("country, pageviews")
      .gte("day", fromDay)
      .lte("day", today),
    supabase
      .from("site_visit_device_daily")
      .select("device_type, pageviews")
      .gte("day", fromDay)
      .lte("day", today),
  ])

  const firstError =
    visitorsRes.error ??
    pageviewCountRes.error ??
    visitorCountRes.error ??
    todayRes.error ??
    onlineRes.error ??
    dailyRes.error ??
    pageRes.error ??
    countryRes.error ??
    deviceRes.error

  if (firstError) {
    return { data: null, error: firstError.message }
  }

  return {
    data: {
      data: (visitorsRes.data ?? []) as VisitorRow[],
      pagination: buildPaginationMeta(params, visitorsRes.count ?? 0),
      summary: {
        pageviews: pageviewCountRes.count ?? 0,
        visitors: visitorCountRes.count ?? 0,
        todayPageviews: Number(todayRes.data?.pageviews ?? 0),
        online: onlineRes.count ?? 0,
      },
      daily: fillDaily(
        (dailyRes.data ?? []) as {
          day: string
          pageviews: number
          visitors: number
        }[],
        fromDay,
        today
      ),
      pages: aggregate(
        (pageRes.data ?? []) as Record<string, unknown>[],
        "path"
      ),
      countries: aggregate(
        (countryRes.data ?? []) as Record<string, unknown>[],
        "country"
      ),
      devices: aggregate(
        (deviceRes.data ?? []) as Record<string, unknown>[],
        "device_type"
      ),
    },
    error: null,
  }
}
