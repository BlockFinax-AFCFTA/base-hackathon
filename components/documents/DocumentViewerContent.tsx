import React, { useState, useEffect } from 'react';
import { Loader2, FileText, Stamp, Ship, CreditCard, FileCheck, AlertTriangle, Globe, Languages, Check, ChevronDown } from 'lucide-react';
import { identifyTemplateDocType } from '../../utils/documentUtils';
import { useTranslation } from 'react-i18next';
import '../../lib/i18n';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

interface DocumentViewerContentProps {
  url: string;
  fileType: string;
}

// Helper component for document field translation
interface FieldLabelProps {
  original: string;
  translationKey: string;
  showTranslation: boolean;
}

const FieldLabel: React.FC<FieldLabelProps> = ({ original, translationKey, showTranslation }) => {
  const { t } = useTranslation();
  
  if (!showTranslation) return <span>{original}</span>;
  
  return <span>{t(translationKey)}</span>;
};

// Document section component
interface DocumentSectionProps {
  title: string;
  translationKey: string;
  showTranslation: boolean;
  children: React.ReactNode;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({ 
  title, 
  translationKey, 
  showTranslation, 
  children 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-6">
      <h3 className="font-bold mb-2 text-gray-800 border-b pb-1">
        {showTranslation ? t(translationKey) : title}
      </h3>
      <div className="pl-2">
        {children}
      </div>
    </div>
  );
};

const DocumentViewerContent: React.FC<DocumentViewerContentProps> = ({ url, fileType }) => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language || 'en');
  const [activeTab, setActiveTab] = useState<string>('original');

  // Available languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' },
    { code: 'sw', name: 'Kiswahili' }
  ];
  
  // Change language
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
  };

  useEffect(() => {
    const fetchDocumentContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if the URL is provided and valid
        if (!url) {
          throw new Error('Invalid document URL');
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        console.log('Document content loaded successfully');
        setContent(text);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (url) {
      fetchDocumentContent();
    } else {
      setError('No document URL provided');
      setIsLoading(false);
    }
  }, [url]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">{t('ui.loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>{t('ui.error')}: {error}</p>
        </div>
      </div>
    );
  }

  // Get document type for the banner
  const documentType = identifyTemplateDocType(url);
  const translationKey = (() => {
    if (documentType.includes('Bill of Lading')) return 'documentType.billOfLading';
    if (documentType.includes('Letter of Credit')) return 'documentType.letterOfCredit';
    if (documentType.includes('Certificate of Origin')) return 'documentType.certificateOfOrigin';
    if (documentType.includes('Phytosanitary')) return 'documentType.phytosanitary';
    if (documentType.includes('Commercial Invoice')) return 'documentType.commercialInvoice';
    if (documentType.includes('Packing List')) return 'documentType.packingList';
    if (documentType.includes('Insurance')) return 'documentType.insuranceCertificate';
    return 'documentType.document';
  })();
  
  // Choose icon based on document type
  const getDocumentIcon = () => {
    if (documentType.includes('Bill of Lading')) {
      return <Ship className="h-5 w-5 mr-2" />;
    } else if (documentType.includes('Letter of Credit')) {
      return <CreditCard className="h-5 w-5 mr-2" />;
    } else if (documentType.includes('Certificate')) {
      return <Stamp className="h-5 w-5 mr-2" />;
    } else {
      return <FileText className="h-5 w-5 mr-2" />;
    }
  };

  // Format the content based on document type for original view
  const renderOriginalContent = () => {
    return (
      <pre className="font-mono whitespace-pre-wrap text-sm overflow-auto max-h-[600px] p-4 leading-relaxed">
        {content}
      </pre>
    );
  };

  // Render Bill of Lading in translated format
  const renderBillOfLading = () => {
    if (!documentType.includes('Bill of Lading')) return null;
    
    return (
      <div className="p-4">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-1">
            {showTranslation ? t('documentType.billOfLading') : 'BILL OF LADING'}
          </h1>
          <div className="border-b border-gray-300 w-full mb-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <DocumentSection 
              title="SHIPPER/EXPORTER" 
              translationKey="document.shipper" 
              showTranslation={showTranslation}
            >
              <p className="text-sm">African Coffee Exporters Ltd.</p>
              <p className="text-sm">123 Export Drive, Mombasa</p>
              <p className="text-sm">Kenya, East Africa</p>
            </DocumentSection>
          </div>
          
          <div>
            <DocumentSection 
              title="CONSIGNEE" 
              translationKey="document.consignee" 
              showTranslation={showTranslation}
            >
              <p className="text-sm">European Coffee Distributors B.V.</p>
              <p className="text-sm">Havenlaan 42</p>
              <p className="text-sm">3000 Rotterdam, Netherlands</p>
            </DocumentSection>
          </div>
        </div>
        
        <DocumentSection 
          title="VESSEL/VOYAGE" 
          translationKey="document.vessel" 
          showTranslation={showTranslation}
        >
          <p className="text-sm">MV Atlantic Navigator / V.125E</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm font-medium">
                <FieldLabel 
                  original="Port of Loading" 
                  translationKey="document.portOfLoading" 
                  showTranslation={showTranslation} 
                />: 
                <span className="font-normal ml-1">Mombasa, Kenya</span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">
                <FieldLabel 
                  original="Port of Discharge" 
                  translationKey="document.portOfDischarge" 
                  showTranslation={showTranslation} 
                />: 
                <span className="font-normal ml-1">Rotterdam, Netherlands</span>
              </p>
            </div>
          </div>
        </DocumentSection>
        
        <DocumentSection 
          title="PARTICULARS FURNISHED BY SHIPPER" 
          translationKey="document.description" 
          showTranslation={showTranslation}
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-1">
                  <FieldLabel 
                    original="Marks & Numbers" 
                    translationKey="document.marksAndNumbers" 
                    showTranslation={showTranslation} 
                  />
                </th>
                <th className="text-left p-1">
                  <FieldLabel 
                    original="No. of Pkgs" 
                    translationKey="document.containerNo" 
                    showTranslation={showTranslation} 
                  />
                </th>
                <th className="text-left p-1">
                  <FieldLabel 
                    original="Description of Goods" 
                    translationKey="document.description" 
                    showTranslation={showTranslation} 
                  />
                </th>
                <th className="text-left p-1">
                  <FieldLabel 
                    original="Gross Weight" 
                    translationKey="document.grossWeight" 
                    showTranslation={showTranslation} 
                  />
                </th>
                <th className="text-left p-1">
                  <FieldLabel 
                    original="Measurement" 
                    translationKey="document.measurement" 
                    showTranslation={showTranslation} 
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-1 align-top">ECDB-2025-KE<br />Lot# 20250417</td>
                <td className="p-1 align-top">320 bags</td>
                <td className="p-1 align-top">
                  Green Coffee Beans<br />
                  Kenyan AA Grade<br />
                  PRODUCT OF KENYA<br />
                  Certified Organic<br />
                  Harvest: March 2025
                </td>
                <td className="p-1 align-top">19,200 kg</td>
                <td className="p-1 align-top">40 CBM</td>
              </tr>
            </tbody>
          </table>
        </DocumentSection>
        
        <DocumentSection 
          title="FREIGHT CHARGES" 
          translationKey="billOfLading.freight" 
          showTranslation={showTranslation}
        >
          <p className="text-sm">
            <FieldLabel 
              original="Prepaid" 
              translationKey="billOfLading.prepaid" 
              showTranslation={showTranslation} 
            /> [X]  
            <FieldLabel 
              original="Collect" 
              translationKey="billOfLading.collect" 
              showTranslation={showTranslation} 
            /> [ ]
          </p>
        </DocumentSection>
        
        <div className="mb-6">
          <p className="text-sm font-medium">
            <FieldLabel 
              original="DECLARED VALUE" 
              translationKey="billOfLading.declaredValue" 
              showTranslation={showTranslation} 
            />: 
            <span className="font-normal ml-1">USD 154,000.00</span>
          </p>
        </div>
        
        <div className="text-center mt-8 mb-4">
          <p className="text-sm font-medium">BLOCKCHAIN VERIFICATION</p>
          <p className="text-sm mt-1">Transaction Hash: 0x7d982f7583d5b0e5d5332acdf911c36157bd0eebd62ae0c4de0b3aee47ba9ab3</p>
          <p className="text-sm mt-1">Verification URL: <a href="#" className="text-blue-600 hover:underline">https://baseexplorer.org/tx/0x7d982f7583d5b0e5d5332acdf911c36157bd0eebd62ae0c4de0b3aee47ba9ab3</a></p>
        </div>
      </div>
    );
  };

  // Render Letter of Credit in translated format
  const renderLetterOfCredit = () => {
    if (!documentType.includes('Letter of Credit')) return null;
    
    return (
      <div className="p-4">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-1">
            {showTranslation ? t('documentType.letterOfCredit') : 'IRREVOCABLE DOCUMENTARY LETTER OF CREDIT'}
          </h1>
          <div className="border-b border-gray-300 w-full mb-4"></div>
          <div className="flex justify-between text-sm">
            <p>
              <span className="font-medium">
                Letter of Credit Number:
              </span> LC-2025-001
            </p>
            <p>
              <span className="font-medium">
                <FieldLabel 
                  original="Date of Issue" 
                  translationKey="document.date" 
                  showTranslation={showTranslation} 
                />:
              </span> April 20, 2025
            </p>
            <p>
              <span className="font-medium">
                <FieldLabel 
                  original="Expiry Date" 
                  translationKey="letterOfCredit.expiryDate" 
                  showTranslation={showTranslation} 
                />:
              </span> July 20, 2025
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DocumentSection 
            title="ISSUING BANK" 
            translationKey="letterOfCredit.issuer" 
            showTranslation={showTranslation}
          >
            <p className="text-sm">AfriBank International</p>
            <p className="text-sm">100 Financial Center</p>
            <p className="text-sm">Nairobi, Kenya</p>
            <p className="text-sm">SWIFT: AFRBKENA</p>
          </DocumentSection>
          
          <DocumentSection 
            title="APPLICANT" 
            translationKey="letterOfCredit.applicant" 
            showTranslation={showTranslation}
          >
            <p className="text-sm">Global Trade Solutions Ltd.</p>
            <p className="text-sm">75 Commerce Avenue</p>
            <p className="text-sm">Lagos, Nigeria</p>
            <p className="text-sm">Account No.: 9876543210</p>
          </DocumentSection>
        </div>
        
        <DocumentSection 
          title="BENEFICIARY" 
          translationKey="letterOfCredit.beneficiary" 
          showTranslation={showTranslation}
        >
          <p className="text-sm">Harvest Agricultural Equipment Corp.</p>
          <p className="text-sm">1250 Industry Parkway</p>
          <p className="text-sm">Chicago, IL 60007</p>
          <p className="text-sm">United States of America</p>
          <p className="text-sm">Account No.: 0123456789</p>
        </DocumentSection>
        
        <DocumentSection 
          title="AMOUNT" 
          translationKey="letterOfCredit.amount" 
          showTranslation={showTranslation}
        >
          <p className="text-sm font-medium">USD 750,000.00 (Seven Hundred Fifty Thousand United States Dollars)</p>
        </DocumentSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DocumentSection 
            title="PARTIAL SHIPMENTS" 
            translationKey="letterOfCredit.partial" 
            showTranslation={showTranslation}
          >
            <p className="text-sm">[ ] Permitted    [X] Not Permitted</p>
          </DocumentSection>
          
          <DocumentSection 
            title="TRANSHIPMENT" 
            translationKey="letterOfCredit.transhipment" 
            showTranslation={showTranslation}
          >
            <p className="text-sm">[ ] Permitted    [X] Not Permitted</p>
          </DocumentSection>
        </div>
        
        <div className="text-center mt-8 mb-4">
          <p className="text-sm font-medium">BLOCKCHAIN VERIFICATION</p>
          <p className="text-sm mt-1">Transaction Hash: 0x4f8c3d6e2fc94caa2e9247bc9af5d9b91c4ad614a758e39bf43e90d8b4f7d1a2</p>
          <p className="text-sm mt-1">Verification URL: <a href="#" className="text-blue-600 hover:underline">https://baseexplorer.org/tx/0x4f8c3d6e2fc94caa2e9247bc9af5d9b91c4ad614a758e39bf43e90d8b4f7d1a2</a></p>
          <p className="text-sm mt-1">Smart Contract: 0x5F7A021349eFDe188a0Ee79E1047E646faE2A6Af</p>
        </div>
      </div>
    );
  };

  // Render Certificate of Origin in translated format
  const renderCertificateOfOrigin = () => {
    if (!documentType.includes('Certificate of Origin')) return null;
    
    return (
      <div className="p-4">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-1">
            {showTranslation ? t('documentType.certificateOfOrigin') : 'CERTIFICATE OF ORIGIN'}
          </h1>
          <div className="border-b border-gray-300 w-full mb-4"></div>
          <div className="flex justify-between text-sm">
            <p>
              <span className="font-medium">Certificate No.:</span> COO-2025-00421
            </p>
            <p>
              <span className="font-medium">Reference:</span> SC-2025-K0032-A
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <DocumentSection 
            title="1. Exporter (Name, Address, Country)" 
            translationKey="document.shipper" 
            showTranslation={showTranslation}
          >
            <p className="text-sm">African Coffee Exporters Ltd.</p>
            <p className="text-sm">123 Export Drive, Mombasa</p>
            <p className="text-sm">Kenya, East Africa</p>
            <p className="text-sm">Registration No.: KE-EXP-75429</p>
          </DocumentSection>
          
          <DocumentSection 
            title="2. Producer (if different from Exporter)" 
            translationKey="certificateOfOrigin.producer" 
            showTranslation={showTranslation}
          >
            <p className="text-sm">Kilimanjaro Cooperative</p>
            <p className="text-sm">45 Highland Road, Nyeri</p>
            <p className="text-sm">Kenya</p>
            <p className="text-sm">Registration No.: KE-PROD-1532</p>
          </DocumentSection>
          
          <DocumentSection 
            title="3. Importer (Name, Address, Country)" 
            translationKey="document.consignee" 
            showTranslation={showTranslation}
          >
            <p className="text-sm">European Coffee Distributors B.V.</p>
            <p className="text-sm">Havenlaan 42</p>
            <p className="text-sm">3000 Rotterdam, Netherlands</p>
            <p className="text-sm">VAT: NL123456789B01</p>
          </DocumentSection>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <DocumentSection 
            title="4. Country of Origin" 
            translationKey="certificateOfOrigin.countryOfOrigin" 
            showTranslation={showTranslation}
          >
            <p className="text-sm font-medium">KENYA</p>
          </DocumentSection>
          
          <DocumentSection 
            title="5. Country of Destination" 
            translationKey="certificateOfOrigin.countryOfDestination" 
            showTranslation={showTranslation}
          >
            <p className="text-sm font-medium">NETHERLANDS</p>
          </DocumentSection>
        </div>
        
        <div className="text-center mt-8 mb-4">
          <p className="text-sm font-medium">BLOCKCHAIN VERIFICATION</p>
          <p className="text-sm mt-1">Transaction Hash: 0xc4e9b30e58cc79a6f2b8c8911f7a8c1b7fde2ae08a92f2dd7622f7aa79757429</p>
          <p className="text-sm mt-1">Verification URL: <a href="#" className="text-blue-600 hover:underline">https://baseexplorer.org/tx/0xc4e9b30e58cc79a6f2b8c8911f7a8c1b7fde2ae08a92f2dd7622f7aa79757429</a></p>
        </div>
      </div>
    );
  };

  // Render Phytosanitary Certificate in translated format
  const renderPhytosanitary = () => {
    if (!documentType.includes('Phytosanitary')) return null;
    
    return (
      <div className="p-4">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-1">
            {showTranslation ? t('documentType.phytosanitary') : 'PHYTOSANITARY CERTIFICATE'}
          </h1>
          <div className="border-b border-gray-300 w-full mb-4"></div>
          <div className="flex justify-between text-sm">
            <p>
              <span className="font-medium">Certificate No.:</span> PC-2025-002-KE
            </p>
            <p>
              <span className="font-medium">Reference No.:</span> KEPHIS/04/2025/0067
            </p>
          </div>
        </div>
        
        <DocumentSection 
          title="1. Plant Protection Organization of" 
          translationKey="phytosanitary.plantProtection" 
          showTranslation={showTranslation}
        >
          <p className="text-sm">KENYA PLANT HEALTH INSPECTORATE SERVICE (KEPHIS)</p>
          <p className="text-sm">P.O. Box 49592-00100, Nairobi</p>
          <p className="text-sm">Tel: +254-20-3597201/2/3</p>
          <p className="text-sm">Email: director@kephis.org</p>
        </DocumentSection>
        
        <DocumentSection 
          title="3. DECLARED NAME AND ADDRESS OF EXPORTER" 
          translationKey="document.shipper" 
          showTranslation={showTranslation}
        >
          <p className="text-sm">African Coffee Exporters Ltd.</p>
          <p className="text-sm">123 Export Drive, Mombasa</p>
          <p className="text-sm">Kenya, East Africa</p>
          <p className="text-sm">Registration No.: KE-EXP-75429</p>
        </DocumentSection>
        
        <DocumentSection 
          title="7. DISTINGUISHING MARKS; NUMBER AND DESCRIPTION OF PACKAGES; NAME OF PRODUCE; BOTANICAL NAME OF PLANTS" 
          translationKey="phytosanitary.botanicalName" 
          showTranslation={showTranslation}
        >
          <div className="grid grid-cols-1 gap-2">
            <p className="text-sm"><span className="font-medium">Marks:</span> ECDB-2025-KE / Lot# 20250417</p>
            <p className="text-sm"><span className="font-medium">Number and description of packages:</span> 320 jute bags with GrainPro liner</p>
            <p className="text-sm"><span className="font-medium">Name of produce:</span> Green Coffee Beans, Kenyan AA Grade</p>
            <p className="text-sm"><span className="font-medium">Botanical name:</span> Coffea arabica</p>
            <p className="text-sm"><span className="font-medium">Quantity declared:</span> 19,200 kg</p>
          </div>
        </DocumentSection>
        
        <div className="text-center mt-8 mb-4">
          <p className="text-sm font-medium">BLOCKCHAIN VERIFICATION</p>
          <p className="text-sm mt-1">Transaction Hash: 0xa2b7c11e5d8bd4f3e9a6bc89e1f9c7def2c74a580d3e5a2a8c28f6b99ef25a31</p>
          <p className="text-sm mt-1">Verification URL: <a href="#" className="text-blue-600 hover:underline">https://baseexplorer.org/tx/0xa2b7c11e5d8bd4f3e9a6bc89e1f9c7def2c74a580d3e5a2a8c28f6b99ef25a31</a></p>
        </div>
      </div>
    );
  };

  // Render translated content based on document type
  const renderTranslatedContent = () => {
    if (documentType.includes('Bill of Lading')) {
      return renderBillOfLading();
    } else if (documentType.includes('Letter of Credit')) {
      return renderLetterOfCredit();
    } else if (documentType.includes('Certificate of Origin')) {
      return renderCertificateOfOrigin();
    } else if (documentType.includes('Phytosanitary')) {
      return renderPhytosanitary();
    } else {
      // Default for other document types
      return (
        <pre className="font-mono whitespace-pre-wrap text-sm overflow-auto max-h-[600px] p-4 leading-relaxed">
          {content}
        </pre>
      );
    }
  };

  // Common document display layout
  return (
    <div className="bg-white rounded-md shadow-sm border">
      <div className="bg-primary/10 text-primary font-medium py-2 px-4 flex items-center border-b">
        {getDocumentIcon()}
        <span>{showTranslation ? t(translationKey) : documentType}</span>
        <div className="ml-auto flex items-center">
          <FileCheck className="h-4 w-4 mr-1 text-green-600" />
          <span className="text-xs text-green-600">{t('ui.blockchainVerified')}</span>
        </div>
      </div>
      
      <div className="border-b bg-gray-50 px-4 py-2 flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="original" className="flex items-center">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              {t('ui.viewOriginalDocument')}
            </TabsTrigger>
            <TabsTrigger value="translated" className="flex items-center">
              <Globe className="h-3.5 w-3.5 mr-1.5" />
              {t('ui.viewTranslation')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="original" className="p-0 m-0">
        {renderOriginalContent()}
      </TabsContent>
      
      <TabsContent value="translated" className="p-0 m-0">
        <div className="p-3 bg-gray-50 border-b flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="translation" 
              checked={showTranslation}
              onCheckedChange={setShowTranslation}
            />
            <Label htmlFor="translation" className="text-sm font-medium">
              {t('ui.translateDocument')}
            </Label>
          </div>
          
          <div className="flex items-center ml-auto">
            <Label htmlFor="language-select" className="text-sm mr-2">
              {t('ui.selectLanguage')}:
            </Label>
            <Select
              value={selectedLanguage}
              onValueChange={changeLanguage}
            >
              <SelectTrigger className="w-[160px] h-8 text-sm">
                <SelectValue placeholder={t('ui.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {renderTranslatedContent()}
      </TabsContent>
    </div>
  );
};

export default DocumentViewerContent;