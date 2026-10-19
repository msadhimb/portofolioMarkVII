import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ChatInputErrorKey, ChatMsg } from "../store/type"
import { ChatInput } from "./ChatInput"
import { MessageList } from "./MessageList"

type ChatTerminalProps = {
  model: string
  messages: ChatMsg[]
  loading: boolean
  error: string | null
  input: string
  inputErrorKey: ChatInputErrorKey | null
  thinkingLabel: string
  emptyStateLabel: string
  copyLabel: string
  placeholder: string
  sendLabel: string
  stopLabel: string
  clearLabel: string
  hintLabel: string
  validationEmptyLabel: string
  validationTooLongLabel: string
  onInputChange: (value: string) => void
  onSubmitText: (raw: string) => void
  onStop: () => void
  onClear: () => void
}

export const ChatTerminal = ({
  model,
  messages,
  loading,
  error,
  input,
  inputErrorKey,
  thinkingLabel,
  emptyStateLabel,
  copyLabel,
  placeholder,
  sendLabel,
  stopLabel,
  clearLabel,
  hintLabel,
  validationEmptyLabel,
  validationTooLongLabel,
  onInputChange,
  onSubmitText,
  onStop,
  onClear,
}: ChatTerminalProps) => {
  return (
    <div className="crt relative overflow-hidden rounded-2xl border border-teal-400/20 bg-[#141311] shadow-[0_0_90px_-18px_rgba(245,158,11,0.3),0_40px_90px_-30px_rgba(0,0,0,0.6)]">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-5 py-3.5">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-[#a8a294]">
          adhim-ai — ollama console
        </span>
        <Badge
          variant="secondary"
          className="ml-auto border-white/10 bg-white/[0.06] font-mono text-[10px] text-[#f59e0b]"
        >
          <Sparkles className="mr-1 size-3" />
          {model}
        </Badge>
      </div>

      {/* Pesan */}
      <MessageList
        messages={messages}
        loading={loading}
        thinkingLabel={thinkingLabel}
        emptyStateLabel={emptyStateLabel}
        copyLabel={copyLabel}
        error={error}
      />

      {/* Input */}
      <ChatInput
        input={input}
        inputErrorKey={inputErrorKey}
        loading={loading}
        placeholder={placeholder}
        sendLabel={sendLabel}
        stopLabel={stopLabel}
        clearLabel={clearLabel}
        hintLabel={hintLabel}
        validationEmptyLabel={validationEmptyLabel}
        validationTooLongLabel={validationTooLongLabel}
        onInputChange={onInputChange}
        onSubmitText={onSubmitText}
        onStop={onStop}
        onClear={onClear}
      />

      {/* Scanlines CRT */}
      <div
        aria-hidden="true"
        className="crt-scanlines pointer-events-none absolute inset-0"
      />
    </div>
  )
}
