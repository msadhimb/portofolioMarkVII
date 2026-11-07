"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowUpRight, Download } from "lucide-react"
import Link from "next/link"
import { BlurText } from "@/components/BlurText"
import { CountUp } from "@/components/CountUp"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { getProjects } from "@/data/localized"
import id from "./i18n/id"
import en from "./i18n/en"
import { Magnet } from "@/components/Magnet"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/data/profile"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import Grid from "../Background/Grid"
import { useIsMobile } from "@/hooks/use-mobile"

export const Hero = () => {
  i18next.addResourceBundle("id", "Hero", id)
  i18next.addResourceBundle("en", "Hero", en)
  const { t, i18n } = useTranslation("Hero")

  const reduce = useReducedMotion()
  const { settings } = useSiteSettings()
  const isMobile = useIsMobile()

  const firstName = siteConfig.siteName.split(" ")[0]
  const restName = siteConfig.siteName.split(" ").slice(1).join(" ")
  const techCount = new Set(
    getProjects(i18n.language).flatMap((p) => p.technologies)
  ).size
  const availabilityLabel =
    i18n.language === "en"
      ? settings.available_label_en
      : settings.available_label_id
  const statsLabels = t("stats", { returnObjects: true }) as string[]
  const stats = [
    { to: 4, label: statsLabels[0] },
    { to: 3, label: statsLabels[1] },
    { to: techCount, label: statsLabels[2] },
  ]
  const Animated = reduce ? "div" : motion.div

  const item = (delay: number) => ({
    initial: reduce ? {} : { opacity: 0, y: isMobile ? 12 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: isMobile ? 0.42 : 0.65,
      delay: isMobile ? Math.min(delay, 0.2) : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  })

  const line = (delay: number) => ({
    initial: reduce ? {} : { y: "110%" },
    animate: { y: "0%" },
    transition: {
      duration: isMobile ? 0.6 : 0.9,
      delay: isMobile ? Math.min(delay, 0.2) : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  })

  return (
    <section
      id="top"
      aria-label="Intro"
      className="relative overflow-hidden pb-10 lg:flex lg:min-h-[86svh] lg:flex-col"
    >
      <Grid />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-5 sm:px-8 lg:flex-1">
        <Animated
          {...(!reduce ? item(0) : {})}
          className="flex flex-wrap items-center justify-between gap-4 pt-4"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {t("role")}
          </span>
          {availabilityLabel ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 font-mono text-[11px] tracking-wide text-muted-foreground">
              <span
                className={
                  "size-1.5 rounded-full " +
                  (settings.is_available
                    ? "animate-pulse bg-signal"
                    : "bg-muted-foreground/50")
                }
              />
              {availabilityLabel}
            </span>
          ) : null}
        </Animated>

        <h1 className="mt-6 text-[clamp(2.6rem,9vw,7rem)] font-medium leading-[0.95] tracking-[-0.045em] text-foreground lg:mt-8">
          <span className="block overflow-hidden">
            <Animated {...(!reduce ? line(0.12) : {})} className="block">
              {firstName}
            </Animated>
          </span>
          <span className="block overflow-hidden">
            <Animated
              {...(!reduce ? line(0.24) : {})}
              className="block font-display font-normal italic leading-[0.92] tracking-[-0.02em]"
            >
              {restName}
            </Animated>
          </span>
        </h1>

        <Animated
          {...(!reduce ? item(0.36) : {})}
          className="mt-5 flex flex-wrap items-center gap-2"
        >
          {["Next.js", "TypeScript", "Supabase", "Ollama AI"].map((s, i) => (
            <span
              key={s}
              className={
                "sticker inline-block rounded-lg border border-border bg-card px-2.5 py-1 font-mono text-[11px] font-semibold text-foreground " +
                (i % 2 === 0 ? "-rotate-2" : "rotate-2")
              }
            >
              ✦ {s}
            </span>
          ))}
          <a
            href="#ai"
            className="sticker inline-block rotate-1 rounded-lg bg-foreground px-2.5 py-1 font-mono text-[11px] font-semibold text-background transition-transform hover:scale-105"
          >
            {t("stickerAi")}
          </a>
        </Animated>

        <div className="mt-7 grid gap-10 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
          <div>
            <BlurText
              text={`${t("statement")} ${t("statementExtra")}`}
              delay={45}
              animateBy="words"
              className="max-w-[34rem] text-[15px] leading-relaxed text-muted-foreground md:text-base"
            />

            <Animated
              {...(!reduce ? item(0.5) : {})}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <Magnet
                padding={48}
                magnetStrength={3.5}
                maxOffset={10}
                disabled={isMobile}
              >
                <Button asChild size="lg" className="h-11 rounded-full px-6">
                  <Link href="#projects">
                    {t("ctaProjects")}
                    <ArrowDown className="size-4" />
                  </Link>
                </Button>
              </Magnet>
              <Magnet
                padding={48}
                magnetStrength={3.5}
                maxOffset={10}
                disabled={isMobile}
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 rounded-full px-6"
                >
                  <Link href="#contact">{t("ctaContact")}</Link>
                </Button>
              </Magnet>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-11 rounded-full px-5"
              >
                <a href="/api/v1/cv" download="Salman_Adhim_CV.pdf">
                  <Download className="size-4" />
                  {t("ctaCv")}
                </a>
              </Button>
            </Animated>
          </div>

          <Animated
            {...(!reduce
              ? {
                  initial: { opacity: 0, y: isMobile ? 12 : 24 },
                  animate: { opacity: 1, y: 0 },
                  transition: {
                    duration: isMobile ? 0.42 : 0.8,
                    delay: isMobile ? 0.2 : 0.55,
                    ease: [0.22, 1, 0.36, 1] as const,
                  },
                }
              : {})}
            className="hidden lg:block"
          >
            <div className="card-futuristic rotate-[1.2deg] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_24px_60px_-32px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:rotate-0">
              <div
                aria-hidden="true"
                className="flex items-center gap-1.5 border-b border-border px-4 py-2.5"
              >
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-signal/70" />
                <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                  engineer.ts
                </span>
              </div>
              <pre
                aria-hidden="true"
                className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed"
              >
                <code>
                  <span className="text-muted-foreground">{"// how I work"}</span>
                  {"\n"}
                  <span className="text-signal">const</span>{" "}
                  <span className="text-foreground">engineer</span>{" "}
                  <span className="text-muted-foreground">=</span>{" "}
                  <span className="text-foreground">{"{"}</span>
                  {"\n  "}
                  <span className="text-foreground">focus:</span>{" "}
                  <span className="text-emerald-700 dark:text-emerald-300">
                    [&quot;structure&quot;, &quot;speed&quot;, &quot;ux&quot;]
                  </span>
                  <span className="text-foreground">,</span>
                  {"\n  "}
                  <span className="text-foreground">serverState:</span>{" "}
                  <span className="text-emerald-700 dark:text-emerald-300">
                    &quot;react-query&quot;
                  </span>
                  <span className="text-foreground">,</span>
                  {"\n  "}
                  <span className="text-foreground">clientState:</span>{" "}
                  <span className="text-emerald-700 dark:text-emerald-300">
                    &quot;zustand&quot;
                  </span>
                  <span className="text-foreground">,</span>
                  {"\n  "}
                  <span className="text-foreground">persist</span>
                  <span className="text-muted-foreground">(</span>
                  <span className="text-foreground">onlyWhatUserOwns</span>
                  <span className="text-muted-foreground">)</span>
                  <span className="text-foreground">,</span>
                  {"\n"}
                  <span className="text-foreground">{"}"}</span>
                  <span className="text-muted-foreground">;</span>
                  {"\n\n"}
                  <span className="text-muted-foreground">{"// currently"}</span>
                  {"\n"}
                  <span className="text-foreground">ship</span>
                  <span className="text-muted-foreground">(</span>
                  <span className="text-emerald-700 dark:text-emerald-300">
                    &quot;SIMPP&quot;
                  </span>
                  <span className="text-muted-foreground">)</span>
                  <span className="text-muted-foreground">;</span>
                  <span className="ml-1 inline-block h-4 w-[7px] translate-y-[3px] animate-pulse bg-signal" />
                </code>
              </pre>
              <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
                <span>TypeScript · Strict</span>
                <Link
                  href="#projects"
                  className="inline-flex items-center gap-1 text-signal"
                >
                  {t("viewWork")} <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>
          </Animated>
        </div>

        <Animated
          {...(!reduce ? item(0.65) : {})}
          className="mt-auto border-t border-border pt-5 lg:pt-6"
        >
          <dl className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="tabular font-mono text-lg font-semibold text-foreground">
                  <CountUp to={s.to} />
                </dt>
                <dd className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Animated>
      </div>
    </section>
  )
}
