"use client"

import { useState } from "react"
import { Languages, Layers, Sparkles } from "lucide-react"
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
import type { AdminSkillGroup } from "../../table/columns"

type SkillGroupDetailDialogProps = {
  open: boolean
  group: AdminSkillGroup | null
  onClose: () => void
}

export const SkillGroupDetailDialog = ({
  open,
  group,
  onClose,
}: SkillGroupDetailDialogProps) => {
  const [locale, setLocale] = useState<"id" | "en">("id")
  const id = group?.translations?.id
  const en = group?.translations?.en
  const active = locale === "id" ? id : en
  const heroTitle = id?.title || en?.title || group?.slug || "Skill group"

  return (
    <DialogModal
      open={open}
      onClose={onClose}
      icon={<Sparkles />}
      eyebrow={group ? `skill group · ${group.slug}` : "skill group"}
      title={
        group ? `Detail skill group "${group.slug}"` : "Detail skill group"
      }
      description="Ringkasan grup skill dalam dua bahasa."
      size="lg"
      tone="emerald"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[11px] text-muted-foreground">
            {(group?.items ?? []).length} skill items
          </p>
          <Button type="button" variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      }
    >
      {!group ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-10 text-center">
          <Sparkles className="size-6 text-muted-foreground" />
          <p className="text-sm font-medium">Data tidak ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <DetailHero
            tone="emerald"
            letter={(heroTitle[0] || "?").toUpperCase()}
            title={heroTitle}
            subtitle={
              <span className="flex flex-col gap-1">
                <span className="line-clamp-2">
                  {active?.note || "Belum ada catatan."}
                </span>
                <code className="font-mono text-[11px] text-signal">
                  /{group.slug}
                </code>
              </span>
            }
            badges={
              <>
                <Badge variant="secondary" className="tabular">
                  #{group.sort_order ?? 0}
                </Badge>
                <Badge variant="secondary" className="tabular gap-1">
                  <Layers className="size-2.5" />
                  {(group.items ?? []).length} items
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
                    {group.slug}
                  </code>
                }
              />
              <DetailText label="Urutan" value={group.sort_order ?? 0} />
            </div>
            <DetailChips label="Items" items={group.items ?? []} />
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
            <DetailText label="Judul" value={active?.title} />
            <DetailText label="Catatan" value={active?.note} />
          </DetailSection>
        </div>
      )}
    </DialogModal>
  )
}
