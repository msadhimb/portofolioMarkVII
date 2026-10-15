"use client";

import {
  Bot,
  Check,
  Copy,
  CornerDownLeft,
  Eraser,
  Sparkles,
  Square,
  Terminal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

/**
 * Section chatbot unik: konsol terminal "salman-ai" bergaya CRT —
 * scanlines, glow fosfor, prompt `>`, chip keyboard, badge model Ollama live.
 * Data mengalir: UI -> /api/chat -> Ollama (model & key dari env).
 */
export const ChatbotSection = () => {
  const { dict, lang } = useLanguage();
  const t = dict.chatbot;
  const chat = useChat({ locale: lang, initialGreeting: t.greeting });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll ke pesan terbaru.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chat.messages, chat.loading]);

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((v) => (v === id ? null : v)), 1500);
    } catch {
      /* clipboard unavailable — abaikan */
    }
  };

  return (
    <section
      id="ai"
      aria-label="Salman AI chatbot"
      className="relative scroll-mt-24 overflow-hidden border-t border-border py-20 sm:py-28"
    >
      {/* Aurora di belakang section */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-aurora absolute -top-24 left-1/4 size-[28rem] rounded-full bg-signal/20 blur-[110px]" />
        <div className="animate-aurora-slow absolute -bottom-32 right-1/5 size-[24rem] rounded-full bg-cyan-400/20 blur-[110px]" />
        <div className="bg-grid bg-grid-fade absolute inset-0 opacity-60" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* Kolom kiri: heading + prompt keyboard + kartu model */}
          <Reveal>
            <SectionHeading
              index="AI"
              eyebrow={t.eyebrow}
              title={
                <>
                  {t.titleA}{" "}
                  <span className="font-display font-normal italic text-signal">
                    {t.titleAccent}
                  </span>
                </>
              }
            >
              {t.description}
            </SectionHeading>

            <div className="mt-7 flex flex-wrap gap-2">
              {t.prompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => chat.send(p)}
                  disabled={chat.loading}
                  className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-left text-[13px] font-medium text-foreground shadow-[0_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:border-signal/60 hover:shadow-[0_4px_0_0_var(--signal)] active:translate-y-0 active:shadow-none disabled:cursor-wait disabled:opacity-60"
                >
                  <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-signal">
                    ⏎
                  </kbd>
                  {p}
                </button>
              ))}
            </div>

            <Card className="mt-6 gap-0 overflow-hidden rounded-2xl p-0">
              <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
                <Terminal className="size-3.5 text-signal" />
                {t.terminalTitle}
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <span className="relative flex size-1.5">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                    <span className="relative size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  {t.online}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-px bg-border font-mono text-[11px]">
                {[
                  [t.modelLabel, chat.model],
                  ["api", "/api/chat → ollama"],
                  ["stream", "token-by-token"],
                  ["key", "OLLAMA_API_KEY · env"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-card px-4 py-2.5">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="mt-0.5 truncate font-semibold text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {t.disclaimer}
            </p>
          </Reveal>

          {/* Kolom kanan: jendela terminal HUD futuristik */}
          <Reveal delay={0.1} className="w-full">
            <div className="hud-corners p-3">
              <div className="crt relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#050b1d] shadow-[0_0_90px_-18px_rgba(34,211,238,0.4),0_40px_90px_-30px_rgba(0,0,0,0.6)]">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-5 py-3.5">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 font-mono text-xs text-[#8ea0c9]">
                  salman-ai — ollama console
                </span>
                <Badge
                  variant="secondary"
                  className="ml-auto border-white/10 bg-white/[0.06] font-mono text-[10px] text-[#22d3ee]"
                >
                  <Sparkles className="mr-1 size-3" />
                  {chat.model}
                </Badge>
              </div>

              {/* Pesan */}
              <div
                ref={listRef}
                role="log"
                aria-live="polite"
                className="h-[380px] space-y-4 overflow-y-auto px-5 py-5 sm:h-[420px]"
              >
                {chat.messages.map((m) =>
                  m.role === "user" ? (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#22d3ee] px-4 py-2.5 text-sm leading-relaxed text-[#032630]">
                        <p className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-60">
                          {"you@portfolio:~$"}
                        </p>
                        <p className="mt-0.5 whitespace-pre-wrap">{m.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div key={m.id} className="flex gap-2.5">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
                        <Bot className="size-4" />
                      </span>
                      <div className="group relative max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm leading-relaxed text-[#dbe6ff]">
                        <MiniMarkdown text={m.content} />
                        {m.content ? (
                          <button
                            type="button"
                            onClick={() => copy(m.id, m.content)}
                            aria-label="Copy"
                            className="absolute -top-2 -right-2 hidden size-6 items-center justify-center rounded-full border border-white/15 bg-[#0a1122] text-[#8ea0c9] group-hover:inline-flex"
                          >
                            {copiedId === m.id ? (
                              <Check className="size-3 text-cyan-300" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  )
                )}
                {chat.loading &&
                chat.messages[chat.messages.length - 1]?.content === "" ? (
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
                      <Bot className="size-4" />
                    </span>
                    <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-3">
                      <span className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="animate-typing-dot size-1.5 rounded-full bg-[#22d3ee]"
                            style={{ animationDelay: `${i * 0.18}s` }}
                          />
                        ))}
                      </span>
                      <span className="font-mono text-[11px] text-[#8ea0c9]">
                        {t.thinking}…
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  chat.send();
                }}
                className="border-t border-white/10 bg-white/[0.02] p-4"
              >
                <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/40 px-4 py-1.5 focus-within:border-[#22d3ee]/60">
                  <span className="font-mono text-sm font-bold text-[#22d3ee]">
                    {">"}
                  </span>
                  <input
                    value={chat.input}
                    onChange={(e) => chat.setInput(e.target.value)}
                    placeholder={t.placeholder}
                    aria-label={t.placeholder}
                    className="h-10 w-full bg-transparent font-mono text-sm text-[#dbe6ff] outline-none placeholder:text-[#8ea0c9]/50"
                  />
                  {chat.loading ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={chat.stop}
                      aria-label={t.stop}
                      className="size-9 shrink-0 rounded-xl"
                    >
                      <Square className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="icon"
                      aria-label={t.send}
                      disabled={!chat.input.trim()}
                      className="size-9 shrink-0 rounded-xl bg-[#22d3ee] text-[#032630] hover:bg-[#06b6d4] disabled:opacity-40"
                    >
                      <CornerDownLeft className="size-4" />
                    </Button>
                  )}
                </div>
                <div className="mt-2.5 flex items-center justify-between px-1 font-mono text-[10px] text-[#8ea0c9]/70">
                  <span>
                    esc = stop · enter = {t.send.toLowerCase()}
                  </span>
                  <button
                    type="button"
                    onClick={chat.clear}
                    className="inline-flex items-center gap-1 transition-colors hover:text-[#22d3ee]"
                  >
                    <Eraser className="size-3" />
                    {t.clear}
                  </button>
                </div>
              </form>

              {/* Scanlines CRT */}
              <div aria-hidden="true" className="crt-scanlines pointer-events-none absolute inset-0" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/** Renderer markdown super-ringan: bold, inline code, list, paragraf. */
const MiniMarkdown = ({ text }: { text: string }) => {
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
              <span className="font-mono text-[#22d3ee]">
                {trimmed.match(/^\d+/)?.[0]}.
              </span>
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

const Inline = ({ text }: { text: string }) => {
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
