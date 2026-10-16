import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type SkillGroupRow = {
  slug: string
  sort_order: number
  locale: string
  title: string
  note: string
  items: string[] | null
}

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale") === "en" ? "en" : "id"

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("skill_group_list")
      .select("*")
      .eq("locale", locale)
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("[GET /api/skills] Supabase error:", error.message)
      return NextResponse.json(
        { error: "Gagal mengambil skills dari Supabase.", detail: error.message },
        { status: 500 }
      )
    }

    const groups = ((data ?? []) as SkillGroupRow[]).map((row) => ({
      slug: row.slug,
      title: row.title,
      note: row.note ?? "",
      items: row.items ?? [],
    }))

    return NextResponse.json({ data: groups, locale })
  } catch (err) {
    console.error("[GET /api/skills] Unexpected error:", err)
    return NextResponse.json(
      {
        error: "Gagal mengambil skills dari Supabase.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
