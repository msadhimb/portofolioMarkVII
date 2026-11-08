"use client"

import { useEffect, useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Shimmer } from "shimmer-from-structure"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { ProjectLinks, TechList } from "@/components/ProjectCard"
import { SpotlightCard } from "@/components/SpotlightCard"
import { useProjects } from "./store"
import id from "./i18n/id"
import en from "./i18n/en"
import { templateProjects, templateRestProject } from "./helper/template"

const StackCard = ({
  project,
  index,
  t,
}: {
  project: any
  index: number
  t: any
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97])
  const hasImage =
    Boolean(project?.image) && !String(project.image).startsWith("/images/")

  return (
    <div
      ref={ref}
      className="lg:sticky"
      style={{ top: 96 + index * 16, zIndex: index + 1 }}
    >
      <motion.div
        style={reduce ? undefined : { scale }}
        className="group mb-6"
      >
        <SpotlightCard
          as="article"
          className="glass-panel overflow-hidden rounded-[28px] border p-0 shadow-none"
        >
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-64 overflow-hidden lg:min-h-[68vh]">
            {hasImage ? (
              <>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="glass-chip absolute top-4 left-4 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-foreground uppercase">
                  {t("featured")}
                </span>
              </>
            ) : (
              <div className="flex h-full min-h-64 flex-col justify-between bg-foreground p-6 text-background lg:min-h-[68vh] lg:p-8">
                <div className="flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.2em] text-background/60 uppercase">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project?.period}</span>
                </div>
                <p className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.02em] italic">
                  {project?.title}
                </p>
                <div className="flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.18em] text-background/60 uppercase">
                  <span>{project?.context}</span>
                  <span>{t("featured")}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              {project?.context} · {project?.period}
            </p>
            <h3 className="mt-4 text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.02] font-medium tracking-[-0.03em] text-foreground">
              {project?.title}
            </h3>
            <p className="mt-2 font-display text-lg text-muted-foreground italic">
              {project?.tagline}
            </p>
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {project?.description}
            </p>

            {project?.metrics?.length ? (
              <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5">
                {project.metrics.map(
                  (metric: { label: string; value: string }, i: number) => (
                    <div key={`${metric.label}-${i}`}>
                      <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                        {metric.label}
                      </dt>
                      <dd className="tabular mt-1 font-mono text-sm font-medium text-foreground">
                        {metric.value}
                      </dd>
                    </div>
                  )
                )}
              </dl>
            ) : null}

            <div className="mt-5">
              <TechList items={project?.technologies} limit={7} />
            </div>
            <div className="mt-7">
              <ProjectLinks project={project} t={t} />
            </div>
          </div>
        </div>
        </SpotlightCard>
      </motion.div>
    </div>
  )
}

export const Projects = () => {
  i18next.addResourceBundle("id", "Projects", id)
  i18next.addResourceBundle("en", "Projects", en)
  const { t, i18n } = useTranslation("Projects")

  const { getProjectsPage, setProjects } = useProjects()
  const pageSize = 2

  const {
    data: projectsData,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["projects", "feed", i18n.language],
    queryFn: ({ pageParam }) =>
      getProjectsPage(i18n.language, pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const { page, per_page, total } = lastPage.pagination

      if (!lastPage.data || lastPage.data.length === 0) return undefined

      const nonFeaturedTotal = total - (lastPage.featured?.length ?? 0)

      return page * (per_page ?? pageSize) < nonFeaturedTotal
        ? page + 1
        : undefined
    },
    staleTime: 60_000,
  })

  const data: any[] =
    projectsData?.pages.flatMap((page: any) => page.data) ?? []
  const featured: any[] =
    projectsData?.pages
      ?.flatMap((page: any) => page.featured ?? [])
      .filter(
        (f: any, index: number, arr: any[]) =>
          arr.findIndex((x) => x.slug === f.slug) === index
      ) ?? templateProjects
  const rest: any[] =
    data.filter((p: any) => p.featured === false) ?? templateRestProject

  const isEmpty = !isPending && featured.length === 0 && rest.length === 0

  useEffect(() => {
    if (!isPending && !isEmpty) {
      setProjects(featured.concat(rest))
    }
  }, [isPending, isEmpty])

  return (
    <section id="projects" aria-label={t("ariaLabel")} className="scroll-mt-24">
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
            <p className="max-w-[22rem] font-mono text-[10px] leading-relaxed tracking-[0.12em] text-muted-foreground uppercase">
              {t("note")}
            </p>
          </div>
        </Reveal>

        <Shimmer loading={isPending && !isEmpty}>
          <div className="mt-12">
            {featured.map((project, index) => (
              <StackCard
                key={project.slug}
                project={project}
                index={index}
                t={t}
              />
            ))}
          </div>

          {rest.length > 0 ? (
            <div className="mt-14">
              <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                {t("restLabel")}
              </p>
              <div className="mt-4 border-t border-border">
                {rest.map((project, index) => (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="group flex items-start gap-4 border-b border-border py-5 transition-colors hover:bg-muted/30"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1 w-8 shrink-0 font-mono text-[10px] tracking-widest text-signal"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-signal">
                        {project.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {project.tagline}
                      </p>
                    </div>
                    <div className="hidden w-64 shrink-0 text-right md:block">
                      <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                        {project.context} · {project.period}
                      </p>
                      <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground/70">
                        {(project.technologies ?? []).slice(0, 3).join(" · ")}
                      </p>
                    </div>
                    <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal" />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {isEmpty ? (
            <p className="border-t border-border py-16 text-center font-mono text-xs text-muted-foreground">
              {t("empty")}
            </p>
          ) : null}

          {hasNextPage ? (
            <div className="mt-10 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="glass-chip inline-flex h-11 items-center gap-2 rounded-full border px-6 font-mono text-[10px] tracking-[0.18em] text-foreground uppercase transition-colors duration-200 hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFetchingNextPage ? t("loadingMore") : t("loadMore")}
                <ArrowDown className="size-3.5" />
              </button>
            </div>
          ) : null}
        </Shimmer>
      </div>
    </section>
  )
}
