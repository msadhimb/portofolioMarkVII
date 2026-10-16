"use client"

import type { ReactNode } from "react"
import { TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"

export type FormTabKey = "umum" | "id" | "en"

export const FORM_TABS: { key: FormTabKey; short: string; label: string }[] = [
  { key: "umum", short: "Umum", label: "Data umum" },
  { key: "id", short: "ID", label: "Bahasa Indonesia" },
  { key: "en", short: "EN", label: "English" },
]

export const FormTabBar = ({
  active,
  onChange,
  errorCounts,
}: {
  active: FormTabKey
  onChange: (tab: FormTabKey) => void
  errorCounts: Record<FormTabKey, number>
}) => {
  return (
    <div
      role="tablist"
      aria-label="Bagian form"
      className="sticky top-0 z-[5] grid grid-cols-3 gap-1 rounded-xl border bg-card/95 p-1 shadow-sm backdrop-blur-xl"
    >
      {FORM_TABS.map((tab) => {
        const selected = active === tab.key
        const errors = errorCounts[tab.key] ?? 0
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={selected}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "relative flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[13px] font-medium transition-all",
              selected
                ? "bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-foreground shadow-sm ring-1 ring-signal/30"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {selected ? (
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-signal"
              />
            ) : null}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.short}</span>
            {errors > 0 ? (
              <span className="tabular inline-flex items-center gap-1 rounded-full bg-destructive/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-destructive">
                <TriangleAlert className="size-2.5" />
                {errors}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export const FormSectionCard = ({
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
      className="card-futuristic overflow-hidden rounded-xl border bg-card"
    >
      <header className="flex items-center gap-3 border-b border-border/70 bg-muted/50 px-4 py-3 sm:px-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-signal/25 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-signal [&_svg]:size-4">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] tracking-[0.18em] text-signal uppercase">
            {eyebrow}
          </p>
          <h3 className="font-display truncate text-[15px] font-semibold tracking-tight">
            {title}
          </h3>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {errorCount !== undefined && errorCount > 0 ? (
          <span className="tabular inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/15 px-2 py-1 font-mono text-[11px] font-bold text-destructive">
            <TriangleAlert className="size-3" />
            {errorCount} error
          </span>
        ) : (
          <span className="hidden shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] text-emerald-600 sm:block dark:text-emerald-300">
            ✓ siap
          </span>
        )}
      </header>
      <div className="space-y-4 bg-gradient-to-b from-muted/40 to-transparent p-4 sm:p-5">
        {children}
      </div>
    </section>
  )
}

export const countErrorsByPrefix = (
  errors: Record<string, unknown>,
  prefixes: { umum: (key: string) => boolean; id: (key: string) => boolean; en: (key: string) => boolean }
): Record<FormTabKey, number> => {
  const counts: Record<FormTabKey, number> = { umum: 0, id: 0, en: 0 }
  for (const key of Object.keys(errors)) {
    if (prefixes.en(key)) counts.en += 1
    else if (prefixes.id(key)) counts.id += 1
    else if (prefixes.umum(key)) counts.umum += 1
  }
  return counts
}
