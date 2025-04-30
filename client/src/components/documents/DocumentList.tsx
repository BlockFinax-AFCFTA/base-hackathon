import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  File,
  FileText,
  FilePlus,
  Calendar,
  User,
  Link2,
  Search,
  AlertCircle,
  Trash2,
  Share,
  Download,
  Lock,
  Edit,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  XCircle,
  UserPlus,
  FileDown,
  RotateCw,
  Settings,
  ClipboardSignature,
  Tag,
  Filter
} from 'lucide-react';
import { Link } from 'wouter';
import { useDocuments } from '@/hooks/useDocuments';
import { Document, DocumentStatus, formatFileSize, getDocumentIcon } from '@/types/document';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const DocumentList = () => {
  const { documents, isLoading, deleteDocument, isDeleting } = useDocuments();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Create mock documents for display
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Invoice for Contract #12345',
      type: 'application/pdf',
      size: 1024 * 1024 * 2.3, // 2.3 MB
      hash: 'hash123456',
      url: 'https://example.com/documents/invoice12345.pdf',
      contractId: '1',
      uploadedBy: 'user123',
      uploadedAt: new Date('2025-03-15'),
      tags: ['invoice', 'payment', 'contract'],
      referenceNumber: 'INV-2025-0001',
      status: DocumentStatus.APPROVED,
      isVerified: true,
      verifiedBy: 'admin',
      verifiedAt: new Date('2025-03-16'),
      access: [1, 2, 3]
    },
    {
      id: '2',
      name: 'Bill of Lading - Shipping Container MSCU7854321',
      type: 'application/pdf',
      size: 1024 * 1024 * 1.5, // 1.5 MB
      hash: 'hash234567',
      url: 'https://example.com/documents/bl7854321.pdf',
      contractId: '1',
      uploadedBy: 'user123',
      uploadedAt: new Date('2025-03-18'),
      tags: ['shipping', 'logistics', 'bill of lading'],
      referenceNumber: 'BL-2025-0001',
      status: DocumentStatus.PENDING_REVIEW,
      access: [1]
    },
    {
      id: '3',
      name: 'Certificate of Origin - Ghana',
      type: 'application/pdf',
      size: 1024 * 512, // 512 KB
      hash: 'hash345678',
      url: 'https://example.com/documents/coghana2025.pdf',
      uploadedBy: 'user123',
      uploadedAt: new Date('2025-03-20'),
      tags: ['certificate', 'origin', 'ghana'],
      referenceNumber: 'CO-2025-0001',
      status: DocumentStatus.APPROVED,
      isVerified: true,
      verifiedBy: 'admin',
      verifiedAt: new Date('2025-03-21'),
      access: [1, 4]
    },
    {
      id: '4',
      name: 'Purchase Order - Coffee Beans',
      type: 'application/pdf',
      size: 1024 * 750, // 750 KB
      hash: 'hash456789',
      url: 'https://example.com/documents/po89012.pdf',
      contractId: '2',
      uploadedBy: 'user123',
      uploadedAt: new Date('2025-03-22'),
      tags: ['purchase', 'coffee', 'order'],
      referenceNumber: 'PO-2025-0001',
      status: DocumentStatus.DRAFT,
      access: [1]
    },
    {
      id: '5',
      name: 'Import Permit - Agricultural Products',
      type: 'application/pdf',
      size: 1024 * 1024 * 1.2, // 1.2 MB
      hash: 'hash567890',
      url: 'https://example.com/documents/importpermit45678.pdf',
      uploadedBy: 'user123',
      uploadedAt: new Date('2025-02-10'),
      tags: ['permit', 'import', 'agriculture'],
      referenceNumber: 'IP-2025-0001',
      status: DocumentStatus.EXPIRED,
      expiryDate: new Date('2025-03-25'),
      access: [1, 2]
    },
    {
      id: '6',
      name: 'Insurance Certificate - Cargo',
      type: 'application/pdf',
      size: 1024 * 920, // 920 KB
      hash: 'hash678901',
      url: 'https://example.com/documents/insurancecargo12345.pdf',
      contractId: '1',
      uploadedBy: 'user123',
      uploadedAt: new Date('2025-03-01'),
      tags: ['insurance', 'cargo', 'certificate'],
      referenceNumber: 'IC-2025-0001',
      status: DocumentStatus.APPROVED,
      isVerified: true,
      verifiedBy: 'admin',
      verifiedAt: new Date('2025-03-02'),
      access: [1, 3, 5]
    },
    {
      id: '7',
      name: 'Quality Inspection Report',
      type: 'application/pdf',
      size: 1024 * 1024 * 3.1, // 3.1 MB
      hash: 'hash789012',
      url: 'https://example.com/documents/qualityreport789.pdf',
      contractId: '2',
      uploadedBy: 'user123',
      uploadedAt: new Date('2025-03-24'),
      tags: ['quality', 'inspection', 'report'],
      referenceNumber: 'QIR-2025-0001',
      status: DocumentStatus.REJECTED,
      access: [1]
    },
    {
      id: '8',
      name: 'Export License - Electronic Goods',
      type: 'application/pdf',
      size: 1024 * 850, // 850 KB
      hash: 'hash890123',
      url: 'https://example.com/documents/exportlicense456.pdf',
      uploadedBy: 'user123',
      uploadedAt: new Date('2025-03-05'),
      tags: ['export', 'license', 'electronics'],
      referenceNumber: 'EL-2025-0001',
      status: DocumentStatus.PENDING_REVIEW,
      access: [1, 6]
    }
  ];
  
  // Combine real documents with mock ones, or just use mock if none exist
  const documentsList: Document[] = Array.isArray(documents) && documents.length > 0 
    ? documents 
    : mockDocuments;
  
  // Initialize state
  const [activeView, setActiveView] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [shareLink, setShareLink] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [sharePassword, setSharePassword] = useState('');
  const [shareExpiry, setShareExpiry] = useState('7days');
  const [verificationMethod, setVerificationMethod] = useState<'hash' | 'blockchain' | 'certificate'>('hash');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDeleteClick = (documentId: string) => {
    setDocumentToDelete(documentId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      await deleteDocument(parseInt(documentToDelete));
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
      toast({
        title: "Document Deleted",
        description: "The document has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the document",
        variant: "destructive"
      });
    }
  };
  
  // Filter documents by search term and status
  const filteredDocuments = documentsList.filter((doc: Document) => {
    // First filter by search term
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.tags && doc.tags.some((tag: string) => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )) ||
      (doc.referenceNumber && 
        doc.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Then filter by status if not showing all
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'approved' && doc.status === DocumentStatus.APPROVED) ||
      (statusFilter === 'pending' && doc.status === DocumentStatus.PENDING_REVIEW) ||
      (statusFilter === 'draft' && doc.status === DocumentStatus.DRAFT) ||
      (statusFilter === 'rejected' && doc.status === DocumentStatus.REJECTED) ||
      (statusFilter === 'expired' && doc.status === DocumentStatus.EXPIRED);
    
    return matchesSearch && matchesStatus;
  });
  
  // Generate share link with password
  const generateShareLink = (docId: string) => {
    const baseUrl = window.location.origin;
    const randomToken = Math.random().toString(36).substring(2, 15);
    return `${baseUrl}/shared/docs/${docId}?token=${randomToken}`;
  };
  
  const handleShareClick = (document: Document) => {
    setActiveDocument(document);
    setShareLink(generateShareLink(document.id));
    setShowShareDialog(true);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard",
    });
  };
  
  // Handle document verification dialog
  const handleVerifyClick = (document: Document) => {
    setActiveDocument(document);
    setVerificationStatus('idle');
    setShowVerifyDialog(true);
  };
  
  // Simulate document verification process
  const verifyDocument = async () => {
    if (!activeDocument) return;
    
    setVerificationStatus('verifying');
    
    // Simulate verification process with a delay
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll consider documents that have isVerified=true as valid
      if (activeDocument.isVerified) {
        setVerificationStatus('verified');
        toast({
          title: "Verification Successful",
          description: "The document has been successfully verified as authentic",
          variant: "default"
        });
      } else {
        // Randomly succeed or fail verification for non-verified documents
        const isSuccessful = Math.random() > 0.3;
        
        if (isSuccessful) {
          setVerificationStatus('verified');
          toast({
            title: "Verification Successful",
            description: "The document has been successfully verified as authentic",
            variant: "default"
          });
        } else {
          setVerificationStatus('failed');
          toast({
            title: "Verification Failed",
            description: "The document could not be verified. It may have been tampered with.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error verifying document:', error);
      setVerificationStatus('failed');
      toast({
        title: "Verification Error",
        description: "An error occurred during the verification process",
        variant: "destructive"
      });
    }
  };
  
  const getStatusBadge = (status: DocumentStatus) => {
    switch(status) {
      case DocumentStatus.APPROVED:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Approved
        </Badge>;
      case DocumentStatus.PENDING_REVIEW:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending Review
        </Badge>;
      case DocumentStatus.REJECTED:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>;
      case DocumentStatus.DRAFT:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          <Edit className="h-3 w-3 mr-1" />
          Draft
        </Badge>;
      case DocumentStatus.EXPIRED:
        return <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-200">
          <Clock className="h-3 w-3 mr-1" />
          Expired
        </Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Document Management</h1>
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
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Card className="flex-1">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Filter Documents</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="w-full sm:w-auto">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-1 ml-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={activeView === 'grid' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setActiveView('grid')}
                        className="h-8 w-8 p-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                        </svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Grid View</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activeView === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveView('list')}
                        className="h-8 w-8 p-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="21" y1="6" x2="3" y2="6"></line>
                          <line x1="21" y1="12" x2="3" y2="12"></line>
                          <line x1="21" y1="18" x2="3" y2="18"></line>
                        </svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>List View</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <h2 className="text-lg font-medium">Your Documents</h2>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">
              Loading documents...
            </div>
          ) : documentsList.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-2">No documents found</p>
              <Link href="/documents/upload">
                <Button>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Upload Your First Document
                </Button>
              </Link>
            </div>
          ) : filteredDocuments?.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p>No documents match your search</p>
            </div>
          ) : activeView === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document: Document) => (
                <div 
                  key={document.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
                >
                  <div className="p-4 flex-1">
                    <div className="flex justify-between">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <File className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        {getStatusBadge(document.status)}
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mt-3 line-clamp-1">{document.name}</h3>
                    
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-500">Reference Number</div>
                      <div className="text-sm font-mono bg-gray-50 p-1 rounded">{document.referenceNumber}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-y-1 items-center text-xs text-gray-500 mt-2">
                      <span className="flex items-center mr-3">
                        <FileText className="h-3 w-3 mr-1 text-gray-400" />
                        {formatFileSize(document.size)}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {formatDate(document.uploadedAt)}
                      </span>
                    </div>
                    
                    {document.tags && document.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {document.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-3 flex justify-between items-center border-t">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(document.url, '_blank')}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareClick(document)}>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleVerifyClick(document)}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Verify Authenticity
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ClipboardSignature className="h-4 w-4 mr-2" />
                          Sign
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(document.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {document.contractId && (
                      <Link href={`/contracts/${document.contractId}`}>
                        <Button variant="ghost" size="sm">
                          <Link2 className="h-4 w-4 mr-1" />
                          Contract
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((document: Document) => (
                <div key={document.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-md mr-4">
                    <File className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{document.name}</h3>
                          {getStatusBadge(document.status)}
                        </div>
                        <div className="text-xs font-medium text-gray-500 mt-1">Reference Number: 
                          <span className="font-mono ml-1 bg-gray-50 px-1 rounded">{document.referenceNumber}</span>
                        </div>
                        <div className="flex flex-wrap gap-y-1 items-center text-sm text-gray-500 mt-1">
                          <span className="flex items-center mr-3">
                            <FileText className="h-4 w-4 mr-1 text-gray-400" />
                            {formatFileSize(document.size)}
                          </span>
                          <span className="flex items-center mr-3">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {formatDate(document.uploadedAt)}
                          </span>
                          {document.contractId && (
                            <span className="flex items-center">
                              <Link2 className="h-4 w-4 mr-1 text-gray-400" />
                              <Link href={`/contracts/${document.contractId}`}>
                                <span className="text-primary hover:text-primary-700 cursor-pointer">
                                  View Contract
                                </span>
                              </Link>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0 space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(document.url, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleShareClick(document)}
                              >
                                <Share className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Share</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleVerifyClick(document)}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Verify Authenticity</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(document.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    {document.tags && document.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {document.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Document Sharing Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Create a shareable link for "{activeDocument?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 mt-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="share-link" className="sr-only">Link</Label>
              <Input
                id="share-link"
                value={shareLink}
                readOnly
                className="font-mono text-xs"
              />
            </div>
            <Button size="sm" onClick={handleCopyLink} type="button">
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
          
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="expiry">Link Expiry</Label>
              <Select value={shareExpiry} onValueChange={setShareExpiry}>
                <SelectTrigger id="expiry">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="never">Never Expires</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="password-protect" 
                checked={isPasswordProtected}
                onCheckedChange={(checked) => 
                  setIsPasswordProtected(checked === true)
                }
              />
              <Label htmlFor="password-protect">Password Protect</Label>
            </div>
            
            {isPasswordProtected && (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={sharePassword}
                  onChange={(e) => setSharePassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label>Access Permissions</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs py-1 px-2">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Badge>
                <Badge variant="outline" className="text-xs py-1 px-2">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Badge>
                <Badge variant="outline" className="text-xs py-1 px-2 bg-gray-100">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Badge>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowShareDialog(false)}
            >
              Close
            </Button>
            <Button type="button">
              <Share className="h-4 w-4 mr-2" />
              Share Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Document Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Document Verification Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Document Authenticity</DialogTitle>
            <DialogDescription>
              Verify the authenticity of "{activeDocument?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Document Information</Label>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Reference Number:</span>
                  <span className="font-mono text-xs bg-white px-2 py-1 rounded border">{activeDocument?.referenceNumber}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">File Hash:</span>
                  <span className="font-mono text-xs bg-white px-2 py-1 rounded border truncate max-w-[180px]">{activeDocument?.hash}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Upload Date:</span>
                  <span className="text-xs">{activeDocument && formatDate(activeDocument.uploadedAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="verification-method">Verification Method</Label>
              <Select value={verificationMethod} onValueChange={(val: any) => setVerificationMethod(val)}>
                <SelectTrigger id="verification-method">
                  <SelectValue placeholder="Select Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hash">Hash Verification</SelectItem>
                  <SelectItem value="blockchain">Blockchain Verification</SelectItem>
                  <SelectItem value="certificate">Certificate Authority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {verificationMethod === 'hash' && (
              <div className="grid gap-2">
                <Label htmlFor="hash-input">Compare Hash (Optional)</Label>
                <Input
                  id="hash-input"
                  placeholder="Enter hash to compare..."
                  className="font-mono text-xs"
                />
                <p className="text-xs text-gray-500">
                  You can verify by comparing the document hash with a known hash or let the system automatically verify against our records.
                </p>
              </div>
            )}
            
            {verificationMethod === 'blockchain' && (
              <div className="grid gap-2">
                <p className="text-xs text-gray-500">
                  We'll verify this document against the blockchain records. This provides the highest level of verification, confirming the document hasn't been modified since it was recorded on the blockchain.
                </p>
              </div>
            )}
            
            {verificationMethod === 'certificate' && (
              <div className="grid gap-2">
                <p className="text-xs text-gray-500">
                  We'll verify the document's digital signature against trusted certificate authorities to confirm its authenticity.
                </p>
              </div>
            )}
            
            {verificationStatus === 'verified' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Document Verified</h4>
                  <p className="text-sm text-green-700 mt-1">
                    This document has been verified as authentic and has not been tampered with.
                    {activeDocument?.verifiedBy && (
                      <span className="block mt-1">
                        Verified by: <span className="font-medium">{activeDocument.verifiedBy}</span> on {activeDocument.verifiedAt && formatDate(activeDocument.verifiedAt)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
            
            {verificationStatus === 'failed' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Verification Failed</h4>
                  <p className="text-sm text-red-700 mt-1">
                    We couldn't verify this document. It may have been modified or the verification information could be incorrect.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowVerifyDialog(false)}
              className="mr-auto"
            >
              Close
            </Button>
            
            <Button
              onClick={verifyDocument}
              disabled={verificationStatus === 'verifying'}
              className="min-w-[120px]"
            >
              {verificationStatus === 'verifying' ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Verify Document
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentList;