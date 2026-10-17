"use client"

import { useState } from "react"
import { Award, ExternalLink, Languages, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DialogModal } from "@/components/DialogModal"
import {
  DetailChips,
  DetailHero,
  DetailSection,
  DetailText,
  LocaleTabs,
} from "@/view/Admin/components/DetailParts"
import {
  AWARD_CATEGORY_LABELS,
  type AdminAward,
} from "../../table/columns"

type AwardDetailDialogProps = {
  open: boolean
  award: AdminAward | null
  onClose: () => void
}

export const AwardDetailDialog = ({
  open,
  award,
  onClose,
}: AwardDetailDialogProps) => {
  const [locale, setLocale] = useState<"id" | "en">("id")
  const id = award?.translations?.id
  const en = award?.translations?.en
  const active = locale === "id" ? id : en
  const heroTitle = id?.title || en?.title || award?.slug || "Award"
  const categoryLabel = award?.category
    ? AWARD_CATEGORY_LABELS[award.category] ?? award.category
    : "—"

  return (
    <DialogModal
      open={open}
      onClose={onClose}
      icon={<Award />}
      eyebrow={award ? `award · ${award.slug}` : "award"}
      title={award ? `Detail award "${award.slug}"` : "Detail award"}
      description="Ringkasan sertifikat, penghargaan, atau honor dalam dua bahasa."
      size="xl"
      tone="amber"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[11px] text-muted-foreground">
            {(award?.skills ?? []).length} skill · {categoryLabel}
          </p>
          <Button type="button" variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      }
    >
      {!award ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-10 text-center">
          <Award className="size-6 text-muted-foreground" />
          <p className="text-sm font-medium">Data tidak ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <DetailHero
            tone="cyan"
            letter={(heroTitle[0] || "?").toUpperCase()}
            title={heroTitle}
            subtitle={
              <span className="flex flex-col gap-1">
                {id?.issuer || en?.issuer ? (
                  <span className="font-medium text-foreground/80">
                    {id?.issuer || en?.issuer}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  {award.issue_date || "—"}
                  <span className="text-border">|</span>
                  <code className="text-signal">/{award.slug}</code>
                </span>
              </span>
            }
            badges={
              <>
                <Badge variant="secondary" className="gap-1">
                  {categoryLabel}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Languages className="size-2.5" />
                  {id?.title && en?.title ? "ID + EN" : "Sebagian"}
                </Badge>
              </>
            }
          />

          <DetailSection title="Data umum" icon={<Layers />}>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <DetailText
                label="Slug"
                value={
                  <code className="font-mono text-xs text-signal">
                    {award.slug}
                  </code>
                }
              />
              <DetailText label="Kategori" value={categoryLabel} />
              <DetailText label="Tahun terbit" value={award.issue_date || "—"} />
              <DetailText
                label="Tahun kadaluarsa"
                value={award.expiry_date || "Tidak ada"}
              />
              <DetailText
                label="Credential ID"
                value={award.credential_id || "—"}
              />
              <DetailText
                label="URL kredensial"
                value={
                  award.credential_url ? (
                    <a
                      href={award.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-signal hover:underline"
                    >
                      Buka
                      <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
            </div>
            <DetailChips label="Skills" items={award.skills ?? []} />
          </DetailSection>

          <LocaleTabs active={locale} onChange={setLocale} />

          <DetailSection
            title={locale === "id" ? "Bahasa Indonesia" : "English"}
            icon={<Languages />}
            action={
              <Badge variant="secondary" className="font-mono text-[10px]">
                {locale.toUpperCase()}
              </Badge>
            }
          >
            <div className="grid gap-2.5 sm:grid-cols-2">
              <DetailText label="Judul" value={active?.title} />
              <DetailText label="Penerbit" value={active?.issuer} />
            </div>
            <DetailText label="Deskripsi" value={active?.description} />
          </DetailSection>
        </div>
      )}
    </DialogModal>
  )
}
