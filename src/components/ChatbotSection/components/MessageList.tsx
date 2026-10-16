"use client";

import { Bot } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ChatMsg } from "../store/type";
import { ChatMessageItem } from "./ChatMessageItem";

type MessageListProps = {
  messages: ChatMsg[];
  loading: boolean;
  thinkingLabel: string;
  emptyStateLabel: string;
  copyLabel: string;
  error: string | null;
};

export const MessageList = ({
  messages,
  loading,
  thinkingLabel,
  emptyStateLabel,
  copyLabel,
  error,
}: MessageListProps) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  const lastMessage = messages[messages.length - 1];

  // Auto-scroll ke pesan terbaru.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const showTyping = loading && (!lastMessage || lastMessage.content === "");

  return (
    <div
      ref={listRef}
      role="log"
      aria-live="polite"
      className="h-[380px] space-y-4 overflow-y-auto px-5 py-5 sm:h-[420px]"
    >
      {messages.length === 0 && !loading ? (
        <p className="font-mono text-xs leading-relaxed text-[#8ea0c9]">{emptyStateLabel}</p>
      ) : null}

      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} copyLabel={copyLabel} />
      ))}

      {showTyping ? (
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
            <span className="font-mono text-[11px] text-[#8ea0c9]">{thinkingLabel}…</span>
          </div>
        </div>
      ) : null}

      {error && !loading ? (
        <p role="alert" className="font-mono text-[11px] leading-relaxed text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
};
