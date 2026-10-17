import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { toAward } from "@/helper/server/formatAwards/toAward"

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
      .from("award_list")
      .select(
        "slug,locale,title,issuer,category,issue_date,expiry_date,credential_id,credential_url,description,skills,created_at"
      )
      .eq("locale", locale)
      .eq("slug", slug)
      .maybeSingle()

    if (error) {
      console.error("[GET /api/awards/[slug]] Supabase error:", error.message)
      return NextResponse.json(
        {
          error: "Gagal mengambil award dari Supabase.",
          detail: error.message,
        },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        {
          error: `Award "${slug}" tidak ditemukan untuk locale "${locale}".`,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: toAward(data),
      locale,
      variant: "detail",
    })
  } catch (err) {
    console.error("[GET /api/awards/[slug]] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil award dari Supabase.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
