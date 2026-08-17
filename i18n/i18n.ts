import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import locales from './locales.json';
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: { translation: locales.en },
  pt: { translation: locales.pt },
  fr: { translation: locales.fr },
  es: { translation: locales.es },
  ko: { translation: locales.ko }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;