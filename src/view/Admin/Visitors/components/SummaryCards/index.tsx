import { Activity, CalendarDays, Eye, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { VisitSummary } from "../../store/type"

type SummaryCardsProps = {
  summary: VisitSummary
  loading: boolean
}

const numberFormat = new Intl.NumberFormat("id-ID")

const SummaryCards = ({ summary, loading }: SummaryCardsProps) => {
  const cards = [
    {
      label: "Pengunjung unik",
      value: summary.visitors,
      hint: "Satu baris per browser",
      icon: <Users className="size-4" />,
      tile: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",
    },
    {
      label: "Total pageview",
      value: summary.pageviews,
      hint: "Termasuk kunjungan berulang",
      icon: <Eye className="size-4" />,
      tile: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    },
    {
      label: "Online sekarang",
      value: summary.online,
      hint: "Aktif dalam 5 menit terakhir",
      icon: <Activity className="size-4" />,
      tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    },
    {
      label: "Pageview hari ini",
      value: summary.todayPageviews,
      hint: "Zona waktu Asia/Jakarta",
      icon: <CalendarDays className="size-4" />,
      tile: "bg-teal-500/15 text-teal-600 dark:text-teal-300",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                {card.label}
              </p>
              <div
                className={`flex size-8 items-center justify-center rounded-lg ${card.tile}`}
              >
                {card.icon}
              </div>
            </div>
            {loading ? (
              <Skeleton className="mt-3 h-9 w-20" />
            ) : (
              <p className="tabular mt-2 text-3xl font-semibold tracking-tight">
                {numberFormat.format(card.value)}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default SummaryCards
