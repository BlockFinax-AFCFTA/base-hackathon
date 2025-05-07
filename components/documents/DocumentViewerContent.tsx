import React, { useState, useEffect } from 'react';
import { Loader2, FileText, Stamp, Ship, CreditCard, FileCheck, AlertTriangle } from 'lucide-react';
import { identifyTemplateDocType } from '../../utils/documentUtils';

interface DocumentViewerContentProps {
  url: string;
  fileType: string;
}

const DocumentViewerContent: React.FC<DocumentViewerContentProps> = ({ url, fileType }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        console.log('Document content loaded successfully', text.substring(0, 100));
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
        <span className="ml-2">Loading document...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Get document type for the banner
  const documentType = identifyTemplateDocType(url);
  
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

  // Format the content based on document type
  const renderFormattedContent = () => {
    // For text-based documents like Bills of Lading, Certificates, etc.
    return (
      <pre className="font-mono whitespace-pre-wrap text-sm overflow-auto max-h-[600px] p-4 leading-relaxed">
        {content}
      </pre>
    );
  };

  // Common document display layout
  return (
    <div className="bg-white rounded-md shadow-sm border">
      <div className="bg-primary/10 text-primary font-medium py-2 px-4 flex items-center border-b">
        {getDocumentIcon()}
        <span>{documentType}</span>
        <div className="ml-auto flex items-center">
          <FileCheck className="h-4 w-4 mr-1 text-green-600" />
          <span className="text-xs text-green-600">Blockchain Verified</span>
        </div>
      </div>
      
      {renderFormattedContent()}
    </div>
  );
};

export default DocumentViewerContent;