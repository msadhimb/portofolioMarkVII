"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ElementType, ReactNode } from "react"
import { cn } from "@/lib/utils"

type MaskedLinesProps = {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  as?: ElementType
}

export const MaskedLines = ({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "h1",
}: MaskedLinesProps) => {
  const reduce = useReducedMotion()

  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <span
          key={index}
          className="-mb-[0.12em] block overflow-hidden pb-[0.12em]"
        >
          {reduce ? (
            <span className={cn("block", lineClassName)}>{line}</span>
          ) : (
            <motion.span
              className={cn("block", lineClassName)}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.9,
                delay: delay + index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </Tag>
  )
}
