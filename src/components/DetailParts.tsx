import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export const DetailSection = ({
  title,
  icon,
  action,
  children,
}: {
  title: string
  icon?: ReactNode
  action?: ReactNode
  children: React.ReactNode
}) => {
  return (
    <section
      aria-label={title}
      className="glass-panel overflow-hidden rounded-xl border"
    >
      <header className="flex items-center gap-2.5 border-b border-border/70 bg-muted/40 px-4 py-2.5">
        {icon ? (
          <span className="flex size-7 items-center justify-center rounded-md border border-border bg-muted text-signal [&_svg]:size-3.5">
            {icon}
          </span>
        ) : null}
        <h3 className="font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {title}
        </h3>
        {action ? <div className="ml-auto">{action}</div> : null}
      </header>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  )
}

export const DetailText = ({
  label,
  value,
  className,
}: {
  label: string
  value?: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-muted/40 p-3 transition-colors hover:border-signal/40",
        className
      )}
    >
      <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-1 text-sm leading-relaxed break-words text-foreground">
        {value === undefined || value === null || value === "" ? (
          <span className="text-muted-foreground/70">—</span>
        ) : (
          value
        )}
      </div>
    </div>
  )
}

export const DetailList = ({
  label,
  items,
}: {
  label: string
  items: string[]
}) => {
  if (items.length === 0) {
    return <DetailText label={label} value="—" />
  }

  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}{" "}
        <span className="tabular text-signal">· {items.length}</span>
      </p>
      <ol className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li
            key={`${index}-${item}`}
            className="flex gap-2.5 rounded-lg border border-border/60 bg-muted/40 p-3 text-sm leading-relaxed text-foreground/90 transition-colors hover:border-signal/40"
          >
            <span
              aria-hidden="true"
              className="tabular flex size-5 shrink-0 items-center justify-center rounded-sm border border-border bg-muted font-mono text-[10px] font-semibold text-signal"
            >
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 break-words">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export const DetailChips = ({
  label,
  items,
}: {
  label: string
  items: string[]
}) => {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        {label}{" "}
        {items.length > 0 ? (
          <span className="tabular text-signal">· {items.length}</span>
        ) : null}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.length === 0 ? (
          <span className="text-sm text-muted-foreground/70">—</span>
        ) : (
          items.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="gap-1.5 border-border bg-muted py-1 font-normal hover:border-signal/50"
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-signal"
              />
              {item}
            </Badge>
          ))
        )}
      </div>
    </div>
  )
}

export const DetailHero = ({
  letter,
  title,
  subtitle,
  badges,
  actions,
}: {
  letter: string
  title: string
  subtitle?: ReactNode
  badges?: ReactNode
  actions?: ReactNode
  tone?: "cyan" | "violet" | "emerald"
}) => {
  return (
    <div className="glass-panel overflow-hidden rounded-xl border">
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-mono text-lg font-medium text-signal">
          {letter}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="font-display truncate text-lg leading-snug font-semibold tracking-tight">
            {title}
          </h4>
          {subtitle ? (
            <div className="mt-1 min-w-0 text-[13px] text-muted-foreground">
              {subtitle}
            </div>
          ) : null}
          {badges ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">{badges}</div>
          ) : null}
        </div>
        {actions ? (
          <div className="hidden shrink-0 gap-2 sm:flex">{actions}</div>
        ) : null}
      </div>
      {actions ? (
        <div className="relative flex gap-2 border-t border-border/60 bg-muted/30 px-4 py-2.5 sm:hidden">
          {actions}
        </div>
      ) : null}
    </div>
  )
}

export const LocaleTabs = ({
  active,
  onChange,
  idCount,
  enCount,
}: {
  active: "id" | "en"
  onChange: (locale: "id" | "en") => void
  idCount?: number
  enCount?: number
}) => {
  const tabs = [
    { key: "id" as const, label: "Bahasa Indonesia", flag: "ID", count: idCount },
    { key: "en" as const, label: "English", flag: "EN", count: enCount },
  ]
  return (
    <div
      role="tablist"
      aria-label="Pilih bahasa"
      className="grid grid-cols-2 gap-1 rounded-xl border bg-muted/50 p-1"
    >
      {tabs.map((tab) => {
        const selected = active === tab.key
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={selected}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
              selected
                ? "border border-border bg-muted text-foreground"
                : "border border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-sm font-mono text-[9px] font-semibold",
                selected
                  ? "bg-signal/15 text-signal"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {tab.flag}
            </span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.flag}</span>
            {typeof tab.count === "number" && tab.count > 0 ? (
              <span className="tabular rounded-full bg-signal/15 px-1.5 py-0.5 font-mono text-[10px] text-signal">
                {tab.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export const MetricGrid = ({
  items,
}: {
  items: { label: string; value: string }[]
}) => {
  if (items.length === 0) {
    return <DetailText label="Metrik" value="—" />
  }
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        Metrik <span className="tabular text-signal">· {items.length}</span>
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {items.map((metric, index) => (
          <div
            key={`${metric.label}-${index}`}
            className="rounded-md border border-border bg-muted/40 p-3 text-center transition-colors hover:border-signal/40"
          >
            <p className="tabular font-display text-lg leading-tight text-signal">
              {metric.value}
            </p>
            <p className="mt-1 truncate text-[11px] text-muted-foreground">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
