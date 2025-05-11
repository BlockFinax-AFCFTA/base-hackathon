import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  Wallet,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  ChevronRight,
  AlertCircle,
  Plus,
  History,
  FileText,
  Shield
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';

import { useWeb3 } from '@/hooks/useWeb3';
import { mockWallets, mockTransactions, mockEscrows } from '@/data/mockWallet';
import { formatDate, shortenAddress } from '@/lib/utils';

const WalletPage: React.FC = () => {
  const { account, isConnected, tokens, selectedToken, selectToken } = useWeb3();
  const [activeTab, setActiveTab] = useState('assets');
  
  // Helper to format transaction type
  const formatTransactionType = (txType: string) => {
    switch (txType) {
      case 'DEPOSIT':
        return 'Deposit';
      case 'WITHDRAW':
        return 'Withdraw';
      case 'ESCROW_FUND':
        return 'Fund Escrow';
      case 'ESCROW_RELEASE':
        return 'Release Escrow';
      case 'TRANSFER':
        return 'Transfer';
      default:
        return txType;
    }
  };

  // Helper to get transaction icon
  const getTransactionIcon = (txType: string) => {
    switch (txType) {
      case 'DEPOSIT':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'WITHDRAW':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'ESCROW_FUND':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'ESCROW_RELEASE':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'TRANSFER':
        return <ArrowUpRight className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Helper to get status badge for transactions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Wallet" 
        subtitle="Manage your blockchain assets and escrow wallets"
      />
      
      {/* Account Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>Your blockchain wallet and balances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Wallet Address</div>
              <div className="flex items-center gap-2">
                <div className="font-mono bg-muted p-2 rounded text-sm overflow-hidden overflow-ellipsis">
                  {account || 'Not connected'}
                </div>
                {account && (
                  <Button variant="ghost" size="icon" title="Copy address">
                    <DollarSign className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Button className="justify-start">
                  <ArrowDownRight className="mr-2 h-4 w-4" />
                  Deposit Funds
                </Button>
                <Button variant="outline" className="justify-start">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Send Funds
                </Button>
                <Button variant="outline" className="justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Create Escrow
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Token Balances</h3>
              <div className="space-y-3">
                {tokens.map((token) => (
                  <div 
                    key={token.address}
                    className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-muted/50 ${selectedToken?.address === token.address ? 'bg-muted' : ''}`}
                    onClick={() => selectToken(token.address)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-sm text-muted-foreground">{token.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{token.balance}</div>
                      <div className="text-sm text-muted-foreground">
                        ${parseFloat(token.balance.replace(/,/g, '')) * 1.00}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for Assets/Transactions/Escrow */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assets">
            <Wallet className="mr-2 h-4 w-4" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <History className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="escrow">
            <Shield className="mr-2 h-4 w-4" />
            Escrow Wallets
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockWallets.map((wallet) => (
              <Card key={wallet.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{wallet.currency} Wallet</CardTitle>
                  <CardDescription>
                    {wallet.walletType === 'MAIN' ? 'Main Wallet' : 'Contract Wallet'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wallet.balance} {wallet.currency}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ${parseFloat(wallet.balance.replace(/,/g, '')) * 1.00}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="outline" size="sm">
                  <Clock className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </div>
              <CardDescription>
                Your transaction history on BlockFinaX
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {getTransactionIcon(tx.txType)}
                      </div>
                      <div>
                        <div className="font-medium">{formatTransactionType(tx.txType)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(tx.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="font-medium">
                        {tx.txType === 'DEPOSIT' ? '+' : '-'}{tx.amount} {tx.currency}
                      </div>
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="escrow" className="mt-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium">Escrow Wallets</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Escrow
            </Button>
          </div>
          
          {mockEscrows.length > 0 && (
            <div className="space-y-6">
              {mockEscrows.map((escrow) => (
                <Card key={escrow.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Contract: {escrow.contractTitle}
                      </CardTitle>
                      <Badge 
                        variant={
                          escrow.status === 'FUNDED' ? 'info' : 
                          escrow.status === 'RELEASED' ? 'success' : 
                          escrow.status === 'DISPUTED' ? 'destructive' : 
                          'outline'
                        }
                      >
                        {escrow.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Escrow #{escrow.id} • Created {formatDate(escrow.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-1">Escrow Address</div>
                      <div className="font-mono text-sm bg-muted p-2 rounded">
                        {escrow.escrowAddress}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Amount</div>
                        <div className="font-medium">{escrow.amount} {escrow.currency}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Buyer</div>
                        <div className="font-medium">{shortenAddress(escrow.parties.buyer)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Seller</div>
                        <div className="font-medium">{shortenAddress(escrow.parties.seller)}</div>
                      </div>
                    </div>
                    
                    {escrow.relatedDocs && escrow.relatedDocs.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground mb-2">Related Documents</div>
                        <div className="space-y-2">
                          {escrow.relatedDocs.map((doc) => (
                            <div key={doc.id} className="flex items-center rounded-md border p-2">
                              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {doc.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-2">
                      <div className="text-sm text-muted-foreground mb-1">Release Conditions</div>
                      <div className="text-sm rounded-md border p-3">
                        {escrow.releaseConditions || 'Standard escrow conditions apply'}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/contracts/${escrow.contractId}`}>
                        <a>
                          <FileText className="mr-2 h-4 w-4" />
                          View Contract
                        </a>
                      </Link>
                    </Button>
                    
                    {escrow.status === 'FUNDED' && (
                      <Button>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Release Funds
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletPage;