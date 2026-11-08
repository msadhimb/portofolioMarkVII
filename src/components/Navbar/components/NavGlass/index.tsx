import { cn } from "@/lib/utils"
import { GlassSurface } from "@/components/GlassSurface"

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
          backgroundOpacity={0.8}
          saturation={1.5}
          distortionScale={-50}
          shadow={false}
          className="h-full w-full"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-background/15"
          style={{ borderRadius }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -1px 0 rgba(17,20,17,0.08)",
          }}
        />
      </div>

      <div
        className={cn("glass-nav h-full w-full border lg:hidden", className)}
        style={{ borderRadius }}
      />
    </>
  )
}

export default NavGlass
