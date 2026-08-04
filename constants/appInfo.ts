export const APP_INFO = {
  version: process.env.NEXT_PUBLIC_APP_VERSION!,
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
};

export const LOCALE_MAP: Record<string, string> = {
  pt: "pt-BR",
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  ko: "ko-KR",
};