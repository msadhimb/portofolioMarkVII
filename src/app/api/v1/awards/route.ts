import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { toAward } from "@/helper/server/formatAwards/toAward"
import {
  buildPaginationMeta,
  paginated,
  parsePaginationParams,
  toSupabaseRange,
} from "@/helper/server/pagination"

const AWARD_COLUMNS =
  "slug,locale,title,issuer,category,issue_date,expiry_date,credential_id,credential_url,description,skills,created_at"

const ALLOWED_CATEGORIES = ["certificate", "award", "honor"] as const

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale") === "en" ? "en" : "id"
    const slug = searchParams.get("slug")?.trim() || null
    const rawCategory = searchParams.get("category")?.trim().toLowerCase() ?? ""
    const category = (ALLOWED_CATEGORIES as readonly string[]).includes(
      rawCategory
    )
      ? rawCategory
      : null

    const supabase = await createClient()

    // Mode detail-per-slug: tanpa pagination, bentuk respons lama dipertahankan.
    if (slug) {
      const { data, error } = await supabase
        .from("award_list")
        .select(AWARD_COLUMNS)
        .eq("locale", locale)
        .eq("slug", slug)
        .maybeSingle()

      if (error) {
        console.error("[GET /api/awards] Supabase error:", error.message)
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

      return NextResponse.json({ data: toAward(data), locale, variant: "card" })
    }

    const params = parsePaginationParams(searchParams, {
      defaultPerPage: 6,
      maxPerPage: 50,
    })
    const { from, to } = toSupabaseRange(params)

    let query = supabase
      .from("award_list")
      .select(AWARD_COLUMNS, { count: "exact" })
      .eq("locale", locale)
      .order("created_at", { ascending: false })

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error("[GET /api/awards] Supabase error:", error.message)
      return NextResponse.json(
        {
          error: "Gagal mengambil award dari Supabase.",
          detail: error.message,
        },
        { status: 500 }
      )
    }

    const awards = (data ?? []).map(toAward)

    return NextResponse.json({
      ...paginated(awards, buildPaginationMeta(params, count ?? 0)),
      locale,
      variant: "card",
    })
  } catch (err) {
    console.error("[GET /api/awards] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil award dari Supabase.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
