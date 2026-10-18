"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowUpRight, Download, MapPin } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BlurText } from "@/components/BlurText"
import { CountUp } from "@/components/CountUp"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { getProjects } from "@/data/localized"
import id from "./i18n/id"
import en from "./i18n/en"
import { Magnet } from "@/components/Magnet"
import { ShinyText } from "@/components/ShinyText"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/data/profile"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import Grid from "../Background/Grid"

const ease = [0.22, 1, 0.36, 1] as const

export const Hero = () => {
  i18next.addResourceBundle("id", "Hero", id)
  i18next.addResourceBundle("en", "Hero", en)
  const { t, i18n } = useTranslation("Hero")
  const reduce = useReducedMotion()
  const { resolvedTheme } = useTheme()

  const item = (delay: number) => ({
    initial: reduce ? {} : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease },
  })

  const { settings } = useSiteSettings()
  const availabilityLabel =
    i18n.language === "en"
      ? settings.available_label_en
      : settings.available_label_id
  const availabilityOpen = settings.is_available

  // Di mobile: nonaktifkan semua JS-driven animations (Magnet rAF, framer-motion)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const firstName = siteConfig.siteName.split(" ")[0]
  const restName = siteConfig.siteName.split(" ").slice(1).join(" ")
  const nameColor = resolvedTheme === "dark" ? "#22D3EE" : "#6D28D9"
  // Shine harus tetap terlihat: putih hanya untuk dark, violet muda untuk light
  // (putih di atas background terang membuat teks tampak transparan).
  const shineColor = resolvedTheme === "dark" ? "#77deee" : "#9972d9"
  const techCount = new Set(
    getProjects(i18n.language).flatMap((p) => p.technologies)
  ).size

  const statsLabels = t("stats", { returnObjects: true }) as string[]
  const stats = [
    { to: 4, label: statsLabels[0] },
    { to: 3, label: statsLabels[1] },
    { to: techCount, label: statsLabels[2] },
  ]

  // Wrapper animasi: di mobile render div biasa, di desktop pakai motion.div
  const Animated = isMobile || reduce ? "div" : motion.div

  return (
    <section
      id="top"
      aria-label="Intro"
      className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24"
    >
      {/* Grid + aurora backdrop — lebih hidup tapi tetap fungsional */}
      <Grid />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.85fr] lg:items-end">
          <div>
            <Animated {...(!isMobile && !reduce ? item(0) : {})}>
              <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-border bg-card py-1.5 pr-4 pl-1.5 text-xs text-muted-foreground">
                <span
                  className={
                    availabilityOpen
                      ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-2.5 py-1 font-medium text-emerald-700 dark:text-emerald-300"
                      : "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground"
                  }
                >
                  <span className="relative flex size-1.5">
                    {availabilityOpen ? (
                      <>
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                      </>
                    ) : (
                      <span className="relative inline-flex size-1.5 rounded-full bg-muted-foreground" />
                    )}
                  </span>
                  {availabilityLabel}
                </span>
                <span className="inline-flex items-center gap-1 font-mono">
                  <MapPin className="size-3" />
                  {siteConfig.location}
                </span>
              </p>
            </Animated>

            <Animated
              {...(!isMobile && !reduce ? item(0.08) : {})}
              className="mt-8 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase"
            >
              {t("role")}
            </Animated>

            {/* Stiker keahlian miring — sentuhan playful khas */}
            <Animated
              {...(!isMobile && !reduce ? item(0.11) : {})}
              aria-hidden="true"
              className="mt-4 flex flex-wrap items-center gap-2"
            >
              {["Next.js", "TypeScript", "Supabase", "Ollama AI"].map(
                (s, i) => (
                  <span
                    key={s}
                    className={
                      "sticker inline-block rounded-lg border border-border bg-card px-2.5 py-1 font-mono text-[11px] font-semibold text-foreground " +
                      (i % 2 === 0 ? "-rotate-2" : "rotate-2")
                    }
                  >
                    ✦ {s}
                  </span>
                )
              )}
              <a
                href="#ai"
                className="sticker inline-block rotate-1 rounded-lg bg-foreground px-2.5 py-1 font-mono text-[11px] font-semibold text-background transition-transform hover:scale-105"
              >
                {t("stickerAi")}
              </a>
            </Animated>

            <Animated
              {...(!isMobile && !reduce ? item(0.14) : {})}
              className="mt-3 text-5xl font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-6xl lg:text-7xl"
            >
              {firstName}{" "}
              <span className="font-display font-normal italic">
                <ShinyText
                  text={restName}
                  color={nameColor}
                  shineColor={shineColor}
                  speed={2.5}
                  glow={0.25}
                />
              </span>
            </Animated>

            <BlurText
              text={`${t("statement")} ${t("statementExtra")}`}
              delay={45}
              animateBy="words"
              className="text-md mt-6 max-w-xl text-justify leading-relaxed text-balance text-muted-foreground md:text-lg"
            />

            <Animated
              {...(!isMobile && !reduce ? item(0.3) : {})}
              className="mt-8 flex flex-wrap items-center gap-3"
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
                <Link href="/cv">
                  <Download className="size-4" />
                  {t("ctaCv")}
                </Link>
              </Button>
            </Animated>

            <Animated
              {...(!isMobile && !reduce ? item(0.38) : {})}
              className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="tabular font-mono text-sm font-semibold text-foreground">
                    <CountUp to={s.to} />
                  </dt>
                  <dd className="mt-0.5 text-xs text-muted-foreground">
                    {s.label}
                  </dd>
                </div>
              ))}
            </Animated>
          </div>

          {/* Decorative code snippet — static, lightweight */}
          <Animated
            {...(!isMobile && !reduce ? item(0.32) : {})}
            aria-hidden="true"
            className="card-futuristic hidden overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_20px_60px_-30px_rgba(2,132,199,0.5)] lg:block"
          >
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-signal/70" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                engineer.ts
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed">
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
                  &quot;duitku&quot;
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
                tabIndex={-1}
                className="inline-flex items-center gap-1 text-signal"
              >
                {t("viewWork")} <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </Animated>
        </div>
      </div>
    </section>
  )
}
