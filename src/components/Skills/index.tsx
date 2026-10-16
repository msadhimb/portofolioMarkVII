"use client"

import type { CSSProperties } from "react"
import { useTheme } from "next-themes"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { Shimmer } from "shimmer-from-structure"
import { getPrinciples } from "@/data/localized"
import id from "./i18n/id"
import en from "./i18n/en"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { SpotlightCard } from "@/components/SpotlightCard"
import { useSkills } from "./store"
import { skillsTemplate } from "./template"

const spotlightStyle = {
  padding: "1.5rem",
  borderRadius: "1rem",
  backgroundColor: "var(--card)",
  "--spotlight-card-surface": "var(--card)",
  "--spotlight-card-border":
    "color-mix(in srgb, var(--signal) 38%, transparent)",
} as CSSProperties

export const Skills = () => {
  i18next.addResourceBundle("id", "Skills", id)
  i18next.addResourceBundle("en", "Skills", en)
  const { t, i18n } = useTranslation("Skills")
  const { resolvedTheme } = useTheme()
  const { getSkills } = useSkills()
  const { data: skillGroupsData, isLoading } = useQuery({
    queryKey: ["skills", i18n.language],
    queryFn: () => getSkills(i18n.language),
  })
  const skillGroups = skillGroupsData ?? skillsTemplate
  const principles = getPrinciples(i18n.language)
  const rangeItems = t("rangeItems", { returnObjects: true }) as string[]
  return (
    <section
      id="skills"
      aria-label="Skills and approach"
      className="scroll-mt-24 border-t border-border py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
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

        <Shimmer loading={isLoading}>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((g, i) => (
              <Reveal key={g.title} delay={0.04 * i} className="h-full">
                <SpotlightCard
                  spotlightColor="var(--signal)"
                  intensity={0.5}
                  spotlightSize={220}
                  theme={resolvedTheme === "light" ? "light" : "dark"}
                  className="h-full"
                  style={spotlightStyle}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
                      {g.title}
                    </h3>
                    <span className="font-mono text-[11px] text-signal">
                      0{i + 1}
                    </span>
                  </div>
                  <p className="mt-1 font-display text-[15px] text-muted-foreground italic">
                    {g.note}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {g.items.map((s) => (
                      <li
                        key={s}
                        className="rounded-full bg-muted px-3 py-1.5 text-[13px] text-foreground"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <article className="card-futuristic flex h-full flex-col justify-between rounded-2xl bg-foreground p-6 text-background shadow-[0_24px_55px_-30px_rgba(2,132,199,0.6)]">
                <div>
                  <h3 className="font-mono text-sm font-semibold tracking-wide uppercase">
                    {t("rangeTitle")}
                  </h3>
                  <p className="mt-1 font-display text-[15px] italic opacity-70">
                    {t("rangeNote")}
                  </p>
                </div>
                <ol className="mt-5 space-y-2 font-mono text-[13px]">
                  {rangeItems.map((s) => (
                    <li
                      key={s}
                      className="flex items-center justify-between border-b border-background/15 pb-2"
                    >
                      {s}
                      <span aria-hidden="true">→</span>
                    </li>
                  ))}
                </ol>
              </article>
            </Reveal>
          </div>
        </Shimmer>

        <div className="mt-12 grid gap-6 border-t border-border pt-10 lg:grid-cols-4">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={0.04 * i}>
              <div>
                <p className="tabular font-mono text-xs text-signal">
                  P.0{i + 1}
                </p>
                <h3 className="mt-2 text-[15px] font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
