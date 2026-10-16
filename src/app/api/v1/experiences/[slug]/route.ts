import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { toExperience } from "@/helper/server/formatExperiences/toExperience"

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale") === "en" ? "en" : "id"
    const { slug } = await params

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("experience_list")
      .select("slug,locale,period,role,org,context,points,stack,sort_order")
      .eq("locale", locale)
      .eq("slug", slug)
      .maybeSingle()

    if (error) {
      console.error("[GET /api/experiences/[slug]] Supabase error:", error.message)
      return NextResponse.json(
        {
          error: "Gagal mengambil experience dari Supabase.",
          detail: error.message,
        },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        {
          error: `Experience "${slug}" tidak ditemukan untuk locale "${locale}".`,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: toExperience(data),
      locale,
      variant: "detail",
    })
  } catch (err) {
    console.error("[GET /api/experiences/[slug]] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil experience dari Supabase.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
