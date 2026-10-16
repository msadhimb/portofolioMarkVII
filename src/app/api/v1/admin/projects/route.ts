import { NextResponse } from "next/server"
import { SLUG_RE, badRequest, requireAdmin } from "@/lib/supabase/require-admin"

type Metric = { label: string; value: string }
type Decision = { title: string; detail: string }

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

  const { data: existing } = await supabase.from("projects").select("id").eq("slug", slug).maybeSingle()
  if (existing) return badRequest(`Slug "${slug}" sudah dipakai.`)

  const { data: maxRow } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle()
  const sortOrder = (maxRow?.sort_order ?? 0) + 1

  const { data: project, error: pError } = await supabase
    .from("projects")
    .insert({
      slug,
      image: str(body.image),
      demo_url: str(body.demo_url) || null,
      repository_url: str(body.repository_url) || null,
      featured: Boolean(body.featured),
      sort_order: sortOrder,
    })
    .select("id")
    .single()

  if (pError || !project) {
    return NextResponse.json({ error: pError?.message ?? "Gagal membuat project." }, { status: 500 })
  }

  const projectId = project.id as string

  const translations = [
    {
      project_id: projectId,
      locale: "id",
      title: str(body.title_id),
      tagline: str(body.tagline_id),
      description: str(body.description_id),
      problem: str(body.problem_id),
      role: str(body.role_id),
      period: str(body.period_id),
      context: str(body.context_id),
    },
    {
      project_id: projectId,
      locale: "en",
      title: str(body.title_en),
      tagline: str(body.tagline_en),
      description: str(body.description_en),
      problem: str(body.problem_en),
      role: str(body.role_en),
      period: str(body.period_en),
      context: str(body.context_en),
    },
  ]

  const techs = strArray(body.technologies).map((name, i) => ({
    project_id: projectId,
    name,
    sort_order: i,
  }))

  const highlights = [
    ...strArray(body.highlights_id).map((text, i) => ({
      project_id: projectId,
      locale: "id",
      body: text,
      sort_order: i,
    })),
    ...strArray(body.highlights_en).map((text, i) => ({
      project_id: projectId,
      locale: "en",
      body: text,
      sort_order: i,
    })),
  ]

  const toMetrics = (list: unknown, locale: string) =>
    (Array.isArray(list) ? list : [])
      .filter((m): m is Metric => !!m && typeof (m as Metric).label === "string")
      .map((m, i) => ({
        project_id: projectId,
        locale,
        label: (m as Metric).label,
        value: String((m as Metric).value ?? ""),
        sort_order: i,
      }))

  const toDecisions = (list: unknown, locale: string) =>
    (Array.isArray(list) ? list : [])
      .filter((d): d is Decision => !!d && typeof (d as Decision).title === "string")
      .map((d, i) => ({
        project_id: projectId,
        locale,
        title: (d as Decision).title,
        detail: String((d as Decision).detail ?? ""),
        sort_order: i,
      }))

  const metrics = [...toMetrics(body.metrics_id, "id"), ...toMetrics(body.metrics_en, "en")]
  const decisions = [...toDecisions(body.decisions_id, "id"), ...toDecisions(body.decisions_en, "en")]

  const inserts = [
    supabase.from("project_translations").insert(translations),
    ...(techs.length ? [supabase.from("project_technologies").insert(techs)] : []),
    ...(highlights.length ? [supabase.from("project_highlights").insert(highlights)] : []),
    ...(metrics.length ? [supabase.from("project_metrics").insert(metrics)] : []),
    ...(decisions.length ? [supabase.from("project_decisions").insert(decisions)] : []),
  ]

  for (const q of inserts) {
    const { error: e } = await q
    if (e) {
      await supabase.from("projects").delete().eq("id", projectId)
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }

  return NextResponse.json({ data: { slug } }, { status: 201 })
}
