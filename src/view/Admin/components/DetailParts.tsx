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
      className="card-futuristic overflow-hidden rounded-xl border bg-card shadow-[0_16px_40px_-28px_rgba(2,132,199,0.55)]"
    >
      <header className="flex items-center gap-2.5 border-b border-border/70 bg-muted/50 px-4 py-2.5">
        {icon ? (
          <span className="flex size-7 items-center justify-center rounded-lg border border-signal/25 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-signal [&_svg]:size-3.5">
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
              className="tabular flex size-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/25 to-violet-500/25 font-mono text-[10px] font-bold text-signal"
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
              className="gap-1.5 border-signal/20 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 py-1 font-normal hover:border-signal/50"
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
  tone = "cyan",
}: {
  letter: string
  title: string
  subtitle?: ReactNode
  badges?: ReactNode
  actions?: ReactNode
  tone?: "cyan" | "violet" | "emerald"
}) => {
  const wash =
    tone === "violet"
      ? "from-violet-500/[0.18] via-transparent to-transparent"
      : tone === "emerald"
        ? "from-emerald-500/[0.16] via-transparent to-transparent"
        : "from-cyan-500/[0.16] via-transparent to-transparent"
  const blob =
    tone === "violet"
      ? "bg-violet-500/30"
      : tone === "emerald"
        ? "bg-emerald-400/30"
        : "bg-cyan-400/30"
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br",
          wash
        )}
      />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_90%_100%_at_0%_0%,black,transparent)]" />
      <div
        aria-hidden="true"
        className={cn(
          "animate-aurora pointer-events-none absolute -top-16 -right-8 size-48 rounded-full blur-3xl",
          blob
        )}
      />
      <div className="relative flex items-start gap-4 p-4 sm:p-5">
        <span className="font-display flex size-14 shrink-0 items-center justify-center rounded-2xl border border-signal/25 bg-gradient-to-br from-cyan-500/25 to-violet-500/25 text-2xl font-bold text-signal shadow-lg">
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
        <div className="relative flex gap-2 border-t border-border/60 bg-muted/40 px-4 py-2.5 sm:hidden">
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
              "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
              selected
                ? "border border-signal/30 bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-md font-mono text-[9px] font-bold",
                selected
                  ? "bg-gradient-to-br from-cyan-500/30 to-violet-500/30 text-signal"
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
            className="relative overflow-hidden rounded-lg border border-border/60 bg-gradient-to-b from-cyan-500/[0.08] to-violet-500/[0.08] p-3 text-center transition-colors hover:border-signal/40"
          >
            <p className="tabular font-display text-lg leading-tight font-bold text-signal">
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
