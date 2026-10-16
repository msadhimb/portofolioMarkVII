import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content min-h-32 w-full rounded-xl border border-border bg-background px-4 py-3 text-[15px] leading-relaxed text-foreground shadow-xs transition-all outline-none selection:bg-signal/30 selection:text-foreground placeholder:text-muted-foreground/60",
        "focus-visible:border-signal/60 focus-visible:ring-2 focus-visible:ring-signal/25",
        "aria-invalid:border-destructive/60 aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
