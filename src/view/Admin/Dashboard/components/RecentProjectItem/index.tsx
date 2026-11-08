import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

const RecentProjectItem = ({ p }: { p: any }) => (
  <Link
    href="/dashboard/projects"
    className="group flex items-center gap-3 border-b border-border py-3 transition-colors last:border-b-0"
  >
    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground font-mono text-[10px] text-background">
      {(p?.title?.[0] || p?.slug?.[0] || "?")?.toUpperCase()}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-[13px] font-medium text-foreground transition-colors group-hover:text-signal">
        {p?.title || p?.slug}
      </p>
      <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
        {p?.slug}
        {p?.featured ? " · unggulan" : ""}
        {(p?.technologies ?? []).length
          ? ` · ${p.technologies.slice(0, 3).join(" · ")}`
          : ""}
      </p>
    </div>
    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
  </Link>
)

export default RecentProjectItem
