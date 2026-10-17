import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  AWARD_WITH_RELATIONS,
  deleteAwardRelations,
  toAdminAward,
  validateAwardPayload,
  writeAwardRelations,
  type AwardPayload,
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
      error: "Award tidak ditemukan.",
      message: `Award "${slug}" tidak ditemukan.`,
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
      .from("awards")
      .select(AWARD_WITH_RELATIONS)
      .eq("slug", slug)
      .maybeSingle()

    if (error) {
      console.error("[GET /api/admin/awards/[slug]] Supabase error:", error.message)
      return NextResponse.json(
        {
          error: "Gagal mengambil award.",
          message: "Gagal mengambil award.",
          detail: error.message,
        },
        { status: 500 }
      )
    }

    if (!data) return notFound(slug)

    return NextResponse.json({ data: toAdminAward(data) })
  } catch (err) {
    console.error("[GET /api/admin/awards/[slug]] Unexpected error:", err)
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

export const PUT = async (req: NextRequest, { params }: RouteParams) => {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return unauthorized()

    const body = (await req.json()) as AwardPayload
    const issues = validateAwardPayload(body, { requireSlug: false })

    if (issues.length > 0) {
      return NextResponse.json(
        { error: "Payload tidak valid.", message: issues[0], data: { issues } },
        { status: 422 }
      )
    }

    const { data: existing, error: findError } = await supabase
      .from("awards")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle()

    if (findError) {
      console.error("[PUT /api/admin/awards/[slug]] Supabase error:", findError.message)
      return NextResponse.json(
        {
          error: "Gagal menyimpan award.",
          message: "Gagal menyimpan award.",
          detail: findError.message,
        },
        { status: 500 }
      )
    }

    if (!existing) return notFound(slug)

    const awardId = existing.id as string

    const { error: updateError } = await supabase
      .from("awards")
      .update({
        category: body.category,
        issue_date: body.issue_date?.trim() ?? "",
        expiry_date: body.expiry_date?.trim() || null,
        credential_id: body.credential_id?.trim() || null,
        credential_url: body.credential_url?.trim() || null,
      })
      .eq("id", awardId)

    if (updateError) {
      console.error("[PUT /api/admin/awards/[slug]] Supabase error:", updateError.message)
      return NextResponse.json(
        {
          error: "Gagal menyimpan award.",
          message: "Gagal menyimpan award.",
          detail: updateError.message,
        },
        { status: 500 }
      )
    }

    const clearError = await deleteAwardRelations(supabase, awardId)

    if (clearError) {
      console.error("[PUT /api/admin/awards/[slug]] Clear error:", clearError)
      return NextResponse.json(
        {
          error: "Gagal menyimpan detail award.",
          message: "Gagal menyimpan detail award.",
          detail: clearError,
        },
        { status: 500 }
      )
    }

    const relationError = await writeAwardRelations(supabase, awardId, body)

    if (relationError) {
      console.error("[PUT /api/admin/awards/[slug]] Relation error:", relationError)
      return NextResponse.json(
        {
          error: "Gagal menyimpan detail award.",
          message: "Gagal menyimpan detail award.",
          detail: relationError,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: { slug },
      message: "Award berhasil diperbarui.",
    })
  } catch (err) {
    console.error("[PUT /api/admin/awards/[slug]] Unexpected error:", err)
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

export const DELETE = async (_req: NextRequest, { params }: RouteParams) => {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return unauthorized()

    const { data: existing, error: findError } = await supabase
      .from("awards")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle()

    if (findError) {
      console.error("[DELETE /api/admin/awards/[slug]] Supabase error:", findError.message)
      return NextResponse.json(
        {
          error: "Gagal menghapus award.",
          message: "Gagal menghapus award.",
          detail: findError.message,
        },
        { status: 500 }
      )
    }

    if (!existing) return notFound(slug)

    const { error: deleteError } = await supabase
      .from("awards")
      .delete()
      .eq("id", existing.id)

    if (deleteError) {
      console.error("[DELETE /api/admin/awards/[slug]] Supabase error:", deleteError.message)
      return NextResponse.json(
        {
          error: "Gagal menghapus award.",
          message: "Gagal menghapus award.",
          detail: deleteError.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: { slug },
      message: "Award berhasil dihapus.",
    })
  } catch (err) {
    console.error("[DELETE /api/admin/awards/[slug]] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal menghapus award.",
        message: "Gagal menghapus award.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
