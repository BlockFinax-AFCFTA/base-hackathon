import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import DocumentViewer from '../components/documents/DocumentViewer';

// Sample document data
const sampleDocuments = [
  {
    id: "1",
    name: "Bill of Lading - GTI-SHAN-2025-05",
    fileType: "txt",
    url: "/sample-docs/bill-of-lading-template.txt",
    fileSize: 2048,
    createdAt: new Date(),
    isVerified: true,
    referenceNumber: "BOL-2025-05-12345"
  },
  {
    id: "2",
    name: "Certificate of Origin - Electronic Components",
    fileType: "txt",
    url: "/sample-docs/certificate-of-origin-template.txt",
    fileSize: 1536,
    createdAt: new Date(),
    isVerified: true,
    referenceNumber: "COO-2025-05-54321"
  }
];

const DocumentTranslatorPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedDocument, setSelectedDocument] = useState<any>(sampleDocuments[0]);
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);

  // Update UI when language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // Language toggle function
  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('documents.title')} - {t('common.translate')}
        </h1>
        <p className="text-gray-600 mb-4">
          {t('documents.translate')} {t('documents.description')}
        </p>
        
        {/* Language Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button 
              onClick={() => switchLanguage('en')}
              className={`px-3 py-1 rounded ${currentLanguage === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              English
            </button>
            <button 
              onClick={() => switchLanguage('fr')}
              className={`px-3 py-1 rounded ${currentLanguage === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Français
            </button>
            <button 
              onClick={() => switchLanguage('es')}
              className={`px-3 py-1 rounded ${currentLanguage === 'es' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Español
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {t('common.language')}
          </div>
        </div>
      </header>

      {/* Document Selection Tabs */}
      <Tabs defaultValue={selectedDocument.id} onValueChange={(value) => {
        const doc = sampleDocuments.find(d => d.id === value);
        if (doc) setSelectedDocument(doc);
      }}>
        <TabsList className="mb-4">
          {sampleDocuments.map(doc => (
            <TabsTrigger key={doc.id} value={doc.id}>
              {doc.name.split(' - ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {sampleDocuments.map(doc => (
          <TabsContent key={doc.id} value={doc.id}>
            {selectedDocument && selectedDocument.id === doc.id && (
              <DocumentViewer document={selectedDocument} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DocumentTranslatorPage;