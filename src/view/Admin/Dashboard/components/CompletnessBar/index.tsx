import { motion } from "framer-motion"

const CompletenessBar = ({
  label,
  value,
  detail,
}: {
  label: string
  value: number
  detail: string
}) => (
  <div>
    <div className="flex items-center justify-between gap-3 text-[13px]">
      <span className="font-medium text-foreground">{label}</span>
      <span className="tabular font-mono text-[10px] text-muted-foreground">
        {detail} · {value}%
      </span>
    </div>
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full bg-signal"
      />
    </div>
  </div>
)

export default CompletenessBar
