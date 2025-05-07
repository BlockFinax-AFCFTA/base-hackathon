import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import DocumentViewerContent from './DocumentViewerContent';

interface DocumentViewerProps {
  document: {
    id: string;
    name: string;
    fileType: string;
    url: string;
    fileSize: number;
    createdAt: Date;
    isVerified: boolean;
    referenceNumber?: string;
  };
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const { t, i18n } = useTranslation();
  const [documentContent, setDocumentContent] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [showOriginal, setShowOriginal] = useState<boolean>(true);
  const [targetLanguage, setTargetLanguage] = useState<string>(i18n.language);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Determine document type from filename
  useEffect(() => {
    if (document.name.includes('Bill of Lading')) {
      setDocumentType('Bill of Lading');
    } else if (document.name.includes('Certificate of Origin')) {
      setDocumentType('Certificate of Origin');
    } else if (document.name.includes('Letter of Credit')) {
      setDocumentType('Letter of Credit');
    } else if (document.name.includes('Phytosanitary')) {
      setDocumentType('Phytosanitary Certificate');
    } else {
      setDocumentType('Generic Document');
    }
  }, [document.name]);

  // Fetch document content
  useEffect(() => {
    setIsLoading(true);
    
    fetch(document.url)
      .then(response => response.text())
      .then(text => {
        setDocumentContent(text);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading document:', error);
        setIsLoading(false);
      });
  }, [document.url]);

  // Update target language when i18n language changes
  useEffect(() => {
    setTargetLanguage(i18n.language);
  }, [i18n.language]);

  // Handle target language change
  const handleLanguageChange = (value: string) => {
    setTargetLanguage(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Document Header */}
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-xl font-semibold mb-1">{document.name}</h2>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {documentType} • {document.referenceNumber}
          </div>
          <div className="flex items-center space-x-2">
            {document.isVerified && (
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {t('documents.verified')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="translation"
              checked={showTranslation}
              onCheckedChange={setShowTranslation}
            />
            <Label htmlFor="translation">{t('documents.showTranslation')}</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="original"
              checked={showOriginal}
              onCheckedChange={setShowOriginal}
            />
            <Label htmlFor="original">{t('documents.showOriginal')}</Label>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="targetLanguage">{t('documents.targetLanguage')}</Label>
          <Select
            value={targetLanguage}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger id="targetLanguage" className="w-40">
              <SelectValue placeholder={t('documents.selectLanguage')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Document Content */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <DocumentViewerContent 
            documentType={documentType}
            content={documentContent}
            showTranslation={showTranslation}
            showOriginal={showOriginal}
            targetLanguage={targetLanguage}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;