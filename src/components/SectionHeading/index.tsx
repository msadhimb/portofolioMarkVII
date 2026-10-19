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
    <div className={cn("", className)}>
      <div className="max-w-2xl">
        <p className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          <span className="tabular text-signal">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-border" />
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
          {title}
        </h2>
      </div>
      {children ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          {children}
        </p>
      ) : null}
    </div>
  )
}
