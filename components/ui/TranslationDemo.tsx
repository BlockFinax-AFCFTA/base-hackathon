import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Textarea } from './textarea';
import { Label } from './label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Switch } from './switch';
import { Loader2 } from 'lucide-react';
import { DynamicTranslate } from './translation';

/**
 * Component to demonstrate the translation capabilities
 */
export function TranslationDemo() {
  const { language, translateDynamic } = useLanguage();
  const [text, setText] = useState<string>('This is a test of the OpenAI-enhanced translation system. It is designed to provide accurate translations for complex sentences and phrases that go beyond simple word-by-word translation.');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [useAI, setUseAI] = useState<boolean>(true);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const examples = [
    'This is a test of the OpenAI-enhanced translation system.',
    'International trade requires clear communication across language barriers.',
    'We need to verify that all shipping documents are properly authenticated before release of funds.',
    'The escrow account protects both buyers and sellers by holding funds securely until contract conditions are met.',
    'Risk assessment shows a medium probability of supply chain disruption in the eastern shipping routes.',
    'Contract terms must be translated accurately to ensure all parties understand their obligations.',
    'Letter of Credit documentation requires precise translation to avoid payment delays.'
  ];

  const handleExampleClick = (example: string) => {
    setText(example);
  };
  
  // Translate text when language, text, or AI mode changes
  useEffect(() => {
    // Don't translate if language is English or text is empty
    if (language === 'en' || !text.trim()) {
      setTranslatedText('');
      return;
    }
    
    const performTranslation = async () => {
      setIsTranslating(true);
      setError(null);
      
      try {
        // Set custom import with AI toggle preference
        const { TranslationService } = await import('../../services/translationService');
        
        let result;
        if (useAI) {
          // Force AI translation regardless of text length
          result = await TranslationService.aiTranslate(text, language);
        } else {
          // Force dictionary translation
          result = TranslationService.localDictionaryTranslate(text, language);
        }
        
        setTranslatedText(result);
      } catch (err) {
        console.error('Translation error:', err);
        setError('Translation failed. Please try again.');
        setTranslatedText('');
      } finally {
        setIsTranslating(false);
      }
    };
    
    performTranslation();
  }, [language, text, useAI]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Translation Demo</CardTitle>
        <CardDescription>
          Test the AI-enhanced translation system with your own text
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
              {useAI ? "Using AI Translation (OpenAI)" : "Using Dictionary Translation"}
            </Label>
          </div>

          <Tabs defaultValue="input">
            <TabsList className="mb-4">
              <TabsTrigger value="input">Input Text</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="input" className="space-y-4">
              <div>
                <Label htmlFor="text-input">Enter English text to translate</Label>
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
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">
                  <span>Translated Text ({language}):</span>
                </h3>
                {isTranslating && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Translating...</span>
                  </div>
                )}
              </div>
              
              {error ? (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md">
                  {error}
                </div>
              ) : isTranslating ? (
                <div className="p-3 bg-card rounded-md min-h-[100px] flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : translatedText ? (
                <div className="p-3 bg-card rounded-md">
                  <p>{translatedText}</p>
                </div>
              ) : (
                <div className="p-3 bg-card rounded-md min-h-[100px] flex items-center justify-center text-muted-foreground">
                  Ready to translate
                </div>
              )}
            </div>
          )}
          
          {language === 'en' && (
            <div className="mt-6 p-4 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">
                Please select a language other than English to see the translation
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}