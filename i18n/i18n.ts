import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import locales from './locales.json';

const resources = {
  pt: { translation: locales.pt },
  en: { translation: locales.en },
  fr: { translation: locales.fr },
  es: { translation: locales.es },
  ko: { translation: locales.ko }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;