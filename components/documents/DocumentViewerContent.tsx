import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface DocumentViewerContentProps {
  documentType: string;
  content: string;
  showTranslation: boolean;
  showOriginal: boolean;
  targetLanguage: string;
}

// Helper function to format structured documents
const formatStructuredDocument = (
  content: string, 
  docType: string, 
  t: any, 
  namespace: string
): React.ReactNode => {
  // For structured document types, format according to their specific templates
  switch (docType) {
    case 'Bill of Lading':
      return formatBillOfLading(content, t, namespace);
    case 'Letter of Credit':
      return formatLetterOfCredit(content, t, namespace);
    case 'Certificate of Origin':
      return formatCertificateOfOrigin(content, t, namespace);
    case 'Phytosanitary Certificate':
      return formatPhytosanitaryCertificate(content, t, namespace);
    default:
      return formatGenericDocument(content);
  }
};

// Format a Bill of Lading document
const formatBillOfLading = (content: string, t: any, namespace: string): React.ReactNode => {
  // Extract sections from the content
  const sections = extractSections(content);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center border-b pb-4">{t('documentTypes.billOfLading.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentSection 
          label={t('documentTypes.billOfLading.shipper')} 
          value={sections.shipper || 'N/A'} 
          translationKey="shipper"
          namespace={namespace}
        />
        <DocumentSection 
          label={t('documentTypes.billOfLading.consignee')} 
          value={sections.consignee || 'N/A'}
          translationKey="consignee"
          namespace={namespace}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DocumentSection 
          label={t('documentTypes.billOfLading.vessel')} 
          value={sections.vessel || 'N/A'}
          translationKey="vessel"
          namespace={namespace}
        />
        <DocumentSection 
          label={t('documentTypes.billOfLading.portOfLoading')} 
          value={sections.portOfLoading || 'N/A'}
          translationKey="portOfLoading"
          namespace={namespace}
        />
        <DocumentSection 
          label={t('documentTypes.billOfLading.portOfDischarge')} 
          value={sections.portOfDischarge || 'N/A'}
          translationKey="portOfDischarge"
          namespace={namespace}
        />
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">{t('documentTypes.billOfLading.goodsDescription')}</h3>
        <DocumentSection 
          label={t('documentTypes.billOfLading.marks')} 
          value={sections.marks || 'N/A'}
          translationKey="marks"
          namespace={namespace}
        />
        <DocumentSection 
          label={t('documentTypes.billOfLading.packages')} 
          value={sections.packages || 'N/A'}
          translationKey="packages"
          namespace={namespace}
        />
        <DocumentSection 
          label={t('documentTypes.billOfLading.goodsDescription')} 
          value={sections.goodsDescription || 'N/A'}
          translationKey="goodsDescription"
          namespace={namespace}
        />
        <DocumentSection 
          label={t('documentTypes.billOfLading.grossWeight')} 
          value={sections.grossWeight || 'N/A'}
          translationKey="grossWeight"
          namespace={namespace}
        />
      </div>
      
      <div className="border-t pt-4">
        <DocumentSection 
          label={t('documentTypes.billOfLading.shippedOnBoard')} 
          value={sections.shippedOnBoard || 'N/A'}
          translationKey="shippedOnBoard"
          namespace={namespace}
        />
        <div className="text-right mt-4">
          <p className="font-semibold">{t('documentTypes.billOfLading.forTheMaster')}</p>
          <p className="mt-8">_______________________</p>
          <p className="mt-1">Authorized Signature</p>
        </div>
      </div>
    </div>
  );
};

