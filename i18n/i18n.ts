import i18n, { type BackendModule, type ResourceKey } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector";

const SUPPORTED_LANGUAGES = ['pt', 'en', 'fr', 'es', 'ko'] as const;

type TLanguage = typeof SUPPORTED_LANGUAGES[number];

// Cada idioma vira um chunk separado: só o idioma ativo (e o fallback) é baixado.
const localeLoaders: Record<TLanguage, () => Promise<{ default: ResourceKey }>> = {
  en: () => import('./locales/en.json'),
  pt: () => import('./locales/pt.json'),
  fr: () => import('./locales/fr.json'),
  es: () => import('./locales/es.json'),
  ko: () => import('./locales/ko.json'),
};

const lazyLocalesBackend: BackendModule = {
  type: 'backend',
  init: () => { },
  read: (language, _namespace, callback) => {
    const load = localeLoaders[language as TLanguage];

    if (!load) return callback(new Error(`Unsupported language: ${language}`), false);

    load()
      .then(module => callback(null, module.default))
      .catch(error => callback(error, false));
  },
};

i18n
  .use(lazyLocalesBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: { escapeValue: false },

    // As traduções chegam de forma assíncrona; o app espera `ready` em vez de suspender.
    react: { useSuspense: false },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
