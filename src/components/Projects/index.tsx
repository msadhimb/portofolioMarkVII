"use client"

import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { ProjectLinks, TechList } from "@/components/ProjectCard"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Shimmer } from "shimmer-from-structure"
import { useProjects } from "./store"
import Image from "next/image"

export const Projects = () => {
  i18next.addResourceBundle("id", "Projects", id)
  i18next.addResourceBundle("en", "Projects", en)
  const { t, i18n } = useTranslation("Projects")

  const { getProjectsPage } = useProjects()
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
      ) ?? []

  const rest = data.filter((p: any) => p.featured === false)

  return (
    <section
      id="projects"
      aria-label="Selected projects"
      className="scroll-mt-24"
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
            <p className="w-full text-center font-mono text-xs leading-relaxed text-muted-foreground">
              {t("note")}
            </p>
          </div>
        </Reveal>

        <Shimmer loading={isPending}>
          {featured.map((f: any) => (
            <Reveal key={f.slug} delay={0.05}>
              <article className="card-futuristic mt-12 overflow-hidden rounded-3xl border border-border/70 bg-card bg-gradient-to-b from-foreground/[0.04] to-transparent shadow-[0_24px_55px_-30px_rgba(245,158,11,0.35)] transition-all duration-300 hover:border-signal/60 hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.3)]">
                <div className="grid lg:grid-cols-2">
                  <div className="bg-muted/60">
                    {f?.image && (
                      <Image
                        src={f.image}
                        alt={f.title}
                        width={1000}
                        height={1000}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-center p-7 sm:p-10">
                    <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase">
                      <span className="rounded-full bg-signal px-2.5 py-1 text-signal-foreground">
                        {t("featured")}
                      </span>
                      <span className="text-muted-foreground">
                        {f?.context}
                      </span>
                    </p>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                      {f?.title}
                    </h3>
                    <p className="mt-1 font-display text-lg text-muted-foreground italic">
                      {f?.tagline}
                    </p>
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {f?.description}
                    </p>
                    <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5 sm:grid-cols-4">
                      {(f?.metrics ?? []).map((m: any) => (
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
                      <TechList items={f?.technologies} limit={7} />
                    </div>
                    <div className="mt-7">
                      <ProjectLinks project={f} t={t} />
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {rest.map((p: any, i: number) => (
              <Reveal key={p.slug} delay={0.05 * (i % 2)}>
                <article className="card-futuristic flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card bg-gradient-to-b from-foreground/[0.04] to-transparent shadow-[0_24px_55px_-30px_rgba(245,158,11,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-signal/60 hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.3)]">
                  <div className="h-64 border-b border-border bg-muted/60">
                    {p?.image && (
                      <Image
                        src={p.image}
                        alt={p.title}
                        width={1000}
                        height={1000}
                        className="h-full w-full object-cover"
                      />
                    )}
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
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {p.description}
                    </p>

                    <div className="mt-4">
                      <TechList items={p.technologies} limit={5} />
                    </div>
                    <div className="mt-6 border-t border-border pt-5">
                      <ProjectLinks project={p} t={t} />
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-full border border-border/70 bg-card px-6 py-2.5 font-mono text-xs tracking-[0.16em] text-foreground uppercase transition-all duration-300 hover:border-signal/60 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFetchingNextPage ? t("loading") : t("loadMore")}
              </button>
            </div>
          )}
        </Shimmer>
      </div>
    </section>
  )
}
