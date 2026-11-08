"use client"

import { useState } from "react"
import { ArrowDown, ExternalLink } from "lucide-react"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Shimmer } from "shimmer-from-structure"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { SpotlightCard } from "@/components/SpotlightCard"
import { cn } from "@/lib/utils"
import type { AwardCategory, AwardItem } from "@/data/profile"
import id from "./i18n/id"
import en from "./i18n/en"
import { useAwards } from "./store"
import { awardsTemplate } from "./template"

type CategoryFilter = "all" | AwardCategory

export const Awards = () => {
  i18next.addResourceBundle("id", "Awards", id)
  i18next.addResourceBundle("en", "Awards", en)
  const { t, i18n } = useTranslation("Awards")

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all")
  const { getAwardsPage } = useAwards()

  const {
    data: awardsData,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["awards", "feed", i18n.language, activeCategory],
    queryFn: ({ pageParam }) =>
      getAwardsPage(i18n.language, pageParam, 8, activeCategory),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination
      return pagination && pagination.page < pagination.total_pages
        ? pagination.page + 1
        : undefined
    },
    staleTime: 60_000,
  })

  const list = awardsData?.pages.flatMap((page: any) => page.data ?? []) ?? []
  const data = isPending ? awardsTemplate : list
  const isEmpty = !isPending && list.length === 0

  const categoryLabel = (category: AwardCategory) => {
    if (category === "certificate") return t("filterCertificate")
    if (category === "award") return t("filterAward")
    return t("filterHonor")
  }

  const filters: { key: CategoryFilter; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "certificate", label: t("filterCertificate") },
    { key: "award", label: t("filterAward") },
    { key: "honor", label: t("filterHonor") },
  ]

  return (
    <section
      id="awards"
      aria-label={t("ariaLabel")}
      className="scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              index="04"
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

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {filters.map((filter) => {
              const isActive = activeCategory === filter.key
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveCategory(filter.key)}
                  className={cn(
                    "cursor-pointer border-b px-0.5 py-2 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-200",
                    isActive
                      ? "border-signal text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>

        <Shimmer loading={isPending}>
          <SpotlightCard className="glass-panel mt-12 overflow-hidden rounded-2xl border p-0 shadow-none">
            <div className="hidden grid-cols-[72px_1fr_200px_140px_32px] gap-4 border-b border-border px-5 py-3 font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase md:grid">
              <span>{t("tableYear")}</span>
              <span>{t("tableTitle")}</span>
              <span>{t("tableIssuer")}</span>
              <span>{t("tableType")}</span>
              <span className="text-right">{t("tableLink")}</span>
            </div>

            {isEmpty ? (
              <p className="px-5 py-16 text-center font-mono text-xs text-muted-foreground">
                {t("empty")}
              </p>
            ) : (
              <ul>
                {data.map((item: AwardItem, index: number) => (
                  <li
                    key={item.slug}
                    className="group border-b border-border px-5 last:border-b-0"
                  >
                    <Reveal
                      delay={Math.min(index * 0.02, 0.12)}
                      className="grid gap-2 py-5 md:grid-cols-[72px_1fr_200px_140px_32px] md:items-baseline md:gap-4"
                    >
                      <p className="tabular font-mono text-[11px] text-signal">
                        {item.issueDate}
                      </p>
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium tracking-tight text-foreground transition-colors duration-200 group-hover:text-signal">
                          {item.title}
                        </p>
                        <p className="mt-1 line-clamp-1 text-[13px] text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <p className="text-[13px] text-muted-foreground">
                        {item.issuer}
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                        {categoryLabel(item.category)}
                      </p>
                      <div className="flex md:justify-end">
                        {item.credentialUrl ? (
                          <a
                            href={item.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${t("verifyCredential")}: ${item.title}`}
                            className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-card/40 text-muted-foreground transition-colors hover:border-signal hover:text-signal"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
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
