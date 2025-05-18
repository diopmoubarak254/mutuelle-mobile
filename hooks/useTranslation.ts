import { useMemo } from 'react';
import { I18n } from 'i18n-js';
import { useLanguage } from './useLanguage';

// Import translations
import translationsFR from '@/translations/fr.json';
import translationsWO from '@/translations/wo.json';
import translationsFF from '@/translations/ff.json';
import translationsSRR from '@/translations/srr.json';

const translations = {
  fr: translationsFR,
  wo: translationsWO,
  ff: translationsFF,
  srr: translationsSRR,
};

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const i18n = useMemo(() => {
    const i18nInstance = new I18n(translations);
    i18nInstance.locale = language;
    i18nInstance.enableFallback = true;
    i18nInstance.defaultLocale = 'fr';
    return i18nInstance;
  }, [language]);
  
  const t = (key: string, options?: any) => {
    return i18n.t(key, options);
  };
  
  return { t, language };
};