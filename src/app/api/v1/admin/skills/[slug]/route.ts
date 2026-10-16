import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/supabase/require-admin"

export const DELETE = async (_req: Request, ctx: { params: Promise<{ slug: string }> }) => {
  const { supabase, error } = await requireAdmin()
  if (error || !supabase) return error

  const { slug } = await ctx.params
  const { error: dbError } = await supabase.from("skill_groups").delete().eq("slug", slug)

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ data: { slug, deleted: true } })
}
