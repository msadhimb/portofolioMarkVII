import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  SKILL_GROUP_WITH_RELATIONS,
  deleteSkillGroupRelations,
  toAdminSkillGroup,
  validateSkillGroupPayload,
  writeSkillGroupRelations,
  type SkillGroupPayload,
} from "../_shared"

type RouteParams = { params: Promise<{ slug: string }> }

const unauthorized = () =>
  NextResponse.json(
    { error: "Unauthorized.", message: "Sesi tidak valid. Silakan login kembali." },
    { status: 401 }
  )

const notFound = (slug: string) =>
  NextResponse.json(
    {
      error: "Skill group tidak ditemukan.",
      message: `Skill group "${slug}" tidak ditemukan.`,
    },
    { status: 404 }
  )

export const GET = async (_req: NextRequest, { params }: RouteParams) => {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return unauthorized()

    const { data, error } = await supabase
      .from("skill_groups")
      .select(SKILL_GROUP_WITH_RELATIONS)
      .eq("slug", slug)
      .maybeSingle()

    if (error) {
      console.error("[GET /api/admin/skills/[slug]] Supabase error:", error.message)
      return NextResponse.json(
        {
          error: "Gagal mengambil skill group.",
          message: "Gagal mengambil skill group.",
          detail: error.message,
        },
        { status: 500 }
      )
    }

    if (!data) return notFound(slug)

    return NextResponse.json({ data: toAdminSkillGroup(data) })
  } catch (err) {
    console.error("[GET /api/admin/skills/[slug]] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil skill group.",
        message: "Gagal mengambil skill group.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}

export const PUT = async (req: NextRequest, { params }: RouteParams) => {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return unauthorized()

    const body = (await req.json()) as SkillGroupPayload
    const issues = validateSkillGroupPayload(body, { requireSlug: false })

    if (issues.length > 0) {
      return NextResponse.json(
        { error: "Payload tidak valid.", message: issues[0], data: { issues } },
        { status: 422 }
      )
    }

    const { data: existing, error: findError } = await supabase
      .from("skill_groups")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle()

    if (findError) {
      console.error("[PUT /api/admin/skills/[slug]] Supabase error:", findError.message)
      return NextResponse.json(
        {
          error: "Gagal menyimpan skill group.",
          message: "Gagal menyimpan skill group.",
          detail: findError.message,
        },
        { status: 500 }
      )
    }

    if (!existing) return notFound(slug)

    const skillGroupId = existing.id as string

    const { error: updateError } = await supabase
      .from("skill_groups")
      .update({ sort_order: body.sort_order ?? 0 })
      .eq("id", skillGroupId)

    if (updateError) {
      console.error("[PUT /api/admin/skills/[slug]] Supabase error:", updateError.message)
      return NextResponse.json(
        {
          error: "Gagal menyimpan skill group.",
          message: "Gagal menyimpan skill group.",
          detail: updateError.message,
        },
        { status: 500 }
      )
    }

    const clearError = await deleteSkillGroupRelations(supabase, skillGroupId)

    if (clearError) {
      console.error("[PUT /api/admin/skills/[slug]] Clear error:", clearError)
      return NextResponse.json(
        {
          error: "Gagal menyimpan detail skill group.",
          message: "Gagal menyimpan detail skill group.",
          detail: clearError,
        },
        { status: 500 }
      )
    }

    const relationError = await writeSkillGroupRelations(supabase, skillGroupId, body)

    if (relationError) {
      console.error("[PUT /api/admin/skills/[slug]] Relation error:", relationError)
      return NextResponse.json(
        {
          error: "Gagal menyimpan detail skill group.",
          message: "Gagal menyimpan detail skill group.",
          detail: relationError,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: { slug },
      message: "Skill group berhasil diperbarui.",
    })
  } catch (err) {
    console.error("[PUT /api/admin/skills/[slug]] Unexpected error:", err)
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

export const DELETE = async (_req: NextRequest, { params }: RouteParams) => {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return unauthorized()

    const { data: existing, error: findError } = await supabase
      .from("skill_groups")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle()

    if (findError) {
      console.error("[DELETE /api/admin/skills/[slug]] Supabase error:", findError.message)
      return NextResponse.json(
        {
          error: "Gagal menghapus skill group.",
          message: "Gagal menghapus skill group.",
          detail: findError.message,
        },
        { status: 500 }
      )
    }

    if (!existing) return notFound(slug)

    const { error: deleteError } = await supabase
      .from("skill_groups")
      .delete()
      .eq("id", existing.id)

    if (deleteError) {
      console.error("[DELETE /api/admin/skills/[slug]] Supabase error:", deleteError.message)
      return NextResponse.json(
        {
          error: "Gagal menghapus skill group.",
          message: "Gagal menghapus skill group.",
          detail: deleteError.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: { slug },
      message: "Skill group berhasil dihapus.",
    })
  } catch (err) {
    console.error("[DELETE /api/admin/skills/[slug]] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal menghapus skill group.",
        message: "Gagal menghapus skill group.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
