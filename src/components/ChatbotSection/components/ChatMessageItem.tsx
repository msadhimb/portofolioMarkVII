"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import type { ChatMsg } from "../store/type"
import { MiniMarkdown } from "./MiniMarkdown"

type ChatMessageItemProps = {
  message: ChatMsg
  copyLabel: string
}

export const ChatMessageItem = ({
  message,
  copyLabel,
}: ChatMessageItemProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
    } catch {
      return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <span className="pr-1 font-mono text-[9px] tracking-[0.2em] text-[#a8a294] uppercase">
          you
        </span>
        <div className="max-w-[85%] rounded-[18px] rounded-br-sm bg-[#ece7dd] px-4 py-3 text-sm leading-relaxed text-[#111411]">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    )
  }

  if (!message.content) return null

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[9px] tracking-[0.2em] text-signal uppercase">
        EVE
      </span>
      <div className="group relative max-w-[88%] border-l border-signal/40 pl-4 text-sm leading-relaxed text-[#ece7dd]">
        <MiniMarkdown text={message.content} />
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copyLabel}
          className="absolute -top-1 right-0 inline-flex size-6 items-center justify-center rounded-full border border-white/[0.14] bg-[#111411] text-[#a8a294] opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          {copied ? (
            <Check className="size-3 text-signal" />
          ) : (
            <Copy className="size-3" />
          )}
        </button>
      </div>
    </div>
  )
}
