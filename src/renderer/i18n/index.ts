import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './translations/en.json';
import ruTranslation from './translations/ru.json';
import uaTranslation from './translations/ua.json';
import { getLang } from '../helpers/local-storage/language';

i18next.use(initReactI18next).init({
  lng: getLang() ?? 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: enTranslation,
    },
    ru: {
      translation: ruTranslation,
    },
    ua: {
      translation: uaTranslation,
    },
  },
});

export default i18next;
