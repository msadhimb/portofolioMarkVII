import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const BUCKET = "cv"
const DOWNLOAD_NAME = "NamaKamu_CV.pdf" // nama file saat diunduh (tanpa "mark_")

const ROMAN: [number, string][] = [
  [1000, "m"],
  [900, "cm"],
  [500, "d"],
  [400, "cd"],
  [100, "c"],
  [90, "xc"],
  [50, "l"],
  [40, "xl"],
  [10, "x"],
  [9, "ix"],
  [5, "v"],
  [4, "iv"],
  [1, "i"],
]

const toRoman = (n: number) => {
  let out = ""
  for (const [value, symbol] of ROMAN) {
    while (n >= value) {
      out += symbol
      n -= value
    }
  }
  return out
}

const fromRoman = (s: string) => {
  let total = 0
  for (const [value, symbol] of ROMAN) {
    while (s.startsWith(symbol)) {
      total += value
      s = s.slice(symbol.length)
    }
  }
  return total
}

const FILE_RE = /^mark_([ivxlcdm]+)\.pdf$/

// Cari versi tertinggi yang sudah ada di bucket
const getLatestVersion = async (
  supabase: Awaited<ReturnType<typeof createClient>>
) => {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list("", { limit: 1000 })

  if (error) throw error

  let max = 0
  for (const f of data ?? []) {
    const m = FILE_RE.exec(f.name)
    if (m) max = Math.max(max, fromRoman(m[1]))
  }
  return max
}

// GET — signed URL 60 detik untuk versi terbaru
export const GET = async () => {
  try {
    const supabase = await createClient()
    const latest = await getLatestVersion(supabase)

    if (latest === 0) {
      return NextResponse.json(
        { error: "CV tidak ditemukan." },
        { status: 404 }
      )
    }

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(`mark_${toRoman(latest)}.pdf`, 60, {
        download: DOWNLOAD_NAME,
      })

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        {
          error: "CV tidak ditemukan.",
          message: error?.message ?? "Unknown error",
        },
        { status: 404 }
      )
    }

    return NextResponse.redirect(data.signedUrl)
  } catch (err) {
    console.error("[GET /api/v1/cv]", err)
    return NextResponse.json({ error: "Gagal mengambil CV." }, { status: 500 })
  }
}

// PUT — upload sebagai versi baru (mark_i, mark_ii, ...), hanya admin
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
        {
          error: "File tidak valid.",
          message: "Hanya file PDF yang diterima.",
        },
        { status: 422 }
      )
    }

    const next = (await getLatestVersion(supabase)) + 1
    const version = `mark_${toRoman(next)}`
    const bytes = await file.arrayBuffer()

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(`${version}.pdf`, bytes, {
        contentType: "application/pdf",
        upsert: false, // jangan timpa versi lama
      })

    if (error) {
      console.error("[PUT /api/v1/cv] Supabase error:", error.message)
      return NextResponse.json(
        { error: "Gagal mengunggah CV.", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "CV berhasil diperbarui.", version })
  } catch (err) {
    console.error("[PUT /api/v1/cv]", err)
    return NextResponse.json({ error: "Gagal mengunggah CV." }, { status: 500 })
  }
}
