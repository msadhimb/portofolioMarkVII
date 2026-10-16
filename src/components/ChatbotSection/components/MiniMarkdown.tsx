import { cn } from "@/lib/utils";

type MiniMarkdownProps = {
  text: string;
};

type InlineProps = {
  text: string;
};

const Inline = ({ text }: InlineProps) => {
  // Pecah berdasarkan **bold** dan `code`, sisanya teks biasa.
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-[#22d3ee]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={i}
              className={cn(
                "rounded border border-white/15 bg-black/50 px-1 py-px",
                "font-mono text-[12px] text-cyan-300"
              )}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

/** Renderer markdown super-ringan: bold, inline code, list, paragraf. */
export const MiniMarkdown = ({ text }: MiniMarkdownProps) => {
  const blocks = text.split(/\n{2,}|\n/);
  return (
    <div className="space-y-1.5">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        if (/^[-*]\s/.test(trimmed)) {
          return (
            <p key={i} className="flex gap-2">
              <span className="text-[#22d3ee]">▸</span>
              <Inline text={trimmed.replace(/^[-*]\s/, "")} />
            </p>
          );
        }
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <p key={i} className="flex gap-2">
              <span className="font-mono text-[#22d3ee]">{trimmed.match(/^\d+/)?.[0]}.</span>
              <Inline text={trimmed.replace(/^\d+\.\s/, "")} />
            </p>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            <Inline text={trimmed} />
          </p>
        );
      })}
    </div>
  );
};
