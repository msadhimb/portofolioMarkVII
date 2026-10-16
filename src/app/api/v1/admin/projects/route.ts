import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  buildPaginationMeta,
  paginated,
  parsePaginationParams,
  sanitizeLikeParam,
} from "@/helper/server/pagination"
import {
  fetchAdminProjects,
  validateProjectPayload,
  writeProjectRelations,
  type ProjectPayload,
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

    const { data, error, total } = await fetchAdminProjects(supabase, {
      page: params.page,
      perPage: params.perPage,
      search,
    })

    if (error || !data) {
      console.error("[GET /api/admin/projects] Supabase error:", error)
      return NextResponse.json(
        {
          error: "Gagal mengambil project.",
          message: "Gagal mengambil project.",
          detail: error ?? "Unknown error",
        },
        { status: 500 }
      )
    }

    return NextResponse.json(paginated(data, buildPaginationMeta(params, total)))
  } catch (err) {
    console.error("[GET /api/admin/projects] Unexpected error:", err)
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

    const body = (await req.json()) as ProjectPayload
    const issues = validateProjectPayload(body)

    if (issues.length > 0) {
      return NextResponse.json(
        { error: "Payload tidak valid.", message: issues[0], data: { issues } },
        { status: 422 }
      )
    }

    const slug = body.slug!.trim()

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        slug,
        image: body.image?.trim() || "",
        demo_url: body.demo_url?.trim() || null,
        repository_url: body.repository_url?.trim() || null,
        featured: body.featured ?? false,
        sort_order: body.sort_order ?? 0,
      })
      .select("id, slug")
      .single()

    if (projectError) {
      if (projectError.code === "23505") {
        return NextResponse.json(
          {
            error: "Slug sudah dipakai.",
            message: `Slug "${slug}" sudah dipakai project lain.`,
          },
          { status: 409 }
        )
      }
      console.error("[POST /api/admin/projects] Supabase error:", projectError.message)
      return NextResponse.json(
        {
          error: "Gagal menyimpan project.",
          message: "Gagal menyimpan project.",
          detail: projectError.message,
        },
        { status: 500 }
      )
    }

    const projectId = project.id as string
    const relationError = await writeProjectRelations(supabase, projectId, body)

    if (relationError) {
      await supabase.from("projects").delete().eq("id", projectId)
      console.error("[POST /api/admin/projects] Relation error:", relationError)
      return NextResponse.json(
        {
          error: "Gagal menyimpan detail project.",
          message: "Gagal menyimpan detail project.",
          detail: relationError,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: { slug }, message: "Project berhasil ditambahkan." },
      { status: 201 }
    )
  } catch (err) {
    console.error("[POST /api/admin/projects] Unexpected error:", err)
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
