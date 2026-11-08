"use client"

import { useEffect, useRef } from "react"
import type { ChatMsg } from "../store/type"
import { ChatMessageItem } from "./ChatMessageItem"

type MessageListProps = {
  messages: ChatMsg[]
  loading: boolean
  thinkingLabel: string
  emptyStateLabel: string
  copyLabel: string
  error: string | null
}

export const MessageList = ({
  messages,
  loading,
  thinkingLabel,
  emptyStateLabel,
  copyLabel,
  error,
}: MessageListProps) => {
  const listRef = useRef<HTMLDivElement | null>(null)

  const lastMessage = messages[messages.length - 1]

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  const showTyping = loading && (!lastMessage || lastMessage.content === "")

  return (
    <div
      ref={listRef}
      role="log"
      aria-live="polite"
      className="h-[380px] touch-pan-y space-y-5 overflow-y-auto overscroll-contain px-5 py-6 [scrollbar-width:thin] sm:h-[420px]"
    >
      {messages.length === 0 && !loading ? (
        <p className="max-w-xs font-mono text-[11px] leading-relaxed text-[#a8a294]">
          {emptyStateLabel}
        </p>
      ) : null}

      {messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          copyLabel={copyLabel}
        />
      ))}

      {showTyping ? (
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] tracking-[0.2em] text-signal uppercase">
            EVE
          </span>
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="animate-typing-dot size-1 rounded-full bg-[#a8a294]"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </span>
          <span className="font-mono text-[10px] text-[#a8a294]">
            {thinkingLabel}…
          </span>
        </div>
      ) : null}

      {error && !loading ? (
        <p
          role="alert"
          className="font-mono text-[10px] leading-relaxed text-red-300/90"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
