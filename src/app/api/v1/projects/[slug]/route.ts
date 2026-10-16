import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { toProject } from "@/helper/server/formatProjects/toProject"

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
        .select("*")
        .eq("locale", locale)
        .eq("slug", slug)
        .maybeSingle(),
      supabase
        .from("project_list")
        .select("slug, title")
        .eq("locale", locale)
        .neq("slug", slug)
        .order("sort_order", { ascending: true })
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

    const project = {
      ...toProject(projectRes.data),
      related: relatedRes.data || [],
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
