"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowUpRight, Download } from "lucide-react"
import Link from "next/link"
import { BlurText } from "@/components/BlurText"
import { CountUp } from "@/components/CountUp"
import { Magnet } from "@/components/Magnet"
import { MaskedLines } from "@/components/MaskedLines"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/data/profile"
import { getProjects } from "@/data/localized"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { useIsMobile } from "@/hooks/use-mobile"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { cn } from "@/lib/utils"
import { SpotlightCard } from "../SpotlightCard"
import { useTheme } from "next-themes"
import LogoLoop from "../ReactBits/LogoLoop"
import { useProjects } from "../Projects/store"

export const Hero = () => {
  i18next.addResourceBundle("id", "Hero", id)
  i18next.addResourceBundle("en", "Hero", en)
  const { t, i18n } = useTranslation("Hero")

  const reduce = useReducedMotion()
  const { settings } = useSiteSettings()
  const isMobile = useIsMobile()
  const { resolvedTheme } = useTheme()
  const { projects } = useProjects()

  const nameParts = siteConfig.siteName.split(" ")
  const lineOne = nameParts.slice(0, 2).join(" ")
  const lineTwo = nameParts.slice(2).join(" ")
  const techCount = new Set(projects.flatMap((p) => p.technologies)).size
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
  const workItems = projects.slice(0, 6)

  const indexes = workItems.map((item, index) => {
    return {
      node: (
        <SpotlightCard
          spotlightColor="var(--signal)"
          intensity={0.5}
          ambient
          spotlightSize={220}
          theme={resolvedTheme === "light" ? "light" : "dark"}
          className="h-full min-w-100 shadow-none"
        >
          <Link key={item.slug} href={`/projects/${item.slug}`}>
            <div className="flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{item.period}</span>
            </div>
            <p className="mt-6 text-lg font-medium tracking-tight text-foreground">
              {item.title}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="truncate text-xs text-muted-foreground">
                {item.context}
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal" />
            </div>
          </Link>
        </SpotlightCard>
      ),
      title: item.period,
      href: item.slug,
      hoverColor: item.period,
    }
  })

  return (
    <section
      id="top"
      aria-label={t("ariaLabel")}
      className="relative overflow-hidden pb-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col space-y-10 px-5 sm:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-between gap-4 pt-2"
        >
          <span className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            {t("index")}
          </span>
          {availabilityLabel ? (
            <span className="glass-chip inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  settings.is_available ? "bg-signal" : "bg-muted-foreground/50"
                )}
              />
              {availabilityLabel}
            </span>
          ) : null}
        </motion.div>

        <MaskedLines
          lines={[
            <span key="first" className="block">
              {lineOne}
            </span>,
            <span
              key="second"
              className="block font-display font-normal tracking-[-0.02em] text-muted-foreground italic"
            >
              {lineTwo}
            </span>,
          ]}
          className="mt-8 text-[clamp(2.75rem,10.5vw,8.5rem)] leading-[0.86] font-medium tracking-[-0.05em] text-foreground lg:mt-10"
          delay={0.05}
        />

        <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
          <div className="space-y-5 lg:col-span-2">
            <BlurText
              text={`${t("statement")} ${t("statementExtra")}`}
              delay={30}
              animateBy="words"
              className="max-w-[34rem] text-[15px] leading-relaxed text-muted-foreground md:text-base"
            />

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-wrap items-center gap-3"
            >
              <Magnet
                padding={48}
                magnetStrength={3.5}
                maxOffset={10}
                disabled={isMobile || !!reduce}
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
                disabled={isMobile || !!reduce}
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
            </motion.div>
          </div>

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="grid grid-cols-3 gap-4 border-border"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="tabular font-mono text-xl font-medium text-foreground">
                  <CountUp to={s.to} />
                </dt>
                <dd className="mt-1 text-[10px] leading-snug tracking-[0.14em] text-muted-foreground uppercase">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {workItems.length > 0 ? (
          <div className="space-y-5 border-t border-border pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                {t("workIndex")}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground/70">
                {t("workHint")}
              </p>
            </div>

            <LogoLoop
              logos={indexes}
              speed={50}
              direction="left"
              gap={38}
              hoverSpeed={0}

              ariaLabel="Technology partners"
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
