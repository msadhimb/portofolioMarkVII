"use client"

import Link from "next/link"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import idNav from "../Navbar/i18n/id"
import enNav from "../Navbar/i18n/en"
import id from "./i18n/id"
import en from "./i18n/en"
import { siteConfig } from "@/data/profile"

export const Footer = () => {
  i18next.addResourceBundle("id", "Navbar", idNav)
  i18next.addResourceBundle("en", "Navbar", enNav)
  i18next.addResourceBundle("id", "Footer", id)
  i18next.addResourceBundle("en", "Footer", en)
  const { t } = useTranslation("Footer")
  const { t: tNav } = useTranslation("Navbar")

  const links: [string, string][] = [
    ["#about", tNav("about")],
    ["#projects", tNav("projects")],
    ["#experience", tNav("experience")],
    ["#skills", tNav("skills")],
    ["#ai", tNav("ai")],
    ["#contact", tNav("contact")],
  ]

  const socials = [
    { label: "GitHub", href: siteConfig.github },
    { label: "LinkedIn", href: siteConfig.linkedin },
    { label: "Email", href: `mailto:${siteConfig.email}` },
  ]

  const wordmark = siteConfig.wordmark.split(".")

  return (
    <footer
      className="border-t border-border bg-card/25 backdrop-blur-xl"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-10 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
              {t("label")}
            </p>
            <p className="mt-3 font-display text-[clamp(3rem,9vw,7rem)] leading-[0.85] tracking-[-0.04em] text-foreground">
              {wordmark.map((part, index) => (
                <span key={`${part}-${index}`}>
                  {part}
                  {index < wordmark.length - 1 ? (
                    <span className="text-signal">.</span>
                  ) : null}
                </span>
              ))}
            </p>
            <p className="mt-6 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                {t("navigate")}
              </p>
              <nav className="mt-4 flex flex-col gap-2.5" aria-label={t("navigate")}>
                {links.map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-signal"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                {t("elsewhere")}
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-signal"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-5 font-mono text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.siteName}
          </p>
          <p className="tabular">
            {t("privacy")} · Salatiga
          </p>
        </div>
      </div>
    </footer>
  )
}
