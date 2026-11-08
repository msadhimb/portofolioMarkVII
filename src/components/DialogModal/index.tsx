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
}: DialogModalProps) => {
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
        <div className="sticky top-0 z-10 overflow-hidden rounded-t-2xl border-b border-border bg-card/45 backdrop-blur-md">
          <div className="flex items-start gap-3.5 px-6 pt-5 pb-4">
            {icon ? (
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-signal [&_svg]:size-5">
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

        <div className="px-6 py-5">
          {children}
        </div>

        {footer ? (
          <div className="sticky bottom-0 z-10 rounded-b-2xl border-t border-border bg-card/45 px-6 py-4 backdrop-blur-md">
            {footer}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export type { DialogModalTone }
