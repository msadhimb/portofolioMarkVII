import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/supabase/require-admin"

export const GET = async () => {
  const { supabase, error } = await requireAdmin()
  if (error || !supabase) return error

  const { data, error: dbError } = await supabase
    .from("site_settings")
    .select("is_available, available_label_id, available_label_en")
    .eq("id", 1)
    .maybeSingle()

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export const PATCH = async (req: Request) => {
  const { supabase, error } = await requireAdmin()
  if (error || !supabase) return error

  const body = await req.json().catch(() => ({}))
  const patch: Record<string, unknown> = {}

  if (typeof body.is_available === "boolean") patch.is_available = body.is_available
  if (typeof body.available_label_id === "string")
    patch.available_label_id = body.available_label_id.slice(0, 120)
  if (typeof body.available_label_en === "string")
    patch.available_label_en = body.available_label_en.slice(0, 120)

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Tidak ada field yang diubah." }, { status: 400 })
  }

  const { data, error: dbError } = await supabase
    .from("site_settings")
    .update(patch)
    .eq("id", 1)
    .select("is_available, available_label_id, available_label_en")
    .maybeSingle()

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
