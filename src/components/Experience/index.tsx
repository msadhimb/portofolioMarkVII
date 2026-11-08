"use client"

import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { SpotlightCard } from "@/components/SpotlightCard"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Shimmer } from "shimmer-from-structure"
import { useExperiences } from "./store"
import { experiencesTemplate } from "./helper/template"
import { ArrowDown } from "lucide-react"

export const Experience = () => {
  i18next.addResourceBundle("id", "Experience", id)
  i18next.addResourceBundle("en", "Experience", en)
  const { t, i18n } = useTranslation("Experience")

  const { getExperiencesPage } = useExperiences()

  const pageSize = 3

  const {
    data: experiencesData,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["experiences", "feed", i18n.language],
    queryFn: ({ pageParam }) =>
      getExperiencesPage(i18n.language, pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination
      return pagination && pagination.page < pagination.total_pages
        ? pagination.page + 1
        : undefined
    },
    staleTime: 60_000,
  })

  const list =
    experiencesData?.pages.flatMap((page: any) => page.data ?? []) ?? []

  if (!isPending && list.length === 0) return null

  const data = isPending ? experiencesTemplate : list

  return (
    <section
      id="experience"
      aria-label={t("ariaLabel")}
      className="scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="03"
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
        </Reveal>

        <Shimmer loading={isPending}>
          <SpotlightCard
            as="ol"
            className="glass-panel mt-12 overflow-hidden rounded-2xl border px-5 sm:px-7 shadow-none"
          >
            {data.map((experience: any, index: number) => (
              <li
                key={experience.slug}
                className="border-b border-border last:border-b-0"
              >
                <Reveal
                  delay={0.04 * index}
                  className="grid gap-4 py-8 lg:grid-cols-[220px_1fr] lg:gap-10"
                >
                  <div className="flex flex-col gap-2">
                    <p className="tabular font-mono text-[11px] tracking-[0.14em] text-signal uppercase">
                      {experience.period}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {experience.context}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[clamp(1.35rem,2.5vw,2rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
                      {experience.role}
                      <span className="mt-1.5 block text-sm font-normal tracking-normal text-muted-foreground">
                        {experience.org}
                      </span>
                    </h3>

                    <ul className="mt-5 space-y-2.5">
                      {experience.points.map((point: string) => (
                        <li
                          key={point}
                          className="flex min-w-0 gap-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.6em] h-px w-4 shrink-0 bg-signal"
                          />
                          <span className="min-w-0">{point}</span>
                        </li>
                      ))}
                    </ul>

                    {experience.stack?.length ? (
                      <div className="mt-5">
                        <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                          {t("stackLabel")}
                        </p>
                        <p className="mt-1.5 font-mono text-[11px] leading-relaxed break-words text-muted-foreground">
                          {experience.stack.join(" · ")}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </Reveal>
              </li>
            ))}
          </SpotlightCard>

          {hasNextPage ? (
            <div className="mt-10 flex justify-center">
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
