"use client"

import { ArrowUpRight, Copy, Mail } from "lucide-react"
import { ClickSpark } from "@/components/ClickSpark"
import { CopyEmailButton } from "@/components/CopyEmailButton"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import id from "./i18n/id"
import en from "./i18n/en"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import { Card } from "@/components/ui/card"
import { siteConfig } from "@/data/profile"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { ContactForm } from "./components/ContactForm"

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
    <section
      id="contact"
      aria-label="Contact"
      className="scroll-mt-24 border-t border-border py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
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
            <ClickSpark
              sparkColor={["#22D3EE", "#A78BFA"]}
              sparkCount={10}
              sparkRadius={48}
              className="h-auto!"
            >
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-[15px] font-medium text-background transition-transform hover:-translate-y-px"
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
            </ClickSpark>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {[
                { label: "GitHub", href: siteConfig.github },
                { label: "LinkedIn", href: siteConfig.linkedin },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.label}
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Card className="rounded-3xl p-7">
              <h3 className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                {t("expectations")}
              </h3>
              <ol className="mt-5 space-y-5">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="tabular font-mono text-xs font-semibold text-signal">
                      0{i + 1}
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-foreground">
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 rounded-2xl bg-muted/70 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Copy className="size-4 text-signal" />
                  {t("availabilityNow")}:{" "}
                  {settings.is_available
                    ? availabilityLabel.toLowerCase()
                    : i18n.language === "en"
                      ? "currently unavailable"
                      : "sedang tidak tersedia"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("capacity")}
                </p>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
