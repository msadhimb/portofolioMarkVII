"use client"

import { Building2 } from "lucide-react"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { Badge } from "@/components/ui/badge"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Shimmer } from "shimmer-from-structure"
import { useExperiences } from "./store"
import { experiencesTemplate } from "./template"
import { useState } from "react"

export const Experience = () => {
  i18next.addResourceBundle("id", "Experience", id)
  i18next.addResourceBundle("en", "Experience", en)
  const { t, i18n } = useTranslation("Experience")

  const { getExperiencesPage } = useExperiences()

  const [pageSize] = useState(3)

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
      aria-label="Experience"
      className="scroll-mt-24 border-t border-border bg-card/40 py-20 sm:py-28"
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
          <ol className="mt-12 space-y-0">
            {data.map((e: any, i: number) => (
              <li
                key={e.slug}
                className="border-t border-border last:border-b"
              >
                <Reveal
                  delay={0.04 * i}
                  className="grid min-w-0 gap-3 py-8 sm:grid-cols-[180px_1fr] sm:gap-8"
                >
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 sm:block">
                    <p className="tabular font-mono text-xs text-muted-foreground">
                      {e.period}
                    </p>
                    <Badge
                      variant="outline"
                      className="h-auto min-w-0 max-w-full justify-start gap-1.5 rounded-full px-2.5 py-1 text-xs font-normal text-muted-foreground sm:mt-2 sm:w-full"
                    >
                      <Building2 className="size-3.5 shrink-0" />
                      <span className="min-w-0 truncate">{e.context}</span>
                    </Badge>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {e.role}{" "}
                      <span className="font-normal text-muted-foreground">
                        · {e.org}
                      </span>
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {e.points.map((pt: string) => (
                        <li
                          key={pt}
                          className="flex min-w-0 gap-3 text-[15px] leading-relaxed break-words text-muted-foreground"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[9px] size-1.5 shrink-0 rounded-full bg-signal"
                          />
                          <span className="min-w-0">{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 font-mono text-xs break-words text-muted-foreground">
                      {e.stack.join(" · ")}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          {hasNextPage && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-full border border-border/70 bg-card px-6 py-2.5 font-mono text-xs tracking-[0.16em] text-foreground uppercase transition-all duration-300 hover:border-signal/60 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFetchingNextPage ? t("loadingMore") : t("loadMore")}
              </button>
            </div>
          )}
        </Shimmer>
      </div>
    </section>
  )
}
