"use client"

import { CornerDownLeft, Eraser, Square } from "lucide-react"
import type { FormEvent } from "react"
import { MAX_CHAT_INPUT } from "../validation"
import type { ChatInputErrorKey } from "../store/type"

type ChatInputProps = {
  input: string
  inputErrorKey: ChatInputErrorKey | null
  loading: boolean
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

export const ChatInput = ({
  input,
  inputErrorKey,
  loading,
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
}: ChatInputProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmitText(input)
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
      <div className="flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.04] px-4 py-1.5 backdrop-blur-sm focus-within:border-signal/60">
        <span className="font-mono text-sm text-signal">{">"}</span>
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={inputErrorKey !== null}
          maxLength={MAX_CHAT_INPUT}
          className="h-10 w-full bg-transparent font-mono text-sm text-[#ece7dd] outline-none placeholder:text-[#a8a294]/50"
        />
        {loading ? (
          <button
            type="button"
            onClick={onStop}
            aria-label={stopLabel}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#ece7dd] transition-colors hover:bg-white/[0.16]"
          >
            <Square className="size-4" />
          </button>
        ) : (
          <button
            type="submit"
            aria-label={sendLabel}
            disabled={!input.trim()}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-signal text-[#1a1206] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <CornerDownLeft className="size-4" />
          </button>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3 px-1 font-mono text-[10px] text-[#a8a294]/70">
        <span>{hintLabel}</span>
        <span className="tabular shrink-0">
          {input.length}/{MAX_CHAT_INPUT}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex shrink-0 items-center gap-1 transition-colors hover:text-signal"
        >
          <Eraser className="size-3" />
          {clearLabel}
        </button>
      </div>

      {inputErrorKey ? (
        <p
          role="alert"
          className="mt-1.5 px-1 font-mono text-[10px] text-red-300/90"
        >
          {inputErrorKey === "too_long"
            ? validationTooLongLabel
            : validationEmptyLabel}
        </p>
      ) : null}
    </form>
  )
}
