import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const BUCKET = "cv"
const CV_PATH = "cv.pdf"

// GET — buat signed URL 60 detik, redirect ke file
export const GET = async () => {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(CV_PATH, 60)

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { error: "CV tidak ditemukan.", message: error?.message ?? "Unknown error" },
        { status: 404 }
      )
    }

    // Redirect ke signed URL sehingga browser langsung download
    return NextResponse.redirect(data.signedUrl)
  } catch (err) {
    console.error("[GET /api/v1/cv]", err)
    return NextResponse.json({ error: "Gagal mengambil CV." }, { status: 500 })
  }
}

// PUT — upload file baru, hanya untuk admin yang terautentikasi
export const PUT = async (req: Request) => {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized.", message: "Sesi tidak valid." },
        { status: 401 }
      )
    }

    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File tidak valid.", message: "Hanya file PDF yang diterima." },
        { status: 422 }
      )
    }

    const bytes = await file.arrayBuffer()

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(CV_PATH, bytes, {
        contentType: "application/pdf",
        upsert: true,
      })

    if (error) {
      console.error("[PUT /api/v1/cv] Supabase error:", error.message)
      return NextResponse.json(
        { error: "Gagal mengunggah CV.", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "CV berhasil diperbarui." })
  } catch (err) {
    console.error("[PUT /api/v1/cv]", err)
    return NextResponse.json({ error: "Gagal mengunggah CV." }, { status: 500 })
  }
}