// Format a Letter of Credit document
const formatLetterOfCredit = (content: string, t: any, namespace: string): React.ReactNode => {
  // Extract sections from the content
  const sections = extractSections(content);
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center border-b pb-4">{t('documentTypes.letterOfCredit.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentSection 
          label={t('documentTypes.letterOfCredit.issuingBank')} 
          value={sections.issuingBank || 'N/A'}
          translationKey="issuingBank"
          namespace={namespace}
        />
        <DocumentSection 
          label={t('documentTypes.letterOfCredit.advisingBank')} 
          value={sections.advisingBank || 'N/A'}
          translationKey="advisingBank"
          namespace={namespace}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentSection 
          label={t('documentTypes.letterOfCredit.applicant')} 
          value={sections.applicant || 'N/A'}
          translationKey="applicant"
          namespace={namespace}
        />
        <DocumentSection 
          label={t('documentTypes.letterOfCredit.beneficiary')} 
          value={sections.beneficiary || 'N/A'}
          translationKey="beneficiary"
          namespace={namespace}
        />
      </div>
      
      <DocumentSection 
        label={t('documentTypes.letterOfCredit.amount')} 
        value={sections.amount || 'N/A'}
        translationKey="amount"
        namespace={namespace}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentSection 
          label={t('documentTypes.letterOfCredit.partialShipments')} 
          value={sections.partialShipments || 'N/A'}
          translationKey="partialShipments"
          namespace={namespace}
        />
        <DocumentSection 
          label={t('documentTypes.letterOfCredit.transhipment')} 
          value={sections.transhipment || 'N/A'}
          translationKey="transhipment"
          namespace={namespace}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentSection 
          label={t('documentTypes.letterOfCredit.loading')} 
          value={sections.loading || 'N/A'}
          translationKey="loading"
          namespace={namespace}
        />
        <DocumentSection 
          label={t('documentTypes.letterOfCredit.discharge')} 
          value={sections.discharge || 'N/A'}
          translationKey="discharge"
          namespace={namespace}
        />
      </div>
      
      <DocumentSection 
        label={t('documentTypes.letterOfCredit.latestShipmentDate')} 
        value={sections.latestShipmentDate || 'N/A'}
        translationKey="latestShipmentDate"
        namespace={namespace}
      />
      
      <DocumentSection 
        label={t('documentTypes.letterOfCredit.goodsDescription')} 
        value={sections.goodsDescription || 'N/A'}
        translationKey="goodsDescription"
        namespace={namespace}
      />
      
      <DocumentSection 
        label={t('documentTypes.letterOfCredit.documentsRequired')} 
        value={sections.documentsRequired || 'N/A'}
        translationKey="documentsRequired"
        namespace={namespace}
      />
      
      <DocumentSection 
        label={t('documentTypes.letterOfCredit.specialConditions')} 
        value={sections.specialConditions || 'N/A'}
        translationKey="specialConditions"
        namespace={namespace}
      />
    </div>
  );
};

