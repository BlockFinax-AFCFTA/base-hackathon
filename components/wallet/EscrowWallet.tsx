'use client'

import React, { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { 
  Wallet, 
  FilePlus2, 
  Lock, 
  Shield, 
  Handshake, 
  ArrowRightLeft,
  FileText,
  Clock,
  Calendar,
  ExternalLink,
  Info,
  Check,
  PlusCircle,
  Truck,
  FileCheck,
  AlertTriangle,
  Copy,
  DollarSign
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Badge } from '../ui/badge'
import { format } from 'date-fns'
import { Textarea } from '../ui/textarea'
import { useToast } from '../../hooks/use-toast'

// Mock data for escrow transactions
interface ContractDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  url: string;
  verified: boolean;
}

interface EscrowTransaction {
  id: string;
  contractId: string;
  contractName: string;
  status: 'draft' | 'active' | 'completed' | 'disputed' | 'refunded';
  amount: string;
  currency: string;
  createdDate: Date;
  completionDate: Date | null;
  counterpartyName: string;
  counterpartyAddress: string;
  terms: {
    paymentConditions: string;
    deliveryDetails: string;
    disputeResolution: string;
    additionalTerms: string;
  };
  documents: ContractDocument[];
}

// Sample data for demonstration
const mockEscrowTransactions: EscrowTransaction[] = [
  {
    id: 'escrow-001',
    contractId: 'contract-001',
    contractName: 'Supply Chain Agreement',
    status: 'active',
    amount: '5000.00',
    currency: 'USDC',
    createdDate: new Date(2025, 3, 10),
    completionDate: null,
    counterpartyName: 'Global Logistics Inc.',
    counterpartyAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    terms: {
      paymentConditions: "Payment to be released upon verification of goods received",
      deliveryDetails: "Door-to-door delivery within 30 days of contract activation",
      disputeResolution: "Third-party arbitration through Base Chain DAO",
      additionalTerms: "Cancellation with 7-day notice subject to 10% fee"
    },
    documents: [
      {
        id: 'doc-001',
        name: 'Contract Agreement.pdf',
        type: 'application/pdf',
        size: 2500000,
        uploadDate: new Date(2025, 3, 10),
        url: '#',
        verified: true
      },
      {
        id: 'doc-002',
        name: 'Bill of Lading.pdf',
        type: 'application/pdf',
        size: 1800000,
        uploadDate: new Date(2025, 3, 15),
        url: '#',
        verified: true
      }
    ]
  },
  {
    id: 'escrow-002',
    contractId: 'contract-002',
    contractName: 'Cross-Border Payment Service',
    status: 'draft',
    amount: '7500.00',
    currency: 'USDT',
    createdDate: new Date(2025, 4, 5),
    completionDate: null,
    counterpartyName: 'International Payments Ltd.',
    counterpartyAddress: '0x9e35b23dba3dfae7fbfc3b1f0dfde7b6ae619304',
    terms: {
      paymentConditions: "Monthly billing with net-30 payment terms",
      deliveryDetails: "Service activation within 14 days of contract signing",
      disputeResolution: "Joint committee resolution with option for arbitration",
      additionalTerms: "Monthly minimum transaction volume: $5,000, Fee structure: 1.5% per transaction"
    },
    documents: [
      {
        id: 'doc-003',
        name: 'Service Agreement.pdf',
        type: 'application/pdf',
        size: 3100000,
        uploadDate: new Date(2025, 4, 5),
        url: '#',
        verified: false
      }
    ]
  },
  {
    id: 'escrow-003',
    contractId: 'contract-003',
    contractName: 'Equipment Purchase',
    status: 'completed',
    amount: '12000.00',
    currency: 'USDC',
    createdDate: new Date(2025, 2, 20),
    completionDate: new Date(2025, 3, 25),
    counterpartyName: 'Industrial Equipment Co.',
    counterpartyAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    terms: {
      paymentConditions: "50% upfront, 50% upon delivery and inspection",
      deliveryDetails: "Delivery within 45 days to specified warehouse location",
      disputeResolution: "Inspection period of 7 days to report defects",
      additionalTerms: "Warranty period: 12 months, Technical support included for 6 months"
    },
    documents: [
      {
        id: 'doc-004',
        name: 'Purchase Order.pdf',
        type: 'application/pdf',
        size: 1500000,
        uploadDate: new Date(2025, 2, 20),
        url: '#',
        verified: true
      },
      {
        id: 'doc-005',
        name: 'Warranty Certificate.pdf',
        type: 'application/pdf',
        size: 900000,
        uploadDate: new Date(2025, 3, 25),
        url: '#',
        verified: true
      },
      {
        id: 'doc-006',
        name: 'Inspection Report.pdf',
        type: 'application/pdf',
        size: 2200000,
        uploadDate: new Date(2025, 3, 23),
        url: '#',
        verified: true
      }
    ]
  }
];

// Mock contracts for creating new escrows
const mockContracts = [
  { id: 'contract-004', name: 'Software Development Agreement' },
  { id: 'contract-005', name: 'Agricultural Export Contract' },
  { id: 'contract-006', name: 'Consulting Services Agreement' },
];

