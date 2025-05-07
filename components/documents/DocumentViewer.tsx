import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Download, ExternalLink, FileText, Check, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { identifyTemplateDocType, isTemplateDocument, getDocumentIcon, formatFileSize } from '../../utils/documentUtils';
import DocumentViewerContent from './DocumentViewerContent';

interface DocumentViewerProps {
  document: {
    id: string | number;
    name: string;
    fileType: string;
    url: string;
    fileSize: number;
    createdAt: Date;
    contractId?: string | number | null;
    contractName?: string | null;
    isVerified?: boolean;
    referenceNumber?: string;
  };
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('details');
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [targetLanguage, setTargetLanguage] = useState<string>(i18n.language !== 'en' ? i18n.language : 'fr');
  const [documentContent, setDocumentContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showOriginal, setShowOriginal] = useState<boolean>(true);

  const docType = identifyTemplateDocType(document.name, documentContent);
  const isTemplate = isTemplateDocument(document.name);

  useEffect(() => {
    const fetchDocumentContent = async () => {
      if (isTemplate && document.url) {
        setIsLoading(true);
        try {
          const response = await fetch(document.url);
          const text = await response.text();
          setDocumentContent(text);
        } catch (error) {
          console.error('Error fetching document content:', error);
          setDocumentContent('Error loading document content');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDocumentContent();
  }, [document.url, isTemplate]);

  const handleLanguageChange = (value: string) => {
    setTargetLanguage(value);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(documentContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  const toggleOriginal = () => {
    setShowOriginal(!showOriginal);
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] bg-white rounded-lg shadow-lg">
      {/* Document Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-lg">{document.name}</h3>
          {document.isVerified && (
            <Badge variant="success" className="ml-2">
              <Check className="h-3 w-3 mr-1" />
              {t('common.verified')}
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <a 
            href={document.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            {t('documents.viewOriginal')}
          </a>
          <a 
            href={document.url} 
            download 
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            {t('documents.downloadOriginal')}
          </a>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="flex flex-col flex-grow">
        <div className="border-b px-4">
          <TabsList className="bg-transparent">
            <TabsTrigger 
              value="details"
              onClick={() => setActiveTab('details')}
              className={activeTab === 'details' ? 'border-b-2 border-blue-600' : ''}
            >
              {t('common.details')}
            </TabsTrigger>
            <TabsTrigger 
              value="content"
              onClick={() => setActiveTab('content')}
              className={activeTab === 'content' ? 'border-b-2 border-blue-600' : ''}
            >
              {isTemplate ? docType : t('documents.documentContent')}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Details Tab */}
        <TabsContent value="details" className="flex-grow overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-3">{t('documents.documentDetails')}</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">{t('documents.documentType')}</label>
                  <p>{docType}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">{t('documents.documentName')}</label>
                  <p>{document.name}</p>
                </div>
                {document.referenceNumber && (
                  <div>
                    <label className="text-sm text-gray-500">{t('documents.referenceNumber')}</label>
                    <p>{document.referenceNumber}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-500">{t('documents.uploadDate')}</label>
                  <p>{new Date(document.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">{t('common.fileSize')}</label>
                  <p>{formatFileSize(document.fileSize)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">{t('common.fileType')}</label>
                  <p>{document.fileType}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">{t('documents.associatedContract')}</h4>
              <div className="space-y-3">
                {document.contractId ? (
                  <>
                    <div>
                      <label className="text-sm text-gray-500">{t('contracts.contractName')}</label>
                      <p>{document.contractName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">{t('contracts.contractStatus')}</label>
                      <p>Active</p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">{t('common.notAvailable')}</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="flex-grow flex flex-col overflow-hidden">
          {isTemplate ? (
            <>
              {/* Translation Controls */}
              <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="translation-toggle"
                      checked={showTranslation}
                      onCheckedChange={toggleTranslation}
                    />
                    <Label htmlFor="translation-toggle" className="cursor-pointer">
                      {t('documents.translate')}
                    </Label>
                  </div>
                  
                  {showTranslation && (
                    <div className="flex items-center space-x-2">
                      <ArrowLeftRight className="h-4 w-4" />
                      <Select
                        value={targetLanguage}
                        onValueChange={handleLanguageChange}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {showTranslation && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="original-toggle"
                        checked={showOriginal}
                        onCheckedChange={toggleOriginal}
                      />
                      <Label htmlFor="original-toggle" className="cursor-pointer">
                        {t('documents.originalText')}
                      </Label>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleCopyContent}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              
              {/* Document Content */}
              <div className="flex-grow overflow-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <DocumentViewerContent
                    documentType={docType}
                    content={documentContent}
                    showTranslation={showTranslation}
                    showOriginal={showOriginal}
                    targetLanguage={targetLanguage}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Document Preview Not Available</h3>
              <p className="text-gray-500 max-w-md">
                This document cannot be previewed. Please download or open the document externally to view its contents.
              </p>
              <div className="mt-4 flex space-x-4">
                <a
                  href={document.url}
                  download
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
                <a
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Externally
                </a>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentViewer;