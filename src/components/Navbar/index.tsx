"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GlassSurface } from "@/components/GlassSurface";
import { useLanguage } from "@/components/LanguageProvider";
import { LocaleToggle } from "@/components/LocaleToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { siteConfig } from "@/data/profile";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { dict } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: "#about", label: dict.nav.about },
    { href: "#projects", label: dict.nav.projects },
    { href: "#experience", label: dict.nav.experience },
    { href: "#skills", label: dict.nav.skills },
    { href: "#ai", label: dict.nav.ai, highlight: true },
    { href: "#contact", label: dict.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        {dict.nav.skipToContent}
      </a>
      <div className="mx-auto max-w-6xl">
        <div className="relative flex items-center justify-between gap-4 rounded-2xl px-4 py-3">
          <div
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity duration-300",
              scrolled ? "opacity-100" : "opacity-0"
            )}
            aria-hidden="true"
          >
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={16}
              displace={1.4}
              distortionScale={-70}
              blur={14}
              backgroundOpacity={0.4}
              shadow={false}
              className="h-full w-full"
            />
          </div>
          <Link
            href="#top"
            className="relative flex items-center gap-2.5 font-mono text-sm"
            aria-label={dict.nav.backToTop}
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-foreground font-semibold text-background">
              {siteConfig.monogram}
            </span>
            <span className="hidden tracking-tight text-foreground sm:inline">
              salman<span className="text-signal">.</span>dev
            </span>
          </Link>

          <nav aria-label="Primary" className="relative hidden items-center gap-1 md:flex">
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
                  toLightLabel={dict.nav.toggleToLight}
                  toDarkLabel={dict.nav.toggleToDark}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">{dict.nav.themeHint}</TooltipContent>
            </Tooltip>
            <Button asChild className="hidden rounded-full md:inline-flex">
              <Link href="#contact">{dict.nav.hireMe}</Link>
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full md:hidden"
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                  aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
                  onClick={() => setOpen((v) => !v)}
                >
                  {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {open ? dict.nav.closeMenu : dict.nav.openMenu}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {open ? (
          <div className="mt-2 md:hidden" id="mobile-menu" role="dialog" aria-label="Menu">
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={20}
              displace={1.4}
              distortionScale={-70}
              blur={14}
              backgroundOpacity={0.4}
            >
              <nav aria-label="Mobile" className="flex w-full flex-col gap-1 p-2">
                {links.map((l, i) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-foreground/[0.06]"
                  >
                    {"highlight" in l && l.highlight ? `✦ ${l.label}` : l.label}
                    <span className="font-mono text-xs text-muted-foreground">
                      0{i + 1}
                    </span>
                  </Link>
                ))}
                <Button asChild className="mt-2 h-11 rounded-xl">
                  <Link href="#contact" onClick={() => setOpen(false)}>
                    {dict.nav.hireMe}
                  </Link>
                </Button>
              </nav>
            </GlassSurface>
          </div>
        ) : null}
      </div>
    </header>
  );
};
