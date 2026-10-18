"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export type BlurTextProps = {
  text?: string
  delay?: number
  className?: string
  animateBy?: "words" | "letters"
  direction?: "top" | "bottom"
  threshold?: number
  rootMargin?: string
  animationFrom?: Record<string, string | number>
  animationTo?: Array<Record<string, string | number>>
  easing?: string | number[]
  onAnimationComplete?: () => void
  stepDuration?: number
}

export const BlurText = ({
  text = "",
  delay = 35,
  className = "",
  animateBy = "words",
  direction = "top",
  animationFrom,
  animationTo,
  onAnimationComplete,
}: BlurTextProps) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("")
  const [inView, setInView] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (!ref.current) return

    // Elemen di Hero selalu aktif saat mount tanpa harus menunggu scroll
    const rect = ref.current.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(ref.current as Element)
        }
      },
      { threshold: 0.05, rootMargin: "60px" }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Jika prefers-reduced-motion aktif di OS: render teks normal tanpa animasi
  if (shouldReduce) {
    return (
      <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
        {elements.map((segment, index) => (
          <span key={index} style={{ display: "inline-block" }}>
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </span>
        ))}
      </p>
    )
  }

  const wordDelay = isMobile ? Math.min(delay, 22) / 1000 : delay / 1000
  const yOffset = direction === "top" ? -10 : 10

  const defaultFrom = isMobile
    ? { opacity: 0, y: yOffset }
    : { opacity: 0.2, y: yOffset, filter: "blur(14px)" }

  const defaultTo = isMobile
    ? { opacity: 1, y: 0, filter: "blur(0px)" }
    : { opacity: 1, y: 0, filter: "blur(0px)" }

  return (
    <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
      {elements.map((segment, index) => {
        return (
          <motion.span
            key={index}
            initial={animationFrom ?? defaultFrom}
            animate={
              inView
                ? (animationTo?.[0] ?? defaultTo)
                : (animationFrom ?? defaultFrom)
            }
            transition={{
              duration: isMobile ? 0.32 : 0.55,
              delay: index * wordDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              // Pastikan filter & willChange di-reset total agar teks 100% jernih dan tajam
              const el = ref.current?.children[index] as HTMLElement | undefined
              if (el) {
                el.style.filter = "none"
                el.style.willChange = "auto"
              }
              if (index === elements.length - 1) {
                onAnimationComplete?.()
              }
            }}
            style={{
              display: "inline-block",
              willChange: inView
                ? "auto"
                : isMobile
                  ? "transform, opacity"
                  : "transform, opacity, filter",
            }}
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        )
      })}
    </p>
  )
}
