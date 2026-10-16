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
  if (!str(body.role_id).trim() || !str(body.role_en).trim())
    return badRequest("role_id dan role_en wajib diisi.")

  const { data: existing } = await supabase.from("experiences").select("id").eq("slug", slug).maybeSingle()
  if (existing) return badRequest(`Slug "${slug}" sudah dipakai.`)

  const { data: maxRow } = await supabase
    .from("experiences")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle()
  const sortOrder = (maxRow?.sort_order ?? 0) + 1

  const { data: exp, error: eError } = await supabase
    .from("experiences")
    .insert({ slug, sort_order: sortOrder })
    .select("id")
    .single()

  if (eError || !exp) {
    return NextResponse.json({ error: eError?.message ?? "Gagal membuat experience." }, { status: 500 })
  }

  const expId = exp.id as string
  const translations = [
    {
      experience_id: expId,
      locale: "id",
      period: str(body.period_id),
      role: str(body.role_id),
      org: str(body.org_id),
      context: str(body.context_id),
    },
    {
      experience_id: expId,
      locale: "en",
      period: str(body.period_en),
      role: str(body.role_en),
      org: str(body.org_en),
      context: str(body.context_en),
    },
  ]

  const points = [
    ...strArray(body.points_id).map((text, i) => ({
      experience_id: expId,
      locale: "id",
      body: text,
      sort_order: i,
    })),
    ...strArray(body.points_en).map((text, i) => ({
      experience_id: expId,
      locale: "en",
      body: text,
      sort_order: i,
    })),
  ]

  const stacks = strArray(body.stack).map((name, i) => ({
    experience_id: expId,
    name,
    sort_order: i,
  }))

  const inserts = [
    supabase.from("experience_translations").insert(translations),
    ...(points.length ? [supabase.from("experience_points").insert(points)] : []),
    ...(stacks.length ? [supabase.from("experience_stacks").insert(stacks)] : []),
  ]

  for (const q of inserts) {
    const { error: e } = await q
    if (e) {
      await supabase.from("experiences").delete().eq("id", expId)
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }

  return NextResponse.json({ data: { slug } }, { status: 201 })
}
