import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { toProject } from "@/helper/server/formatProjects/toProject"

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
  ),
  highlights:project_highlights!project_id (
    id,
    body,
    sort_order
  )
`

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale") === "en" ? "en" : "id"
    const { slug } = await params

    const supabase = await createClient()

    const [projectRes, relatedRes] = await Promise.all([
      supabase
        .from("project_list")
        .select(SELECT)
        .eq("locale", locale)
        .eq("slug", slug)
        .eq("metrics.locale", locale)
        .eq("decisions.locale", locale)
        .eq("highlights.locale", locale)
        .order("sort_order", { referencedTable: "metrics" })
        .order("sort_order", { referencedTable: "decisions" })
        .order("sort_order", { referencedTable: "highlights" })
        .maybeSingle(),
      supabase
        .from("project_list")
        .select("slug, title")
        .eq("locale", locale)
        .neq("slug", slug)
        .order("created_at", { ascending: false })
        .limit(2),
    ])

    if (projectRes.error) {
      return NextResponse.json(
        {
          error: "Gagal mengambil project dari Supabase.",
          detail: projectRes.error.message,
        },
        { status: 500 }
      )
    }

    if (!projectRes.data) {
      return NextResponse.json(
        {
          error: `Project "${slug}" tidak ditemukan untuk locale "${locale}".`,
        },
        { status: 404 }
      )
    }

    if (relatedRes.error) {
      console.error(
        "[GET /api/projects/[slug]] Related error:",
        relatedRes.error.message
      )
    }

    const project = {
      ...toProject(projectRes.data),
      related: relatedRes.data ?? [],
    }

    return NextResponse.json({ data: project, locale, variant: "detail" })
  } catch (err) {
    console.error("[GET /api/projects/[slug]] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil project dari Supabase.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
