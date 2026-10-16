"use client"

import { useState } from "react"
import { LoaderCircle, TriangleAlert } from "lucide-react"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useConfirmModal } from "./store"
import { cn } from "@/lib/utils"

/**
 * Modal konfirmasi global ala SIMPP ConfirmModal: tanya yakin sebelum aksi
 * (hapus, kirim, publish). Alur baku: Confirm → mutation → ActionModal.
 * Mount sekali, dibuka via `openConfirmModal`.
 */
export const ConfirmModal = () => {
  i18next.addResourceBundle("id", "ConfirmModal", id)
  i18next.addResourceBundle("en", "ConfirmModal", en)
  const { t } = useTranslation("ConfirmModal")

  const { confirmActions, closeConfirmModal } = useConfirmModal()
  const {
    isOpen,
    title,
    description,
    confirmLabel,
    cancelLabel,
    destructive,
    isLoading,
  } = confirmActions
  const [busy, setBusy] = useState(false)
  const locked = Boolean(isLoading) || busy

  const handleCancel = () => {
    if (locked) return
    confirmActions.onCancel?.()
    closeConfirmModal()
  }

  const handleConfirm = async () => {
    if (locked) return
    try {
      setBusy(true)
      await confirmActions.onConfirm()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog
      modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel()
      }}
    >
      <DialogContent
        showClose={!locked}
        closeLabel={t("cancel")}
        onInteractOutside={(event) => event.preventDefault()}
        className="card-futuristic max-w-md overflow-hidden rounded-3xl p-0"
      >
        <div className="flex flex-col items-center px-6 pt-9 pb-7 text-center sm:px-9">
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-full",
              destructive
                ? "bg-destructive/10 text-destructive"
                : "bg-signal/15 text-signal"
            )}
          >
            <TriangleAlert className="size-6" aria-hidden="true" />
          </span>
          <DialogTitle className="mt-4 font-display text-[26px] leading-snug font-normal text-balance">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="mt-2 max-w-sm">
              {description}
            </DialogDescription>
          ) : null}

          <div className="mt-6 grid w-full grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={locked}
              onClick={handleCancel}
              className="h-11 w-full rounded-full px-6 text-[15px]"
            >
              {cancelLabel || t("cancel")}
            </Button>
            <Button
              type="button"
              variant={destructive ? "destructive" : undefined}
              disabled={locked}
              onClick={handleConfirm}
              className={cn(
                "h-11 w-full rounded-full px-6 text-[15px]",
                !destructive && "bg-foreground text-background hover:opacity-90"
              )}
            >
              {locked ? (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : null}
              {confirmLabel || t("confirm")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
