import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatWibDay } from "../../helper/format"
import type { VisitDailyPoint } from "../../store/type"

type VisitTrendProps = {
  daily: VisitDailyPoint[]
  loading: boolean
}

const VisitTrend = ({ daily, loading }: VisitTrendProps) => {
  const chartData = daily.map((point) => ({
    ...point,
    label: formatWibDay(point.day),
  }))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-[15px]">Tren kunjungan</CardTitle>
        <CardDescription>
          Pageview dan pengunjung unik per hari.
        </CardDescription>
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" />
            Pageview
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-teal-400" />
            Pengunjung
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
            Belum ada data kunjungan pada rentang ini.
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="visit-pageviews"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="visit-visitors"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    fontSize: 12,
                    border: "1px solid var(--border)",
                    background: "var(--popover)",
                    color: "var(--popover-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pageviews"
                  name="Pageview"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#visit-pageviews)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Pengunjung"
                  stroke="#2dd4bf"
                  strokeWidth={2}
                  fill="url(#visit-visitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default VisitTrend
