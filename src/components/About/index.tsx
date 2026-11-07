"use client"

import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"

export const About = () => {
  i18next.addResourceBundle("id", "About", id)
  i18next.addResourceBundle("en", "About", en)
  const { t } = useTranslation("About")

  const paragraphs = t("paragraphs", { returnObjects: true }) as string[]
  const values = t("values", { returnObjects: true }) as {
    title: string
    body: string
  }[]
  const highlight = t("highlight")
  const [beforeHighlight, afterHighlight] = paragraphs[1].split(highlight)

  return (
    <section id="about" aria-label="About" className="scroll-mt-48">
      <div className="mx-auto max-w-6xl space-y-6 px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="01"
            eyebrow={t("eyebrow")}
            title={
              <>
                {t("titleA")}{" "}
                <span className="font-display font-normal text-signal italic">
                  {t("titleAccent")}
                </span>
              </>
            }
            className="w-full"
          >
            {t("description")}
          </SectionHeading>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <Reveal delay={0.05}>
            <div className="space-y-5 text-[15px] leading-relaxed text-muted-foreground">
              <p className="text-justify">
                <strong className="font-medium text-foreground">
                  {t("greeting")}
                </strong>{" "}
                {paragraphs[0]}
              </p>
              <p className="text-justify">
                {beforeHighlight}
                <strong className="font-medium text-foreground">
                  {highlight}
                </strong>
                {afterHighlight}
              </p>
              <p className="text-justify">{paragraphs[2]}</p>
            </div>
          </Reveal>

          <ul className="list-none">
            {values.map((v, i) => (
              <li
                key={v.title}
                className="border-t border-border py-4 first:border-t-0 first:pt-0"
              >
                <Reveal delay={0.06 * i} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 font-mono text-[11px] tracking-widest text-signal"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                      {v.title}
                    </h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                      {v.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-2 max-w-3xl border-l-2 border-signal pl-5 font-display text-[clamp(1.15rem,2.4vw,1.7rem)] italic leading-snug text-foreground">
            {t("principle")}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
