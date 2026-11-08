import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  index: string
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  className?: string
}

export const SectionHeading = ({
  index,
  eyebrow,
  title,
  children,
  className,
}: SectionHeadingProps) => {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
        <span className="tabular text-signal">{index}</span>
        <span aria-hidden="true" className="h-px w-10 bg-border" />
        {eyebrow}
      </p>
      <h2 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.04em] text-balance text-foreground">
        {title}
      </h2>
      {children ? (
        <p className="mt-5 max-w-[38rem] text-[15px] leading-relaxed text-muted-foreground md:text-base">
          {children}
        </p>
      ) : null}
    </div>
  )
}
