import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Star } from "lucide-react"
import Link from "next/link"

const RecentProjectItem = ({ p }: { p: any }) => (
  <Link
    href="/admin/dashboard/projects"
    className="group flex items-center gap-3 rounded-xl border bg-muted/40 p-3 transition-colors hover:border-signal/50 hover:bg-muted"
  >
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/25 to-teal-500/25 font-mono text-sm font-bold text-signal">
      {(p?.title?.[0] || p?.slug?.[0] || "?")?.toUpperCase()}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <p className="truncate text-sm font-medium">{p?.title || p?.slug}</p>
        {p?.featured && (
          <Badge className="gap-1 text-[10px]">
            <Star className="size-2.5" /> Unggulan
          </Badge>
        )}
      </div>
      <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
        {p?.slug} · {(p?.technologies ?? []).slice(0, 3).join(" · ")}
      </p>
    </div>
    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal" />
  </Link>
)

export default RecentProjectItem