// Format a Certificate of Origin document
const formatCertificateOfOrigin = (content: string, t: any, namespace: string): React.ReactNode => {
  // Extract sections from the content
  const sections = extractSections(content);
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center border-b pb-4">{t('documentTypes.certificateOfOrigin.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentSection 
          label={t('documentTypes.certificateOfOrigin.exporter')} 
          value={sections.exporter || 'N/A'}
          translationKey="exporter"
          namespace={namespace}
        />
        <DocumentSection 
          label={t('documentTypes.certificateOfOrigin.importer')} 
          value={sections.importer || 'N/A'}
          translationKey="importer"
          namespace={namespace}
        />
      </div>
      
      <DocumentSection 
        label={t('documentTypes.certificateOfOrigin.countryOfOrigin')} 
        value={sections.countryOfOrigin || 'N/A'}
        translationKey="countryOfOrigin"
        namespace={namespace}
      />
      
      <DocumentSection 
        label={t('documentTypes.certificateOfOrigin.transportDetails')} 
        value={sections.transportDetails || 'N/A'}
        translationKey="transportDetails"
        namespace={namespace}
      />
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">{t('documentTypes.certificateOfOrigin.goodsDescription')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DocumentSection 
            label={t('documentTypes.certificateOfOrigin.itemNumber')} 
            value={sections.itemNumber || 'N/A'}
            translationKey="itemNumber"
            namespace={namespace}
          />
          <DocumentSection 
            label={t('documentTypes.certificateOfOrigin.marksAndNumbers')} 
            value={sections.marksAndNumbers || 'N/A'}
            translationKey="marksAndNumbers"
            namespace={namespace}
          />
          <DocumentSection 
            label={t('documentTypes.certificateOfOrigin.packagesInfo')} 
            value={sections.packagesInfo || 'N/A'}
            translationKey="packagesInfo"
            namespace={namespace}
          />
        </div>
        
        <DocumentSection 
          label={t('documentTypes.certificateOfOrigin.hsCode')} 
          value={sections.hsCode || 'N/A'}
          translationKey="hsCode"
          namespace={namespace}
        />
        
        <DocumentSection 
          label={t('documentTypes.certificateOfOrigin.goodsDescription')} 
          value={sections.goodsDescription || 'N/A'}
          translationKey="goodsDescription"
          namespace={namespace}
        />
        
        <DocumentSection 
          label={t('documentTypes.certificateOfOrigin.grossWeight')} 
          value={sections.grossWeight || 'N/A'}
          translationKey="grossWeight"
          namespace={namespace}
        />
      </div>
      
      <div className="border-t pt-4">
        <DocumentSection 
          label={t('documentTypes.certificateOfOrigin.exporterDeclaration')} 
          value={sections.exporterDeclaration || 'N/A'}
          translationKey="exporterDeclaration"
          namespace={namespace}
        />
        
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">{t('documentTypes.certificateOfOrigin.certification')}</h3>
          <p className="text-center mt-8">_______________________</p>
          <p className="text-center mt-1">Authorized Signature</p>
        </div>
      </div>
    </div>
  );
};

