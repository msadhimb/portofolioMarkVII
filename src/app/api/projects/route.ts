import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { toProjectCard } from "@/helper/server/formatProjects/toProject"

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale") === "en" ? "en" : "id"
    const slug = searchParams.get("slug")?.trim() || null

    const supabase = await createClient()

    let query = supabase
      .from("project_list")
      .select("*")
      .eq("locale", locale)
      .order("sort_order", { ascending: true })

    if (slug) query = query.eq("slug", slug)

    const { data, error } = await query

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

    const projects = data.map(toProjectCard)

    return NextResponse.json({ data: projects, locale, variant: "card" })
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
