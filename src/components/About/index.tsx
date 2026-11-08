"use client"

import { useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { SpotlightCard } from "@/components/SpotlightCard"

const Word = ({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) => {
  const opacity = useTransform(progress, range, [0.2, 1])

  return (
    <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
      {children}
    </motion.span>
  )
}

export const About = () => {
  i18next.addResourceBundle("id", "About", id)
  i18next.addResourceBundle("en", "About", en)
  const { t } = useTranslation("About")

  const reduce = useReducedMotion()
  const manifestoRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: manifestoRef,
    offset: ["start 0.9", "end 0.5"],
  })

  const paragraphs = t("paragraphs", { returnObjects: true }) as string[]
  const values = t("values", { returnObjects: true }) as {
    title: string
    body: string
  }[]
  const highlight = t("highlight")
  const [beforeHighlight, afterHighlight = ""] =
    paragraphs[1]?.split(highlight) ?? []
  const words = t("principle").split(" ").filter(Boolean)

  const facts = [
    { label: t("factLocation"), value: t("factLocationValue") },
    { label: t("factFocus"), value: t("factFocusValue") },
    { label: t("factStack"), value: t("factStackValue") },
    { label: t("factStatus"), value: t("factStatusValue") },
  ]

  return (
    <section
      id="about"
      aria-label={t("ariaLabel")}
      className="scroll-mt-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
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
          >
            {t("description")}
          </SectionHeading>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <Reveal delay={0.05}>
            <div className="lg:sticky lg:top-28">
              <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight tracking-tight text-foreground italic">
                {t("greeting")}
              </p>
              <SpotlightCard
                as="dl"
                className="glass-panel mt-8 space-y-3 rounded-2xl border px-5 py-5 shadow-none"
              >
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid grid-cols-[88px_1fr] gap-3 text-[13px]"
                  >
                    <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                      {fact.label}
                    </dt>
                    <dd className="text-foreground">{fact.value}</dd>
                  </div>
                ))}
              </SpotlightCard>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-5 text-[15px] leading-relaxed text-muted-foreground md:text-base">
              <p>{paragraphs[0]}</p>
              <p>
                {beforeHighlight}
                <strong className="font-medium text-foreground">
                  {highlight}
                </strong>
                {afterHighlight}
              </p>
              <p>{paragraphs[2]}</p>
            </div>

            <div className="mt-12">
              <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                {t("valuesLabel")}
              </p>
              <SpotlightCard
                as="ul"
                className="glass-panel mt-4 list-none rounded-2xl border px-5 shadow-none [&>li:last-child]:border-b-0"
              >
                {values.map((value, index) => (
                  <li
                    key={value.title}
                    className="grid grid-cols-[32px_1fr] gap-4 border-t border-border py-4 first:border-t-0"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 font-mono text-[10px] tracking-widest text-signal"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[15px] font-medium tracking-tight text-foreground">
                        {value.title}
                      </h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                        {value.body}
                      </p>
                    </div>
                  </li>
                ))}
              </SpotlightCard>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 border-t border-border pt-8">
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
              {t("manifestoLabel")}
            </p>
            <p
              ref={manifestoRef}
              className="mt-4 max-w-4xl font-display text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.22] tracking-[-0.01em] text-foreground"
            >
              {reduce
                ? t("principle")
                : words.map((word, index) => (
                    <Word
                      key={`${word}-${index}`}
                      progress={scrollYProgress}
                      range={[index / words.length, (index + 1) / words.length]}
                    >
                      {word}
                    </Word>
                  ))}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
