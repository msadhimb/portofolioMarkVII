import { SpotlightCard } from "@/components/SpotlightCard"

type ModelCardProps = {
  model: string
  onlineLabel: string
  modelLabel: string
  apiPath: string
}

export const ModelCard = ({
  model,
  onlineLabel,
  modelLabel,
  apiPath,
}: ModelCardProps) => {
  const rows: Array<[string, string]> = [
    [modelLabel, model],
    ["api", apiPath],
    ["stream", "token"],
    ["runtime", "ollama"],
  ]

  return (
    <SpotlightCard className="glass-panel mt-6 overflow-hidden rounded-[20px] border p-0 shadow-none">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        <span className="size-1.5 rounded-full bg-signal" />
        {onlineLabel}
      </div>
      <dl className="grid grid-cols-2 gap-px bg-border font-mono text-[11px]">
        {rows.map(([label, value]) => (
          <div key={label} className="bg-card/60 px-4 py-3">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 truncate text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </SpotlightCard>
  )
}
