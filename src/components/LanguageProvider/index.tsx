"use client";

import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/config";
import { ActionModal } from "@/components/ActionModal";
import { ConfirmModal } from "@/components/ConfirmModal";

type LanguageProviderProps = {
  children: ReactNode;
};

/**
 * Provider i18n ala PLN (nextjs-simpp-eiqc ClientProvider):
 * satu I18nextProvider global. Bahasa dari localStorage, default "id",
 * disinkron ke document.documentElement.lang.
 * Ganti bahasa dari mana saja via i18n.changeLanguage (lihat LocaleToggle).
 */
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  useEffect(() => {
    const saved = window.localStorage.getItem("locale");
    const next: Locale =
      saved === "en" || saved === "id" ? saved : defaultLocale;
    document.documentElement.lang = next;
    if (i18n.language !== next) {
      void i18n.changeLanguage(next);
    }
  }, []);

  useEffect(() => {
    const onChanged = (lng: string) => {
      document.documentElement.lang = lng;
      window.localStorage.setItem("locale", lng);
    };
    i18n.on("languageChanged", onChanged);
    return () => {
      i18n.off("languageChanged", onChanged);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
      <ActionModal />
      <ConfirmModal />
    </I18nextProvider>
  );
};
