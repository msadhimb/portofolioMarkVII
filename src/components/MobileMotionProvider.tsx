"use client"

import { MotionConfig } from "framer-motion"
import { useIsMobileViewport } from "@/hooks/use-media-query"

export function MobileMotionProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobileViewport()

  return (
    <MotionConfig reducedMotion={isMobile ? "always" : "user"}>
      {children}
    </MotionConfig>
  )
}
