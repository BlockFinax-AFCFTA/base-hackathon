import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Upload,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ExternalLink,
  Copy,
  Building,
  Landmark,
  Coins,
  Globe,
  QrCode,
  Share,
  ShieldCheck
} from 'lucide-react';

/**
 * Multi-currency wallet page with USD, NGN, XOF balances
 */
const MultiCurrencyWalletPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('wallets');
  const [selectedWalletType, setSelectedWalletType] = useState<'fiat' | 'crypto' | 'escrow'>('fiat');
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  
  // Mock wallet data with USD balance
  const wallets = {
    fiat: [{
      id: 1,
      walletType: 'main',
      walletProvider: 'papss',
      primaryCurrency: 'USD',
      balances: [
        { amount: '25,000.00', currency: 'USD', currencyType: 'fiat' },
        { amount: '15,000.00', currency: 'NGN', currencyType: 'fiat' },
        { amount: '5,000.00', currency: 'XOF', currencyType: 'fiat' },
      ]
    }],
    crypto: [{
      id: 2,
      walletType: 'crypto',
      walletProvider: 'self_custody',
      walletAddress: '0x1a2b3c4d5e6f7g8h9i0j',
      primaryCurrency: 'ETH',
      balances: [
        { amount: '2.5', currency: 'ETH', currencyType: 'crypto' },
        { amount: '1000', currency: 'USDT', currencyType: 'crypto' },
      ]
    }],
    escrow: [{
      id: 3,
      walletType: 'escrow',
      contractId: 12345,
      walletProvider: 'internal',
      primaryCurrency: 'USD',
      balances: [
        { amount: '10,000.00', currency: 'USD', currencyType: 'fiat' }
      ]
    }]
  };

  // Simplify transaction display
  const transactions = [
    {
      id: 1,
      type: 'deposit',
      amount: '5,000.00',
      currency: 'USD',
      status: 'completed',
      date: '2025-04-01T10:30:00Z',
      description: 'Initial deposit'
    },
    {
      id: 2,
      type: 'withdrawal',
      amount: '1,000.00',
      currency: 'USD',
      status: 'pending',
      date: '2025-04-02T14:20:00Z',
      description: 'Withdrawal to bank account'
    }
  ];

  // Helper function to get icon for transaction type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'withdrawal': return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'sent': return <Upload className="h-5 w-5 text-orange-500" />;
      case 'received': return <Download className="h-5 w-5 text-blue-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-200 text-green-800';
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'failed': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Multi-Currency Wallet</h1>
        <p className="text-gray-600">Manage your finances across multiple currencies</p>
      </div>

      <Tabs defaultValue="wallets" className="mb-8" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="mb-4">
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="wallets">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Button 
                variant={selectedWalletType === 'fiat' ? 'default' : 'outline'} 
                onClick={() => setSelectedWalletType('fiat')}
                className="flex items-center"
              >
                <Building className="h-4 w-4 mr-2" />
                Fiat Wallet
              </Button>
              <Button 
                variant={selectedWalletType === 'crypto' ? 'default' : 'outline'} 
                onClick={() => setSelectedWalletType('crypto')}
                className="flex items-center"
              >
                <Coins className="h-4 w-4 mr-2" />
                Crypto Wallet
              </Button>
              <Button 
                variant={selectedWalletType === 'escrow' ? 'default' : 'outline'} 
                onClick={() => setSelectedWalletType('escrow')}
                className="flex items-center"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Escrow Wallet
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {selectedWalletType === 'fiat' && wallets.fiat.map(wallet => (
              <Card key={wallet.id} className="lg:col-span-3">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <Building className="h-6 w-6 mr-2 text-primary" />
                        Fiat Wallet (PAPSS-powered)
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Landmark className="h-4 w-4 mr-1 text-blue-500" />
                        Pan-African Payment and Settlement System • Multi-Currency
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      PAPSS
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {wallet.balances.map((balance, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">
                          {balance.currency === 'USD' ? 'US Dollar' : 
                           balance.currency === 'NGN' ? 'Nigerian Naira' : 
                           balance.currency === 'XOF' ? 'West African CFA Franc' : 
                           balance.currency}
                        </div>
                        <div className="text-2xl font-bold">{balance.currency} {balance.amount}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1">
                    <ArrowDownLeft className="h-4 w-4 mr-2" />
                    Deposit
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Withdraw
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Transfer
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {selectedWalletType === 'crypto' && wallets.crypto.map(wallet => (
              <Card key={wallet.id} className="lg:col-span-3">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <Coins className="h-6 w-6 mr-2 text-amber-500" />
                        Crypto Wallet
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <ShieldCheck className="h-4 w-4 mr-1 text-amber-500" />
                        Self-Custody • {wallet.walletAddress?.slice(0, 6)}...{wallet.walletAddress?.slice(-4)}
                      </CardDescription>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                      Self-Custody
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {wallet.balances.map((balance, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">
                          {balance.currency === 'ETH' ? 'Ethereum' : 
                           balance.currency === 'USDT' ? 'Tether USD' : 
                           balance.currency}
                        </div>
                        <div className="text-2xl font-bold">{balance.amount} {balance.currency}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          ≈ ${balance.currency === 'ETH' ? 
                             (parseFloat(balance.amount.replace(/,/g, '')) * 3000.50).toFixed(2) : 
                             balance.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1">
                    <QrCode className="h-4 w-4 mr-2" />
                    Receive
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View On Explorer
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {selectedWalletType === 'escrow' && wallets.escrow.map(wallet => (
              <Card key={wallet.id} className="lg:col-span-3">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <ShieldCheck className="h-6 w-6 mr-2 text-green-500" />
                        Escrow Wallet
                      </CardTitle>
                      <CardDescription>
                        For Contract #{wallet.contractId}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      BlockFinaX
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {wallet.balances.map((balance, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">
                          Escrow Balance
                        </div>
                        <div className="text-2xl font-bold">{balance.currency} {balance.amount}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Fund Escrow
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Release Funds
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Refund
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent payment activity</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="mr-4 p-2 bg-gray-100 rounded-full">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.type === 'deposit' ? 'Deposit' : 
                             transaction.type === 'withdrawal' ? 'Withdrawal' : 
                             transaction.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                          {transaction.description && (
                            <div className="text-sm">{transaction.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={transaction.type === 'deposit' || transaction.type === 'received' 
                          ? 'text-green-600 font-medium' 
                          : 'text-red-600 font-medium'}>
                          {transaction.type === 'deposit' || transaction.type === 'received' ? '+' : '-'} 
                          {transaction.currency} {transaction.amount}
                        </div>
                        <div className="mt-1">
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No transactions found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiCurrencyWalletPage;