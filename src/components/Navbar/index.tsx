"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import i18next from "i18next"
import { useTranslation } from "react-i18next"

import { LocaleToggle } from "@/components/LocaleToggle"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { siteConfig } from "@/data/profile"
import { cn } from "@/lib/utils"
import id from "./i18n/id"
import en from "./i18n/en"
import NavGlass from "./components/NavGlass"

export const Navbar = () => {
  i18next.addResourceBundle("id", "Navbar", id)
  i18next.addResourceBundle("en", "Navbar", en)
  const { t } = useTranslation("Navbar")

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const links = [
    { href: "#about", label: t("about") },
    { href: "#projects", label: t("projects") },
    { href: "#experience", label: t("experience") },
    { href: "#awards", label: t("awards") },
    { href: "#skills", label: t("skills") },
    { href: "#ai", label: t("ai"), highlight: true },
    { href: "#contact", label: t("contact") },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Tutup menu dengan Escape, dan saat layar melebar ke breakpoint desktop
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    const mq = window.matchMedia("(min-width: 768px)")
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    mq.addEventListener("change", onChange)
    return () => {
      window.removeEventListener("keydown", onKey)
      mq.removeEventListener("change", onChange)
    }
  }, [open])

  const showBackground = scrolled || open

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto max-w-6xl">
        <div className="pointer-events-auto relative z-[45] flex items-center justify-between gap-4 rounded-2xl px-4 py-3">
          <div
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity duration-300",
              showBackground ? "opacity-100" : "opacity-0 md:opacity-100"
            )}
            aria-hidden="true"
          >
            <NavGlass borderRadius={16} />
          </div>

          <Link
            href="#top"
            className="relative flex items-center gap-2.5 font-mono text-sm"
            aria-label={t("backToTop")}
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-foreground font-semibold text-background">
              {siteConfig.monogram}
            </span>
            <span className="hidden tracking-tight text-foreground sm:inline">
              salman<span className="text-signal">.</span>dev
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="relative hidden items-center gap-1 md:flex"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm transition-colors",
                  "highlight" in l && l.highlight
                    ? "bg-foreground font-medium text-background hover:opacity-90"
                    : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
                )}
              >
                {"highlight" in l && l.highlight ? `✦ ${l.label}` : l.label}
              </Link>
            ))}
          </nav>

          <div className="relative flex items-center gap-1.5">
            <LocaleToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <ThemeToggle
                  toLightLabel={t("toggleToLight")}
                  toDarkLabel={t("toggleToDark")}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">{t("themeHint")}</TooltipContent>
            </Tooltip>
            <Button asChild className="hidden rounded-full md:inline-flex">
              <Link href="#contact">{t("hireMe")}</Link>
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full md:hidden"
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                  aria-label={open ? t("closeMenu") : t("openMenu")}
                  onClick={() => setOpen((v) => !v)}
                >
                  {open ? (
                    <X className="size-5" />
                  ) : (
                    <Menu className="size-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {open ? t("closeMenu") : t("openMenu")}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Overlay: fade in/out, mengaburkan halaman di belakang menu */}
        <button
          type="button"
          tabIndex={-1}
          aria-label={t("closeMenu")}
          onClick={() => setOpen(false)}
          className={cn(
            "fixed inset-0 z-40 bg-background/60 md:hidden",
            "transition-[opacity,visibility] duration-300 ease-out motion-reduce:transition-none",
            open
              ? "pointer-events-auto visible opacity-100"
              : "pointer-events-none invisible opacity-0"
          )}
        />

        <div
          className={cn(
            "relative z-50 mt-2 md:hidden",
            !open && "pointer-events-none"
          )}
          id="mobile-menu"
          role="dialog"
          aria-label="Menu"
          aria-hidden={!open}
        >
          {/* Opacity & transform ditaruh di elemen yang sama dengan backdrop-filter,
              bukan di induknya, supaya blur tidak hilang saat animasi */}
          <div
            style={{
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              backdropFilter: "blur(24px) saturate(160%)",
            }}
            className={cn(
              "origin-top rounded-[20px] border border-foreground/10 bg-background/40 shadow-lg",
              "transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "motion-reduce:transition-none",
              open
                ? "visible translate-y-0 scale-100 opacity-100"
                : "pointer-events-none invisible -translate-y-2 scale-95 opacity-0"
            )}
          >
            <nav aria-label="Mobile" className="flex w-full flex-col gap-1 p-2">
              {links.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  style={{ transitionDelay: open ? `${80 + i * 35}ms` : "0ms" }}
                  className={cn(
                    "flex items-center rounded-full px-4 py-3 text-base",
                    "transition-[opacity,transform,background-color,color] duration-300 ease-out",
                    "motion-reduce:transition-none",
                    open
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-1 opacity-0",
                    "highlight" in l && l.highlight
                      ? "bg-foreground font-medium text-background hover:opacity-90"
                      : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
                  )}
                >
                  {"highlight" in l && l.highlight ? `✦ ${l.label}` : l.label}
                </Link>
              ))}
              <Button
                asChild
                className={cn(
                  "mt-1 h-11 rounded-full",
                  "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
                  open
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-1 opacity-0"
                )}
                style={{
                  transitionDelay: open ? `${80 + links.length * 35}ms` : "0ms",
                }}
              >
                <Link
                  href="#contact"
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                >
                  {t("hireMe")}
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
