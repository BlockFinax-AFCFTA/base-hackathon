import { useState, useEffect } from 'react';
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TranslationService } from '../services/translationService';

/**
 * Custom hook for translating dynamic content
 * @param text - The original text to translate (in English)
 * @returns The translated text based on the current language
 */
export const useTranslation = (text: string) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);

  useEffect(() => {
    if (language === 'en') {
      // No need to translate if already in English
      setTranslatedText(text);
      return;
    }

    const translateText = async () => {
      try {
        const result = TranslationService.translateDynamicContent(text, language);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text); // Fallback to original text
      }
    };

    translateText();
  }, [text, language]);

  return translatedText;
};

interface TransProps {
  children: string;
  values?: Record<string, string | number>;
}

/**
 * Component for displaying translated text
 * @param props - Component props
 * @returns A React element with translated text
 */
export const Trans: React.FC<TransProps> = (props) => {
  const { children, values = {} } = props;
  const translatedText = useTranslation(children);
  
  // Replace placeholders with values
  let finalText = translatedText;
  
  if (values && Object.keys(values).length > 0) {
    Object.entries(values).forEach(([key, value]) => {
      const placeholder = '{' + key + '}';
      finalText = finalText.replace(placeholder, String(value));
    });
  }
  
  return React.createElement(React.Fragment, null, finalText);
};