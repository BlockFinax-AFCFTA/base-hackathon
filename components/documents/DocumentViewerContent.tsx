import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

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
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
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
        <p>{error}</p>
      </div>
    );
  }

  if (fileType === 'pdf' || fileType.includes('pdf')) {
    return (
      <div className="bg-gray-100 p-4 border rounded-md">
        <div className="font-mono whitespace-pre-wrap text-sm overflow-auto max-h-[600px]">
          {content}
        </div>
      </div>
    );
  }

  if (fileType === 'xlsx' || fileType.includes('excel') || fileType.includes('spreadsheet')) {
    return (
      <div className="bg-gray-100 p-4 border rounded-md">
        <div className="font-mono whitespace-pre-wrap text-sm overflow-auto max-h-[600px]">
          {content}
        </div>
      </div>
    );
  }

  // Default text viewer for all other file types
  return (
    <div className="bg-gray-100 p-4 border rounded-md">
      <div className="font-mono whitespace-pre-wrap text-sm overflow-auto max-h-[600px]">
        {content}
      </div>
    </div>
  );
};

export default DocumentViewerContent;