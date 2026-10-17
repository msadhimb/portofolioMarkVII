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
  EXPERIENCE_WITH_RELATIONS,
  toAdminExperience,
  validateExperiencePayload,
  writeExperienceRelations,
  type ExperiencePayload,
} from "./_shared"

export const GET = async (req: Request) => {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized.", message: "Sesi tidak valid. Silakan login kembali." },
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
      .from("experiences")
      .select(EXPERIENCE_WITH_RELATIONS, { count: "exact" })
      .order("start_date", { ascending: false, nullsFirst: false })

    if (search) {
      const { ids, error: searchError } = await fetchTranslationIds(
        supabase,
        "experience_translations",
        "experience_id",
        ["role", "org"],
        search
      )
      if (searchError) {
        console.error("[GET /api/admin/experiences] Search error:", searchError)
        return NextResponse.json(
          {
            error: "Gagal mengambil experience.",
            message: "Gagal mengambil experience.",
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
      console.error("[GET /api/admin/experiences] Supabase error:", error.message)
      return NextResponse.json(
        {
          error: "Gagal mengambil experience.",
          message: "Gagal mengambil experience.",
          detail: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      paginated(
        (data ?? []).map((experience) => toAdminExperience(experience)),
        buildPaginationMeta(params, count ?? 0)
      )
    )
  } catch (err) {
    console.error("[GET /api/admin/experiences] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil experience.",
        message: "Gagal mengambil experience.",
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
        { error: "Unauthorized.", message: "Sesi tidak valid. Silakan login kembali." },
        { status: 401 }
      )
    }

    const body = (await req.json()) as ExperiencePayload
    const issues = validateExperiencePayload(body)

    if (issues.length > 0) {
      return NextResponse.json(
        { error: "Payload tidak valid.", message: issues[0], data: { issues } },
        { status: 422 }
      )
    }

    const slug = body.slug!.trim()

    const { data: experience, error: experienceError } = await supabase
      .from("experiences")
      .insert({
        slug,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        org: body.org?.trim() ?? "",
      })
      .select("id, slug")
      .single()

    if (experienceError) {
      if (experienceError.code === "23505") {
        return NextResponse.json(
          {
            error: "Slug sudah dipakai.",
            message: `Slug "${slug}" sudah dipakai experience lain.`,
          },
          { status: 409 }
        )
      }
      console.error("[POST /api/admin/experiences] Supabase error:", experienceError.message)
      return NextResponse.json(
        {
          error: "Gagal menyimpan experience.",
          message: "Gagal menyimpan experience.",
          detail: experienceError.message,
        },
        { status: 500 }
      )
    }

    const experienceId = experience.id as string
    const relationError = await writeExperienceRelations(supabase, experienceId, body)

    if (relationError) {
      await supabase.from("experiences").delete().eq("id", experienceId)
      console.error("[POST /api/admin/experiences] Relation error:", relationError)
      return NextResponse.json(
        {
          error: "Gagal menyimpan detail experience.",
          message: "Gagal menyimpan detail experience.",
          detail: relationError,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: { slug }, message: "Experience berhasil ditambahkan." },
      { status: 201 }
    )
  } catch (err) {
    console.error("[POST /api/admin/experiences] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal menyimpan experience.",
        message: "Gagal menyimpan experience.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
