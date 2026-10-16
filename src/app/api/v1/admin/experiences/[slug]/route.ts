import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  EXPERIENCE_WITH_RELATIONS,
  deleteExperienceRelations,
  toAdminExperience,
  validateExperiencePayload,
  writeExperienceRelations,
  type ExperiencePayload,
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
      error: "Experience tidak ditemukan.",
      message: `Experience "${slug}" tidak ditemukan.`,
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
      .from("experiences")
      .select(EXPERIENCE_WITH_RELATIONS)
      .eq("slug", slug)
      .maybeSingle()

    if (error) {
      console.error("[GET /api/admin/experiences/[slug]] Supabase error:", error.message)
      return NextResponse.json(
        {
          error: "Gagal mengambil experience.",
          message: "Gagal mengambil experience.",
          detail: error.message,
        },
        { status: 500 }
      )
    }

    if (!data) return notFound(slug)

    return NextResponse.json({ data: toAdminExperience(data) })
  } catch (err) {
    console.error("[GET /api/admin/experiences/[slug]] Unexpected error:", err)
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

export const PUT = async (req: NextRequest, { params }: RouteParams) => {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return unauthorized()

    const body = (await req.json()) as ExperiencePayload
    const issues = validateExperiencePayload(body, { requireSlug: false })

    if (issues.length > 0) {
      return NextResponse.json(
        { error: "Payload tidak valid.", message: issues[0], data: { issues } },
        { status: 422 }
      )
    }

    const { data: existing, error: findError } = await supabase
      .from("experiences")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle()

    if (findError) {
      console.error("[PUT /api/admin/experiences/[slug]] Supabase error:", findError.message)
      return NextResponse.json(
        {
          error: "Gagal menyimpan experience.",
          message: "Gagal menyimpan experience.",
          detail: findError.message,
        },
        { status: 500 }
      )
    }

    if (!existing) return notFound(slug)

    const experienceId = existing.id as string

    const { error: updateError } = await supabase
      .from("experiences")
      .update({
        sort_order: body.sort_order ?? 0,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
      })
      .eq("id", experienceId)

    if (updateError) {
      console.error("[PUT /api/admin/experiences/[slug]] Supabase error:", updateError.message)
      return NextResponse.json(
        {
          error: "Gagal menyimpan experience.",
          message: "Gagal menyimpan experience.",
          detail: updateError.message,
        },
        { status: 500 }
      )
    }

    const clearError = await deleteExperienceRelations(supabase, experienceId)

    if (clearError) {
      console.error("[PUT /api/admin/experiences/[slug]] Clear error:", clearError)
      return NextResponse.json(
        {
          error: "Gagal menyimpan detail experience.",
          message: "Gagal menyimpan detail experience.",
          detail: clearError,
        },
        { status: 500 }
      )
    }

    const relationError = await writeExperienceRelations(supabase, experienceId, body)

    if (relationError) {
      console.error("[PUT /api/admin/experiences/[slug]] Relation error:", relationError)
      return NextResponse.json(
        {
          error: "Gagal menyimpan detail experience.",
          message: "Gagal menyimpan detail experience.",
          detail: relationError,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: { slug },
      message: "Experience berhasil diperbarui.",
    })
  } catch (err) {
    console.error("[PUT /api/admin/experiences/[slug]] Unexpected error:", err)
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

export const DELETE = async (_req: NextRequest, { params }: RouteParams) => {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return unauthorized()

    const { data: existing, error: findError } = await supabase
      .from("experiences")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle()

    if (findError) {
      console.error("[DELETE /api/admin/experiences/[slug]] Supabase error:", findError.message)
      return NextResponse.json(
        {
          error: "Gagal menghapus experience.",
          message: "Gagal menghapus experience.",
          detail: findError.message,
        },
        { status: 500 }
      )
    }

    if (!existing) return notFound(slug)

    const { error: deleteError } = await supabase
      .from("experiences")
      .delete()
      .eq("id", existing.id)

    if (deleteError) {
      console.error("[DELETE /api/admin/experiences/[slug]] Supabase error:", deleteError.message)
      return NextResponse.json(
        {
          error: "Gagal menghapus experience.",
          message: "Gagal menghapus experience.",
          detail: deleteError.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: { slug },
      message: "Experience berhasil dihapus.",
    })
  } catch (err) {
    console.error("[DELETE /api/admin/experiences/[slug]] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal menghapus experience.",
        message: "Gagal menghapus experience.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
