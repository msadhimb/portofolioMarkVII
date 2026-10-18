"use client"

import type { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type DialogModalSize = "md" | "lg" | "xl"

const SIZE_CLASSES: Record<DialogModalSize, string> = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
}

type DialogModalTone = "cyan" | "violet" | "emerald" | "amber"

const TONE_STYLES: Record<DialogModalTone, { wash: string; blobA: string; blobB: string; tile: string }> = {
  cyan: {
    wash: "from-teal-500/[0.14] via-transparent to-transparent",
    blobA: "bg-teal-400/30",
    blobB: "bg-amber-500/20",
    tile: "border-teal-400/30 bg-gradient-to-br from-teal-500/25 to-amber-500/20 text-teal-600 dark:text-teal-300",
  },
  violet: {
    wash: "from-amber-500/[0.16] via-transparent to-transparent",
    blobA: "bg-amber-500/30",
    blobB: "bg-teal-400/20",
    tile: "border-amber-400/30 bg-gradient-to-br from-amber-500/25 to-teal-500/15 text-amber-600 dark:text-amber-300",
  },
  emerald: {
    wash: "from-emerald-500/[0.14] via-transparent to-transparent",
    blobA: "bg-emerald-400/30",
    blobB: "bg-teal-400/20",
    tile: "border-emerald-400/30 bg-gradient-to-br from-emerald-500/25 to-teal-500/15 text-emerald-600 dark:text-emerald-300",
  },
  amber: {
    wash: "from-amber-500/[0.16] via-transparent to-transparent",
    blobA: "bg-amber-400/30",
    blobB: "bg-rose-400/20",
    tile: "border-amber-400/30 bg-gradient-to-br from-amber-500/25 to-rose-500/15 text-amber-600 dark:text-amber-300",
  },
}

type DialogModalProps = {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: DialogModalSize
  dismissible?: boolean
  className?: string
  icon?: ReactNode
  eyebrow?: ReactNode
  tone?: DialogModalTone
}

/**
 * Dialog generik dengan title (header) dan footer yang sticky:
 * hanya area konten (children) yang scroll, header/footer selalu terlihat.
 * Dibutuhkan `formId` yang sama pada <form id> dan tombol submit
 * `form={formId}` karena footer dirender di luar elemen form.
 */
export const DialogModal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "lg",
  dismissible = true,
  className,
  icon,
  eyebrow,
  tone = "cyan",
}: DialogModalProps) => {
  const styles = TONE_STYLES[tone]
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}
    >
      <DialogContent
        showClose={dismissible}
        className={cn(
          "max-h-[90svh] overflow-y-auto p-0",
          SIZE_CLASSES[size],
          className
        )}
      >
        <div className="sticky top-0 z-10 overflow-hidden rounded-t-2xl border-b border-border bg-card">
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-br",
              styles.wash
            )}
          />
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_90%_100%_at_0%_0%,black,transparent)]" />
          <div
            aria-hidden="true"
            className={cn(
              "animate-aurora pointer-events-none absolute -top-14 -left-10 size-44 rounded-full blur-2xl opacity-75",
              styles.blobA
            )}
          />
          <div
            aria-hidden="true"
            className={cn(
              "animate-aurora-slow pointer-events-none absolute -top-10 right-0 size-40 rounded-full blur-2xl opacity-75",
              styles.blobB
            )}
          />
          <div className="relative flex items-start gap-3.5 px-6 pt-5 pb-4">
            {icon ? (
              <span
                className={cn(
                  "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border shadow-sm [&_svg]:size-5",
                  styles.tile
                )}
              >
                {icon}
              </span>
            ) : null}
            <div className="min-w-0 flex-1">
              {eyebrow ? (
                <p className="font-mono text-[11px] tracking-[0.18em] text-signal uppercase">
                  {eyebrow}
                </p>
              ) : null}
              <DialogTitle className="pr-8 font-display text-lg font-semibold tracking-tight">
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription className="mt-1">
                  {description}
                </DialogDescription>
              ) : null}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-muted/50 via-transparent to-transparent px-6 py-5">
          {children}
        </div>

        {footer ? (
          <div className="sticky bottom-0 z-10 rounded-b-2xl border-t border-border bg-card px-6 py-4">
            {footer}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export type { DialogModalTone }
