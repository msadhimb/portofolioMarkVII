"use client";

import { useLanguage } from "@/components/LanguageProvider";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export const LocaleToggle = () => {
  const { lang, dict, setLang } = useLanguage();

  const switchTo = (next: Locale) => {
    if (next === lang) return;
    setLang(next);
  };

  return (
    <div
      role="group"
      aria-label={dict.nav.switchLanguage}
      className="relative flex items-center rounded-full border border-border bg-card p-0.5 font-mono text-[11px]"
    >
      {(["id", "en"] as const).map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-pressed={lang === locale}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition-colors",
            lang === locale
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
};
