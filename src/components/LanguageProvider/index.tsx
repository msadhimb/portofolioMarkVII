"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultLocale, type Locale } from "@/i18n/config";
import { dictionaries, type Dictionary } from "@/i18n/dictionaries";

type LanguageContextValue = {
  lang: Locale;
  dict: Dictionary;
  setLang: (lang: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: defaultLocale,
  dict: dictionaries[defaultLocale],
  setLang: () => {},
});

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [lang, setLangState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const saved = window.localStorage.getItem("locale");
    const next: Locale = saved === "en" || saved === "id" ? saved : defaultLocale;
    document.documentElement.lang = next;
    // Hydrate saved preference after mount to avoid SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLangState(next);
  }, []);

  const setLang = useCallback((next: Locale) => {
    setLangState(next);
    window.localStorage.setItem("locale", next);
    document.documentElement.lang = next;
  }, []);

  const value = useMemo(
    () => ({ lang, dict: dictionaries[lang], setLang }),
    [lang, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
