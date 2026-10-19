import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const BUCKET = "cv"
const FILE_PATH = "cv_mark_vii.pdf"
const DOWNLOAD_NAME = "Salman_Adhim_CV.pdf" // nama file saat diunduh

const jsonError = (error: string, status: number, message?: string) =>
  NextResponse.json(
    { error, ...(message ? { message } : {}) },
    { status, headers: { "Cache-Control": "no-store" } }
  )

// GET — stream CV versi terbaru sebagai file unduhan (same-origin)
export const GET = async () => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.storage.from(BUCKET).download(FILE_PATH)

    if (data) {
      return new Response(data, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Length": String(data.size),
          "Content-Disposition": `attachment; filename="${DOWNLOAD_NAME}"`,
          "Cache-Control": "no-store",
        },
      })
    }

    if (error && /not found/i.test(error.message)) {
      return jsonError("CV belum tersedia.", 404, error.message)
    }

    // Fallback: bucket publik, lewat URL publik dengan nama unduhan
    const { data: pub } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(FILE_PATH, { download: DOWNLOAD_NAME })

    return NextResponse.redirect(pub.publicUrl, 307)
  } catch (err) {
    console.error("[GET /api/v1/cv]", err)
    return jsonError("Gagal mengambil CV.", 500)
  }
}

// PUT — ganti CV (nama file tetap), hanya admin
export const PUT = async (req: Request) => {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return jsonError("Unauthorized.", 401, "Sesi tidak valid.")
    }

    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file || file.type !== "application/pdf") {
      return jsonError("File tidak valid.", 422, "Hanya file PDF yang diterima.")
    }

    const bytes = await file.arrayBuffer()

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(FILE_PATH, bytes, {
        contentType: "application/pdf",
        upsert: true, // timpa CV lama dengan nama file yang sama
      })

    if (error) {
      console.error("[PUT /api/v1/cv] Supabase error:", error.message)
      return jsonError("Gagal mengunggah CV.", 500, error.message)
    }

    return NextResponse.json({ message: "CV berhasil diperbarui.", version: FILE_PATH })
  } catch (err) {
    console.error("[PUT /api/v1/cv]", err)
    return jsonError("Gagal mengunggah CV.", 500)
  }
}
