import React from 'react';
import { Trans, useLanguage } from '../../../../context/LanguageContext';
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

/**
 * Component that demonstrates the use of the Trans component for complex translations
 * with variables and nested components
 */
const TranslationExample: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Trans i18nKey="translation.demo" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Simple Translation:</h3>
            <p><Trans i18nKey="dashboard.aiTranslationDesc" /></p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Translation with Variables:</h3>
            <p>
              <Trans 
                i18nKey="translation.withVariables" 
                values={{ 
                  language: language,
                  count: 5
                }} 
              />
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Translation with Components:</h3>
            <p>
              <Trans 
                i18nKey="translation.withComponents"
                components={{
                  bold: <strong className="font-bold" />,
                  button: <Button variant="outline" size="sm" className="mx-2" />
                }}
              />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationExample;