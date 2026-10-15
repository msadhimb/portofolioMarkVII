import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { toExperience } from "@/helper/server/formatExperiences/toExperience"

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale") === "en" ? "en" : "id"
    const slug = searchParams.get("slug")?.trim() || null

    const supabase = await createClient()

    let query = supabase
      .from("experience_list")
      .select("slug,locale,period,role,org,context,points,stack,sort_order")
      .eq("locale", locale)
      .order("sort_order", { ascending: true })

    if (slug) query = query.eq("slug", slug)

    const { data, error } = await query

    if (error) {
      console.error("[GET /api/experiences] Supabase error:", error.message)
      return NextResponse.json(
        {
          error: "Gagal mengambil experience dari Supabase.",
          detail: error.message,
        },
        { status: 500 }
      )
    }

    const experiences = (data ?? []).map(toExperience)

    if (slug && experiences.length === 0) {
      return NextResponse.json(
        {
          error: `Experience "${slug}" tidak ditemukan untuk locale "${locale}".`,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: experiences, locale, variant: "card" })
  } catch (err) {
    console.error("[GET /api/experiences] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil experience dari Supabase.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
