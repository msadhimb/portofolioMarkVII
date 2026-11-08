import { TriangleAlert } from "lucide-react"
import { ReactNode } from "react"

const FormSectionCard = ({
  icon,
  eyebrow,
  title,
  subtitle,
  errorCount,
  hidden,
  children,
}: {
  icon: ReactNode
  eyebrow: string
  title: string
  subtitle: string
  errorCount?: number
  hidden?: boolean
  children: ReactNode
}) => {
  if (hidden) return null
  return (
    <section
      aria-label={title}
      className="glass-panel overflow-hidden rounded-xl border"
    >
      <header className="flex items-center gap-3 border-b border-border/70 bg-muted/40 px-4 py-3 sm:px-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-signal [&_svg]:size-4">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] tracking-[0.18em] text-signal uppercase">
            {eyebrow}
          </p>
          <h3 className="truncate font-display text-[15px] font-semibold tracking-tight">
            {title}
          </h3>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {errorCount !== undefined && errorCount > 0 ? (
          <span className="tabular inline-flex shrink-0 items-center gap-1 rounded-sm bg-destructive/10 px-2 py-1 font-mono text-[11px] font-semibold text-destructive">
            <TriangleAlert className="size-3" />
            {errorCount} galat
          </span>
        ) : (
          <span className="hidden shrink-0 font-mono text-[9px] tracking-[0.16em] text-muted-foreground uppercase sm:block">
            Siap
          </span>
        )}
      </header>
      <div className="space-y-4 p-4 sm:p-5">{children}</div>
    </section>
  )
}
export default FormSectionCard
