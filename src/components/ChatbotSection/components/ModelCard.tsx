import { Terminal } from "lucide-react"
import { Card } from "@/components/ui/card"

type ModelCardProps = {
  model: string
  terminalTitle: string
  onlineLabel: string
  modelLabel: string
  apiPath: string
}

export const ModelCard = ({
  model,
  terminalTitle,
  onlineLabel,
  modelLabel,
  apiPath,
}: ModelCardProps) => {
  const rows: Array<[string, string]> = [
    [modelLabel, model],
    ["api", apiPath],
    ["stream", "token-by-token"],
    ["key", "OLLAMA_API_KEY"],
  ]

  return (
    <Card className="mt-6 gap-0 overflow-hidden rounded-2xl p-0">
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
        <Terminal className="size-3.5 text-signal" />
        {terminalTitle}
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
          <span className="relative flex size-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative size-1.5 rounded-full bg-emerald-500" />
          </span>
          {onlineLabel}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-px bg-border font-mono text-[11px]">
        {rows.map(([label, value]) => (
          <div key={label} className="bg-card px-4 py-2.5">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 truncate font-semibold text-foreground">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
