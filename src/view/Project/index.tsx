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
import moment from "moment"

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
  const hasImage =
    Boolean(project?.image) && !String(project.image).startsWith("/images/")
  const period = project.end_date
    ? `${moment(project.start_date).format("MMM YYYY")} — ${moment(project.end_date).format("MMM YYYY")}`
    : moment(project.start_date).format("MMM YYYY")

  return (
    <main id="main">
      <article className="mx-auto max-w-6xl px-5 pt-10 pb-24 sm:px-8">
        <Shimmer loading={isLoading}>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-signal"
          >
            <ArrowLeft className="size-3.5" />
            {t("back")}
          </Link>

          <header className="mt-8 border-t border-border pt-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              <span className="text-signal">{t("prefix")}</span>
              <span aria-hidden="true">/</span>
              <span>{project.context}</span>
              <span aria-hidden="true">/</span>
              <span>{period}</span>
            </div>

            <h1 className="mt-5 max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-balance text-foreground">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl font-display text-[clamp(1.2rem,2.2vw,1.75rem)] leading-snug text-muted-foreground italic">
              {project.tagline}
            </p>
          </header>

          <dl className="glass-panel mt-10 grid grid-cols-2 gap-x-6 gap-y-6 rounded-2xl border px-6 py-6 sm:grid-cols-4">
            <div>
              <dt className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
                {t("role")}
              </dt>
              <dd className="mt-1.5 text-sm text-foreground">{project.role}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
                {t("period")}
              </dt>
              <dd className="tabular mt-1.5 text-sm text-foreground">
                {period}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
                {t("demo")}
              </dt>
              <dd className="mt-1.5 text-sm">
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
              <dt className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
                {t("stack")}
              </dt>
              <dd className="mt-1.5 text-sm text-foreground">
                {(project.technologies ?? []).slice(0, 3).join(" · ")}
              </dd>
            </div>
          </dl>

          {hasImage ? (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[24px] border border-border bg-card/40">
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 1024px) 80rem, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="mt-14 grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
            <aside className="hidden lg:block">
              <div className="glass-panel sticky top-28 rounded-2xl border p-5">
                <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
                  {t("technologies")}
                </p>
                <div className="mt-3">
                  <TechList items={project.technologies} />
                </div>
              </div>
            </aside>

            <div className="max-w-3xl space-y-12">
              <section>
                <div className="flex items-baseline gap-3 border-t border-border pt-4">
                  <span className="font-mono text-[9px] text-signal">01</span>
                  <h2 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                    {t("problem")}
                  </h2>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
                  {project.problem}
                </p>
              </section>

              <section>
                <div className="flex items-baseline gap-3 border-t border-border pt-4">
                  <span className="font-mono text-[9px] text-signal">02</span>
                  <h2 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                    {t("built")}
                  </h2>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
                  {project.description}
                </p>
                <ul className="mt-5 space-y-3">
                  {(project.highlights ?? []).map((highlight: string) => (
                    <li
                      key={highlight}
                      className="flex gap-3 text-[14px] leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] h-px w-4 shrink-0 bg-signal"
                      />
                      <span className="min-w-0">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {project.decisions ? (
                <section>
                  <div className="flex items-baseline gap-3 border-t border-border pt-4">
                    <span className="font-mono text-[9px] text-signal">03</span>
                    <h2 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                      {t("decisions")}
                    </h2>
                  </div>
                  <ol className="mt-5 space-y-5">
                    {project.decisions.map(
                      (
                        decision: { title: string; detail: string },
                        index: number
                      ) => (
                        <li
                          key={`${decision.title}-${index}`}
                          className="grid grid-cols-[28px_1fr] gap-3"
                        >
                          <span className="tabular font-mono text-[10px] text-signal">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {decision.title}
                            </p>
                            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                              {decision.detail}
                            </p>
                          </div>
                        </li>
                      )
                    )}
                  </ol>
                </section>
              ) : null}

              <section className="lg:hidden">
                <div className="flex items-baseline gap-3 border-t border-border pt-4">
                  <span className="font-mono text-[9px] text-signal">04</span>
                  <h2 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                    {t("technologies")}
                  </h2>
                </div>
                <div className="mt-4">
                  <TechList items={project.technologies} />
                </div>
              </section>
            </div>
          </div>

          {project.related && project.related.length > 0 ? (
            <nav
              aria-label={t("moreProjects")}
              className="glass-panel mt-16 rounded-2xl border px-5 py-5"
            >
              <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
                {t("moreProjects")}
              </p>
              <div className="mt-4">
                {project.related.map((related: any) => (
                  <Link
                    key={related.slug}
                    href={`/projects/${related.slug}`}
                    className="group flex items-center justify-between gap-4 border-b border-border py-4 transition-colors last:border-b-0 hover:text-signal"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
                        {t("nextCase")}
                      </p>
                      <p className="mt-1 truncate text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-signal">
                        {related.title}
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
                  </Link>
                ))}
              </div>
            </nav>
          ) : null}
        </Shimmer>
      </article>
    </main>
  )
}
