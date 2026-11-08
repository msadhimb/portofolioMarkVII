import { cn } from "@/lib/utils"

type MiniMarkdownProps = {
  text: string
}

type InlineProps = {
  text: string
}

const Inline = ({ text }: InlineProps) => {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-medium text-signal">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={i}
              className={cn(
                "rounded border border-white/[0.14] bg-white/5 px-1 py-px",
                "font-mono text-[12px] text-[#ece7dd]"
              )}
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export const MiniMarkdown = ({ text }: MiniMarkdownProps) => {
  const blocks = text.split(/\n{2,}|\n/)
  return (
    <div className="space-y-1.5">
      {blocks.map((block, i) => {
        const trimmed = block.trim()
        if (!trimmed) return null
        if (/^[-*]\s/.test(trimmed)) {
          return (
            <p key={i} className="flex gap-2">
              <span aria-hidden="true" className="text-signal">
                —
              </span>
              <Inline text={trimmed.replace(/^[-*]\s/, "")} />
            </p>
          )
        }
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <p key={i} className="flex gap-2">
              <span className="font-mono text-[11px] text-signal">
                {trimmed.match(/^\d+/)?.[0]}.
              </span>
              <Inline text={trimmed.replace(/^\d+\.\s/, "")} />
            </p>
          )
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            <Inline text={trimmed} />
          </p>
        )
      })}
    </div>
  )
}
