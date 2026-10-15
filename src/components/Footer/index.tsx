"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/data/profile";

export const Footer = () => {
  const { dict } = useLanguage();
  const t = dict.footer;
  const nav = dict.nav;

  const links: [string, string][] = [
    ["#about", nav.about],
    ["#projects", nav.projects],
    ["#experience", nav.experience],
    ["#skills", nav.skills],
    ["#ai", nav.ai],
    ["#contact", nav.contact],
  ];

  return (
    <footer className="border-t border-border" aria-label="Footer">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-mono text-sm">
              <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-xs font-semibold text-background">
                {siteConfig.monogram}
              </span>
              <span className="text-foreground">
                salman<span className="text-signal">.</span>dev
              </span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t.tagline}
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="transition-colors hover:text-foreground">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="mt-8" />
        <div className="flex flex-col gap-2 pt-6 font-mono text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.siteName}. All rights reserved.</p>
          <p className="tabular">Salatiga · {new Date().toISOString().slice(0, 10)} · v1.0</p>
        </div>
      </div>
    </footer>
  );
};
