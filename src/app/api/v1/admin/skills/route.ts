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
  SKILL_GROUP_WITH_RELATIONS,
  toAdminSkillGroup,
  validateSkillGroupPayload,
  writeSkillGroupRelations,
  type SkillGroupPayload,
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
      .from("skill_groups")
      .select(SKILL_GROUP_WITH_RELATIONS, { count: "exact" })
      .order("sort_order", { ascending: true })

    if (search) {
      const { ids, error: searchError } = await fetchTranslationIds(
        supabase,
        "skill_group_translations",
        "skill_group_id",
        ["title"],
        search
      )
      if (searchError) {
        console.error("[GET /api/admin/skills] Search error:", searchError)
        return NextResponse.json(
          {
            error: "Gagal mengambil skills.",
            message: "Gagal mengambil skills.",
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
      console.error("[GET /api/admin/skills] Supabase error:", error.message)
      return NextResponse.json(
        {
          error: "Gagal mengambil skills.",
          message: "Gagal mengambil skills.",
          detail: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      paginated(
        (data ?? []).map((group) => toAdminSkillGroup(group)),
        buildPaginationMeta(params, count ?? 0)
      )
    )
  } catch (err) {
    console.error("[GET /api/admin/skills] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil skills.",
        message: "Gagal mengambil skills.",
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

    const body = (await req.json()) as SkillGroupPayload
    const issues = validateSkillGroupPayload(body)

    if (issues.length > 0) {
      return NextResponse.json(
        { error: "Payload tidak valid.", message: issues[0], data: { issues } },
        { status: 422 }
      )
    }

    const slug = body.slug!.trim()

    const { data: group, error: groupError } = await supabase
      .from("skill_groups")
      .insert({ slug, sort_order: body.sort_order ?? 0 })
      .select("id, slug")
      .single()

    if (groupError) {
      if (groupError.code === "23505") {
        return NextResponse.json(
          {
            error: "Slug sudah dipakai.",
            message: `Slug "${slug}" sudah dipakai skill group lain.`,
          },
          { status: 409 }
        )
      }
      console.error("[POST /api/admin/skills] Supabase error:", groupError.message)
      return NextResponse.json(
        {
          error: "Gagal menyimpan skill group.",
          message: "Gagal menyimpan skill group.",
          detail: groupError.message,
        },
        { status: 500 }
      )
    }

    const skillGroupId = group.id as string
    const relationError = await writeSkillGroupRelations(supabase, skillGroupId, body)

    if (relationError) {
      await supabase.from("skill_groups").delete().eq("id", skillGroupId)
      console.error("[POST /api/admin/skills] Relation error:", relationError)
      return NextResponse.json(
        {
          error: "Gagal menyimpan detail skill group.",
          message: "Gagal menyimpan detail skill group.",
          detail: relationError,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: { slug }, message: "Skill group berhasil ditambahkan." },
      { status: 201 }
    )
  } catch (err) {
    console.error("[POST /api/admin/skills] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal menyimpan skill group.",
        message: "Gagal menyimpan skill group.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
