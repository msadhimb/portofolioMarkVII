"use client"

import { useEffect, useRef } from "react"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { ProjectLinks, ProjectVisual, TechList } from "@/components/ProjectCard"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Shimmer } from "shimmer-from-structure"
import { motion } from "framer-motion"
import { ArrowDown, Check, Loader2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjects } from "./store"
import { projectsTemplate } from "./template"

const PAGE_SIZE = 2

const GridSkeletonCard = () => (
  <div
    aria-hidden="true"
    className="flex h-full animate-pulse flex-col overflow-hidden rounded-3xl border border-border/70 bg-card"
  >
    <div className="h-44 bg-muted/70" />
    <div className="flex flex-1 flex-col gap-3 p-7">
      <div className="h-3 w-2/5 rounded-full bg-muted" />
      <div className="h-6 w-3/4 rounded-lg bg-muted" />
      <div className="h-4 w-1/2 rounded-lg bg-muted/70" />
      <div className="mt-2 space-y-2">
        <div className="h-3.5 w-full rounded bg-muted/60" />
        <div className="h-3.5 w-11/12 rounded bg-muted/60" />
        <div className="h-3.5 w-4/5 rounded bg-muted/60" />
      </div>
      <div className="mt-2 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted/70" />
        <div className="h-6 w-20 rounded-full bg-muted/70" />
        <div className="h-6 w-14 rounded-full bg-muted/70" />
      </div>
    </div>
  </div>
)

export const Projects = () => {
  i18next.addResourceBundle("id", "Projects", id)
  i18next.addResourceBundle("en", "Projects", en)
  const { t, i18n } = useTranslation("Projects")

  const { getProjectsPage } = useProjects()

  const feed = useInfiniteQuery({
    queryKey: ["projects", "feed", i18n.language],
    queryFn: ({ pageParam }) =>
      getProjectsPage(i18n.language, pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination
      return pagination.page < pagination.total_pages
        ? pagination.page + 1
        : undefined
    },
    staleTime: 60_000,
  })

  const pages = feed.data?.pages ?? []
  const loaded = pages.flatMap((page) => page.items)
  const total = pages[0]?.pagination.total ?? 0
  const hasLoadedData = loaded.length > 0
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = feed
  const isLoading = feed.isLoading

  // Lazy load: halaman berikutnya diambil otomatis saat sentinel terlihat.
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasNextPage) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void fetchNextPage()
      },
      { rootMargin: "500px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  if (!isLoading && !hasLoadedData && !feed.isError) return null

  const list = hasLoadedData ? loaded : projectsTemplate
  const firstBatch = hasLoadedData ? (pages[0]?.items ?? loaded) : list
  const featured: any =
    firstBatch.find((p: any) => p.featured) ?? firstBatch[0] ?? list[0]
  const rest: any = list.filter((p: any) => p.slug !== featured?.slug) || []

  const linksDict = {
    viewCaseStudy: t("viewCaseStudy"),
    liveDemo: t("liveDemo"),
    internalDemo: t("internalDemo"),
  }

  const progress = total === 0 ? 0 : Math.min(loaded.length / total, 1)

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
        <Shimmer loading={isLoading}>
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

        {/* Rest — editorial rows, lazy-loaded per halaman */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {rest.map((p: any, i: number) => (
            <Reveal key={p.slug} delay={0.05 * (i % PAGE_SIZE)}>
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
          {isFetchingNextPage
            ? [0, 1].map((i) => <GridSkeletonCard key={`more-${i}`} />)
            : null}
          </div>
        </Shimmer>

        {/* Pagination / lazy-load console */}
        {hasLoadedData && total > 0 ? (
          <Reveal delay={0.05}>
            <div className="hud-corners relative mx-auto mt-10 max-w-xl overflow-hidden rounded-2xl border bg-card px-6 py-5 text-center">
              <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_80%_100%_at_50%_0%,black,transparent)]" />
              <div className="animate-aurora pointer-events-none absolute -top-16 left-1/2 size-56 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="relative">
                <p className="tabular font-mono text-xs text-muted-foreground">
                  {t("showing", { shown: loaded.length, total })}
                </p>
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={total}
                  aria-valuenow={loaded.length}
                  aria-label={t("showing", { shown: loaded.length, total })}
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                    initial={false}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-4 flex flex-col items-center gap-2">
                  {feed.isFetchNextPageError ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void fetchNextPage()}
                    >
                      <RotateCcw />
                      {t("retry")}
                    </Button>
                  ) : hasNextPage ? (
                    <>
                      <Button
                        type="button"
                        onClick={() => void fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="group rounded-full px-6 shadow-[0_0_30px_-8px_rgba(34,211,238,0.6)]"
                      >
                        {isFetchingNextPage ? (
                          <>
                            <Loader2 className="animate-spin" />
                            {t("loadingMore")}
                          </>
                        ) : (
                          <>
                            {t("loadMore")}
                            <ArrowDown className="transition-transform group-hover:translate-y-0.5" />
                          </>
                        )}
                      </Button>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {t("autoHint")}
                      </p>
                    </>
                  ) : (
                    <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                      <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/20">
                        <Check className="size-3" />
                      </span>
                      {t("allShown")}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Sentinel lazy load */}
            <div ref={sentinelRef} aria-hidden="true" className="h-1" />
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
