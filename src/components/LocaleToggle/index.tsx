"use client";

import i18next from "i18next";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import id from "../Navbar/i18n/id";
import en from "../Navbar/i18n/en";

/**
 * Language switcher ala PLN: ganti bahasa client-side via
 * i18n.changeLanguage — halaman dipertahankan, tanpa navigasi.
 */
export const LocaleToggle = () => {
  i18next.addResourceBundle("id", "Navbar", id);
  i18next.addResourceBundle("en", "Navbar", en);
  const { t, i18n } = useTranslation("Navbar");
  const lang = (i18n.language === "en" ? "en" : "id") as Locale;

  const switchTo = (next: Locale) => {
    if (next === lang) return;
    void i18n.changeLanguage(next);
  };

  return (
    <div
      role="group"
      aria-label={t("switchLanguage")}
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
