"use client";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  className?: string;
};

/**
 * Pita berjalan tanpa henti — pemisah section yang playful.
 * Duplikasi list 2x + animasi CSS `marquee` agar loop mulus.
 */
export const Marquee = ({ items, className }: MarqueeProps) => {
  const row = [...items, ...items];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden border-y border-border bg-foreground py-3 text-background",
        className
      )}
    >
      <div className="animate-marquee flex w-max items-center gap-8 pr-8 whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 font-mono text-xs tracking-[0.22em] uppercase"
          >
            {item}
            <span className="inline-block size-1.5 rotate-45 bg-signal" />
          </span>
        ))}
      </div>
    </div>
  );
};
