"use client";

import { Bot, Check, Copy } from "lucide-react";
import { useState } from "react";
import type { ChatMsg } from "../store/type";
import { MiniMarkdown } from "./MiniMarkdown";

type ChatMessageItemProps = {
  message: ChatMsg;
  copyLabel: string;
};

export const ChatMessageItem = ({ message, copyLabel }: ChatMessageItemProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#22d3ee] px-4 py-2.5 text-sm leading-relaxed text-[#032630]">
          <p className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-60">
            {"you@portfolio:~$"}
          </p>
          <p className="mt-0.5 whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  if (!message.content) return null;

  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
        <Bot className="size-4" />
      </span>
      <div className="group relative max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm leading-relaxed text-[#dbe6ff]">
        <MiniMarkdown text={message.content} />
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copyLabel}
          className="absolute -top-2 -right-2 hidden size-6 items-center justify-center rounded-full border border-white/15 bg-[#0a1122] text-[#8ea0c9] group-hover:inline-flex"
        >
          {copied ? <Check className="size-3 text-cyan-300" /> : <Copy className="size-3" />}
        </button>
      </div>
    </div>
  );
};
