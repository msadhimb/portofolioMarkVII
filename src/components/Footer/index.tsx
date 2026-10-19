"use client"

import Link from "next/link"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import idNav from "../Navbar/i18n/id"
import enNav from "../Navbar/i18n/en"
import id from "./i18n/id"
import en from "./i18n/en"
import { Separator } from "@/components/ui/separator"
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

  return (
    <footer
      className="border-t border-border pb-14 lg:pb-0"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-mono text-sm">
              <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-xs font-semibold text-background">
                {siteConfig.monogram}
              </span>
              <span className="text-foreground">
                salman<span className="text-signal">.</span>adhim
              </span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-2 gap-x-6 text-sm text-muted-foreground"
          >
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="mt-8" />
        <div className="flex flex-col gap-2 pt-6 font-mono text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.siteName}. All rights
            reserved.
          </p>
          <p className="tabular">Salatiga · v7.0</p>
        </div>
      </div>
    </footer>
  )
}
