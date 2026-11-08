"use client"

import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { Shimmer } from "shimmer-from-structure"
import id from "./i18n/id"
import en from "./i18n/en"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { SpotlightCard } from "@/components/SpotlightCard"
import { useSkills } from "./store"
import { getPrinciples } from "./helper/template/principle"
import { skillsTemplate } from "./helper/template/dataTemplate"

export const Skills = () => {
  i18next.addResourceBundle("id", "Skills", id)
  i18next.addResourceBundle("en", "Skills", en)
  const { t, i18n } = useTranslation("Skills")

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
      aria-label={t("ariaLabel")}
      className="scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="05"
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
          <SpotlightCard className="glass-panel mt-12 overflow-hidden rounded-2xl border px-5 sm:px-7 shadow-none [&>div:last-child>div]:border-b-0">
            {skillGroups.map((group: any, index: number) => (
              <Reveal key={group.slug} delay={Math.min(index * 0.04, 0.16)}>
                <div className="grid gap-4 border-b border-border py-8 md:grid-cols-[240px_1fr] md:gap-10">
                  <div>
                    <p className="tabular font-mono text-[10px] tracking-[0.2em] text-signal">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-lg font-medium tracking-tight text-foreground">
                      {group.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {group.note}
                    </p>
                  </div>

                  <ul className="flex flex-wrap content-start gap-2">
                    {group.items.map((item: string) => (
                      <li
                        key={item}
                        className="rounded-full border border-border bg-card/40 px-3 py-1.5 font-mono text-[11px] text-foreground/80 transition-colors duration-200 hover:border-signal hover:text-signal"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </SpotlightCard>
        </Shimmer>

        <Reveal>
          <SpotlightCard className="mt-14 grid gap-8 rounded-[28px] border border-white/10 bg-foreground p-7 text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-background/50 uppercase">
                {t("rangeTitle")}
              </p>
              <p className="mt-3 max-w-[24rem] font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] italic text-background">
                {t("rangeNote")}
              </p>
            </div>

            <ol className="grid content-center">
              {rangeItems.map((item, index) => (
                <li
                  key={item}
                  className="flex items-baseline justify-between gap-4 border-t border-background/15 py-3 font-mono text-[11px] tracking-[0.04em] first:border-t-0"
                >
                  <span className="text-background/80">{item}</span>
                  <span className="tabular text-background/35">
                    0{index + 1}
                  </span>
                </li>
              ))}
            </ol>
          </SpotlightCard>
        </Reveal>

        <div className="mt-14">
          <Reveal>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
              {t("principlesLabel")}
            </p>
          </Reveal>

          <div className="mt-5 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={Math.min(index * 0.04, 0.16)}>
                <SpotlightCard className="glass-panel rounded-xl border p-4 shadow-none">
                  <p className="tabular font-mono text-[10px] text-signal">
                    P.0{index + 1}
                  </p>
                  <h4 className="mt-2 text-sm font-medium text-foreground">
                    {principle.title}
                  </h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {principle.note}
                  </p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
