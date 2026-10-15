import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
};

export const SectionHeading = ({
  index,
  eyebrow,
  title,
  children,
  className,
}: SectionHeadingProps) => {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
        <span className="text-signal tabular">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-border" />
        {eyebrow}
      </p>
      <h2 className="text-balance mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{children}</p>
      ) : null}
    </div>
  );
};
