"use client"

import { useState } from "react"
import { Award, ExternalLink, Medal, Sparkles, Trophy } from "lucide-react"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { Shimmer } from "shimmer-from-structure"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  const { getAwards } = useAwards()

  const { data: awardsData, isLoading } = useQuery({
    queryKey: ["awards", i18n.language],
    queryFn: () => getAwards(i18n.language),
  })

  const list = awardsData ?? awardsTemplate

  const filteredList =
    activeCategory === "all"
      ? list
      : list.filter((item) => item.category === activeCategory)

  const getCategoryConfig = (category: AwardCategory) => {
    switch (category) {
      case "certificate":
        return {
          label: t("filterCertificate"),
          icon: Award,
          badgeClass:
            "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
          iconClass: "text-cyan-500",
        }
      case "award":
        return {
          label: t("filterAward"),
          icon: Trophy,
          badgeClass:
            "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
          iconClass: "text-amber-500",
        }
      case "honor":
        return {
          label: t("filterHonor"),
          icon: Medal,
          badgeClass:
            "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400",
          iconClass: "text-violet-500",
        }
      default:
        return {
          label: category,
          icon: Sparkles,
          badgeClass: "border-border bg-muted text-muted-foreground",
          iconClass: "text-muted-foreground",
        }
    }
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
      aria-label="Certificates, Awards and Honors"
      className="scroll-mt-24 border-t border-border bg-card/25 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
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

            {/* Filter Pill Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((f) => {
                const isActive = activeCategory === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setActiveCategory(f.key)}
                    className={cn(
                      "cursor-pointer rounded-full px-3.5 py-1.5 font-mono text-xs transition-all duration-200",
                      isActive
                        ? "border border-signal/40 bg-signal/15 text-signal shadow-sm"
                        : "border border-border/70 bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Grid List */}
        <Shimmer loading={isLoading}>
          {filteredList.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
              {t("empty")}
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredList.map((item: AwardItem, i: number) => {
                const config = getCategoryConfig(item.category)
                const IconComponent = config.icon

                return (
                  <Reveal key={item.slug} delay={0.04 * i} className="h-full">
                    <article className="card-futuristic group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/80 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-signal/40 hover:shadow-[0_16px_36px_-18px_rgba(2,132,199,0.25)]">
                      <div>
                        {/* Top Meta: Category Badge + Year */}
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-normal uppercase",
                              config.badgeClass
                            )}
                          >
                            <IconComponent className={cn("size-3.5", config.iconClass)} />
                            <span>{config.label}</span>
                          </Badge>
                          <span className="tabular font-mono text-xs text-muted-foreground">
                            {item.issueDate}
                          </span>
                        </div>

                        {/* Title & Issuer */}
                        <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-signal">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                          {item.issuer}
                        </p>

                        {/* Description */}
                        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>

                      {/* Footer: Credential ID / Link + Skills */}
                      <div className="mt-6 border-t border-border/60 pt-4">
                        {item.credentialId ? (
                          <p className="font-mono text-[11px] text-muted-foreground/80">
                            ID: <span className="text-foreground">{item.credentialId}</span>
                          </p>
                        ) : null}

                        {item.skills && item.skills.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-md bg-muted/80 px-2 py-0.5 font-mono text-[11px] text-foreground"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {item.credentialUrl ? (
                          <div className="mt-4 pt-1">
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full justify-center gap-1.5 rounded-xl border-border bg-background/50 font-mono text-xs transition-colors hover:border-signal/50 hover:bg-signal/10 hover:text-signal"
                            >
                              <a
                                href={item.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span>{t("verifyCredential")}</span>
                                <ExternalLink className="size-3" />
                              </a>
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          )}
        </Shimmer>
      </div>
    </section>
  )
}
