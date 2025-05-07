import React, { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink, Translate, Check, X } from 'lucide-react';
import { identifyTemplateDocType } from '../../utils/documentUtils';
import { useTranslation } from 'react-i18next';
import DocumentViewerContent from './DocumentViewerContent';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';

interface DocumentViewerProps {
  document: {
    id: string | number;
    name: string;
    fileType: string;
    url: string;
    createdAt: Date;
    fileSize: number;
    isVerified?: boolean;
    referenceNumber?: string;
    contractId?: string | number | null;
    contractName?: string | null;
  };
  onClose?: () => void;
}

export default function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language || 'en');
  
  const documentType = identifyTemplateDocType(document.url);
  
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await fetch(document.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.statusText}`);
        }
        
        const text = await response.text();
        setContent(text);
        setLoading(false);
      } catch (err) {
        setError(`Error loading document: ${err instanceof Error ? err.message : String(err)}`);
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [document.url]);
  
  // When language changes, hide translation until it's ready
  useEffect(() => {
    if (showTranslation) {
      setTranslatedContent('');
      const translateDocument = async () => {
        // In a real implementation, this would call a translation API
        // For now, we'll simulate translation by showing the content with
        // a header indicating the language
        const header = `[Document translated to ${i18n.t('common.language', { lng: currentLanguage })}]\n\n`;
        // Wait a moment to simulate translation process
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setTranslatedContent(header + content);
      };
      
      translateDocument();
    }
  }, [currentLanguage, showTranslation, content, i18n]);
  
  const handleLanguageChange = (value: string) => {
    setCurrentLanguage(value);
    i18n.changeLanguage(value);
  };
  
  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };
  
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = document.name || 'document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">{t('common.error')}</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              {t('common.close')}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b px-6 py-4 bg-white flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">{document.name}</h2>
          {document.isVerified && (
            <Badge variant="success" className="ml-2">
              <Check className="h-3 w-3 mr-1" />
              {t('common.verified')}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDownload}
            className="text-gray-600 hover:text-gray-900"
            title={t('documents.downloadOriginal')}
          >
            <Download className="h-5 w-5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
              title={t('common.close')}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      <div className="border-b px-6 py-2 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{t('documents.documentType')}:</span>{' '}
          {t(`documentTypes.${documentType.toLowerCase().replace(/ /g, '')}.title`, documentType)}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="translate-toggle" className="text-sm font-medium cursor-pointer">
              {t('documents.translate')}
            </Label>
            <Switch
              id="translate-toggle"
              checked={showTranslation}
              onCheckedChange={toggleTranslation}
            />
          </div>
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue>{currentLanguage === 'en' ? 'English' : currentLanguage === 'fr' ? 'Français' : 'Español'}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {showTranslation ? (
          <Tabs defaultValue="original" className="h-full flex flex-col">
            <div className="border-b px-4 bg-white">
              <TabsList className="mt-1">
                <TabsTrigger value="original">{t('documents.originalText')}</TabsTrigger>
                <TabsTrigger value="translated">{t('documents.translatedText')}</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="original" className="flex-1 overflow-auto p-4">
              <DocumentViewerContent content={content} documentType={documentType} />
            </TabsContent>
            <TabsContent value="translated" className="flex-1 overflow-auto p-4">
              {translatedContent ? (
                <DocumentViewerContent content={translatedContent} documentType={documentType} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="mt-2 text-gray-600">{t('common.loading')}</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="h-full overflow-auto p-4">
            <DocumentViewerContent content={content} documentType={documentType} />
          </div>
        )}
      </div>
      
      <div className="border-t px-6 py-3 bg-gray-50 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <div>
            {document.referenceNumber && (
              <span className="mr-4">
                <span className="font-medium">{t('documents.referenceNumber')}:</span>{' '}
                {document.referenceNumber}
              </span>
            )}
            {document.contractId && document.contractName && (
              <span>
                <span className="font-medium">{t('documents.associatedContract')}:</span>{' '}
                {document.contractName}
              </span>
            )}
          </div>
          <div>
            {document.isVerified && (
              <a 
                href={`https://baseexplorer.org/`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                {t('documents.verifyOnBlockchain')}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}