import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  deleteProjectRelations,
  fetchAdminProjects,
  validateProjectPayload,
  writeProjectRelations,
  type ProjectPayload,
} from "../_shared"

type RouteParams = { params: Promise<{ slug: string }> }

const unauthorized = () =>
  NextResponse.json(
    { error: "Unauthorized.", message: "Sesi tidak valid. Silakan login kembali." },
    { status: 401 }
  )

export const GET = async (_req: NextRequest, { params }: RouteParams) => {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return unauthorized()

    const { data, error } = await fetchAdminProjects(supabase, slug)

    if (error || !data) {
      console.error("[GET /api/admin/projects/[slug]] Supabase error:", error)
      return NextResponse.json(
        {
          error: "Gagal mengambil project.",
          message: "Gagal mengambil project.",
          detail: error ?? "Unknown error",
        },
        { status: 500 }
      )
    }

    if (data.length === 0) {
      return NextResponse.json(
        {
          error: "Project tidak ditemukan.",
          message: `Project "${slug}" tidak ditemukan.`,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: data[0] })
  } catch (err) {
    console.error("[GET /api/admin/projects/[slug]] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil project.",
        message: "Gagal mengambil project.",
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

    const body = (await req.json()) as ProjectPayload
    const issues = validateProjectPayload(body, { requireSlug: false })

    if (issues.length > 0) {
      return NextResponse.json(
        { error: "Payload tidak valid.", message: issues[0], data: { issues } },
        { status: 422 }
      )
    }

    const { data: existing, error: findError } = await supabase
      .from("projects")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle()

    if (findError) {
      console.error("[PUT /api/admin/projects/[slug]] Supabase error:", findError.message)
      return NextResponse.json(
        {
          error: "Gagal menyimpan project.",
          message: "Gagal menyimpan project.",
          detail: findError.message,
        },
        { status: 500 }
      )
    }

    if (!existing) {
      return NextResponse.json(
        {
          error: "Project tidak ditemukan.",
          message: `Project "${slug}" tidak ditemukan.`,
        },
        { status: 404 }
      )
    }

    const projectId = existing.id as string

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        image: body.image?.trim() || "",
        demo_url: body.demo_url?.trim() || null,
        repository_url: body.repository_url?.trim() || null,
        featured: body.featured ?? false,
        title: body.title?.trim() || "",
      })
      .eq("id", projectId)

    if (updateError) {
      console.error("[PUT /api/admin/projects/[slug]] Supabase error:", updateError.message)
      return NextResponse.json(
        {
          error: "Gagal menyimpan project.",
          message: "Gagal menyimpan project.",
          detail: updateError.message,
        },
        { status: 500 }
      )
    }

    const clearError = await deleteProjectRelations(supabase, projectId)

    if (clearError) {
      console.error("[PUT /api/admin/projects/[slug]] Clear error:", clearError)
      return NextResponse.json(
        {
          error: "Gagal menyimpan detail project.",
          message: "Gagal menyimpan detail project.",
          detail: clearError,
        },
        { status: 500 }
      )
    }

    const relationError = await writeProjectRelations(supabase, projectId, body)

    if (relationError) {
      console.error("[PUT /api/admin/projects/[slug]] Relation error:", relationError)
      return NextResponse.json(
        {
          error: "Gagal menyimpan detail project.",
          message: "Gagal menyimpan detail project.",
          detail: relationError,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: { slug },
      message: "Project berhasil diperbarui.",
    })
  } catch (err) {
    console.error("[PUT /api/admin/projects/[slug]] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal menyimpan project.",
        message: "Gagal menyimpan project.",
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
      .from("projects")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle()

    if (findError) {
      console.error("[DELETE /api/admin/projects/[slug]] Supabase error:", findError.message)
      return NextResponse.json(
        {
          error: "Gagal menghapus project.",
          message: "Gagal menghapus project.",
          detail: findError.message,
        },
        { status: 500 }
      )
    }

    if (!existing) {
      return NextResponse.json(
        {
          error: "Project tidak ditemukan.",
          message: `Project "${slug}" tidak ditemukan.`,
        },
        { status: 404 }
      )
    }

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", existing.id)

    if (deleteError) {
      console.error("[DELETE /api/admin/projects/[slug]] Supabase error:", deleteError.message)
      return NextResponse.json(
        {
          error: "Gagal menghapus project.",
          message: "Gagal menghapus project.",
          detail: deleteError.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: { slug },
      message: "Project berhasil dihapus.",
    })
  } catch (err) {
    console.error("[DELETE /api/admin/projects/[slug]] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal menghapus project.",
        message: "Gagal menghapus project.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
