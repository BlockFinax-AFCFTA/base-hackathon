import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FilePlus, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import DocumentCard from './DocumentCard';
import DocumentViewer from './DocumentViewer';
import { useDocuments } from '@/hooks/useDocuments';
import { generateDocumentTags } from '../../utils/documentUtils';

// Sample documents based on the screenshot
const SAMPLE_DOCUMENTS = [
  {
    id: '1',
    name: 'Invoice for Contract #12345',
    fileType: 'pdf',
    fileSize: 2.3 * 1024 * 1024, // 2.3 MB
    createdAt: new Date('2025-03-15'),
    status: 'approved' as const,
    referenceNumber: 'INV-2025-0001',
    url: 'https://example.com/documents/invoice.pdf',
    tags: ['invoice', 'payment', 'contract']
  },
  {
    id: '2',
    name: 'Bill of Lading - Shipping Container',
    fileType: 'pdf',
    fileSize: 1.5 * 1024 * 1024, // 1.5 MB
    createdAt: new Date('2025-03-18'),
    status: 'pending' as const,
    referenceNumber: 'BL-2025-0001',
    url: 'https://example.com/documents/bill-of-lading.pdf',
    tags: ['shipping', 'logistics', 'bill of lading']
  },
  {
    id: '3',
    name: 'Certificate of Origin - Ghana',
    fileType: 'pdf',
    fileSize: 512 * 1024, // 512 KB
    createdAt: new Date('2025-03-20'),
    status: 'approved' as const,
    referenceNumber: 'CO-2025-0001',
    url: 'https://example.com/documents/certificate.pdf',
    tags: ['certificate', 'origin', 'ghana']
  },
  {
    id: '4',
    name: 'Purchase Order - Coffee Beans',
    fileType: 'pdf',
    fileSize: 750 * 1024, // 750 KB
    createdAt: new Date('2025-03-22'),
    status: 'draft' as const,
    referenceNumber: 'PO-2025-0001',
    url: 'https://example.com/documents/purchase-order.pdf',
    tags: ['purchase', 'coffee', 'order']
  },
  {
    id: '5',
    name: 'Import Permit - Agricultural Products',
    fileType: 'pdf',
    fileSize: 1.2 * 1024 * 1024, // 1.2 MB
    createdAt: new Date('2025-02-10'),
    status: 'expired' as const,
    referenceNumber: 'IP-2025-0001',
    url: 'https://example.com/documents/import-permit.pdf',
    tags: ['permit', 'import', 'agriculture']
  },
  {
    id: '6',
    name: 'Insurance Certificate - Cargo',
    fileType: 'pdf',
    fileSize: 920 * 1024, // 920 KB
    createdAt: new Date('2025-03-01'),
    status: 'approved' as const,
    referenceNumber: 'IC-2025-0001',
    url: 'https://example.com/documents/insurance.pdf',
    tags: ['insurance', 'cargo', 'certificate']
  }
];

const DocumentGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  
  // In a real implementation, we would use the useDocuments hook
  // const { documents, isLoading, error } = useDocuments();
  
  // For now, we'll use the sample data
  const isLoading = false;
  const error = null;
  const documents = SAMPLE_DOCUMENTS;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDocumentClick = (document: any) => {
    setSelectedDocument(document);
    setViewerOpen(true);
  };
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Your Documents</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search documents..."
              className="pl-9"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Link href="/documents/upload">
            <Button>
              <FilePlus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Your Documents</CardTitle>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">
              Loading documents...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-2">Error loading documents</p>
              <p className="text-sm text-gray-400">{error.toString()}</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-2">No documents found</p>
              <Link href="/documents/upload">
                <Button>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Upload New Document
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  id={document.id}
                  name={document.name}
                  fileType={document.fileType}
                  fileSize={document.fileSize}
                  createdAt={document.createdAt}
                  status={document.status}
                  referenceNumber={document.referenceNumber}
                  onClick={() => handleDocumentClick(document)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <DocumentViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        document={selectedDocument}
      />
    </div>
  );
};

export default DocumentGrid;