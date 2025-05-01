import { useLanguage } from '../context/LanguageContext';

/**
 * Custom hook for easy access to i18next translation functionality
 * This provides a consistent way to use translations throughout the application
 * 
 * @returns {Object} Translation utilities and current language information
 */
export const useLocalization = () => {
  const { language, setLanguage, translate, translateDynamic } = useLanguage();

  /**
   * Translates a key with optional variable substitution
   * @param key The translation key to use
   * @param variables Optional variables for dynamic content in translations
   * @returns Translated string
   */
  const t = (key: string, variables?: Record<string, string | number>): string => {
    if (!variables) {
      return translate(key);
    }
    
    // Handle variable substitution manually for simple cases
    let translatedText = translate(key);
    
    Object.entries(variables).forEach(([varName, varValue]) => {
      const placeholder = new RegExp(`{{${varName}}}`, 'g');
      translatedText = translatedText.replace(placeholder, String(varValue));
    });
    
    return translatedText;
  };

  return {
    language,
    setLanguage,
    t,
    translateDynamic,
  };
};