// Format a Phytosanitary Certificate document
const formatPhytosanitaryCertificate = (content: string, t: any, namespace: string): React.ReactNode => {
  // Extract sections from the content
  const sections = extractSections(content);
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center border-b pb-4">{t('documentTypes.phytosanitaryCertificate.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentSection 
          label={t('documentTypes.phytosanitaryCertificate.plantProtectionOrg')} 
          value={sections.plantProtectionOrg || 'N/A'}
          translationKey="plantProtectionOrg"
          namespace={namespace}
        />
        <DocumentSection 
          label={t('documentTypes.phytosanitaryCertificate.toPlantProtectionOrg')} 
          value={sections.toPlantProtectionOrg || 'N/A'}
          translationKey="toPlantProtectionOrg"
          namespace={namespace}
        />
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">{t('documentTypes.phytosanitaryCertificate.descriptionOfConsignment')}</h3>
        
        <DocumentSection 
          label={t('documentTypes.phytosanitaryCertificate.nameAndAddressExporter')} 
          value={sections.nameAndAddressExporter || 'N/A'}
          translationKey="nameAndAddressExporter"
          namespace={namespace}
        />
        
        <DocumentSection 
          label={t('documentTypes.phytosanitaryCertificate.declaredNameAndAddressConsignee')} 
          value={sections.declaredNameAndAddressConsignee || 'N/A'}
          translationKey="declaredNameAndAddressConsignee"
          namespace={namespace}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentSection 
            label={t('documentTypes.phytosanitaryCertificate.packagesDescription')} 
            value={sections.packagesDescription || 'N/A'}
            translationKey="packagesDescription"
            namespace={namespace}
          />
          <DocumentSection 
            label={t('documentTypes.phytosanitaryCertificate.distinguishingMarks')} 
            value={sections.distinguishingMarks || 'N/A'}
            translationKey="distinguishingMarks"
            namespace={namespace}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentSection 
            label={t('documentTypes.phytosanitaryCertificate.placeOfOrigin')} 
            value={sections.placeOfOrigin || 'N/A'}
            translationKey="placeOfOrigin"
            namespace={namespace}
          />
          <DocumentSection 
            label={t('documentTypes.phytosanitaryCertificate.declaredMeansOfConveyance')} 
            value={sections.declaredMeansOfConveyance || 'N/A'}
            translationKey="declaredMeansOfConveyance"
            namespace={namespace}
          />
        </div>
        
        <DocumentSection 
          label={t('documentTypes.phytosanitaryCertificate.declaredPointOfEntry')} 
          value={sections.declaredPointOfEntry || 'N/A'}
          translationKey="declaredPointOfEntry"
          namespace={namespace}
        />
        
        <DocumentSection 
          label={t('documentTypes.phytosanitaryCertificate.produceInfo')} 
          value={sections.produceInfo || 'N/A'}
          translationKey="produceInfo"
          namespace={namespace}
        />
        
        <DocumentSection 
          label={t('documentTypes.phytosanitaryCertificate.botanicalNameOfPlants')} 
          value={sections.botanicalNameOfPlants || 'N/A'}
          translationKey="botanicalNameOfPlants"
          namespace={namespace}
        />
      </div>
      
      <DocumentSection 
        label={t('documentTypes.phytosanitaryCertificate.additionalDeclaration')} 
        value={sections.additionalDeclaration || 'N/A'}
        translationKey="additionalDeclaration"
        namespace={namespace}
      />
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">{t('documentTypes.phytosanitaryCertificate.disinfestationTreatment')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentSection 
            label={t('documentTypes.phytosanitaryCertificate.dateOfTreatment')} 
            value={sections.dateOfTreatment || 'N/A'}
            translationKey="dateOfTreatment"
            namespace={namespace}
          />
          <DocumentSection 
            label={t('documentTypes.phytosanitaryCertificate.treatmentType')} 
            value={sections.treatmentType || 'N/A'}
            translationKey="treatmentType"
            namespace={namespace}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentSection 
            label={t('documentTypes.phytosanitaryCertificate.chemical')} 
            value={sections.chemical || 'N/A'}
            translationKey="chemical"
            namespace={namespace}
          />
          <DocumentSection 
            label={t('documentTypes.phytosanitaryCertificate.concentration')} 
            value={sections.concentration || 'N/A'}
            translationKey="concentration"
            namespace={namespace}
          />
        </div>
        
        <DocumentSection 
          label={t('documentTypes.phytosanitaryCertificate.additionalInfo')} 
          value={sections.additionalInfo || 'N/A'}
          translationKey="additionalInfo"
          namespace={namespace}
        />
      </div>
      
      <div className="border-t pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DocumentSection 
            label={t('documentTypes.phytosanitaryCertificate.placeOfIssue')} 
            value={sections.placeOfIssue || 'N/A'}
            translationKey="placeOfIssue"
            namespace={namespace}
          />
          <DocumentSection 
            label={t('documentTypes.phytosanitaryCertificate.dateOfIssue')} 
            value={sections.dateOfIssue || 'N/A'}
            translationKey="dateOfIssue"
            namespace={namespace}
          />
          <DocumentSection 
            label={t('documentTypes.phytosanitaryCertificate.nameOfAuthorizedOfficer')} 
            value={sections.nameOfAuthorizedOfficer || 'N/A'}
            translationKey="nameOfAuthorizedOfficer"
            namespace={namespace}
          />
        </div>
        
        <div className="text-center mt-8">
          <p>_______________________</p>
          <p className="mt-1">{t('documentTypes.phytosanitaryCertificate.signature')}</p>
        </div>
      </div>
    </div>
  );
};

// Format a generic document (plain text)
const formatGenericDocument = (content: string): React.ReactNode => {
  return (
    <pre className="p-6 whitespace-pre-wrap font-mono text-sm">
      {content}
    </pre>
  );
};

