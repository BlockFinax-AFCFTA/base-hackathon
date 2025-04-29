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
  const { language, translate } = useLanguage();
  const [text, setText] = useState<string>('This is a test of the OpenAI-enhanced translation system. It is designed to provide accurate translations for complex sentences and phrases that go beyond simple word-by-word translation.');
  const [useAI, setUseAI] = useState<boolean>(true);
  
  const examples = [
    'This is a test of the OpenAI-enhanced translation system.',
    'International trade requires clear communication across language barriers.',
    'We need to verify that all shipping documents are properly authenticated before release of funds.',
    'The escrow account protects both buyers and sellers by holding funds securely until contract conditions are met.',
    'Risk assessment shows a medium probability of supply chain disruption in the eastern shipping routes.'
  ];

  const handleExampleClick = (example: string) => {
    setText(example);
  };

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
              <h3 className="font-medium mb-2">
                <span>Translated Text ({language}):</span>
              </h3>
              <div className="p-3 bg-card rounded-md">
                <p>
                  This feature is currently in development. When completed, you'll be able to:
                  <ul className="list-disc ml-5 mt-2">
                    <li>Translate complex business documents</li>
                    <li>Communicate with international partners seamlessly</li>
                    <li>Understand contract terms in your preferred language</li>
                    <li>Switch between AI-powered and dictionary-based translation</li>
                  </ul>
                </p>
              </div>
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