import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { toProjectCard } from "@/helper/server/formatProjects/toProject"
import {
  buildPaginationMeta,
  paginated,
  parsePaginationParams,
  toSupabaseRange,
} from "@/helper/server/pagination"

const SELECT = `
  *,
  metrics:project_metrics!project_id (
    id,
    label,
    value,
    sort_order
  ),
  decisions:project_decisions!project_id (
    id,
    title,
    detail,
    sort_order
  )
`

const errorResponse = (detail: string) => {
  console.error("[GET /api/projects] Supabase error:", detail)
  return NextResponse.json(
    { error: "Gagal mengambil project dari Supabase.", detail },
    { status: 500 }
  )
}

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale") === "en" ? "en" : "id"
    const slug = searchParams.get("slug")?.trim() || null

    const supabase = await createClient()

    if (slug) {
      const { data, error } = await supabase
        .from("project_list")
        .select(SELECT)
        .eq("locale", locale)
        .eq("slug", slug)
        .eq("metrics.locale", locale)
        .eq("decisions.locale", locale)
        .order("created_at", { ascending: false })
        .order("sort_order", { referencedTable: "metrics" })
        .order("sort_order", { referencedTable: "decisions" })

      if (error) return errorResponse(error.message)

      return NextResponse.json({
        data: (data ?? []).map(toProjectCard),
        locale,
        variant: "card",
      })
    }

    const params = parsePaginationParams(searchParams, {
      defaultPerPage: 6,
      maxPerPage: 50,
    })
    const { from, to } = toSupabaseRange(params)

    const [listRes, featuredRes] = await Promise.all([
      supabase
        .from("project_list")
        .select(SELECT, { count: "exact" })
        .eq("locale", locale)
        .eq("metrics.locale", locale)
        .eq("decisions.locale", locale)
        .order("created_at", { ascending: false })
        .order("sort_order", { referencedTable: "metrics" })
        .order("sort_order", { referencedTable: "decisions" })
        .range(from, to),
      supabase
        .from("project_list")
        .select(SELECT)
        .eq("locale", locale)
        .eq("featured", true)
        .eq("metrics.locale", locale)
        .eq("decisions.locale", locale)
        .order("sort_order", { referencedTable: "metrics" })
        .order("sort_order", { referencedTable: "decisions" }),
    ])

    if (listRes.error) return errorResponse(listRes.error.message)
    if (featuredRes.error) return errorResponse(featuredRes.error.message)

    return NextResponse.json({
      ...paginated(
        (listRes.data ?? []).map(toProjectCard),
        buildPaginationMeta(params, listRes.count ?? 0)
      ),
      locale,
      variant: "card",
      featured: (featuredRes.data ?? []).map(toProjectCard),
    })
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : String(err))
  }
}