// EscrowWallet Component
const EscrowWallet: React.FC = () => {
  const [escrows, setEscrows] = useState<EscrowTransaction[]>(mockEscrowTransactions);
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowTransaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateEscrowOpen, setIsCreateEscrowOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  // Create Escrow Form State
  const [newEscrow, setNewEscrow] = useState({
    contractId: '',
    counterpartyName: '',
    counterpartyAddress: '',
    amount: '',
    currency: 'USDC',
    paymentConditions: '',
    deliveryDetails: '',
    disputeResolution: '',
    additionalTerms: ''
  });
  
  // Format currency amount
  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return value.toFixed(2);
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Address Copied",
      description: "Address copied to clipboard",
    });
  };
  
  // Handle viewing escrow details
  const handleViewDetails = (escrow: EscrowTransaction) => {
    setSelectedEscrow(escrow);
    setIsDetailsOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEscrow({
      ...newEscrow,
      [name]: value
    });
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setNewEscrow({
      ...newEscrow,
      [name]: value
    });
  };
  
  // Handle creating new escrow
  const handleCreateEscrow = async () => {
    // Validate form
    if (!newEscrow.contractId || !newEscrow.counterpartyAddress || !newEscrow.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get selected contract name
      const contractName = mockContracts.find(c => c.id === newEscrow.contractId)?.name || '';
      
      // Create new escrow object
      const newEscrowTransaction: EscrowTransaction = {
        id: `escrow-${Date.now().toString(36)}`,
        contractId: newEscrow.contractId,
        contractName,
        status: 'draft',
        amount: newEscrow.amount,
        currency: newEscrow.currency,
        createdDate: new Date(),
        completionDate: null,
        counterpartyName: newEscrow.counterpartyName,
        counterpartyAddress: newEscrow.counterpartyAddress,
        terms: {
          paymentConditions: newEscrow.paymentConditions,
          deliveryDetails: newEscrow.deliveryDetails,
          disputeResolution: newEscrow.disputeResolution,
          additionalTerms: newEscrow.additionalTerms
        },
        documents: []
      };
      
      // Add to escrows list
      setEscrows([newEscrowTransaction, ...escrows]);
      
      // Reset form and close dialog
      setNewEscrow({
        contractId: '',
        counterpartyName: '',
        counterpartyAddress: '',
        amount: '',
        currency: 'USDC',
        paymentConditions: '',
        deliveryDetails: '',
        disputeResolution: '',
        additionalTerms: ''
      });
      
      setIsCreateEscrowOpen(false);
      
      toast({
        title: "Escrow Created",
        description: "Your escrow transaction has been created as a draft. Fund it to activate."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create escrow transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle funding escrow (moves from draft to active)
  const handleFundEscrow = async () => {
    if (!selectedEscrow) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update escrow status
      const updatedEscrows = escrows.map(escrow => 
        escrow.id === selectedEscrow.id
          ? { ...escrow, status: 'active' as const }
          : escrow
      );
      
      setEscrows(updatedEscrows);
      setSelectedEscrow({
        ...selectedEscrow,
        status: 'active'
      });
      
      toast({
        title: "Escrow Funded",
        description: "The escrow has been funded and is now active."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fund escrow. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle releasing escrow funds
  const handleReleaseEscrow = async () => {
    if (!selectedEscrow) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update escrow status
      const updatedEscrows = escrows.map(escrow => 
        escrow.id === selectedEscrow.id
          ? { ...escrow, status: 'completed' as const, completionDate: new Date() }
          : escrow
      );
      
      setEscrows(updatedEscrows);
      setSelectedEscrow({
        ...selectedEscrow,
        status: 'completed',
        completionDate: new Date()
      });
      
      toast({
        title: "Funds Released",
        description: "The escrow funds have been released successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to release escrow funds. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle uploading document to escrow
  const handleUploadDocument = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Document upload functionality will be available in a future update."
    });
  };
  
  // Filter escrows based on active tab
  const filteredEscrows = escrows.filter(escrow => {
    if (activeTab === 'all') return true;
    return escrow.status === activeTab;
  });
  
  // Status badge color
  const getStatusBadgeVariant = (status: EscrowTransaction['status']): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'draft': return 'outline';
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'disputed': return 'destructive';
      case 'refunded': return 'secondary';
      default: return 'outline';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Contract Escrow Wallet
              </CardTitle>
              <CardDescription>
                Manage secure escrow transactions linked to your contracts
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateEscrowOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Escrow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract</TableHead>
                      <TableHead>Counterparty</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEscrows.length > 0 ? (
                      filteredEscrows.map(escrow => (
                        <TableRow key={escrow.id}>
                          <TableCell className="font-medium">{escrow.contractName}</TableCell>
                          <TableCell>{escrow.counterpartyName}</TableCell>
                          <TableCell>{formatCurrency(escrow.amount)} {escrow.currency}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(escrow.status)}>
                              {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewDetails(escrow)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No escrow transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Escrow Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedEscrow && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center text-xl">
                  <Handshake className="mr-2 h-5 w-5" />
                  Escrow Transaction Details
                </DialogTitle>
                <DialogDescription>
                  Contract: {selectedEscrow.contractName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Transaction Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Escrow ID:</span>
                      <span className="font-mono">{selectedEscrow.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contract ID:</span>
                      <span className="font-mono">{selectedEscrow.contractId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-semibold">{formatCurrency(selectedEscrow.amount)} {selectedEscrow.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={getStatusBadgeVariant(selectedEscrow.status)}>
                        {selectedEscrow.status.charAt(0).toUpperCase() + selectedEscrow.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{format(selectedEscrow.createdDate, 'PPP')}</span>
                    </div>
                    {selectedEscrow.completionDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed:</span>
                        <span>{format(selectedEscrow.completionDate, 'PPP')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Counterparty Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{selectedEscrow.counterpartyName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Wallet Address:</span>
                      <div className="flex items-center">
                        <span className="font-mono">{formatAddress(selectedEscrow.counterpartyAddress)}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyToClipboard(selectedEscrow.counterpartyAddress)}
                          className="h-6 w-6 ml-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Payment Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm">
                      {selectedEscrow.terms.paymentConditions}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        Delivery Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm">
                      {selectedEscrow.terms.deliveryDetails}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Dispute Resolution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm">
                      {selectedEscrow.terms.disputeResolution}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Additional Terms
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm">
                      {selectedEscrow.terms.additionalTerms}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  <Button variant="outline" size="sm" onClick={handleUploadDocument}>
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
                
                {selectedEscrow.documents.length > 0 ? (
                  <div className="border rounded-md divide-y">
                    {selectedEscrow.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-blue-500" />
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{doc.name}</p>
                              {doc.verified && (
                                <Badge variant="outline" className="ml-2 flex items-center">
                                  <FileCheck className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(doc.size)} • Uploaded on {format(doc.uploadDate, 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border rounded-md">
                    <p className="text-muted-foreground">No documents attached to this escrow</p>
                  </div>
                )}
              </div>
              
              <DialogFooter className="sm:justify-between mt-4">
                <div>
                  {selectedEscrow.status === 'active' && (
                    <Button variant="outline" size="sm" className="mr-2">
                      Report Issue
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                    Close
                  </Button>
                  
                  {selectedEscrow.status === 'draft' && (
                    <Button 
                      onClick={handleFundEscrow} 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Fund Escrow'}
                    </Button>
                  )}
                  
                  {selectedEscrow.status === 'active' && (
                    <Button 
                      onClick={handleReleaseEscrow} 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Release Funds'}
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Create Escrow Dialog */}
      <Dialog open={isCreateEscrowOpen} onOpenChange={setIsCreateEscrowOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Create New Escrow
            </DialogTitle>
            <DialogDescription>
              Create a secure escrow transaction linked to a contract
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contractId">Select Contract</Label>
              <Select
                value={newEscrow.contractId}
                onValueChange={(value) => handleSelectChange('contractId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a contract" />
                </SelectTrigger>
                <SelectContent>
                  {mockContracts.map(contract => (
                    <SelectItem key={contract.id} value={contract.id}>
                      {contract.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The contract this escrow transaction will be linked to
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="counterpartyName">Counterparty Name</Label>
              <Input
                id="counterpartyName"
                name="counterpartyName"
                value={newEscrow.counterpartyName}
                onChange={handleInputChange}
                placeholder="Company or individual name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="counterpartyAddress">Counterparty Wallet Address</Label>
              <Input
                id="counterpartyAddress"
                name="counterpartyAddress"
                value={newEscrow.counterpartyAddress}
                onChange={handleInputChange}
                placeholder="0x..."
                required
              />
              <p className="text-xs text-muted-foreground">
                The wallet address that will receive funds when the escrow is released
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={newEscrow.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={newEscrow.currency}
                  onValueChange={(value) => handleSelectChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="DAI">DAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator />
            
            <h3 className="text-md font-medium">Terms & Conditions</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="paymentConditions">Payment Conditions</Label>
              <Textarea
                id="paymentConditions"
                name="paymentConditions"
                value={newEscrow.paymentConditions}
                onChange={handleInputChange}
                placeholder="Specify payment release conditions..."
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="deliveryDetails">Delivery Details</Label>
              <Textarea
                id="deliveryDetails"
                name="deliveryDetails"
                value={newEscrow.deliveryDetails}
                onChange={handleInputChange}
                placeholder="Specify delivery terms and timeframe..."
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="disputeResolution">Dispute Resolution</Label>
              <Textarea
                id="disputeResolution"
                name="disputeResolution"
                value={newEscrow.disputeResolution}
                onChange={handleInputChange}
                placeholder="Outline dispute resolution process..."
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="additionalTerms">Additional Terms</Label>
              <Textarea
                id="additionalTerms"
                name="additionalTerms"
                value={newEscrow.additionalTerms}
                onChange={handleInputChange}
                placeholder="Any additional contract terms..."
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateEscrowOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateEscrow} 
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Escrow'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EscrowWallet;