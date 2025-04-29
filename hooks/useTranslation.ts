import { useState, useEffect } from 'react';
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TranslationService } from '../services/translationService';

/**
 * Custom hook for translating dynamic content
 * @param text - The original text to translate (in English)
 * @param options - Options for translation (useAI: whether to prefer AI translation)
 * @returns The translated text based on the current language
 */
export const useTranslation = (text: string, options?: { useAI?: boolean }) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (language === 'en') {
      // No need to translate if already in English
      setTranslatedText(text);
      return;
    }

    const translateText = async () => {
      try {
        setIsLoading(true);
        
        // Get the translation result - this might be a Promise or a string
        const result = TranslationService.translateDynamicContent(text, language);
        
        // If it's a Promise (using AI translation), await it
        if (result instanceof Promise) {
          const translatedResult = await result;
          setTranslatedText(translatedResult);
        } else {
          // It's a direct string result (using dictionary)
          setTranslatedText(result);
        }
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text); // Fallback to original text
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [text, language, options?.useAI]);

  return { translatedText, isLoading };
};

interface TransProps {
  children: string;
  values?: Record<string, string | number>;
  useAI?: boolean;
}

/**
 * Component for displaying translated text
 * @param props - Component props
 * @returns A React element with translated text
 */
export const Trans: React.FC<TransProps> = (props) => {
  const { children, values = {}, useAI = false } = props;
  const { translatedText, isLoading } = useTranslation(children, { useAI });
  
  // Replace placeholders with values
  let finalText = translatedText;
  
  if (values && Object.keys(values).length > 0) {
    Object.entries(values).forEach(([key, value]) => {
      const placeholder = '{' + key + '}';
      finalText = finalText.replace(placeholder, String(value));
    });
  }
  
  if (isLoading) {
    return React.createElement(React.Fragment, null, 
      React.createElement('span', { className: 'text-gray-400' }, finalText)
    );
  }
  
  return React.createElement(React.Fragment, null, finalText);
};