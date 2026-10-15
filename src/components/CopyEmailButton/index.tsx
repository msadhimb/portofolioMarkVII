"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type CopyEmailButtonProps = {
  email: string;
  copyLabel?: string;
  copiedLabel?: string;
};

export const CopyEmailButton = ({
  email,
  copyLabel = "Copy email",
  copiedLabel = "Copied!",
}: CopyEmailButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={copy}
      className="h-12 rounded-full px-5"
      aria-live="polite"
    >
      {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
      {copied ? copiedLabel : copyLabel}
    </Button>
  );
};
