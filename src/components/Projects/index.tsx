"use client"

import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { ProjectLinks, ProjectVisual, TechList } from "@/components/ProjectCard"
import { useQuery } from "@tanstack/react-query"
import { useProjects } from "./store"

export const Projects = () => {
  i18next.addResourceBundle("id", "Projects", id)
  i18next.addResourceBundle("en", "Projects", en)
  const { t, i18n } = useTranslation("Projects")

  const { getProjects } = useProjects()

  const { data: projects } = useQuery({
    queryKey: ["projects", i18n.language],
    queryFn: () => getProjects(i18n.language),
  })

  const linksDict = {
    viewCaseStudy: t("viewCaseStudy"),
    liveDemo: t("liveDemo"),
    internalDemo: t("internalDemo"),
  }
  const featured: any = projects?.find((p: any) => p.featured) ?? projects?.[0]
  const rest: any =
    projects?.filter((p: any) => p.slug !== featured?.slug) || []

  if (!featured) return null

  return (
    <section
      id="projects"
      aria-label="Selected projects"
      className="scroll-mt-24 border-t border-border py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              index="02"
              eyebrow={t("eyebrow")}
              title={
                <>
                  {t("titleA")}{" "}
                  <span className="font-display font-normal text-signal italic">
                    {t("titleAccent")}
                  </span>
                </>
              }
            >
              {t("description")}
            </SectionHeading>
            <p className="max-w-xs font-mono text-xs leading-relaxed text-muted-foreground">
              {t("note")}
            </p>
          </div>
        </Reveal>

        {/* Featured — dominant */}
        <Reveal delay={0.05}>
          <article className="card-futuristic mt-12 overflow-hidden rounded-3xl border border-border/70 bg-card bg-gradient-to-b from-foreground/[0.04] to-transparent shadow-[0_24px_55px_-30px_rgba(2,132,199,0.5)] transition-all duration-300 hover:border-signal/60 hover:shadow-[0_0_60px_-15px_rgba(34,211,238,0.45)]">
            <div className="grid lg:grid-cols-2">
              <div className="bg-muted/60">
                <ProjectVisual project={featured} />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase">
                  <span className="rounded-full bg-signal px-2.5 py-1 text-signal-foreground">
                    {t("featured")}
                  </span>
                  <span className="text-muted-foreground">
                    {featured.context}
                  </span>
                </p>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {featured.title}
                </h3>
                <p className="mt-1 font-display text-lg text-muted-foreground italic">
                  {featured.tagline}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {featured.description}
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5 sm:grid-cols-4">
                  {(featured.metrics ?? []).map((m: any) => (
                    <div key={m.label}>
                      <dt className="font-mono text-[11px] text-muted-foreground uppercase">
                        {m.label}
                      </dt>
                      <dd className="tabular mt-1 font-mono text-sm font-semibold text-foreground">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5">
                  <TechList items={featured.technologies} limit={7} />
                </div>
                <div className="mt-7">
                  <ProjectLinks project={featured} dict={linksDict} />
                </div>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Rest — editorial rows, not repetitive cards */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {rest.map((p: any, i: number) => (
            <Reveal key={p.slug} delay={0.05 * i}>
              <article className="card-futuristic flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card bg-gradient-to-b from-foreground/[0.04] to-transparent shadow-[0_24px_55px_-30px_rgba(2,132,199,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-signal/60 hover:shadow-[0_0_60px_-15px_rgba(34,211,238,0.45)]">
                <div className="border-b border-border bg-muted/60">
                  <ProjectVisual project={p} />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                    {p.context} · {p.period}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-1 font-display text-muted-foreground italic">
                    {p.tagline}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="mt-4 rounded-xl bg-muted/70 p-4">
                    <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                      {t("problem")}
                    </p>
                    <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-foreground/90">
                      {p.problem}
                    </p>
                  </div>
                  <ul className="mt-4 space-y-1.5">
                    {p.highlights.slice(0, 3).map((h: any) => (
                      <li
                        key={h}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[7px] size-1.5 shrink-0 rounded-full bg-signal"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <TechList items={p.technologies} limit={5} />
                  </div>
                  <div className="mt-6 border-t border-border pt-5">
                    <ProjectLinks project={p} dict={linksDict} />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
