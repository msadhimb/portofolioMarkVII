"use client"

import {
  Briefcase,
  FolderKanban,
  Home,
  Mail,
  Sparkles,
  Trophy,
  User,
  Wrench,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { usePathname } from "next/navigation"
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
import { LocaleToggle } from "../LocaleToggle"

export const Navbar = () => {
  i18next.addResourceBundle("id", "Navbar", id)
  i18next.addResourceBundle("en", "Navbar", en)
  const { t } = useTranslation("Navbar")

  const pathname = usePathname()
  const isProjectsPage = pathname.includes("/projects")

  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string>("")

  const links = [
    { href: "#about", label: t("about"), icon: User },
    { href: "#projects", label: t("projects"), icon: FolderKanban },
    { href: "#experience", label: t("experience"), icon: Briefcase },
    { href: "#awards", label: t("awards"), icon: Trophy },
    { href: "#skills", label: t("skills"), icon: Wrench },
    { href: "#ai", label: t("ai"), icon: Sparkles, highlight: true },
    { href: "#contact", label: t("contact"), icon: Mail },
  ]

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) return
    e.preventDefault()

    const el = href === "#top" ? null : document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    window.history.replaceState(null, "", href)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Tandai section yang sedang terlihat (untuk state aktif di dock)
  useEffect(() => {
    if (isProjectsPage) return
    const elements = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => !!el)
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProjectsPage])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>

      {/* ================= DESKTOP NAVBAR (lg+) ================= */}
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 hidden px-6 pt-3 lg:block",
          "transition-[opacity,transform,visibility] duration-500 ease-out motion-reduce:transition-none",
          mounted
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        )}
      >
        <div className="mx-auto max-w-6xl">
          <div className="pointer-events-auto relative flex items-center justify-between gap-4 rounded-2xl px-4 py-3">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
              <NavGlass borderRadius={16} />
            </div>

            <Link
              href="#top"
              onClick={(e) => scrollToSection(e, "#top")}
              className="relative flex items-center gap-2.5 font-mono text-sm"
              aria-label={t("backToTop")}
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-foreground font-semibold text-background">
                {siteConfig.monogram}
              </span>
              <span className="tracking-tight text-foreground">
                salman<span className="text-signal">.</span>adhim
              </span>
            </Link>

            <nav
              aria-label="Primary"
              className="relative flex items-center gap-1"
            >
              {isProjectsPage ? (
                <Link
                  href={"/"}
                  className="cursor-pointer rounded-full px-3.5 py-2 text-sm font-semibold transition-colors"
                >
                  Back To Home
                </Link>
              ) : (
                links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={(e) => scrollToSection(e, l.href)}
                    className={cn(
                      "cursor-pointer rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                      "highlight" in l && l.highlight
                        ? "bg-foreground font-medium text-background hover:opacity-90"
                        : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
                    )}
                  >
                    {"highlight" in l && l.highlight ? `✦ ${l.label}` : l.label}
                  </Link>
                ))
              )}
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
              <Button asChild className="rounded-full">
                <Link
                  href="#contact"
                  onClick={(e) => scrollToSection(e, "#contact")}
                >
                  Hire Me
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE: toggle melayang (kanan atas) ================= */}
      <div
        className={cn(
          "pointer-events-none fixed top-0 right-0 z-50 px-4 pt-3 lg:hidden",
          "pt-[max(0.75rem,env(safe-area-inset-top))]",
          "transition-[opacity,transform,visibility] duration-500 ease-out motion-reduce:transition-none",
          mounted
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        )}
      >
        <div className="pointer-events-auto relative flex items-center gap-1 rounded-full py-1 pr-3 pl-5">
          <div
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity duration-300",
              scrolled ? "opacity-100" : "opacity-0"
            )}
            aria-hidden="true"
          >
            <NavGlass borderRadius={9999} />
          </div>
          <div className="relative flex items-center gap-1">
            <LocaleToggle />
            <ThemeToggle
              toLightLabel={t("toggleToLight")}
              toDarkLabel={t("toggleToDark")}
            />
          </div>
        </div>
      </div>

      {/* ================= MOBILE DOCK (di bawah lg) ================= */}
      <nav
        aria-label="Dock"
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 lg:hidden",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          "transition-[opacity,transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          mounted
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-6 opacity-0"
        )}
      >
        <div className="pointer-events-auto relative flex items-end gap-1 rounded-[28px] px-2 py-2">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <NavGlass borderRadius={28} />
          </div>

          {isProjectsPage ? (
            <Link
              href="/"
              aria-label="Back To Home"
              className="relative flex h-11 items-center gap-2 rounded-2xl bg-foreground px-4 text-sm font-medium text-background transition-transform active:scale-95"
            >
              <Home className="size-5" />
              Home
            </Link>
          ) : (
            links.map((l) => {
              const Icon = l.icon
              const isActive = active === l.href
              const isHighlight = "highlight" in l && l.highlight

              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={(e) => scrollToSection(e, l.href)}
                  aria-label={l.label}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative flex size-11 items-center justify-center rounded-2xl",
                    "transition-[transform,background-color,color] duration-300 ease-out",
                    "active:scale-90 motion-reduce:transition-none",
                    isHighlight
                      ? "bg-foreground text-background"
                      : isActive
                        ? "bg-foreground/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-5" />
                </Link>
              )
            })
          )}
        </div>
      </nav>
    </>
  )
}
