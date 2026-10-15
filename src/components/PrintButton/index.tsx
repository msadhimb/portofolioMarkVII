"use client";

import { Download } from "lucide-react";

type PrintButtonProps = {
  label?: string;
};

export const PrintButton = ({ label = "Print / Save PDF" }: PrintButtonProps) => {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background"
    >
      <Download className="size-4" /> {label}
    </button>
  );
};
