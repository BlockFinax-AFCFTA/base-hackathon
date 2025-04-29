import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Textarea } from './textarea';
import { Label } from './label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Switch } from './switch';

/**
 * Component to demonstrate the translation capabilities
 */
export function TranslationDemo() {
  const { language, translate, translateDynamic } = useLanguage();
  const [text, setText] = useState<string>('This is a test of the OpenAI-enhanced translation system. It is designed to provide accurate translations for complex sentences and phrases that go beyond simple word-by-word translation.');
  const [useAI, setUseAI] = useState<boolean>(true);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const examples = [
    'This is a test of the OpenAI-enhanced translation system.',
    'International trade requires clear communication across language barriers.',
    'We need to verify that all shipping documents are properly authenticated before release of funds.',
    'The escrow account protects both buyers and sellers by holding funds securely until contract conditions are met.',
    'Risk assessment shows a medium probability of supply chain disruption in the eastern shipping routes.'
  ];

  // Translate the text
  React.useEffect(() => {
    const translateText = async () => {
      if (language === 'en') return;
      
      setIsTranslating(true);
      try {
        const result = await translateDynamic(text);
        setTranslatedText(result);
      } catch (error) {
        console.error('Error translating text:', error);
        setTranslatedText(text);
      } finally {
        setIsTranslating(false);
      }
    };
    
    translateText();
  }, [text, language, useAI]);

  const handleExampleClick = (example: string) => {
    setText(example);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{translate('translation.demo')}</CardTitle>
        <CardDescription>
          {translate('translation.testSystem')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="ai-mode" 
              checked={useAI}
              onCheckedChange={setUseAI}
            />
            <Label htmlFor="ai-mode">
              {useAI ? (
                translate('translation.usingAI')
              ) : (
                translate('translation.usingDict')
              )}
            </Label>
          </div>

          <Tabs defaultValue="input">
            <TabsList className="mb-4">
              <TabsTrigger value="input">{translate('translation.inputText')}</TabsTrigger>
              <TabsTrigger value="examples">{translate('translation.examples')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="input" className="space-y-4">
              <div>
                <Label htmlFor="text-input">{translate('translation.enterEnglish')}</Label>
                <Textarea 
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="mt-1"
                  placeholder="Enter text in English to translate"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="space-y-2">
              {examples.map((example, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-2" 
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </Button>
              ))}
            </TabsContent>
          </Tabs>
          
          {language !== 'en' && (
            <div className="mt-6 p-4 border rounded-md bg-muted/20">
              <h3 className="font-medium mb-2">
                <span>Translated Text ({language}):</span>
              </h3>
              <div className="p-3 bg-card rounded-md">
                {isTranslating ? (
                  <p className="text-gray-400">Translating...</p>
                ) : (
                  <p>{translatedText}</p>
                )}
              </div>
            </div>
          )}
          
          {language === 'en' && (
            <div className="mt-6 p-4 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">
                {translate('translation.selectLanguage')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}