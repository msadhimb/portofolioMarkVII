"use client"

import { MotionConfig } from "framer-motion"
import { useEffect, useState } from "react"

export function MobileMotionProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  )
} 