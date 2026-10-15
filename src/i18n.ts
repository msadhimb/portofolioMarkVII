import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultLocale } from "./i18n/config";

// Pola PLN nextjs-simpp-eiqc (src/i18n.ts):
// - initReactI18next, lng/fallbackLng "id", escapeValue false, useSuspense false.
// - Deviasi: tanpa dynamic import public/locales/*.json (di PLN pun nyaris tak
//   terpakai; sumber kebenaran = bundle TS co-located per komponen via
//   i18next.addResourceBundle). Init sinkron dengan resources kosong.

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
