import { cn } from "cn"
import { TriangleAlert } from "lucide-react"

type FormTabKey = "umum" | "id" | "en"

export const FormTabBar = ({
  active,
  onChange,
  errorCounts,
}: {
  active: "umum" | "id" | "en"
  onChange: (tab: FormTabKey) => void
  errorCounts: Record<FormTabKey, number>
}) => {
  const formTabs: { key: FormTabKey; short: string; label: string }[] = [
    { key: "umum", short: "Umum", label: "Data umum" },
    { key: "id", short: "ID", label: "Bahasa Indonesia" },
    { key: "en", short: "EN", label: "English" },
  ]
  return (
    <div
      role="tablist"
      aria-label="Bagian form"
      className="glass-chip sticky top-0 z-[5] grid grid-cols-3 gap-1 rounded-xl border p-1"
    >
      {formTabs.map((tab) => {
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
              "relative flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[13px] font-medium transition-colors",
              selected
                ? "bg-foreground text-background"
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