// Helper function to extract sections from the document content
const extractSections = (content: string): Record<string, string> => {
  const sections: Record<string, string> = {};
  
  // Simple pattern matching to extract sections from the content
  // This is a basic implementation; a more robust parser would be needed for production
  
  // Match patterns like "SECTION NAME: content" or "SECTION NAME:\ncontent"
  const lines = content.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];
  
  for (const line of lines) {
    const sectionMatch = line.match(/^([A-Za-z\s/]+):\s*(.*)$/);
    
    if (sectionMatch) {
      // Save previous section if any
      if (currentSection && currentContent.length > 0) {
        sections[convertToKey(currentSection)] = currentContent.join('\n').trim();
        currentContent = [];
      }
      
      // Start new section
      currentSection = sectionMatch[1].trim();
      if (sectionMatch[2]) {
        currentContent.push(sectionMatch[2].trim());
      }
    } else if (currentSection && line.trim()) {
      // Continue current section
      currentContent.push(line.trim());
    }
  }
  
  // Save last section
  if (currentSection && currentContent.length > 0) {
    sections[convertToKey(currentSection)] = currentContent.join('\n').trim();
  }
  
  return sections;
};

// Convert section titles to camelCase keys
const convertToKey = (title: string): string => {
  const key = title.toLowerCase()
    .replace(/[\s/]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/[\s/]+$/, '')
    .replace(/^[\s/]+/, '');
  
  return key;
};

// DocumentSection component for displaying a labeled value with potential translation
interface DocumentSectionProps {
  label: string;
  value: string;
  translationKey?: string;
  namespace?: string;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({ 
  label, 
  value, 
  translationKey,
  namespace 
}) => {
  const { t, i18n } = useTranslation();
  
  const shouldTranslate = namespace && translationKey;
  const translatedValue = shouldTranslate ? t(`${namespace}.${translationKey}`) : null;
  
  return (
    <div className="mb-4">
      <div className="font-medium text-gray-700 mb-1">{label}</div>
      <div className="border rounded p-2">
        {value}
        {shouldTranslate && translatedValue && translatedValue !== value && (
          <div className="mt-2 pt-2 border-t text-blue-600">
            <div className="text-xs text-gray-500 mb-1">
              {t('documents.translatedText')} ({i18n.language}):
            </div>
            {translatedValue}
          </div>
        )}
      </div>
    </div>
  );
};

const DocumentViewerContent: React.FC<DocumentViewerContentProps> = ({
  documentType,
  content,
  showTranslation,
  showOriginal,
  targetLanguage
}) => {
  const { t, i18n } = useTranslation();
  
  const namespace = useMemo(() => {
    switch (documentType) {
      case 'Bill of Lading':
        return 'documentTypes.billOfLading';
      case 'Letter of Credit':
        return 'documentTypes.letterOfCredit';
      case 'Certificate of Origin':
        return 'documentTypes.certificateOfOrigin';
      case 'Phytosanitary Certificate':
        return 'documentTypes.phytosanitaryCertificate';
      default:
        return '';
    }
  }, [documentType]);
  
  // Change language if translation is enabled
  useEffect(() => {
    if (showTranslation && i18n.language !== targetLanguage) {
      i18n.changeLanguage(targetLanguage);
    } else if (!showTranslation && i18n.language !== 'en') {
      i18n.changeLanguage('en');
    }
    
    // When component unmounts, reset language to English if needed
    return () => {
      if (i18n.language !== 'en') {
        i18n.changeLanguage('en');
      }
    };
  }, [showTranslation, targetLanguage, i18n]);
  
  return (
    <div className="document-content">
      {!content ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No content available</p>
        </div>
      ) : (
        <>
          {showOriginal || !showTranslation ? (
            formatStructuredDocument(content, documentType, t, namespace)
          ) : null}
          
          {showTranslation && !showOriginal ? (
            formatStructuredDocument(content, documentType, t, namespace)
          ) : null}
        </>
      )}
    </div>
  );
};

export default DocumentViewerContent;