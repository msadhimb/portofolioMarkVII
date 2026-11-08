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
import { GlassSurface } from "@/components/GlassSurface"

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
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
  }, [isProjectsPage])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        {t("skipToContent")}
      </a>

      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 hidden px-6 pt-4 lg:block",
          "transition-[opacity,transform,visibility] duration-500 ease-out motion-reduce:transition-none",
          mounted
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        )}
      >
        <div className="mx-auto max-w-6xl">
          <div className="pointer-events-auto relative flex items-center justify-between gap-4 rounded-full px-5 py-2.5">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
              <NavGlass borderRadius={9999} />
            </div>

            <Link
              href="#top"
              onClick={(e) => scrollToSection(e, "#top")}
              className="relative flex items-center gap-2.5 font-mono text-[13px]"
              aria-label={t("backToTop")}
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                {siteConfig.monogram}
              </span>
              <span className="tracking-tight text-foreground">
                {siteConfig.wordmark}
              </span>
            </Link>

            <nav
              aria-label={t("primaryNav")}
              className="relative flex items-center gap-1"
            >
              {isProjectsPage ? (
                <Link
                  href="/"
                  className="flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Home className="size-3.5" />
                  {t("backHome")}
                </Link>
              ) : (
                links.map((l) => {
                  const isActive = active === l.href
                  const isHighlight = "highlight" in l && l.highlight

                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={(e) => scrollToSection(e, l.href)}
                      className={cn(
                        "relative cursor-pointer rounded-full px-3 py-2 text-[13px] font-medium transition-colors",
                        isActive
                          ? "bg-card/40 text-foreground"
                          : "text-muted-foreground hover:bg-card/30 hover:text-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5",
                          isHighlight && "text-signal"
                        )}
                      >
                        {isHighlight ? (
                          <span
                            aria-hidden="true"
                            className="size-1 rounded-full bg-signal"
                          />
                        ) : null}
                        {l.label}
                      </span>
                      {isActive ? (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-3 -bottom-0.5 h-px bg-signal"
                        />
                      ) : null}
                    </Link>
                  )
                })
              )}
            </nav>

            <div className="relative flex items-center gap-2">
              <div className="relative flex items-center gap-1 rounded-full px-2 py-1">
                <div
                  className="pointer-events-none absolute inset-0"
                  aria-hidden="true"
                >
                  <GlassSurface
                    borderRadius={9999}
                    width="100%"
                    height="100%"
                    redOffset={5}
                    greenOffset={15}
                    blueOffset={25}
                    backgroundOpacity={0.3}
                    saturation={1.2}
                    blur={8}
                    shadow={false}
                    border={true}
                    className="h-full w-full"
                  />
                </div>
                <div className="relative flex items-center gap-1">
                  <LocaleToggle />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ThemeToggle
                        toLightLabel={t("toggleToLight")}
                        toDarkLabel={t("toggleToDark")}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {t("themeHint")}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Button asChild size="sm" className="h-9 rounded-full px-4">
                <Link
                  href="#contact"
                  onClick={(e) => scrollToSection(e, "#contact")}
                >
                  {t("hireMe")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

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
        <div className="pointer-events-auto relative flex items-center gap-1 rounded-full py-1 pr-2 pl-2">
          <div
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity duration-300",
              scrolled ? "opacity-100" : "opacity-90"
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

      <nav
        aria-label={t("dockNav")}
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 lg:hidden",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          "transition-[opacity,transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          mounted
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-6 opacity-0"
        )}
      >
        <div className="pointer-events-auto relative flex max-w-[calc(100vw-1.5rem)] [scrollbar-width:none] items-end gap-0.5 overflow-x-auto rounded-[28px] px-2 py-2 [&::-webkit-scrollbar]:hidden">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <NavGlass borderRadius={28} />
          </div>

          {isProjectsPage ? (
            <Link
              href="/"
              aria-label={t("backHome")}
              className="relative flex h-11 items-center gap-2 rounded-2xl bg-foreground px-4 text-[13px] font-medium text-background transition-transform active:scale-95"
            >
              <Home className="size-5" />
              {t("home")}
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
                    "relative flex size-11 shrink-0 items-center justify-center rounded-2xl",
                    "transition-[transform,background-color,color] duration-300 ease-out",
                    "active:scale-90 motion-reduce:transition-none",
                    isHighlight
                      ? "text-signal"
                      : isActive
                        ? "bg-card/40 text-foreground"
                        : "text-muted-foreground hover:bg-card/25 hover:text-foreground"
                  )}
                >
                  <Icon className="size-5" />
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1.5 size-1 rounded-full bg-signal"
                    />
                  ) : null}
                </Link>
              )
            })
          )}
        </div>
      </nav>
    </>
  )
}
