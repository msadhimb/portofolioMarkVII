import { fadeUp } from "../../helper/fadeUp"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

type StatCardProps = {
  label: string
  value: number
  hint: string
  href: string
  icon: React.ReactNode
  tile: string
  sparkData: { i: number; v: number }[]
  sparkColor: string
  loading: boolean
  custom: number
}

const StatCard = ({
  label,
  value,
  hint,
  href,
  icon,
  tile,
  sparkData,
  sparkColor,
  loading,
  custom,
}: StatCardProps) => (
  <motion.div variants={fadeUp} initial="hidden" animate="show" custom={custom}>
    <Link href={href} className="group block">
      <Card className="relative overflow-hidden transition-transform duration-300 group-hover:-translate-y-0.5">
        <CardContent className="pt-4">
          <div className="flex items-start justify-between gap-3">
            <div
              className={`flex size-9 items-center justify-center rounded-lg ${tile}`}
            >
              {icon}
            </div>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              Kelola <ArrowRight className="size-3" />
            </span>
          </div>
          <p className="mt-3 text-[13px] font-medium text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <Skeleton className="mt-1 h-9 w-20" />
          ) : (
            <p className="tabular mt-0.5 text-3xl font-semibold tracking-tight">
              {value}
            </p>
          )}
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-xs text-muted-foreground">{hint}</p>
            <div className="h-9 w-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData}>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={sparkColor}
                    strokeWidth={1.8}
                    fill={sparkColor}
                    fillOpacity={0.22}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
)

export default StatCard
