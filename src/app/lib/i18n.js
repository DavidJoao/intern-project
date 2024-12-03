import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import commonEN from '../../../public/locales/en/common.json';
import commonES from '../../../public/locales/es/common.json';

i18next.use(initReactI18next).init({
  resources: {
    en: { common: commonEN },
    es: { common: commonES }
  },
  lng: 'en', 
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18next;