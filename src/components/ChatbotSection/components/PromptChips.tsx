type PromptChipsProps = {
  prompts: string[];
  disabled: boolean;
  onSelect: (prompt: string) => void;
};

export const PromptChips = ({ prompts, disabled, onSelect }: PromptChipsProps) => {
  return (
    <div className="mt-7 flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-left text-[13px] font-medium text-foreground shadow-[0_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:border-signal/60 hover:shadow-[0_4px_0_0_var(--signal)] active:translate-y-0 active:shadow-none disabled:cursor-wait disabled:opacity-60"
        >
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-signal">
            ⏎
          </kbd>
          {prompt}
        </button>
      ))}
    </div>
  );
};
