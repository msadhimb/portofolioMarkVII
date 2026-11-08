import { ArrowUpRight, Lock } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/data/projects"

export type ProjectLinksDict = {
  viewCaseStudy: string
  liveDemo: string
  internalDemo: string
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
      {shown.map((item) => (
        <li
          key={item}
          className="rounded-full border border-border bg-card/40 px-2.5 py-1 font-mono text-[10px] tracking-[0.04em] text-muted-foreground"
        >
          {item}
        </li>
      ))}
      {limit && items.length > limit ? (
        <li className="rounded-full border border-dashed border-border bg-card/30 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
          +{items.length - limit}
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
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-foreground px-4 text-[13px] font-medium text-background shadow-[0_14px_30px_-24px_rgba(0,0,0,0.7)] transition-transform duration-200 hover:-translate-y-px"
      >
        {dict.viewCaseStudy}
        <ArrowUpRight className="size-3.5" />
      </Link>
      {project.demoUrl ? (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noreferrer"
          className="glass-chip inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-[13px] text-foreground transition-colors hover:border-signal hover:text-signal"
        >
          {dict.liveDemo}
          <ArrowUpRight className="size-3.5" />
        </a>
      ) : (
        <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed border-border bg-card/30 px-4 text-[13px] text-muted-foreground">
          <Lock className="size-3.5" />
          {dict.internalDemo}
        </span>
      )}
    </div>
  )
}
