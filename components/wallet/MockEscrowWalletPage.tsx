import React, { useState } from 'react';
import { format } from 'date-fns';
import { File, Image, FileSpreadsheet, FileText, ArrowUp, ArrowDown, Wallet, RefreshCw, CreditCard, ExternalLink, ChevronDown, DollarSign, Landmark, BadgeCheck } from 'lucide-react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';

// Mock Data - Directly defined in this component
const user = {
  id: 1,
  username: 'demo_user',
  walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
};

const mainWallet = {
  id: 1,
  userId: 1,
  walletType: 'MAIN',
  contractId: null,
  balance: '10000.00',
  currency: 'USD',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

// Demo escrow wallets
const mockEscrowWallets = [
  {
    id: 1001,
    userId: 1,
    walletType: 'ESCROW',
    contractId: 123,
    balance: '5000.00',
    currency: 'USD',
    createdAt: new Date('2025-04-10'),
    updatedAt: new Date('2025-04-10')
  },
  {
    id: 1002,
    userId: 1,
    walletType: 'ESCROW',
    contractId: 456,
    balance: '8500.00',
    currency: 'USD',
    createdAt: new Date('2025-04-15'),
    updatedAt: new Date('2025-04-15')
  }
];

// Demo transactions with documents
const mockTransactions = [
  {
    id: 5001,
    fromWalletId: 1,
    toWalletId: 1001,
    amount: '5000.00',
    currency: 'USD',
    txType: 'ESCROW_LOCK',
    status: 'COMPLETED',
    contractId: 123,
    description: 'Contract #123 escrow funding',
    createdAt: new Date('2025-04-10'),
    documents: [
      { 
        id: 1, 
        name: 'Purchase Agreement.pdf', 
        fileType: 'application/pdf', 
        fileSize: 2457600, 
        url: '#', 
        uploadedBy: 1, 
        isVerified: true,
        createdAt: new Date('2025-04-09'),
        contractId: 123
      },
      { 
        id: 2, 
        name: 'Proof of Payment.jpg', 
        fileType: 'image/jpeg', 
        fileSize: 1048576, 
        url: '#', 
        uploadedBy: 1, 
        isVerified: true,
        createdAt: new Date('2025-04-10'),
        contractId: 123
      }
    ]
  },
  {
    id: 5002,
    fromWalletId: 1001,
    toWalletId: 2,
    amount: '5000.00',
    currency: 'USD',
    txType: 'ESCROW_RELEASE',
    status: 'COMPLETED',
    contractId: 123,
    description: 'Contract #123 escrow release to seller',
    createdAt: new Date('2025-04-20'),
    documents: [
      { 
        id: 3, 
        name: 'Delivery Confirmation.pdf', 
        fileType: 'application/pdf', 
        fileSize: 1245184, 
        url: '#', 
        uploadedBy: 2, 
        isVerified: true,
        createdAt: new Date('2025-04-18'),
        contractId: 123
      },
      { 
        id: 4, 
        name: 'Quality Inspection Report.pdf', 
        fileType: 'application/pdf', 
        fileSize: 3670016, 
        url: '#', 
        uploadedBy: 3, 
        isVerified: true,
        createdAt: new Date('2025-04-19'),
        contractId: 123
      }
    ]
  },
  {
    id: 5003,
    fromWalletId: 1,
    toWalletId: 1002,
    amount: '8500.00',
    currency: 'USD',
    txType: 'ESCROW_LOCK',
    status: 'COMPLETED',
    contractId: 456,
    description: 'Contract #456 escrow funding',
    createdAt: new Date('2025-04-15'),
    documents: [
      { 
        id: 5, 
        name: 'Sales Contract.pdf', 
        fileType: 'application/pdf', 
        fileSize: 3211264, 
        url: '#', 
        uploadedBy: 1, 
        isVerified: true,
        createdAt: new Date('2025-04-14'),
        contractId: 456
      }
    ]
  }
];

// Wallet card component - simple version
const WalletCard = ({ wallet, onDeposit, onWithdraw, onTransfer }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {wallet.walletType === 'MAIN' ? 'Main Wallet' : `Escrow Wallet (Contract #${wallet.contractId})`}
        </CardTitle>
        <CardDescription>
          ID: {wallet.id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">${parseFloat(wallet.balance).toLocaleString()}</p>
            <p className="text-muted-foreground text-sm">Created: {format(new Date(wallet.createdAt), 'MMM d, yyyy')}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => onDeposit(wallet.id)}>
              <ArrowDown className="h-4 w-4 mr-1" />
              Deposit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onWithdraw(wallet.id)}>
              <ArrowUp className="h-4 w-4 mr-1" />
              Withdraw
            </Button>
            <Button variant="outline" size="sm" onClick={() => onTransfer(wallet.id)}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Transfer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Transaction list component
const TransactionList = ({ transactions }) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentDetailsOpen, setDocumentDetailsOpen] = useState(false);
  
  const formatCurrency = (amount, currency) => {
    return `${currency} ${parseFloat(amount).toLocaleString()}`;
  };
  
  const getTransactionTypeIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case 'WITHDRAW':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'TRANSFER':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'ESCROW_LOCK':
        return <Landmark className="h-4 w-4 text-purple-500" />;
      case 'ESCROW_RELEASE':
        return <BadgeCheck className="h-4 w-4 text-green-500" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };
  
  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return 'Deposit';
      case 'WITHDRAW':
        return 'Withdraw';
      case 'TRANSFER':
        return 'Transfer';
      case 'ESCROW_LOCK':
        return 'Escrow Lock';
      case 'ESCROW_RELEASE':
        return 'Escrow Release';
      default:
        return type;
    }
  };
  
  const getTransactionStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'FAILED':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setDocumentDetailsOpen(true);
  };
  
  const fileIcon = (fileType) => {
    if (fileType.includes('pdf')) {
      return <File className="h-4 w-4 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <Image className="h-4 w-4 text-blue-500" />;
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent wallet activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <React.Fragment key={tx.id}>
                    <TableRow 
                      className={`cursor-pointer ${selectedTransaction === tx.id ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                      onClick={() => setSelectedTransaction(selectedTransaction === tx.id ? null : tx.id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {getTransactionTypeIcon(tx.txType)}
                          <span className="ml-2">{getTransactionTypeLabel(tx.txType)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(tx.amount, tx.currency)}</TableCell>
                      <TableCell>{getTransactionStatusBadge(tx.status)}</TableCell>
                      <TableCell>{format(new Date(tx.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <p className="text-xs text-muted-foreground">{tx.description || '-'}</p>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expandable row with transaction details */}
                    {selectedTransaction === tx.id && (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-muted/30 p-4">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Transaction Details</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Transaction ID</p>
                                  <p className="font-mono">{tx.id}</p>
                                </div>
                                {tx.contractId && (
                                  <div>
                                    <p className="text-muted-foreground">Contract ID</p>
                                    <p className="font-mono">{tx.contractId}</p>
                                  </div>
                                )}
                                {tx.fromWalletId && (
                                  <div>
                                    <p className="text-muted-foreground">From Wallet</p>
                                    <p className="font-mono">{tx.fromWalletId}</p>
                                  </div>
                                )}
                                {tx.toWalletId && (
                                  <div>
                                    <p className="text-muted-foreground">To Wallet</p>
                                    <p className="font-mono">{tx.toWalletId}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Show associated documents if they exist */}
                            {tx.documents && tx.documents.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">Associated Documents</h4>
                                <div className="border rounded-md overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[100px]">Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {tx.documents.map((doc) => (
                                        <TableRow key={doc.id}>
                                          <TableCell>
                                            <div className="flex items-center">
                                              {fileIcon(doc.fileType)}
                                              <span className="ml-2">{doc.name}</span>
                                            </div>
                                          </TableCell>
                                          <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                                          <TableCell>{format(new Date(doc.createdAt), 'MMM d, yyyy')}</TableCell>
                                          <TableCell>
                                            {doc.isVerified ? (
                                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Verified</Badge>
                                            ) : (
                                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              onClick={(e) => {
                                                e.stopPropagation(); 
                                                handleViewDocument(doc);
                                              }}
                                            >
                                              View
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Document details dialog */}
      <Dialog open={documentDetailsOpen} onOpenChange={setDocumentDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDocument.name}</DialogTitle>
                <DialogDescription>
                  {selectedDocument.isVerified ? 'This document has been verified.' : 'This document is awaiting verification.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">File Type</p>
                      <p>{selectedDocument.fileType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Size</p>
                      <p>{formatFileSize(selectedDocument.fileSize)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Uploaded</p>
                      <p>{format(new Date(selectedDocument.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                    {selectedDocument.contractId && (
                      <div>
                        <p className="text-muted-foreground">Contract ID</p>
                        <p className="font-mono">{selectedDocument.contractId}</p>
                      </div>
                    )}
                    {selectedDocument.invoiceId && (
                      <div>
                        <p className="text-muted-foreground">Invoice ID</p>
                        <p className="font-mono">{selectedDocument.invoiceId}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Placeholder for document preview - in a real app, you would integrate a viewer */}
                <div className="border rounded-md p-8 h-[400px] flex flex-col items-center justify-center">
                  <div className="text-center p-4">
                    <div className="flex justify-center mb-4">
                      {fileIcon(selectedDocument.fileType)}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{selectedDocument.name}</h3>
                    <p className="text-muted-foreground mb-4">Document preview would appear here.</p>
                    <Button>Download Document</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// Simple dialog components
const DepositDialog = ({ isOpen, onClose, onDeposit, walletId }) => {
  const [amount, setAmount] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onDeposit({ walletId, amount });
    setAmount('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Add funds to your wallet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Deposit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const WithdrawDialog = ({ isOpen, onClose, onWithdraw, walletId, maxAmount }) => {
  const [amount, setAmount] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onWithdraw({ walletId, amount });
    setAmount('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Withdraw funds from your wallet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={maxAmount}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">Available: ${parseFloat(maxAmount || 0).toLocaleString()}</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Withdraw</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TransferDialog = ({ isOpen, onClose, onTransfer, onFundEscrow, fromWalletId, availableWallets, maxAmount }) => {
  const [amount, setAmount] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [transferType, setTransferType] = useState('wallet'); // 'wallet' or 'escrow'
  const [contractId, setContractId] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (transferType === 'wallet') {
      onTransfer({ fromWalletId, toWalletId, amount });
    } else {
      onFundEscrow({ fromWalletId, contractId, amount });
    }
    setAmount('');
    setToWalletId('');
    setContractId('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Funds</DialogTitle>
          <DialogDescription>
            Transfer funds to another wallet or escrow account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Transfer Type</Label>
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant={transferType === 'wallet' ? 'default' : 'outline'} 
                  onClick={() => setTransferType('wallet')}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Wallet Transfer
                </Button>
                <Button 
                  type="button" 
                  variant={transferType === 'escrow' ? 'default' : 'outline'} 
                  onClick={() => setTransferType('escrow')}
                >
                  <Landmark className="h-4 w-4 mr-2" />
                  Fund Escrow
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={maxAmount}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">Available: ${parseFloat(maxAmount || 0).toLocaleString()}</p>
            </div>
            
            {transferType === 'wallet' ? (
              <div className="grid gap-2">
                <Label htmlFor="to-wallet">To Wallet</Label>
                <select
                  id="to-wallet"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={toWalletId}
                  onChange={(e) => setToWalletId(e.target.value)}
                  required
                >
                  <option value="">Select destination wallet</option>
                  {availableWallets && availableWallets
                    .filter((w) => w.id !== fromWalletId)
                    .map((wallet) => (
                      <option key={wallet.id} value={wallet.id}>
                        {wallet.walletType === 'MAIN' 
                          ? 'Main Wallet' 
                          : `Escrow Wallet (Contract #${wallet.contractId})`}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="contract">Contract ID</Label>
                <Input
                  id="contract"
                  type="text"
                  value={contractId}
                  onChange={(e) => setContractId(e.target.value)}
                  placeholder="Enter contract ID"
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">
              {transferType === 'wallet' ? 'Transfer' : 'Fund Escrow'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main wallet page component
const MockEscrowWalletPage = () => {
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  
  // Find the selected wallet
  const selectedWallet = 
    selectedWalletId === mainWallet.id 
      ? mainWallet 
      : mockEscrowWallets.find(w => w.id === selectedWalletId);
  
  // Mock handlers
  const handleDeposit = (walletId) => {
    setSelectedWalletId(walletId);
    setDepositDialogOpen(true);
  };
  
  const handleWithdraw = (walletId) => {
    setSelectedWalletId(walletId);
    setWithdrawDialogOpen(true);
  };
  
  const handleTransfer = (walletId) => {
    setSelectedWalletId(walletId);
    setTransferDialogOpen(true);
  };
  
  const submitDeposit = ({ walletId, amount }) => {
    console.log(`Deposit $${amount} to wallet ${walletId}`);
    // In a real app, this would update the state
  };
  
  const submitWithdraw = ({ walletId, amount }) => {
    console.log(`Withdraw $${amount} from wallet ${walletId}`);
    // In a real app, this would update the state
  };
  
  const submitTransfer = ({ fromWalletId, toWalletId, amount }) => {
    console.log(`Transfer $${amount} from wallet ${fromWalletId} to wallet ${toWalletId}`);
    // In a real app, this would update the state
  };
  
  const submitFundEscrow = ({ fromWalletId, contractId, amount }) => {
    console.log(`Fund escrow for contract ${contractId} with $${amount} from wallet ${fromWalletId}`);
    // In a real app, this would update the state
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">Manage your funds and transactions</p>
      </div>
      
      <Tabs defaultValue="wallets">
        <TabsList>
          <TabsTrigger value="wallets">My Wallets</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallets" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold mb-4">Main Wallet</h2>
              <WalletCard 
                wallet={mainWallet} 
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
                onTransfer={handleTransfer}
              />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Escrow Wallets</h2>
              <div className="space-y-4">
                {mockEscrowWallets.map((wallet) => (
                  <WalletCard 
                    key={wallet.id} 
                    wallet={wallet} 
                    onDeposit={handleDeposit}
                    onWithdraw={handleWithdraw}
                    onTransfer={handleTransfer}
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4">
          <TransactionList transactions={mockTransactions} />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <DepositDialog 
        isOpen={depositDialogOpen} 
        onClose={() => setDepositDialogOpen(false)} 
        onDeposit={submitDeposit} 
        walletId={selectedWalletId} 
      />
      
      <WithdrawDialog 
        isOpen={withdrawDialogOpen} 
        onClose={() => setWithdrawDialogOpen(false)} 
        onWithdraw={submitWithdraw} 
        walletId={selectedWalletId} 
        maxAmount={selectedWallet?.balance} 
      />
      
      <TransferDialog 
        isOpen={transferDialogOpen} 
        onClose={() => setTransferDialogOpen(false)} 
        onTransfer={submitTransfer}
        onFundEscrow={submitFundEscrow}
        fromWalletId={selectedWalletId} 
        availableWallets={[mainWallet, ...mockEscrowWallets]} 
        maxAmount={selectedWallet?.balance} 
      />
    </div>
  );
};

export default MockEscrowWalletPage;