"use client"

import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react"
import Link from "next/link"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { TechList } from "@/components/ProjectCard"

import { useProjectsDetail } from "./store"
import { useQuery } from "@tanstack/react-query"
import { Shimmer } from "shimmer-from-structure"
import { projectTemplate } from "./template"
import Image from "next/image"

type ProjectViewProps = {
  slug: string
}

export const ProjectView = ({ slug }: ProjectViewProps) => {
  i18next.addResourceBundle("id", "CaseStudy", id)
  i18next.addResourceBundle("en", "CaseStudy", en)
  const { t, i18n } = useTranslation("CaseStudy")

  const { getProjectBySlug } = useProjectsDetail()

  const { data: projectData, isLoading } = useQuery({
    queryKey: ["project", slug, i18n.language],
    queryFn: () => getProjectBySlug(slug, i18n.language),
  })

  if (!isLoading && !projectData) {
    return null
  }

  const project: any = projectData ?? projectTemplate

  return (
    <main id="main">
      <article className="mx-auto max-w-4xl px-5 sm:px-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t("back")}
        </Link>

        <Shimmer loading={isLoading}>
          <p className="mt-8 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {t("prefix")} · {project.context}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-2 font-display text-xl text-muted-foreground italic">
            {project.tagline}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5 sm:grid-cols-4">
            <div>
              <dt className="font-mono text-[11px] text-muted-foreground uppercase">
                {t("role")}
              </dt>
              <dd className="mt-1 text-sm font-medium">{project.role}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] text-muted-foreground uppercase">
                {t("period")}
              </dt>
              <dd className="mt-1 text-sm font-medium">{project.period}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] text-muted-foreground uppercase">
                {t("demo")}
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-signal"
                  >
                    {t("live")} <ArrowUpRight className="size-3.5" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Lock className="size-3.5" /> {t("internal")}
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] text-muted-foreground uppercase">
                {t("stack")}
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {project.technologies.slice(0, 3).join(" · ")}
              </dd>
            </div>
          </dl>

          <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-muted/60">
            <Image
              src={project?.image}
              alt={project?.title}
              width={1000}
              height={1000}
              className="h-100 w-full object-cover"
            />
          </div>

          <div className="prose-portfolio mt-10 space-y-10">
            <section>
              <h2 className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                <span className="text-signal">01</span> {t("problem")}
              </h2>
              <p className="mt-3 text-justify text-[16px] leading-relaxed text-foreground/90">
                {project.problem}
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                <span className="text-signal">02</span> {t("built")}
              </h2>
              <p className="mt-3 text-justify text-[16px] leading-relaxed text-foreground/90">
                {project.description}
              </p>
              <ul className="mt-5 space-y-2.5">
                {project.highlights.map((h: any) => (
                  <li
                    key={h}
                    className="flex gap-3 text-justify text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[9px] size-1.5 shrink-0 rounded-full bg-signal"
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            {project.decisions ? (
              <section>
                <h2 className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  <span className="text-signal">03</span> {t("decisions")}
                </h2>
                <ul className="mt-5 space-y-2.5">
                  {project.decisions.map((h: any) => (
                    <li
                      key={h}
                      className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[9px] size-1.5 shrink-0 rounded-full bg-signal"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="text-md text-justify font-medium text-foreground">
                          {h.title}
                        </p>
                        <p className="text-justify text-sm">detail</p>
                      </div>
                    </li>
                  ))}
                </ul>
                {/* <div className="mt-4 grid gap-4">
                {project.decisions.map((d: any) => (
                  <Card key={d.title} className="rounded-2xl p-5">
                    <h3 className="text-[15px] font-semibold">{d.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {d.detail}
                    </p>
                  </Card>
                ))}
              </div> */}
              </section>
            ) : null}

            <section>
              <h2 className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                <span className="text-signal">04</span> {t("technologies")}
              </h2>
              <div className="mt-4">
                <TechList items={project.technologies} />
              </div>
            </section>
          </div>

          {project.related && project.related.length > 0 && (
            <nav
              aria-label={t("moreProjects")}
              className="mt-14 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
            >
              {project.related?.map((p: any) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-signal/50 hover:shadow-[0_0_40px_-12px_rgba(34,211,238,0.4)]"
                >
                  <p className="font-mono text-[11px] text-muted-foreground uppercase">
                    {t("nextCase")}
                  </p>
                  <p className="mt-1 flex items-center justify-between text-lg font-semibold">
                    {p.title}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
                  </p>
                </Link>
              ))}
            </nav>
          )}
        </Shimmer>
      </article>
    </main>
  )
}
