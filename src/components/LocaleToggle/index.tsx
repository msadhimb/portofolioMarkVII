"use client"

import i18next from "i18next"
import { useTranslation } from "react-i18next"
import type { Locale } from "@/i18n/config"
import id from "../Navbar/i18n/id"
import en from "../Navbar/i18n/en"
import FormSwitch from "../Forms/FormSwitch"

export const LocaleToggle = () => {
  i18next.addResourceBundle("id", "Navbar", id)
  i18next.addResourceBundle("en", "Navbar", en)
  const { t, i18n } = useTranslation("Navbar")
  const lang = (i18n.language === "en" ? "en" : "id") as Locale

  const handleChange = (checked: boolean) => {
    const next: Locale = checked ? "en" : "id"
    if (next === lang) return
    void i18n.changeLanguage(next)
  }

  return (
    <div className="flex items-center gap-2 font-mono text-[11px] uppercase">
      <span
        className={lang === "id" ? "text-foreground" : "text-muted-foreground"}
      >
        id
      </span>
      <FormSwitch
        checked={lang === "en"}
        onChange={handleChange}
        ariaLabel={t("switchLanguage")}
      />
      <span
        className={lang === "en" ? "text-foreground" : "text-muted-foreground"}
      >
        en
      </span>
    </div>
  )
}
