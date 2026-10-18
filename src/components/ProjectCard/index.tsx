import { ArrowUpRight, Lock } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/data/projects"
export type ProjectLinksDict = {
  viewCaseStudy: string
  liveDemo: string
  internalDemo: string
}
import { cn } from "@/lib/utils"

type ProjectVisualProps = {
  project: Project
}

type TechListProps = {
  items: string[]
  limit?: number
}

type ProjectLinksProps = {
  project: Project
  t: any
}

export const TechList = ({ items, limit }: TechListProps) => {
  if (!items) return null
  const shown = limit ? items.slice(0, limit) : items

  return (
    <ul aria-label="Technologies" className="flex flex-wrap gap-1.5">
      {shown.map((t) => (
        <li key={t}>
          <Badge
            variant="secondary"
            className="h-auto rounded-full px-2.5 py-1 font-mono text-[11px] font-normal"
          >
            {t}
          </Badge>
        </li>
      ))}
      {limit && items.length > limit ? (
        <li>
          <Badge
            variant="outline"
            className="h-auto rounded-full px-2.5 py-1 font-mono text-[11px] font-normal"
          >
            +{items.length - limit}
          </Badge>
        </li>
      ) : null}
    </ul>
  )
}

export const ProjectLinks = ({ project, t }: ProjectLinksProps) => {
  const dict = {
    viewCaseStudy: t("viewCaseStudy"),
    liveDemo: t("liveDemo"),
    internalDemo: t("internalDemo"),
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/projects/${project.slug}`}
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-transform hover:-translate-y-px"
      >
        {dict.viewCaseStudy}
        <ArrowUpRight className="size-4" />
      </Link>
      {project.demoUrl ? (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm text-foreground transition-colors hover:bg-muted"
        >
          {dict.liveDemo}
          <ArrowUpRight className="size-4" />
        </a>
      ) : (
        <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed border-border px-4 text-sm text-muted-foreground">
          <Lock className="size-3.5" />
          {dict.internalDemo}
        </span>
      )}
    </div>
  )
}
