type PromptChipsProps = {
  prompts: string[]
  disabled: boolean
  onSelect: (prompt: string) => void
}

export const PromptChips = ({
  prompts,
  disabled,
  onSelect,
}: PromptChipsProps) => {
  return (
    <div className="mt-7 flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          className="glass-chip inline-flex touch-manipulation items-center rounded-full border px-3.5 py-2 text-left font-mono text-[11px] text-muted-foreground transition-colors duration-200 hover:border-signal hover:text-signal disabled:cursor-wait disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
