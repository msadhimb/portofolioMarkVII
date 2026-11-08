"use client"

import { ArrowUpRight, Mail } from "lucide-react"
import { CopyEmailButton } from "@/components/CopyEmailButton"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { SpotlightCard } from "@/components/SpotlightCard"
import { siteConfig } from "@/data/profile"
import { useSiteSettings } from "@/hooks/useSiteSettings"

export const Contact = () => {
  i18next.addResourceBundle("id", "Contact", id)
  i18next.addResourceBundle("en", "Contact", en)
  const { t, i18n } = useTranslation("Contact")
  const { settings } = useSiteSettings()
  const availabilityLabel =
    i18n.language === "en"
      ? settings.available_label_en
      : settings.available_label_id
  const steps = t("steps", { returnObjects: true }) as {
    title: string
    detail: string
  }[]

  return (
    <section id="contact" aria-label={t("eyebrow")} className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              index="07"
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

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-foreground px-6 text-sm font-medium text-background shadow-[0_18px_40px_-30px_rgba(0,0,0,0.7)] transition-transform duration-200 hover:-translate-y-px"
              >
                <Mail className="size-4" />
                {siteConfig.email}
              </a>
              <CopyEmailButton
                email={siteConfig.email}
                copyLabel={t("copyEmail")}
                copiedLabel={t("copied")}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {[
                { label: "GitHub", href: siteConfig.github },
                { label: "LinkedIn", href: siteConfig.linkedin },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-signal"
                >
                  {social.label}
                  <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <SpotlightCard className="glass-panel rounded-2xl border px-5 pb-5 shadow-none">
              <div className="py-5">
                <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  {t("availabilityNow")}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-foreground">
                  <span className="size-1.5 shrink-0 rounded-full bg-signal" />
                  {settings.is_available
                    ? availabilityLabel
                    : t("unavailable")}
                </p>
              </div>

              <p className="border-t border-border py-5 text-[13px] leading-relaxed text-muted-foreground">
                {t("capacity")}
              </p>

              <div className="border-t border-border pt-7">
                <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  {t("expectations")}
                </p>
                <ol className="mt-5 space-y-5">
                  {steps.map((step, index) => (
                    <li
                      key={step.title}
                      className="grid grid-cols-[28px_1fr] gap-3"
                    >
                      <span className="tabular font-mono text-[10px] text-signal">
                        0{index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {step.title}
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
