export type Locale = "id" | "en";

export const locales: readonly Locale[] = ["id", "en"];

export const defaultLocale: Locale = "id";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
