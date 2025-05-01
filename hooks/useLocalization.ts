import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for easy access to i18next translation functionality
 * This provides a consistent way to use translations throughout the application
 * 
 * @param {string} namespace Optional namespace for the translations
 * @returns {Object} Translation utilities and current language information
 */
export const useLocalization = (namespace?: string) => {
  const { language, setLanguage, translateDynamic } = useLanguage();
  const { t: i18nextT } = useTranslation(namespace);

  /**
   * Translates a key with optional variable substitution
   * Uses the i18next t function which already handles variable substitution
   * 
   * @param key The translation key to use
   * @param variables Optional variables for dynamic content in translations
   * @param options Additional options for translation
   * @returns Translated string
   */
  const t = (
    key: string, 
    variables?: Record<string, string | number>,
    options?: { ns?: string }
  ): string => {
    return i18nextT(key, { ...variables, ...options });
  };

  return {
    language,
    setLanguage,
    t,
    translateDynamic,
    ns: namespace,
  };
};