"use client"

import { useState } from "react"
import {
  ArrowUpRight,
  Database,
  FolderKanban,
  GitBranch,
  Globe,
  Languages,
  Star,
} from "lucide-react"
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
  MetricGrid,
} from "@/view/Admin/components/DetailParts"
import type { AdminProject } from "../../table/columns"
import { formatPeriodRange } from "../../form"

type ProjectDetailDialogProps = {
  open: boolean
  project: AdminProject | null
  onClose: () => void
}

const filledCount = (translation?: Record<string, unknown>) =>
  translation
    ? Object.values(translation).filter((value) =>
        Array.isArray(value) ? value.length > 0 : Boolean(value)
      ).length
    : 0

export const ProjectDetailDialog = ({
  open,
  project,
  onClose,
}: ProjectDetailDialogProps) => {
  const [locale, setLocale] = useState<"id" | "en">("id")
  const id = project?.translations?.id
  const en = project?.translations?.en
  const active = locale === "id" ? id : en
  const heroTitle = project?.title || project?.slug || "Project"

  return (
    <DialogModal
      open={open}
      onClose={onClose}
      icon={<FolderKanban />}
      eyebrow={project ? `project · ${project.slug}` : "project"}
      title={project ? `Detail project "${project.slug}"` : "Detail project"}
      description="Ringkasan konten project dalam dua bahasa."
      size="xl"
      tone="cyan"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[11px] text-muted-foreground">
            {(project?.technologies ?? []).length} teknologi ·{" "}
            {(id?.highlights ?? []).length + (en?.highlights ?? []).length}{" "}
            highlights
          </p>
          <Button type="button" variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      }
    >
      {!project ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-10 text-center">
          <FolderKanban className="size-6 text-muted-foreground" />
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
                <span className="line-clamp-2">
                  {project.tagline || "Belum ada tagline."}
                </span>
                <code className="font-mono text-[11px] text-signal">
                  /{project.slug}
                </code>
              </span>
            }
            badges={
              <>
                {project.featured ? (
                  <Badge className="gap-1">
                    <Star className="size-2.5" /> Unggulan
                  </Badge>
                ) : (
                  <Badge variant="secondary">Reguler</Badge>
                )}
                <Badge variant="secondary" className="gap-1">
                  <Languages className="size-2.5" />
                  {id?.description && en?.description ? "ID + EN" : "Sebagian"}
                </Badge>
              </>
            }
            actions={
              <>
                {project.demo_url ? (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Globe /> Demo <ArrowUpRight />
                    </a>
                  </Button>
                ) : null}
                {project.repository_url ? (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <GitBranch /> Repo <ArrowUpRight />
                    </a>
                  </Button>
                ) : null}
              </>
            }
          />

          <DetailSection title="Data umum" icon={<Database />}>
            <div className="grid gap-2.5 sm:grid-cols-3">
              <DetailText label="Judul" value={project.title || "—"} />
              <DetailText
                label="Slug"
                value={
                  <code className="font-mono text-xs text-signal">
                    {project.slug}
                  </code>
                }
              />
              <DetailText
                label="Unggulan"
                value={
                  project.featured ? (
                    <Badge className="gap-1">
                      <Star className="size-2.5" /> Unggulan
                    </Badge>
                  ) : (
                    "Tidak"
                  )
                }
              />
            </div>
            {project.image ? (
              <div className="overflow-hidden rounded-lg border border-border/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={`Cover ${project.slug}`}
                  className="h-40 w-full bg-muted object-cover"
                  loading="lazy"
                />
                <p className="truncate border-t border-border/60 bg-muted/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
                  {project.image}
                </p>
              </div>
            ) : (
              <DetailText label="Gambar" value="—" />
            )}
            <div className="grid gap-2.5 sm:grid-cols-2">
              <DetailText label="Tagline" value={project.tagline || "—"} />
              <DetailText label="Peran" value={project.role || "—"} />
              <DetailText
                label="Periode"
                value={
                  formatPeriodRange(project.start_date, project.end_date) || "—"
                }
              />
              <DetailText label="Konteks" value={project.context || "—"} />
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <DetailText
                label="URL demo"
                value={
                  project.demo_url ? (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 break-all text-signal underline-offset-4 hover:underline"
                    >
                      {project.demo_url} <ArrowUpRight className="size-3" />
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              <DetailText
                label="URL repositori"
                value={
                  project.repository_url ? (
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 break-all text-signal underline-offset-4 hover:underline"
                    >
                      {project.repository_url} <ArrowUpRight className="size-3" />
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
            </div>
            <DetailChips label="Teknologi" items={project.technologies ?? []} />
          </DetailSection>

          <LocaleTabs
            active={locale}
            onChange={setLocale}
            idCount={filledCount(id)}
            enCount={filledCount(en)}
          />

          <DetailSection
            title={locale === "id" ? "Bahasa Indonesia" : "English"}
            icon={<Languages />}
            action={
              <Badge variant="secondary" className="font-mono text-[10px]">
                {locale.toUpperCase()}
              </Badge>
            }
          >
            <DetailText label="Deskripsi" value={active?.description} />
            <DetailText label="Masalah" value={active?.problem} />
            <DetailList label="Highlights" items={active?.highlights ?? []} />
            <MetricGrid items={active?.metrics ?? []} />
            <DetailList
              label="Keputusan"
              items={(active?.decisions ?? []).map((decision) =>
                decision.detail
                  ? `${decision.title} — ${decision.detail}`
                  : decision.title
              )}
            />
          </DetailSection>
        </div>
      )}
    </DialogModal>
  )
}
