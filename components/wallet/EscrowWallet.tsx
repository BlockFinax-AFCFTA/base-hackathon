'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Separator } from '../ui/separator'
import { format } from 'date-fns'
import { 
  Shield, 
  Clock, 
  FileText, 
  Lock, 
  Unlock, 
  CheckSquare,
  AlertCircle,
  Eye,
  FileSpreadsheet
} from 'lucide-react'
import { useToast } from '../../hooks/use-toast'

// Mock escrow transactions
interface EscrowTransaction {
  id: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  contractId: string
  contractName: string
  amount: string
  currency: string
  createdDate: Date
  releaseDate: Date | null
  description: string
  sender: {
    name: string
    address: string
  }
  recipient: {
    name: string
    address: string
  }
  documents: {
    id: string
    name: string
    dateAdded: Date
    verified: boolean
  }[]
  terms: string[]
}

const mockEscrowTransactions: EscrowTransaction[] = [
  {
    id: 'escrow-001',
    status: 'active',
    contractId: 'contract-001',
    contractName: 'Supply Chain Agreement',
    amount: '5000.00',
    currency: 'USDC',
    createdDate: new Date(2025, 3, 15),
    releaseDate: new Date(2025, 4, 15),
    description: 'Payment for logistics services - Q2 2025',
    sender: {
      name: 'Your Company',
      address: '0x7C4E46d9D576B32598Bc4D77A91Ad4a00B188Deb'
    },
    recipient: {
      name: 'Global Logistics Inc.',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    },
    documents: [
      {
        id: 'doc-001',
        name: 'Service Agreement.pdf',
        dateAdded: new Date(2025, 3, 15),
        verified: true
      },
      {
        id: 'doc-002',
        name: 'Bill of Lading.pdf',
        dateAdded: new Date(2025, 3, 16),
        verified: true
      }
    ],
    terms: [
      'Funds will be released upon confirmation of goods delivery',
      'Verification must be completed within 30 days',
      'Disputes must be raised within 7 days of delivery'
    ]
  },
  {
    id: 'escrow-002',
    status: 'pending',
    contractId: 'contract-002',
    contractName: 'Cross-Border Payment Service',
    amount: '2500.00',
    currency: 'USDT',
    createdDate: new Date(2025, 4, 5),
    releaseDate: null,
    description: 'Initial payment for payment gateway integration',
    sender: {
      name: 'Your Company',
      address: '0x7C4E46d9D576B32598Bc4D77A91Ad4a00B188Deb'
    },
    recipient: {
      name: 'International Payments Ltd.',
      address: '0x9e35b23dba3dfae7fbfc3b1f0dfde7b6ae619304'
    },
    documents: [
      {
        id: 'doc-003',
        name: 'Integration Agreement.pdf',
        dateAdded: new Date(2025, 4, 5),
        verified: false
      }
    ],
    terms: [
      'Funds to be escrowed prior to integration start',
      'Payment released in stages based on project milestones',
      'Final payment upon successful testing of payment gateway'
    ]
  },
  {
    id: 'escrow-003',
    status: 'completed',
    contractId: 'contract-003',
    contractName: 'Equipment Purchase',
    amount: '12000.00',
    currency: 'USDC',
    createdDate: new Date(2025, 2, 25),
    releaseDate: new Date(2025, 3, 10),
    description: 'Purchase of industrial manufacturing equipment',
    sender: {
      name: 'Your Company',
      address: '0x7C4E46d9D576B32598Bc4D77A91Ad4a00B188Deb'
    },
    recipient: {
      name: 'Industrial Equipment Co.',
      address: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db'
    },
    documents: [
      {
        id: 'doc-004',
        name: 'Purchase Order.pdf',
        dateAdded: new Date(2025, 2, 25),
        verified: true
      },
      {
        id: 'doc-005',
        name: 'Equipment Receipt.pdf',
        dateAdded: new Date(2025, 3, 8),
        verified: true
      },
      {
        id: 'doc-006',
        name: 'Inspection Certificate.pdf',
        dateAdded: new Date(2025, 3, 9),
        verified: true
      }
    ],
    terms: [
      'Full payment held in escrow until equipment delivered',
      'Release conditional on equipment passing quality inspection',
      'Warranty period begins upon escrow release'
    ]
  }
];

const EscrowWallet = () => {
  const [transactions, setTransactions] = useState<EscrowTransaction[]>(mockEscrowTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<EscrowTransaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { toast } = useToast();
  
  // View transaction details
  const handleViewDetails = (transaction: EscrowTransaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };
  
  // Release funds from escrow
  const handleReleaseFunds = async (transactionId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update transaction status
      setTransactions(transactions.map(txn => 
        txn.id === transactionId 
          ? { ...txn, status: 'completed', releaseDate: new Date() }
          : txn
      ));
      
      setIsDetailsOpen(false);
      
      toast({
        title: "Funds Released",
        description: "The escrow funds have been successfully released.",
      });
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "There was an error processing your request.",
        variant: "destructive"
      });
    }
  };
  
  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    if (activeFilter === 'all') return true;
    return txn.status === activeFilter;
  });
  
  // Format currency
  const formatCurrency = (amount: string, currency: string) => {
    return `${parseFloat(amount).toFixed(2)} ${currency}`;
  };
  
  // Format address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'active':
        return <Lock className="h-4 w-4 text-primary" />;
      case 'completed':
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-semibold flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Escrow Wallet
          </h2>
          <p className="text-sm text-muted-foreground">
            Securely manage funds in escrow for contracts and agreements
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={activeFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === 'active' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('active')}
          >
            Active
          </Button>
          <Button 
            variant={activeFilter === 'pending' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={activeFilter === 'completed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </div>
      
      {filteredTransactions.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(transaction.status)}
                      <span className="ml-2">{getStatusBadge(transaction.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-muted-foreground" />
                      {transaction.contractName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </TableCell>
                  <TableCell>{format(transaction.createdDate, 'PP')}</TableCell>
                  <TableCell>
                    <span title={transaction.recipient.address}>
                      {formatAddress(transaction.recipient.address)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewDetails(transaction)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No Escrow Transactions</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            When you secure funds in escrow for a contract, they will appear here. Escrow provides security for both parties in a transaction.
          </p>
        </div>
      )}
      
      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                <DialogTitle>Escrow Transaction Details</DialogTitle>
              </div>
              <DialogDescription>
                ID: {selectedTransaction.id} • {selectedTransaction.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <Card className="w-full md:w-1/2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Contract Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Contract: </span>
                      <span className="font-medium">{selectedTransaction.contractName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status: </span>
                      {getStatusBadge(selectedTransaction.status)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created: </span>
                      {format(selectedTransaction.createdDate, 'PPP')}
                    </div>
                    {selectedTransaction.releaseDate && (
                      <div>
                        <span className="text-muted-foreground">Released: </span>
                        {format(selectedTransaction.releaseDate, 'PPP')}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="w-full md:w-1/2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Amount in Escrow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                    </div>
                    
                    {selectedTransaction.status === 'active' && (
                      <Button 
                        className="mt-4 w-full" 
                        onClick={() => handleReleaseFunds(selectedTransaction.id)}
                      >
                        <Unlock className="mr-2 h-4 w-4" />
                        Release Funds
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm mb-2">Sender</h3>
                  <div className="border rounded-md p-3">
                    <p className="font-medium">{selectedTransaction.sender.name}</p>
                    <p className="text-xs font-mono mt-1">{selectedTransaction.sender.address}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Recipient</h3>
                  <div className="border rounded-md p-3">
                    <p className="font-medium">{selectedTransaction.recipient.name}</p>
                    <p className="text-xs font-mono mt-1">{selectedTransaction.recipient.address}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-2">Escrow Terms</h3>
                <Card>
                  <CardContent className="p-4">
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedTransaction.terms.map((term, index) => (
                        <li key={index} className="text-sm">{term}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-2 flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Attached Documents ({selectedTransaction.documents.length})
                </h3>
                
                {selectedTransaction.documents.length > 0 ? (
                  <div className="border rounded-md divide-y">
                    {selectedTransaction.documents.map(doc => (
                      <div key={doc.id} className="p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Added {format(doc.dateAdded, 'PP')}
                            </p>
                          </div>
                        </div>
                        
                        {doc.verified ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline">Unverified</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-md p-4 text-center text-muted-foreground">
                    No documents attached to this escrow transaction
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EscrowWallet;