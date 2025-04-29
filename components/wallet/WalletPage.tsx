import React, { useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useWallet } from '@/hooks/useWallet';
import { useContracts } from '@/hooks/useContracts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, AlertCircle, RefreshCw, DollarSign, Send, 
  File, FileText, FileSpreadsheet, Image, Building2, Globe, Mail, Phone, Calendar, Ship, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

// Format currency helper
const formatCurrency = (amount: string | number, currency: string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency, 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};

const WalletCard = ({ wallet, onDeposit, onWithdraw, onTransfer }: any) => {
  const isMainWallet = wallet.walletType === 'MAIN';
  const isEscrowWallet = wallet.walletType === 'ESCROW';
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{isMainWallet ? 'Main Wallet' : 'Escrow Wallet'}</CardTitle>
            <CardDescription>
              {isMainWallet ? 'Your primary wallet for transactions' : `Escrow wallet for contract #${wallet.contractId}`}
            </CardDescription>
          </div>
          <div className="p-2 bg-primary rounded-full">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-3xl font-bold">{formatCurrency(wallet.balance, wallet.currency)}</p>
          </div>
          <div className="flex gap-2">
            <p className="text-xs text-muted-foreground">Wallet ID:</p>
            <p className="text-xs font-mono">{wallet.id}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-start gap-2">
        {isMainWallet && (
          <>
            <Button size="sm" onClick={() => onDeposit(wallet.id)}>
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              Deposit
            </Button>
            <Button size="sm" onClick={() => onWithdraw(wallet.id)}>
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
            <Button size="sm" onClick={() => onTransfer(wallet.id)}>
              <Send className="h-4 w-4 mr-2" />
              Transfer
            </Button>
          </>
        )}
        {isEscrowWallet && (
          <Badge variant="outline" className="px-2 py-1">
            Contract Escrow
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

const TransactionList = ({ transactions }: any) => {
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);
  const [documentDetailsOpen, setDocumentDetailsOpen] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  
  if (!transactions || transactions.length === 0) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No transactions</AlertTitle>
        <AlertDescription>
          You haven't made any transactions yet.
        </AlertDescription>
      </Alert>
    );
  }
  
  const getTransactionTypeIcon = (txType: string) => {
    switch (txType) {
      case 'DEPOSIT':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'WITHDRAWAL':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'TRANSFER':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'ESCROW_LOCK':
        return <Wallet className="h-4 w-4 text-orange-500" />;
      case 'ESCROW_RELEASE':
        return <Wallet className="h-4 w-4 text-green-500" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const getTransactionTypeLabel = (txType: string) => {
    switch (txType) {
      case 'DEPOSIT':
        return 'Deposit';
      case 'WITHDRAWAL':
        return 'Withdrawal';
      case 'TRANSFER':
        return 'Transfer';
      case 'ESCROW_LOCK':
        return 'Escrow Lock';
      case 'ESCROW_RELEASE':
        return 'Escrow Release';
      default:
        return txType;
    }
  };

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Sample documents for escrow transactions - in a real app, these would come from the API
  const escrowTransactions = [
    {
      id: 1, 
      txType: 'ESCROW_LOCK', 
      amount: '5000.00', 
      currency: 'USD', 
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
      id: 2, 
      txType: 'ESCROW_RELEASE', 
      amount: '5000.00', 
      currency: 'USD', 
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
    }
  ];
  
  // Always add the sample escrow transactions to demonstrate the feature
  // In a real implementation, these would come from the API
  const enhancedTransactions = [...transactions];
  
  // Add the escrow transactions to the beginning of the list
  enhancedTransactions.unshift(...escrowTransactions);
  
  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setDocumentDetailsOpen(true);
  };
  
  const fileIcon = (fileType: string) => {
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
  
  const formatFileSize = (bytes: number) => {
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
                {enhancedTransactions.map((tx: any) => (
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
                                      {tx.documents.map((doc: any) => (
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

const DepositDialog = ({ isOpen, onClose, onDeposit, walletId }: any) => {
  const [amount, setAmount] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
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
                <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Deposit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const WithdrawDialog = ({ isOpen, onClose, onWithdraw, walletId, maxAmount }: any) => {
  const [amount, setAmount] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
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
                <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={maxAmount}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              {maxAmount && (
                <p className="text-xs text-muted-foreground">
                  Max amount: {formatCurrency(maxAmount, 'USD')}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Withdraw</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TransferDialog = ({ isOpen, onClose, onTransfer, onFundEscrow, fromWalletId, availableWallets, maxAmount }: any) => {
  const [transferType, setTransferType] = useState('wallet');
  const [amount, setAmount] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [selectedContractId, setSelectedContractId] = useState('');
  const [description, setDescription] = useState('');
  const { contracts, isLoadingContracts } = useContracts();
  
  // Filter contracts that are awaiting funds
  const awaitingFundsContracts = contracts && Array.isArray(contracts) 
    ? contracts.filter((contract: any) => contract.status === 'AWAITING_FUNDS')
    : [];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (transferType === 'wallet') {
      onTransfer({ 
        fromWalletId, 
        toWalletId: parseInt(toWalletId), 
        amount,
        description 
      });
    } else if (transferType === 'escrow' && selectedContractId) {
      onFundEscrow({
        contractId: parseInt(selectedContractId),
        fromWalletId
      });
    }
    
    // Reset form
    setAmount('');
    setToWalletId('');
    setSelectedContractId('');
    setDescription('');
    setTransferType('wallet');
    onClose();
  };
  
  // Filter out the source wallet
  const destinationWallets = availableWallets.filter((w: any) => w.id !== fromWalletId);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Funds</DialogTitle>
          <DialogDescription>
            Transfer funds to another wallet or fund a contract escrow.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Transfer Type</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="wallet-transfer"
                    name="transfer-type"
                    value="wallet"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={transferType === 'wallet'}
                    onChange={() => setTransferType('wallet')}
                  />
                  <Label htmlFor="wallet-transfer" className="text-sm font-normal">Wallet Transfer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="escrow-funding"
                    name="transfer-type"
                    value="escrow"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={transferType === 'escrow'}
                    onChange={() => setTransferType('escrow')}
                  />
                  <Label htmlFor="escrow-funding" className="text-sm font-normal">Fund Contract Escrow</Label>
                </div>
              </div>
            </div>
            
            {transferType === 'wallet' ? (
              <div className="grid gap-2">
                <Label htmlFor="toWallet">Destination Wallet</Label>
                <select
                  id="toWallet"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={toWalletId}
                  onChange={(e) => setToWalletId(e.target.value)}
                  required={transferType === 'wallet'}
                >
                  <option value="">Select destination wallet</option>
                  {destinationWallets.map((wallet: any) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.walletType === 'MAIN' ? 'Main Wallet' : `Escrow Wallet (Contract #${wallet.contractId})`}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="contract">Awaiting Funds Contracts</Label>
                {isLoadingContracts ? (
                  <div className="text-sm text-muted-foreground py-2">Loading contracts...</div>
                ) : awaitingFundsContracts.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-2">No contracts awaiting funds found.</div>
                ) : (
                  <select
                    id="contract"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedContractId}
                    onChange={(e) => setSelectedContractId(e.target.value)}
                    required={transferType === 'escrow'}
                  >
                    <option value="">Select contract to fund</option>
                    {awaitingFundsContracts.map((contract: any) => (
                      <option key={contract.id} value={contract.id}>
                        {contract.title} - {contract.tradeTerms?.amount} {contract.tradeTerms?.currency}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
            
            {transferType === 'wallet' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="transferAmount">Amount</Label>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                    <Input
                      id="transferAmount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={maxAmount}
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required={transferType === 'wallet'}
                    />
                  </div>
                  {maxAmount && (
                    <p className="text-xs text-muted-foreground">
                      Max amount: {formatCurrency(maxAmount, 'USD')}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Payment for services..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </>
            )}
            
            {transferType === 'escrow' && selectedContractId && (
              <div className="mt-2">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <div className="ml-2">
                    <p className="text-sm font-medium">Funding Contract Escrow</p>
                    <p className="text-xs text-muted-foreground">
                      This will transfer the full contract amount to the escrow wallet. The contract will become active once funded.
                    </p>
                  </div>
                </Alert>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={(transferType === 'wallet' && (!toWalletId || !amount)) || 
                       (transferType === 'escrow' && !selectedContractId)}
            >
              {transferType === 'wallet' ? 'Transfer' : 'Fund Escrow'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

const EnhancedWalletPage = () => {
  const { user, isLoggedIn } = useWeb3();
  const { 
    wallets, 
    userTransactions, 
    depositMutation, 
    withdrawMutation, 
    transferMutation, 
    fundEscrowMutation,
    isLoadingWallets 
  } = useWallet();
  
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
  
  // Get the selected wallet object
  const selectedWallet = selectedWalletId 
    ? wallets.find((w: any) => w.id === selectedWalletId) 
    : null;
  
  const handleDeposit = (walletId: number) => {
    setSelectedWalletId(walletId);
    setDepositDialogOpen(true);
  };
  
  const handleWithdraw = (walletId: number) => {
    setSelectedWalletId(walletId);
    setWithdrawDialogOpen(true);
  };
  
  const handleTransfer = (walletId: number) => {
    setSelectedWalletId(walletId);
    setTransferDialogOpen(true);
  };
  
  const submitDeposit = (data: any) => {
    depositMutation.mutate({
      walletId: data.walletId,
      amount: data.amount,
      currency: 'USD'
    });
  };
  
  const submitWithdraw = (data: any) => {
    withdrawMutation.mutate({
      walletId: data.walletId,
      amount: data.amount,
      currency: 'USD'
    });
  };
  
  const submitTransfer = (data: any) => {
    transferMutation.mutate({
      fromWalletId: data.fromWalletId,
      toWalletId: data.toWalletId,
      amount: data.amount,
      currency: 'USD',
      description: data.description
    });
  };
  
  const submitFundEscrow = (data: any) => {
    fundEscrowMutation.mutate({
      contractId: data.contractId,
      fromWalletId: data.fromWalletId
    });
  };
  
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">Manage your funds and transactions</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              Please login to view your wallet balance and transactions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.href = '/'}>Go to Login</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (isLoadingWallets) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">Manage your funds and transactions</p>
        </div>
        <div className="flex justify-center py-12">
          <p>Loading wallets...</p>
        </div>
      </div>
    );
  }
  
  const mainWallet = wallets.find((w: any) => w.walletType === 'MAIN');
  const escrowWallets = wallets.filter((w: any) => w.walletType === 'ESCROW');
  
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
              {mainWallet ? (
                <WalletCard 
                  wallet={mainWallet} 
                  onDeposit={handleDeposit}
                  onWithdraw={handleWithdraw}
                  onTransfer={handleTransfer}
                />
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <p>No main wallet found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Escrow Wallets</h2>
              {escrowWallets.length > 0 ? (
                escrowWallets.map((wallet: any) => (
                  <WalletCard 
                    key={wallet.id} 
                    wallet={wallet} 
                    onDeposit={handleDeposit}
                    onWithdraw={handleWithdraw}
                    onTransfer={handleTransfer}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <p>No escrow wallets found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4">
          <TransactionList transactions={userTransactions} />
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
        availableWallets={wallets} 
        maxAmount={selectedWallet?.balance} 
      />
    </div>
  );
};

export default EnhancedWalletPage;