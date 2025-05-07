import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { 
  Button 
} from '../../components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '../../components/ui/tabs';
import { 
  Badge 
} from '../../components/ui/badge';
import { 
  Separator 
} from '../../components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

import { 
  CheckCircle2, 
  Wallet, 
  FileText, 
  ShieldCheck, 
  Ship, 
  Package, 
  Landmark,
  MoreHorizontal as DotsHorizontalIcon,
  Calendar,
  User,
  Users,
  Clock,
  ArrowRight,
  Download,
  UploadCloud,
  Eye,
  Pencil,
  AlertCircle,
  ExternalLink,
  Truck as TruckIcon,
  MapPin as MapPinIcon
} from 'lucide-react';

// Custom components and hooks
import LogisticsTracking from '../logistics/LogisticsTracking';
import { useContracts } from '../../hooks/useContracts';
import { useDocuments } from '../../hooks/useDocuments';
import { useWeb3 } from '../../hooks/useWeb3';
import { useToast } from '../../hooks/use-toast';

// Contract details interface
interface ContractDetailsProps {
  contractId: string;
}

const ContractDetails: React.FC<ContractDetailsProps> = ({ contractId }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const { contract, isLoading, error, approve, fund, release } = useContracts(parseInt(contractId));
  const { documents, isLoading: isLoadingDocs } = useDocuments(parseInt(contractId));
  const { account } = useWeb3();
  
  // State for file upload
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentDescription, setDocumentDescription] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Here we would upload the file to the server
      toast({
        title: "Document uploaded",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setDocumentDescription('');
    }
  };

  // Transaction actions
  const handleFundContract = async () => {
    try {
      await fund();
      toast({
        title: "Contract Funded",
        description: "The escrow has been successfully funded.",
      });
    } catch (error) {
      toast({
        title: "Funding Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleApproveContract = async () => {
    try {
      await approve();
      toast({
        title: "Contract Approved",
        description: "You have approved the contract terms.",
      });
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleReleaseEscrow = async () => {
    try {
      await release();
      toast({
        title: "Funds Released",
        description: "The escrow funds have been released to the seller.",
      });
    } catch (error) {
      toast({
        title: "Release Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <Card className="border border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Error Loading Contract</h3>
          </div>
          <p className="text-muted-foreground">
            {error || "Contract not found. It may have been deleted or you don't have access."}
          </p>
          <Button className="mt-4" variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Helper to safely get the status
  const getStatus = () => contract.status || '';
  
  // Helper to safely check status against a value or array of values
  const checkStatus = (checkValue: string | string[]) => {
    if (!contract.status) return false;
    const statusLower = contract.status.toLowerCase();
    
    if (Array.isArray(checkValue)) {
      return checkValue.includes(statusLower);
    }
    
    return statusLower === checkValue;
  };
  
  // Helper to get the right status badge color
  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case 'draft': return "bg-gray-100 text-gray-800";
      case 'pendingapproval': 
      case 'pending': return "bg-amber-100 text-amber-800";
      case 'awaitingfunds': 
      case 'awaiting': return "bg-blue-100 text-blue-800";
      case 'funded': return "bg-indigo-100 text-indigo-800";
      case 'active': return "bg-blue-100 text-blue-800";
      case 'goodsshipped': 
      case 'shipped': return "bg-purple-100 text-purple-800";
      case 'goodsreceived': 
      case 'received': return "bg-teal-100 text-teal-800";
      case 'completed': return "bg-green-100 text-green-800";
      case 'cancelled': 
      case 'disputed': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Format date helper
  const formatDate = (dateStr: string | Date) => {
    if (!dateStr) return 'Not specified';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{contract.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getStatusColor(contract.status || '')}>
              {contract.status ? contract.status.toUpperCase() : 'UNKNOWN'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Contract ID: {contractId}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {checkStatus('draft') && (
            <Button onClick={handleApproveContract} className="gap-1">
              <CheckCircle2 className="h-4 w-4 mr-1" /> Approve Contract
            </Button>
          )}
          
          {checkStatus('pendingapproval') && (
            <Button onClick={handleFundContract} className="gap-1">
              <Wallet className="h-4 w-4 mr-1" /> Fund Escrow
            </Button>
          )}
          
          {checkStatus('goodsreceived') && (
            <Button onClick={handleReleaseEscrow} className="gap-1">
              <Landmark className="h-4 w-4 mr-1" /> Release Funds
            </Button>
          )}
          
          {checkStatus(['draft', 'pendingapproval']) && (
            <Button variant="outline" className="gap-1">
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
          
          <Button variant="outline" className="gap-1">
            <FileText className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="escrow">Escrow</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="history" className="hidden md:flex">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Information</CardTitle>
                <CardDescription>
                  Primary details of this trading agreement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Status</div>
                    <Badge className={getStatusColor(contract.status || '')}>
                      {contract.status ? contract.status.toUpperCase() : 'UNKNOWN'}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Created</div>
                    <div className="text-sm flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {formatDate(contract.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Description</div>
                  <div className="text-sm">{contract.description || "No description provided"}</div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="text-sm font-medium mb-1">Created By</div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div className="text-sm">{contract.createdBy}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Parties</div>
                  <div className="space-y-2">
                    {contract.parties && Object.entries(contract.parties).map(([role, party], index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div><span className="font-medium">{role}:</span> {party}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {contract.contractAddress && (
                  <div>
                    <div className="text-sm font-medium mb-1">On-Chain Address</div>
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={`https://basescan.org/address/${contract.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        {contract.contractAddress.substring(0, 8)}...{contract.contractAddress.substring(36)}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trade Terms</CardTitle>
                <CardDescription>
                  Terms and conditions of the trade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Trade Details</div>
                  <div className="space-y-2">
                    {contract.tradeTerms && Object.entries(contract.tradeTerms).map(([key, value], index) => (
                      <div key={index} className="grid grid-cols-2 text-sm">
                        <div className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                        <div>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="text-sm font-medium mb-1">Milestones</div>
                  {contract.milestones && Object.entries(contract.milestones).length > 0 ? (
                    <div className="space-y-2">
                      {contract.milestones && Object.entries(contract.milestones).map(([key, milestone], index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className={`h-2 w-2 rounded-full ${
                            milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <div className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                          <div className="text-muted-foreground">
                            {milestone.completed ? (
                              <span className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
                                Completed {milestone.date && formatDate(milestone.date)}
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No milestones defined</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Contract Documents</h3>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <UploadCloud className="h-4 w-4 mr-1" /> Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                  <DialogDescription>
                    Add a new document to this contract. Supported formats: PDF, DOCX, XLSX, PNG, JPG.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="file">Document File</Label>
                    <Input id="file" type="file" onChange={handleFileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description" 
                      placeholder="Enter a brief description" 
                      value={documentDescription}
                      onChange={(e) => setDocumentDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleUpload} disabled={!selectedFile}>Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoadingDocs ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {documents.map((doc, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{doc.name}</h4>
                      <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                        <span>{doc.fileType}</span>
                        <span>•</span>
                        <span>{Math.round(doc.fileSize / 1024)} KB</span>
                        <span>•</span>
                        <span>Uploaded {formatDate(doc.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.isVerified && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-1">No Documents</h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  There are no documents attached to this contract yet. Upload important files like agreements, invoices, 
                  or shipping documentation.
                </p>
                <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
                  <UploadCloud className="h-4 w-4 mr-2" /> Upload First Document
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="escrow" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Escrow Wallet</CardTitle>
              <CardDescription>
                Secure funds hold for this contract
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium mb-1 text-muted-foreground">Contract Value</div>
                    <div className="text-2xl font-bold">
                      {contract.tradeTerms?.value || "0"} {contract.tradeTerms?.currency || "USDC"}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium mb-1 text-muted-foreground">Current Balance</div>
                    <div className="text-2xl font-bold">
                      {checkStatus(['funded', 'active', 'goodsshipped', 'goodsreceived'])
                        ? (contract.tradeTerms?.value || "0") 
                        : "0"} {contract.tradeTerms?.currency || "USDC"}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium mb-1 text-muted-foreground">Status</div>
                    <div className="flex items-center">
                      {checkStatus(['funded', 'active', 'goodsshipped', 'goodsreceived']) ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-lg font-medium">Funded</span>
                        </>
                      ) : checkStatus('completed') ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="text-lg font-medium">Released</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                          <span className="text-lg font-medium">Not Funded</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium mb-3">Escrow Lifecycle</h4>
                <div className="relative">
                  <div className="absolute left-3.5 top-0 h-full w-px bg-muted-foreground/20"></div>
                  
                  <div className="relative pl-10 pb-8">
                    <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Contract Created</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(contract.createdAt)}
                    </div>
                  </div>
                  
                  <div className={`relative pl-10 pb-8 ${
                    checkStatus(['pendingapproval', 'awaitingfunds', 'funded', 'active', 'goodsshipped', 'goodsreceived', 'completed'])
                    ? 'opacity-100' : 'opacity-50'
                  }`}>
                    <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
                      checkStatus(['pendingapproval', 'awaitingfunds', 'funded', 'active', 'goodsshipped', 'goodsreceived', 'completed'])
                      ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                    }`}>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Parties Approved</div>
                    <div className="text-sm text-muted-foreground">
                      Contract terms approved by all participants
                    </div>
                  </div>
                  
                  <div className={`relative pl-10 pb-8 ${
                    checkStatus(['funded', 'active', 'goodsshipped', 'goodsreceived', 'completed'])
                    ? 'opacity-100' : 'opacity-50'
                  }`}>
                    <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
                      checkStatus(['funded', 'active', 'goodsshipped', 'goodsreceived', 'completed'])
                      ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                    }`}>
                      <Wallet className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Escrow Funded</div>
                    <div className="text-sm text-muted-foreground">
                      {contract.tradeTerms?.value || "0"} {contract.tradeTerms?.currency || "USDC"} locked in escrow
                    </div>
                  </div>
                  
                  <div className={`relative pl-10 pb-8 ${
                    checkStatus(['goodsreceived', 'completed'])
                    ? 'opacity-100' : 'opacity-50'
                  }`}>
                    <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
                      checkStatus(['goodsreceived', 'completed'])
                      ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                    }`}>
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Goods Received</div>
                    <div className="text-sm text-muted-foreground">
                      Buyer confirmed receipt of goods
                    </div>
                  </div>
                  
                  <div className={`relative pl-10 ${
                    checkStatus('completed')
                    ? 'opacity-100' : 'opacity-50'
                  }`}>
                    <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
                      checkStatus('completed')
                      ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                    }`}>
                      <Landmark className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Funds Released</div>
                    <div className="text-sm text-muted-foreground">
                      {checkStatus('completed') ? 
                        `Payment of ${contract.tradeTerms?.value || "0"} ${contract.tradeTerms?.currency || "USDC"} sent to seller` :
                        "Awaiting confirmation to release funds"
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                {checkStatus('draft') && (
                  <Button onClick={handleApproveContract} className="gap-1 mr-2">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Approve Contract
                  </Button>
                )}
                
                {checkStatus('pendingapproval') && (
                  <Button onClick={handleFundContract} className="gap-1 mr-2">
                    <Wallet className="h-4 w-4 mr-1" /> Fund Escrow
                  </Button>
                )}
                
                {checkStatus('goodsreceived') && (
                  <Button onClick={handleReleaseEscrow} className="gap-1 mr-2">
                    <Landmark className="h-4 w-4 mr-1" /> Release Funds
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logistics" className="mt-6">
          <LogisticsTracking contractId={parseInt(contractId)} />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contract History</CardTitle>
              <CardDescription>
                Complete chronological record of contract changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-3.5 top-0 h-full w-px bg-muted-foreground/20"></div>
                
                <div className="relative pl-10 pb-8">
                  <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="font-medium">Contract Created</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(contract.createdAt)} by {contract.createdBy}
                  </div>
                </div>
                
                {checkStatus(['pendingapproval', 'awaitingfunds', 'funded', 'active', 'goodsshipped', 'goodsreceived', 'completed']) && (
                  <div className="relative pl-10 pb-8">
                    <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Contract Approved</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(new Date(new Date(contract.createdAt).getTime() + 86400000))} by Buyer
                    </div>
                  </div>
                )}
                
                {checkStatus(['funded', 'active', 'goodsshipped', 'goodsreceived', 'completed']) && (
                  <div className="relative pl-10 pb-8">
                    <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Wallet className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Escrow Funded</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(new Date(new Date(contract.createdAt).getTime() + 172800000))} by Buyer
                    </div>
                    <div className="text-sm">
                      {contract.tradeTerms?.value || "0"} {contract.tradeTerms?.currency || "USDC"} deposited into escrow wallet
                    </div>
                  </div>
                )}
                
                {checkStatus(['goodsshipped', 'goodsreceived', 'completed']) && (
                  <div className="relative pl-10 pb-8">
                    <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Ship className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Goods Shipped</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(new Date(new Date(contract.createdAt).getTime() + 259200000))} by Seller
                    </div>
                    <div className="text-sm">
                      Shipping documents uploaded and tracking number provided
                    </div>
                  </div>
                )}
                
                {checkStatus(['goodsreceived', 'completed']) && (
                  <div className="relative pl-10 pb-8">
                    <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Goods Received</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(new Date(new Date(contract.createdAt).getTime() + 604800000))} by Buyer
                    </div>
                    <div className="text-sm">
                      Buyer confirmed successful delivery of goods
                    </div>
                  </div>
                )}
                
                {checkStatus('completed') && (
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Funds Released</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(new Date(new Date(contract.createdAt).getTime() + 691200000))} by Escrow Smart Contract
                    </div>
                    <div className="text-sm">
                      {contract.tradeTerms?.value || "0"} {contract.tradeTerms?.currency || "USDC"} released to Seller
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ContractDetails;