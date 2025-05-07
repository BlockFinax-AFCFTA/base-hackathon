'use client'

import React, { useState } from 'react'
import Head from 'next/head'
import { BlockchainSidebar } from '../components/layout/BlockchainSidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { FileText, FileUp, Plus, Search, Calendar, Check, X, Download, File } from 'lucide-react'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useToast } from '../hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import DocumentGrid from '../components/documents/DocumentGrid'
import DocumentCard from '../components/documents/DocumentCard'
import DocumentViewer from '../components/documents/DocumentViewer'
import { formatFileSize, getDocumentIcon, generateDocumentTags } from '../utils/documentUtils'

// Document interface for the application
interface Document {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  createdDate: Date;
  contractId: string | null;
  contractName: string | null;
  verified: boolean;
  description: string | null;
  url: string;
  // Additional properties for enhanced functionality
  referenceNumber?: string;
  status?: 'approved' | 'pending' | 'draft' | 'expired';
  tags?: string[];
}

// Sample documents with enhanced data 
const sampleDocuments: Document[] = [
  {
    id: 'doc-001',
    name: 'Supply Chain Agreement.pdf',
    fileType: 'pdf',
    fileSize: 2500000,
    createdDate: new Date(2025, 3, 10),
    contractId: 'contract-001',
    contractName: 'Supply Chain Agreement',
    verified: true,
    description: 'Official signed agreement for supply chain services.',
    url: '#',
    referenceNumber: 'SCM-2025-001',
    status: 'approved',
    tags: ['contract', 'supply chain', 'agreement']
  },
  {
    id: 'doc-002',
    name: 'Bill of Lading.pdf',
    fileType: 'pdf',
    fileSize: 1800000,
    createdDate: new Date(2025, 3, 15),
    contractId: 'contract-001',
    contractName: 'Supply Chain Agreement',
    verified: true,
    description: 'Bill of lading for international shipment.',
    url: '#',
    referenceNumber: 'BL-2025-001',
    status: 'approved',
    tags: ['shipping', 'bill of lading', 'cargo']
  },
  {
    id: 'doc-003',
    name: 'Service Agreement.pdf',
    fileType: 'pdf',
    fileSize: 3100000,
    createdDate: new Date(2025, 4, 5),
    contractId: 'contract-002',
    contractName: 'Cross-Border Payment Service',
    verified: false,
    description: 'Partnership service agreement for payment processing.',
    url: '#',
    referenceNumber: 'SA-2025-001',
    status: 'pending',
    tags: ['contract', 'service', 'payments']
  },
  {
    id: 'doc-004',
    name: 'KYC Documentation.png',
    fileType: 'image/png',
    fileSize: 1200000,
    createdDate: new Date(2025, 4, 1),
    contractId: null,
    contractName: null,
    verified: true,
    description: 'KYC supporting documentation for regulatory compliance.',
    url: '#',
    referenceNumber: 'KYC-2025-001',
    status: 'approved',
    tags: ['kyc', 'compliance', 'regulatory']
  },
  {
    id: 'doc-005',
    name: 'Certificate of Origin - Ghana.pdf',
    fileType: 'pdf',
    fileSize: 512000,
    createdDate: new Date(2025, 3, 20),
    contractId: 'contract-001',
    contractName: 'Supply Chain Agreement',
    verified: true,
    description: 'Certificate of origin for exported goods.',
    url: '#',
    referenceNumber: 'CO-2025-001',
    status: 'approved',
    tags: ['certificate', 'origin', 'ghana', 'export']
  },
  {
    id: 'doc-006',
    name: 'Import Permit - Agricultural Products.pdf',
    fileType: 'pdf',
    fileSize: 1200000,
    createdDate: new Date(2025, 2, 10),
    contractId: 'contract-003',
    contractName: 'Equipment Purchase',
    verified: false,
    description: 'Import permit for agricultural equipment.',
    url: '#',
    referenceNumber: 'IP-2025-001',
    status: 'expired',
    tags: ['permit', 'import', 'agriculture']
  }
];

// Mock contracts for linking documents
const mockContracts = [
  { id: 'contract-001', name: 'Supply Chain Agreement' },
  { id: 'contract-002', name: 'Cross-Border Payment Service' },
  { id: 'contract-003', name: 'Equipment Purchase' },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');
  const { toast } = useToast();
  
  // Upload form state
  const [newDocument, setNewDocument] = useState({
    name: '',
    description: '',
    contractId: '',
    file: null as File | null,
  });
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewDocument({
        ...newDocument,
        name: file.name,
        file: file
      });
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDocument({
      ...newDocument,
      [name]: value
    });
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setNewDocument({
      ...newDocument,
      [name]: value
    });
  };
  
  // Handle document upload
  const handleUploadDocument = async () => {
    // Validate form
    if (!newDocument.file) {
      toast({
        title: "Missing File",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find contract name if a contract is selected
      let contractName = null;
      if (newDocument.contractId) {
        const contract = mockContracts.find(c => c.id === newDocument.contractId);
        if (contract) {
          contractName = contract.name;
        }
      }
      
      // Create reference number
      const referenceNumber = `DOC-${Date.now().toString(36).toUpperCase().substring(0, 6)}`;
      
      // Create new document object with enhanced properties
      const newDocumentObject: Document = {
        id: `doc-${Date.now().toString(36)}`,
        name: newDocument.name,
        fileType: newDocument.file.type || 'application/octet-stream',
        fileSize: newDocument.file.size,
        createdDate: new Date(),
        contractId: newDocument.contractId || null,
        contractName,
        verified: false,
        description: newDocument.description,
        url: '#',
        referenceNumber,
        status: 'pending',
        tags: generateDocumentTags(newDocument.name, newDocument.file.type)
      };
      
      // Add to documents list
      setDocuments([newDocumentObject, ...documents]);
      
      // Reset form and close dialog
      setNewDocument({
        name: '',
        description: '',
        contractId: '',
        file: null,
      });
      
      setIsUploadOpen(false);
      
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully."
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // View document details
  const handleViewDocument = (document: Document) => {
    // Convert to DocumentViewer compatible format
    const viewerDocument = {
      id: document.id,
      name: document.name,
      fileType: document.fileType.replace('application/', ''),
      fileSize: document.fileSize,
      createdAt: document.createdDate,
      url: document.url,
      referenceNumber: document.referenceNumber || `REF-${document.id}`,
      status: document.status || (document.verified ? 'approved' : 'pending'),
      tags: document.tags || []
    };
    
    setSelectedDocument(viewerDocument);
    setIsViewOpen(true);
  };
  
  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    if (filter === 'contract') return doc.contractId !== null;
    if (filter === 'verified') return doc.verified;
    if (filter === 'unverified') return !doc.verified;
    return true;
  });
  
  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.includes('image')) return <File className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5" />;
  };
  
  return (
    <>
      <Head>
        <title>Documents | Base Network Finance</title>
      </Head>
      
      <div className="flex min-h-screen">
        <div className="hidden md:flex w-64 flex-col border-r bg-background z-30">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <div className="font-semibold">Base Network Finance</div>
          </div>
          <BlockchainSidebar className="flex-1" />
        </div>
        
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 lg:gap-6 lg:px-6">
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Document Management</h1>
                <p className="text-sm text-muted-foreground">
                  Manage and verify your blockchain-secured documents
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setViewType(viewType === 'list' ? 'grid' : 'list')}
                  className="px-3"
                >
                  {viewType === 'list' ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid-2x2"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 12h18"/><path d="M12 3v18"/></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
                  }
                  <span className="ml-2">{viewType === 'list' ? 'Grid View' : 'List View'}</span>
                </Button>
                <Button onClick={() => setIsUploadOpen(true)}>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </div>
          </header>
          
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div className="mb-4 md:mb-0">
                <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
                  <TabsList>
                    <TabsTrigger value="all">All Documents</TabsTrigger>
                    <TabsTrigger value="contract">Contract Documents</TabsTrigger>
                    <TabsTrigger value="verified">Verified</TabsTrigger>
                    <TabsTrigger value="unverified">Unverified</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-8"
                />
              </div>
            </div>
            
            {/* Grid View */}
            {viewType === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((document) => (
                    <DocumentCard
                      key={document.id}
                      id={document.id}
                      name={document.name}
                      fileType={document.fileType.replace('application/', '')}
                      fileSize={document.fileSize}
                      createdAt={document.createdDate}
                      status={document.status || (document.verified ? 'approved' : 'pending')}
                      referenceNumber={document.referenceNumber || `REF-${document.id}`}
                      onClick={() => handleViewDocument(document)}
                    />
                  ))
                ) : (
                  <div className="col-span-3 py-12 text-center text-gray-500">
                    No documents found
                  </div>
                )}
              </div>
            )}
            
            {/* List View */}
            {viewType === 'list' && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Contract</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {getFileIcon(document.fileType)}
                              <span className="ml-2 font-medium">{document.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                          <TableCell>
                            {document.contractName ? (
                              <span>{document.contractName}</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>{format(document.createdDate, 'PP')}</TableCell>
                          <TableCell>
                            {document.verified ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
                                <Check className="mr-1 h-3 w-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="flex items-center">
                                Unverified
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewDocument(document)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No documents found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Document Viewer */}
      <DocumentViewer
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        document={selectedDocument}
      />
      
      {/* Upload Document Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileUp className="mr-2 h-5 w-5" />
              Upload Document
            </DialogTitle>
            <DialogDescription>
              Upload and secure your document on the blockchain
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label>Select File</Label>
              <div className="grid gap-2">
                <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50" onClick={() => document.getElementById('file-upload')?.click()}>
                  <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, PNG, JPG, DOCX up to 10MB
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                {newDocument.file && (
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      {getFileIcon(newDocument.file.type)}
                      <span className="ml-2 text-sm font-medium">{newDocument.file.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({formatFileSize(newDocument.file.size)})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setNewDocument({ ...newDocument, file: null })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Document Name</Label>
              <Input
                id="name"
                name="name"
                value={newDocument.name}
                onChange={handleInputChange}
                placeholder="Invoice Agreement"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={newDocument.description || ''}
                onChange={handleInputChange}
                placeholder="Brief description of the document"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="contractId">Link to Contract (Optional)</Label>
              <Select
                value={newDocument.contractId}
                onValueChange={(value) => handleSelectChange('contractId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a contract (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {mockContracts.map(contract => (
                    <SelectItem key={contract.id} value={contract.id}>
                      {contract.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Link this document to an existing contract for better organization
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUploadDocument} 
              disabled={isLoading || !newDocument.file}
            >
              {isLoading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Document Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center text-xl">
                  {getFileIcon(selectedDocument.fileType)}
                  <span className="ml-2">{selectedDocument.name}</span>
                </DialogTitle>
                <DialogDescription>
                  Uploaded on {format(selectedDocument.createdDate, 'PPP')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-6 space-y-6">
                <div className="rounded-md border overflow-hidden">
                  {/* File Preview - Show based on file type */}
                  {selectedDocument.fileType.includes('image') ? (
                    // Image preview
                    <div className="bg-black flex items-center justify-center min-h-[300px]">
                      <img 
                        src={selectedDocument.url} 
                        alt={selectedDocument.name}
                        className="max-w-full max-h-[300px]"
                        onError={(e) => {
                          // If image load fails, replace with icon
                          e.currentTarget.style.display = 'none';
                          const container = e.currentTarget.parentElement;
                          if (container) {
                            const icon = document.createElement('div');
                            icon.className = 'flex flex-col items-center justify-center min-h-[300px] bg-gray-900';
                            icon.innerHTML = `
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                <circle cx="9" cy="9" r="2"/>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                              </svg>
                              <p class="text-white/50 mt-4">Image preview unavailable</p>
                            `;
                            container.appendChild(icon);
                          }
                        }}
                      />
                    </div>
                  ) : selectedDocument.fileType.includes('pdf') ? (
                    // PDF preview - using iframe
                    <div className="bg-gray-100 min-h-[400px] w-full">
                      <iframe 
                        src={selectedDocument.url} 
                        className="w-full h-[400px]"
                        title={selectedDocument.name}
                      />
                    </div>
                  ) : selectedDocument.fileType.includes('text') || selectedDocument.fileType.includes('plain') ? (
                    // Text preview
                    <div className="bg-white p-4 min-h-[300px] max-h-[400px] overflow-auto">
                      <pre className="font-mono text-sm whitespace-pre-wrap">
                        {/* We'd normally fetch the text content here */}
                        {`Sample text content for ${selectedDocument.name}\n\nThis would show the actual text content of the document in a production environment.`}
                      </pre>
                    </div>
                  ) : (
                    // Default preview for other file types
                    <div className="bg-gray-900 h-64 w-full flex flex-col items-center justify-center">
                      {getFileIcon(selectedDocument.fileType)}
                      <p className="text-white/50 mt-4">Preview not available for this file type</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Download className="mr-2 h-4 w-4" />
                        Download to view
                      </Button>
                    </div>
                  )}
                  <div className="p-4 bg-muted/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{selectedDocument.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatFileSize(selectedDocument.fileSize)} • {selectedDocument.fileType.split('/')[1]?.toUpperCase() || selectedDocument.fileType.toUpperCase()}
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Document Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <div>
                        <p className="text-muted-foreground">Document ID</p>
                        <p className="font-medium font-mono">{selectedDocument.id}</p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Upload Date</p>
                        <p className="font-medium">{format(selectedDocument.createdDate, 'PPP')}</p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Verification Status</p>
                        {selectedDocument.verified ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center w-fit mt-1">
                            <Check className="mr-1 h-3 w-3" />
                            Verified on Blockchain
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center w-fit mt-1">
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Related Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <div>
                        <p className="text-muted-foreground">Linked Contract</p>
                        {selectedDocument.contractId ? (
                          <p className="font-medium">{selectedDocument.contractName}</p>
                        ) : (
                          <p className="text-muted-foreground">Not linked to any contract</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Description</p>
                        {selectedDocument.description ? (
                          <p>{selectedDocument.description}</p>
                        ) : (
                          <p className="text-muted-foreground">No description provided</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  {!selectedDocument.verified && (
                    <Button size="sm">
                      <Check className="mr-2 h-4 w-4" />
                      Verify Document
                    </Button>
                  )}
                  {!selectedDocument.contractId && (
                    <Button variant="outline" size="sm">
                      Link to Contract
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}