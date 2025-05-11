import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Plus,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  FileImage,
  FileSpreadsheet,
  FilePieChart,
  Eye,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';

import { mockDocuments, formatFileSize, getDocumentIcon } from '@/data/mockDocuments';
import { formatDate } from '@/lib/utils';

const DocumentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<typeof mockDocuments[0] | null>(null);
  
  // Filter documents based on active tab and search query
  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'verified' && doc.isVerified === true) ||
      (activeTab === 'pending' && doc.status === 'pending') ||
      (activeTab === 'contracts' && doc.contractId !== null);
      
    const matchesSearch = 
      searchQuery === '' ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.referenceNumber && doc.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesTab && matchesSearch;
  });
  
  // Helper to get file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch(fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileImage className="h-5 w-5" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'pptx':
      case 'ppt':
        return <FilePieChart className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  // Helper to render status badge
  const getStatusBadge = (status: string | null, isVerified: boolean | null) => {
    if (isVerified === true) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" />
          Verified
        </Badge>
      );
    } else if (isVerified === false) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="mr-1 h-3 w-3" />
          Failed Verification
        </Badge>
      );
    } else if (status === 'pending') {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    } else if (status === 'draft') {
      return (
        <Badge variant="outline">
          Draft
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Document Management" 
        subtitle="Store and verify trade documents on blockchain" 
      />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="contracts">Contract Docs</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              className="h-10 w-full rounded-md border border-input bg-background pl-8 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button className="gap-1">
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
      </div>
      
      {/* Document Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <Card 
              key={doc.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedDocument(doc)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {getFileIcon(doc.fileType)}
                  </div>
                  {getStatusBadge(doc.status, doc.isVerified)}
                </div>
                <CardTitle className="mt-2 text-lg truncate">{doc.name}</CardTitle>
                <CardDescription>
                  {doc.fileType.toUpperCase()} • {formatFileSize(doc.fileSize)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Uploaded</div>
                    <div>{formatDate(doc.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Reference</div>
                    <div>{doc.referenceNumber || 'N/A'}</div>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-3 w-3" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-3 w-3" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div>
              <FileText className="mx-auto h-10 w-10 text-muted-foreground/60" />
              <h3 className="mt-2 text-lg font-medium">No documents found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "No documents match your search query. Try different keywords."
                  : "Get started by uploading your first document."}
              </p>
              {!searchQuery && (
                <Button className="mt-4 gap-1">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload Document
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-background w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                  {getFileIcon(selectedDocument.fileType)}
                </div>
                <h3 className="font-medium truncate">{selectedDocument.name}</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedDocument(null)}
              >
                &times;
              </Button>
            </div>
            
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  {/* Document preview - in a real app, this would be a PDF/image viewer */}
                  <div className="flex h-96 items-center justify-center rounded-lg border bg-muted">
                    <div className="text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted-foreground/10 mx-auto mb-4">
                        {getFileIcon(selectedDocument.fileType)}
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Document preview would appear here
                      </p>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Document
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-4">Document Details</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-muted-foreground">File Type</dt>
                      <dd className="font-medium">{selectedDocument.fileType.toUpperCase()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">File Size</dt>
                      <dd className="font-medium">{formatFileSize(selectedDocument.fileSize)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Upload Date</dt>
                      <dd className="font-medium">{formatDate(selectedDocument.createdAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Reference Number</dt>
                      <dd className="font-medium">{selectedDocument.referenceNumber || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Status</dt>
                      <dd className="font-medium flex items-center mt-1">
                        {getStatusBadge(selectedDocument.status, selectedDocument.isVerified)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Related Contract</dt>
                      <dd className="font-medium">
                        {selectedDocument.contractId 
                          ? (
                            <Button variant="link" className="p-0 h-auto" asChild>
                              <a href={`/contracts/${selectedDocument.contractId}`}>
                                View Contract
                              </a>
                            </Button>
                          )
                          : 'Not associated with a contract'
                        }
                      </dd>
                    </div>
                    
                    {selectedDocument.tags && (
                      <div>
                        <dt className="text-sm text-muted-foreground">Tags</dt>
                        <dd className="flex flex-wrap gap-1 mt-1">
                          {selectedDocument.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </dd>
                      </div>
                    )}
                  </dl>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify on Blockchain
                    </Button>
                    
                    {selectedDocument.contractId === null && (
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Link to Contract
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;