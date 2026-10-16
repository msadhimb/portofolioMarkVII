import * as React from "react"

import { cn } from "@/lib/utils"

const Input = ({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-background px-4 text-[15px] text-foreground shadow-xs transition-all outline-none selection:bg-signal/30 selection:text-foreground placeholder:text-muted-foreground/60",
        "focus-visible:border-signal/60 focus-visible:ring-2 focus-visible:ring-signal/25",
        "aria-invalid:border-destructive/60 aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
