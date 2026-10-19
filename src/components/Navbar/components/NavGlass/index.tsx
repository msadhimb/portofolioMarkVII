import { cn } from "@/lib/utils"
import { GlassSurface } from "@/components/GlassSurface"
import { useEffect, useState } from "react"

type NavGlassProps = {
  borderRadius: number
  className?: string
}

const NavGlass = ({ borderRadius, className }: NavGlassProps) => {
  return (
    <>
      <div
        className={cn(
          "relative hidden h-full w-full overflow-hidden lg:block",
          className
        )}
        style={{ borderRadius }}
      >
        <GlassSurface
          borderRadius={borderRadius}
          width="100%"
          height="100%"
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          backgroundOpacity={0.5}
          saturation={1.4}
          shadow={false}
          className="h-full w-full"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-background/15"
          style={{ borderRadius }}
        />
      </div>

      <div
        style={{
          borderRadius,
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          backdropFilter: "blur(24px) saturate(160%)",
          backgroundColor:
            "color-mix(in srgb, var(--background) 75%, transparent)",
        }}
        className={cn(
          "h-full w-full border border-foreground/10 shadow-lg lg:hidden",
          className
        )}
      />
    </>
  )
}

export default NavGlass
