import React, { ReactNode, useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface TranslateProps {
  text: string;
  values?: Record<string, string | number>;
}

/**
 * Component for static UI text that uses translation keys
 */
export const Translate: React.FC<TranslateProps> = ({ text, values = {} }) => {
  const { translate } = useLanguage();
  
  // Replace placeholders with values
  let translatedText = translate(text);
  
  if (values && Object.keys(values).length > 0) {
    Object.entries(values).forEach(([key, value]) => {
      translatedText = translatedText.replace(`{${key}}`, String(value));
    });
  }
  
  return <>{translatedText}</>;
};

interface DynamicTranslateProps {
  children: string;
}

/**
 * Component for dynamic content that needs to be translated on the fly
 */
export const DynamicTranslate: React.FC<DynamicTranslateProps> = ({ children }) => {
  const { translateDynamic } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(children);
  
  useEffect(() => {
    const translateText = async () => {
      try {
        const result = await translateDynamic(children);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(children); // Fallback to original text
      }
    };
    
    translateText();
  }, [children, translateDynamic]);
  
  return <>{translatedText}</>;
};

interface FormattedMessageProps {
  id: string;
  values?: Record<string, string | number>;
  children?: ReactNode;
}

/**
 * Component that mimics popular i18n libraries like react-intl
 * Can be used with either translation keys or direct text
 */
export const FormattedMessage: React.FC<FormattedMessageProps> = ({ 
  id, 
  values = {}, 
  children 
}) => {
  // If the component has children, use it as a fallback
  if (children) {
    return (
      <Translate text={id} values={values} />
    );
  }
  
  return <Translate text={id} values={values} />;
};