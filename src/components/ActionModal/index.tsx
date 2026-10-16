"use client"

import Link from "next/link"
import { Check, X } from "lucide-react"
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
import { useActionModal } from "./store"
import { cn } from "@/lib/utils"

/**
 * Modal feedback global ala SIMPP ActionModal: satu instance di-mount sekali,
 * dibuka dari mana saja via `openModalActions`. Caller melempar string yang
 * sudah diterjemahkan (descText/infoText/link.text).
 *
 * Beda dari SIMPP kanonik: `onConfirm` hanya jalan sekali di jalur link,
 * dan `onCancel` benar dipakai tombol kedua.
 */
export const ActionModal = () => {
  i18next.addResourceBundle("id", "ActionModal", id)
  i18next.addResourceBundle("en", "ActionModal", en)
  const { t } = useTranslation("ActionModal")

  const { modalActions, closeModalActions } = useActionModal()
  const {
    success,
    isOpen,
    descText,
    infoText,
    doubleButton,
    link,
    closeButton,
  } = modalActions

  // Jalur utama (tombol / X / Escape): selalu jalankan onConfirm sekali.
  const handlePrimary = () => {
    modalActions.onConfirm?.()
    closeModalActions()
  }

  // Tombol kedua: onCancel, fallback ke onConfirm agar perilaku lama tetap jalan.
  const handleSecondary = () => {
    ;(modalActions.onCancel ?? modalActions.onConfirm)?.()
    closeModalActions()
  }

  // Jalur link: tutup dulu, lalu onConfirm tepat sekali.
  const handleLink = () => {
    closeModalActions()
    modalActions.onConfirm?.()
  }

  const hasLink = Boolean(link?.text && link?.direct)

  return (
    <Dialog
      modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handlePrimary()
      }}
    >
      <DialogContent
        showClose={closeButton}
        closeLabel={t("close")}
        onInteractOutside={(event) => event.preventDefault()}
        className="card-futuristic max-w-md overflow-hidden rounded-3xl p-0"
      >
        <div className="flex flex-col items-center px-6 pt-9 pb-7 text-center sm:px-9">
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-full",
              success
                ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {success ? (
              <Check className="size-6" aria-hidden="true" />
            ) : (
              <X className="size-6" aria-hidden="true" />
            )}
          </span>
          <p
            className={cn(
              "mt-4 font-mono text-[11px] tracking-[0.2em] uppercase",
              success
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-destructive"
            )}
          >
            {success ? t("successLabel") : t("failedLabel")}
          </p>
          <DialogTitle className="mt-2 font-display text-[26px] leading-snug font-normal text-balance">
            {descText}
          </DialogTitle>
          {infoText ? (
            <DialogDescription
              className={cn("mt-2 max-w-sm", !success && "text-destructive/90")}
            >
              {infoText}
            </DialogDescription>
          ) : null}

          <div
            className={cn(
              "mt-6 grid w-full gap-2",
              doubleButton ? "grid-cols-2" : "grid-cols-1"
            )}
          >
            {hasLink ? (
              <Button
                asChild
                className="h-11 w-full rounded-full px-6 text-[15px]"
              >
                <Link
                  href={link!.direct}
                  replace={link!.replace}
                  onClick={handleLink}
                >
                  <span className="truncate">{link!.text}</span>
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handlePrimary}
                className="h-11 w-full rounded-full px-6 text-[15px]"
              >
                {link?.text || t("close")}
              </Button>
            )}
            {doubleButton ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleSecondary}
                className="h-11 w-full rounded-full px-6 text-[15px]"
              >
                {t("close")}
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
