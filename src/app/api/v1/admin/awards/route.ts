import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  buildPaginationMeta,
  fetchTranslationIds,
  paginated,
  parsePaginationParams,
  sanitizeLikeParam,
  toSupabaseRange,
} from "@/helper/server/pagination"
import {
  AWARD_WITH_RELATIONS,
  toAdminAward,
  validateAwardPayload,
  writeAwardRelations,
  type AwardPayload,
} from "./_shared"

export const GET = async (req: Request) => {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
          message: "Sesi tidak valid. Silakan login kembali.",
        },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const params = parsePaginationParams(searchParams, {
      defaultPerPage: 10,
      maxPerPage: 100,
    })
    const search = sanitizeLikeParam(searchParams.get("search"))
    const { from, to } = toSupabaseRange(params)

    let query = supabase
      .from("awards")
      .select(AWARD_WITH_RELATIONS, { count: "exact" })
      .order("sort_order", { ascending: false })

    if (search) {
      const { ids, error: searchError } = await fetchTranslationIds(
        supabase,
        "award_translations",
        "award_id",
        ["title", "issuer"],
        search
      )
      if (searchError) {
        console.error("[GET /api/admin/awards] Search error:", searchError)
        return NextResponse.json(
          {
            error: "Gagal mengambil award.",
            message: "Gagal mengambil award.",
            detail: searchError,
          },
          { status: 500 }
        )
      }
      query =
        ids.length > 0
          ? query.or(`slug.ilike.%${search}%,id.in.(${ids.join(",")})`)
          : query.ilike("slug", `%${search}%`)
    }

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error("[GET /api/admin/awards] Supabase error:", error.message)
      return NextResponse.json(
        {
          error: "Gagal mengambil award.",
          message: "Gagal mengambil award.",
          detail: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      paginated(
        (data ?? []).map((award) => toAdminAward(award)),
        buildPaginationMeta(params, count ?? 0)
      )
    )
  } catch (err) {
    console.error("[GET /api/admin/awards] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil award.",
        message: "Gagal mengambil award.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}

export const POST = async (req: Request) => {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
          message: "Sesi tidak valid. Silakan login kembali.",
        },
        { status: 401 }
      )
    }

    const body = (await req.json()) as AwardPayload
    const issues = validateAwardPayload(body)

    if (issues.length > 0) {
      return NextResponse.json(
        { error: "Payload tidak valid.", message: issues[0], data: { issues } },
        { status: 422 }
      )
    }

    const slug = body.slug!.trim()

    const { data: award, error: awardError } = await supabase
      .from("awards")
      .insert({
        slug,
        category: body.category,
        issue_date: body.issue_date?.trim() ?? "",
        expiry_date: body.expiry_date?.trim() || null,
        credential_id: body.credential_id?.trim() || null,
        credential_url: body.credential_url?.trim() || null,
      })
      .select("id, slug")
      .single()

    if (awardError) {
      if (awardError.code === "23505") {
        return NextResponse.json(
          {
            error: "Slug sudah dipakai.",
            message: `Slug "${slug}" sudah dipakai award lain.`,
          },
          { status: 409 }
        )
      }
      console.error(
        "[POST /api/admin/awards] Supabase error:",
        awardError.message
      )
      return NextResponse.json(
        {
          error: "Gagal menyimpan award.",
          message: "Gagal menyimpan award.",
          detail: awardError.message,
        },
        { status: 500 }
      )
    }

    const awardId = award.id as string
    const relationError = await writeAwardRelations(supabase, awardId, body)

    if (relationError) {
      await supabase.from("awards").delete().eq("id", awardId)
      console.error("[POST /api/admin/awards] Relation error:", relationError)
      return NextResponse.json(
        {
          error: "Gagal menyimpan detail award.",
          message: "Gagal menyimpan detail award.",
          detail: relationError,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: { slug }, message: "Award berhasil ditambahkan." },
      { status: 201 }
    )
  } catch (err) {
    console.error("[POST /api/admin/awards] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal menyimpan award.",
        message: "Gagal menyimpan award.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
