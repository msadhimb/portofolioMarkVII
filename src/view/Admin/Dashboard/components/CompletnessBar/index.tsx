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
    <div className="flex items-center justify-between text-[13px]">
      <span className="font-medium">{label}</span>
      <span className="tabular text-muted-foreground">
        {detail} · {value}%
      </span>
    </div>
    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-teal-500"
      />
    </div>
  </div>
)

export default CompletenessBar
