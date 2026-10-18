"use client";

import { CornerDownLeft, Eraser, Square } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { MAX_CHAT_INPUT } from "../validation";
import type { ChatInputErrorKey } from "../store/type";

type ChatInputProps = {
  input: string;
  inputErrorKey: ChatInputErrorKey | null;
  loading: boolean;
  placeholder: string;
  sendLabel: string;
  stopLabel: string;
  clearLabel: string;
  hintLabel: string;
  validationEmptyLabel: string;
  validationTooLongLabel: string;
  onInputChange: (value: string) => void;
  onSubmitText: (raw: string) => void;
  onStop: () => void;
  onClear: () => void;
};

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
    event.preventDefault();
    onSubmitText(input);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/40 px-4 py-1.5 focus-within:border-[#f59e0b]/60">
        <span className="font-mono text-sm font-bold text-[#f59e0b]">{">"}</span>
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={inputErrorKey !== null}
          maxLength={MAX_CHAT_INPUT}
          className="h-10 w-full bg-transparent font-mono text-sm text-[#e8e4dc] outline-none placeholder:text-[#a8a294]/50 focus:ring-0 focus-visible:outline-0!"
        />
        {loading ? (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={onStop}
            aria-label={stopLabel}
            className="size-9 shrink-0 rounded-xl"
          >
            <Square className="size-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            aria-label={sendLabel}
            disabled={!input.trim()}
            className="size-9 shrink-0 rounded-xl bg-[#f59e0b] text-[#1a1206] hover:bg-[#d97706] disabled:opacity-40"
          >
            <CornerDownLeft className="size-4" />
          </Button>
        )}
      </div>
      <div className="mt-2.5 flex items-center justify-between px-1 font-mono text-[10px] text-[#a8a294]/70">
        <span>{hintLabel}</span>
        <span className="tabular">
          {input.length}/{MAX_CHAT_INPUT}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 transition-colors hover:text-[#f59e0b]"
        >
          <Eraser className="size-3" />
          {clearLabel}
        </button>
      </div>
      {inputErrorKey ? (
        <p role="alert" className="mt-1.5 px-1 font-mono text-[10px] text-red-300">
          {inputErrorKey === "too_long" ? validationTooLongLabel : validationEmptyLabel}
        </p>
      ) : null}
    </form>
  );
};
