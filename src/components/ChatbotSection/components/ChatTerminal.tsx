import type { ChatInputErrorKey, ChatMsg } from "../store/type"
import { ChatInput } from "./ChatInput"
import { MessageList } from "./MessageList"
import { SpotlightCard } from "@/components/SpotlightCard"

type ChatTerminalProps = {
  model: string
  terminalTitle: string
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
  terminalTitle,
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
    <SpotlightCard className="relative overflow-hidden rounded-[24px] border border-white/12 bg-[#111411]/95 p-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_40px_80px_-55px_rgba(0,0,0,0.85)] backdrop-blur-xl">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
        <span className="size-1.5 rounded-full bg-signal" />
        <span className="truncate font-mono text-[10px] tracking-[0.16em] text-[#a8a294] uppercase">
          {terminalTitle}
        </span>
        <span className="ml-auto shrink-0 font-mono text-[10px] text-[#a8a294]">
          {model}
        </span>
      </div>

      <MessageList
        messages={messages}
        loading={loading}
        thinkingLabel={thinkingLabel}
        emptyStateLabel={emptyStateLabel}
        copyLabel={copyLabel}
        error={error}
      />

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
    </SpotlightCard>
  )
}
