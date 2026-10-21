import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { VisitBreakdown } from "../../store/type"

type BreakdownCardProps = {
  title: string
  description: string
  icon: React.ReactNode
  items: VisitBreakdown[]
  loading: boolean
  formatLabel?: (label: string) => string
  emptyText?: string
}

const BreakdownCard = ({
  title,
  description,
  icon,
  items,
  loading,
  formatLabel,
  emptyText = "Belum ada data.",
}: BreakdownCardProps) => {
  const max = Math.max(...items.map((item) => item.pageviews), 1)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <span className="text-signal">{icon}</span>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
            {emptyText}
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
              const label = formatLabel?.(item.label) ?? item.label
              return (
                <li key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span
                      className="min-w-0 truncate text-muted-foreground"
                      title={label}
                    >
                      {label}
                    </span>
                    <span className="tabular shrink-0 font-semibold text-foreground">
                      {item.pageviews}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-teal-400"
                      style={{
                        width: `${Math.max(
                          (item.pageviews / max) * 100,
                          item.pageviews > 0 ? 6 : 0
                        )}%`,
                      }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default BreakdownCard
