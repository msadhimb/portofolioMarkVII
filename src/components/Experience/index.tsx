"use client"

import { Building2 } from "lucide-react"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { Shimmer } from "shimmer-from-structure"
import { useExperiences } from "./store"
import { experiencesTemplate } from "./template"

export const Experience = () => {
  i18next.addResourceBundle("id", "Experience", id)
  i18next.addResourceBundle("en", "Experience", en)
  const { t, i18n } = useTranslation("Experience")

  const { getExperiences } = useExperiences()

  const { data: experiences, isLoading } = useQuery({
    queryKey: ["experiences", i18n.language],
    queryFn: () => getExperiences(i18n.language),
  })

  if (!isLoading && !experiences) return null

  const list = experiences ?? experiencesTemplate

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

        <Shimmer loading={isLoading}>
          <ol className="mt-12 space-y-0">
            {list.map((e: any, i: number) => (
            <Reveal key={e.slug} delay={0.04 * i}>
              <li className="grid gap-4 border-t border-border py-8 last:border-b sm:grid-cols-[180px_1fr] sm:gap-8">
                <div>
                  <p className="tabular font-mono text-xs text-muted-foreground">
                    {e.period}
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-2 h-auto w-full min-w-0 justify-start gap-1.5 rounded-full px-2.5 py-1 text-xs font-normal text-muted-foreground"
                  >
                    <Building2 className="size-3.5 shrink-0" />
                    <span className="min-w-0 truncate">{e.context}</span>
                  </Badge>
                </div>
                <div>
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
                        className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[9px] size-1.5 shrink-0 rounded-full bg-signal"
                        />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-mono text-xs text-muted-foreground">
                    {e.stack.join(" · ")}
                  </p>
                </div>
              </li>
            </Reveal>
            ))}
          </ol>
        </Shimmer>
      </div>
    </section>
  )
}
