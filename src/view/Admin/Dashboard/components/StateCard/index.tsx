import { fadeUp } from "../../helper/fadeUp"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

type StatCardProps = {
  label: string
  value: number
  hint: string
  href: string
  icon: React.ReactNode
  loading: boolean
  custom: number
}

const StatCard = ({
  label,
  value,
  hint,
  href,
  icon,
  loading,
  custom,
}: StatCardProps) => (
  <motion.div variants={fadeUp} initial="hidden" animate="show" custom={custom}>
    <Link href={href} className="group block">
      <Card className="relative overflow-hidden transition-colors hover:border-signal/50">
        <CardContent className="pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground">
              {icon}
            </div>
            <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
          </div>
          <p className="mt-4 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            {label}
          </p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-16" />
          ) : (
            <p className="tabular mt-1 text-3xl font-medium tracking-tight text-foreground">
              {value}
            </p>
          )}
          <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
)

export default StatCard
