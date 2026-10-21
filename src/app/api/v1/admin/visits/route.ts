import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  parsePaginationParams,
  sanitizeLikeParam,
} from "@/helper/server/pagination"
import { fetchAdminVisits, parseVisitRange } from "./_shared"

export const dynamic = "force-dynamic"

const DEVICE_FILTERS = new Set(["desktop", "mobile", "tablet", "unknown"])

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
      defaultPerPage: 20,
      maxPerPage: 100,
    })
    const deviceParam = searchParams.get("device")
    const device =
      deviceParam && DEVICE_FILTERS.has(deviceParam) ? deviceParam : null

    const { data, error } = await fetchAdminVisits(supabase, {
      ...params,
      range: parseVisitRange(searchParams.get("range")),
      search: sanitizeLikeParam(searchParams.get("search")),
      device,
    })

    if (error || !data) {
      console.error("[GET /api/v1/admin/visits] Supabase error:", error)
      return NextResponse.json(
        {
          error: "Gagal mengambil data pengunjung.",
          message: "Gagal mengambil data pengunjung.",
          detail: error ?? "Unknown error",
        },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error("[GET /api/v1/admin/visits] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil data pengunjung.",
        message: "Gagal mengambil data pengunjung.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
