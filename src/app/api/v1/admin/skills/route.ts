import { NextResponse } from "next/server"
import { SLUG_RE, badRequest, requireAdmin } from "@/lib/supabase/require-admin"

const str = (v: unknown) => (typeof v === "string" ? v : "")
const strArray = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : []

export const POST = async (req: Request) => {
  const { supabase, error } = await requireAdmin()
  if (error || !supabase) return error

  const body = await req.json().catch(() => null)
  if (!body) return badRequest("Body JSON tidak valid.")

  const slug = str(body.slug).trim().toLowerCase()
  if (!SLUG_RE.test(slug)) return badRequest("Slug harus huruf kecil, angka, strip (a-z0-9-).")
  if (!str(body.title_id).trim() || !str(body.title_en).trim())
    return badRequest("title_id dan title_en wajib diisi.")

  const items = strArray(body.items)
  if (items.length === 0) return badRequest("Minimal 1 skill item.")

  const { data: existing } = await supabase.from("skill_groups").select("id").eq("slug", slug).maybeSingle()
  if (existing) return badRequest(`Slug "${slug}" sudah dipakai.`)

  const { data: maxRow } = await supabase
    .from("skill_groups")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle()
  const sortOrder = (maxRow?.sort_order ?? 0) + 1

  const { data: group, error: gError } = await supabase
    .from("skill_groups")
    .insert({ slug, sort_order: sortOrder })
    .select("id")
    .single()

  if (gError || !group) {
    return NextResponse.json({ error: gError?.message ?? "Gagal membuat skill group." }, { status: 500 })
  }

  const groupId = group.id as string
  const { error: tError } = await supabase.from("skill_group_translations").insert([
    { skill_group_id: groupId, locale: "id", title: str(body.title_id), note: str(body.note_id) },
    { skill_group_id: groupId, locale: "en", title: str(body.title_en), note: str(body.note_en) },
  ])

  if (tError) {
    await supabase.from("skill_groups").delete().eq("id", groupId)
    return NextResponse.json({ error: tError.message }, { status: 500 })
  }

  const { error: iError } = await supabase.from("skill_group_items").insert(
    items.map((name, i) => ({ skill_group_id: groupId, name, sort_order: i }))
  )

  if (iError) {
    await supabase.from("skill_groups").delete().eq("id", groupId)
    return NextResponse.json({ error: iError.message }, { status: 500 })
  }

  return NextResponse.json({ data: { slug } }, { status: 201 })
}
