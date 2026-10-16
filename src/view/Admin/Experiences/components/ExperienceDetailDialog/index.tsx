"use client"

import { useState } from "react"
import { BriefcaseBusiness, CalendarDays, Languages, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DialogModal } from "@/components/DialogModal"
import {
  DetailChips,
  DetailHero,
  DetailList,
  DetailSection,
  DetailText,
  LocaleTabs,
} from "@/view/Admin/components/DetailParts"
import type { AdminExperience } from "../../table/columns"

type ExperienceDetailDialogProps = {
  open: boolean
  experience: AdminExperience | null
  onClose: () => void
}

export const ExperienceDetailDialog = ({
  open,
  experience,
  onClose,
}: ExperienceDetailDialogProps) => {
  const [locale, setLocale] = useState<"id" | "en">("id")
  const id = experience?.translations?.id
  const en = experience?.translations?.en
  const active = locale === "id" ? id : en
  const heroTitle =
    id?.role || en?.role || experience?.slug || "Experience"
  const heroOrg = id?.org || en?.org || ""

  return (
    <DialogModal
      open={open}
      onClose={onClose}
      icon={<BriefcaseBusiness />}
      eyebrow={experience ? `experience · ${experience.slug}` : "experience"}
      title={
        experience
          ? `Detail experience "${experience.slug}"`
          : "Detail experience"
      }
      description="Ringkasan riwayat pengalaman dalam dua bahasa."
      size="xl"
      tone="violet"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[11px] text-muted-foreground">
            {(experience?.stacks ?? []).length} stack ·{" "}
            {(id?.points ?? []).length + (en?.points ?? []).length} poin
            pencapaian
          </p>
          <Button type="button" variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      }
    >
      {!experience ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-10 text-center">
          <BriefcaseBusiness className="size-6 text-muted-foreground" />
          <p className="text-sm font-medium">Data tidak ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <DetailHero
            tone="violet"
            letter={(heroTitle[0] || "?").toUpperCase()}
            title={heroTitle}
            subtitle={
              <span className="flex flex-col gap-1">
                {heroOrg ? (
                  <span className="font-medium text-foreground/80">
                    {heroOrg}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <CalendarDays className="size-3" />
                  {id?.period || en?.period || "Periode belum diisi"}
                  <span className="text-border">|</span>
                  <code className="text-signal">/{experience.slug}</code>
                </span>
              </span>
            }
            badges={
              <>
                <Badge variant="secondary" className="tabular">
                  #{experience.sort_order ?? 0}
                </Badge>
                <Badge
                  variant="secondary"
                  className="gap-1"
                  title="Tanggal selesai kosong berarti masih berjalan"
                >
                  <span
                    className={
                      experience.end_date
                        ? "size-1.5 rounded-full bg-muted-foreground"
                        : "size-1.5 animate-pulse rounded-full bg-emerald-500"
                    }
                  />
                  {experience.end_date || "Masih berjalan"}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Languages className="size-2.5" />
                  {id?.role && en?.role ? "ID + EN" : "Sebagian"}
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
                    {experience.slug}
                  </code>
                }
              />
              <DetailText label="Urutan" value={experience.sort_order ?? 0} />
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <DetailText
                label="Tanggal mulai"
                value={experience.start_date || "—"}
              />
              <DetailText
                label="Tanggal selesai"
                value={experience.end_date || "Masih berjalan"}
              />
            </div>
            <DetailChips label="Stack" items={experience.stacks ?? []} />
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
              <DetailText label="Peran" value={active?.role} />
              <DetailText label="Organisasi" value={active?.org} />
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <DetailText label="Periode" value={active?.period} />
              <DetailText label="Konteks" value={active?.context} />
            </div>
            <DetailList label="Poin pencapaian" items={active?.points ?? []} />
          </DetailSection>
        </div>
      )}
    </DialogModal>
  )
}
