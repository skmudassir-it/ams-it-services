import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from './en.json';
import es from './es.json';

const STORAGE_KEY = 'ams-lang';
const saved = (() => {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
})();
const initial = saved || (navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en');

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: initial,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnObjects: true,
});

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  try { localStorage.setItem(STORAGE_KEY, lng); } catch {}
});
document.documentElement.lang = initial;

// Picks the localized value from `{ en, es }` objects or `field_en` / `field_es` columns.
export function useLocalized() {
  const { i18n: inst } = useTranslation();
  const lang = inst.language?.startsWith('es') ? 'es' : 'en';
  const pick = (obj, field) => {
    if (!obj) return '';
    if (field) return obj[`${field}_${lang}`] || obj[`${field}_en`] || '';
    return obj[lang] ?? obj.en;
  };
  return { lang, pick };
}

export default i18n;
