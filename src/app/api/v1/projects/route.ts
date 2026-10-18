import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { toProjectCard } from "@/helper/server/formatProjects/toProject"
import {
  buildPaginationMeta,
  paginated,
  parsePaginationParams,
  toSupabaseRange,
} from "@/helper/server/pagination"

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale") === "en" ? "en" : "id"
    const slug = searchParams.get("slug")?.trim() || null

    const supabase = await createClient()

    // Mode detail-per-slug: tanpa pagination, bentuk respons lama dipertahankan.
    if (slug) {
      const { data, error } = await supabase
        .from("project_list")
        .select("*")
        .eq("locale", locale)
      .eq("slug", slug)
      .order("created_at", { ascending: false })

      if (error) {
        console.error("[GET /api/projects] Supabase error:", error.message)
        return NextResponse.json(
          {
            error: "Gagal mengambil project dari Supabase.",
            detail: error.message,
          },
          { status: 500 }
        )
      }

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

    const { data, error, count } = await supabase
      .from("project_list")
      .select("*", { count: "exact" })
      .eq("locale", locale)
      .order("created_at", { ascending: false })
      .range(from, to)

    const { data: featuredData } = await supabase
      .from("project_list")
      .select("*")
      .eq("locale", locale)
      .eq("featured", true)

    if (error) {
      console.error("[GET /api/projects] Supabase error:", error.message)
      return NextResponse.json(
        {
          error: "Gagal mengambil project dari Supabase.",
          detail: error.message,
        },
        { status: 500 }
      )
    }

    const projects = (data ?? []).map(toProjectCard)
    const featuredProjects = featuredData?.map(toProjectCard) || []

    return NextResponse.json({
      ...paginated(projects, buildPaginationMeta(params, count ?? 0)),
      locale,
      variant: "card",
      featured: featuredProjects,
    })
  } catch (err) {
    console.error("[GET /api/projects] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil project dari Supabase.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
