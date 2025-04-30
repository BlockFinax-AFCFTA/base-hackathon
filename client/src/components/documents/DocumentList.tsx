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
  
  // Ensure documents is treated as Document[] even if it comes as unknown
  const documentsList: Document[] = Array.isArray(documents) ? documents : [];
  
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
  
  const filteredDocuments = documentsList.filter((doc: Document) => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.tags && doc.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  // Mock references to contracts since we don't fetch them
  const mockReferenceNumbers = [
    'DOC-2025-0001',
    'DOC-2025-0002', 
    'DOC-2025-0003',
    'DOC-2025-0004',
    'DOC-2025-0005',
    'INV-2025-0001',
    'INV-2025-0002',
    'CON-2025-0001',
    'CON-2025-0002',
    'BL-2025-0001',
  ];
  
  const [activeView, setActiveView] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [shareLink, setShareLink] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [sharePassword, setSharePassword] = useState('');
  const [shareExpiry, setShareExpiry] = useState('7days');
  
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
              {filteredDocuments?.map((document: Document, index: number) => {
                // For mock purposes, add status and reference number
                const mockStatus = Object.values(DocumentStatus)[index % 5];
                const mockRefNum = mockReferenceNumbers[index % mockReferenceNumbers.length];
                
                return (
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
                        {getStatusBadge(mockStatus)}
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mt-3 line-clamp-1">{document.name}</h3>
                    
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-500">Reference Number</div>
                      <div className="text-sm font-mono bg-gray-50 p-1 rounded">{mockRefNum}</div>
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
              )})}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments?.map((document: Document, index: number) => {
                // For mock purposes, add status and reference number
                const mockStatus = Object.values(DocumentStatus)[index % 5];
                const mockRefNum = mockReferenceNumbers[index % mockReferenceNumbers.length];
                
                return (
                <div key={document.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-md mr-4">
                    <File className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{document.name}</h3>
                          {getStatusBadge(mockStatus)}
                        </div>
                        <div className="text-xs font-medium text-gray-500 mt-1">Reference Number: 
                          <span className="font-mono ml-1 bg-gray-50 px-1 rounded">{mockRefNum}</span>
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
              )})}
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
    </div>
  );
};

export default DocumentList;
