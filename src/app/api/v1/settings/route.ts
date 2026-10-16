import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const FALLBACK = {
  is_available: true,
  available_label_id: "Terbuka untuk proyek",
  available_label_en: "Available for projects",
}

export const GET = async () => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("is_available, available_label_id, available_label_en")
      .eq("id", 1)
      .maybeSingle()

    if (error) {
      console.error("[GET /api/settings] Supabase error:", error.message)
      return NextResponse.json({ data: FALLBACK, fallback: true })
    }

    return NextResponse.json({ data: data ?? FALLBACK, fallback: !data })
  } catch (err) {
    console.error("[GET /api/settings] Unexpected error:", err)
    return NextResponse.json({ data: FALLBACK, fallback: true })
  }
}
