import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../client/src/components/ui/card';
import { Button } from '../client/src/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../client/src/components/ui/tabs';
import { Badge } from '../client/src/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../client/src/components/ui/dialog';
import { Input } from '../client/src/components/ui/input';
import { Label } from '../client/src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../client/src/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '../client/src/components/ui/alert';
import { useToast } from '../client/src/hooks/use-toast';
import {
  Wallet,
  CreditCard,
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
  ShieldCheck,
  Loader2,
  Smartphone,
  Check,
  Info
} from 'lucide-react';
import { useWeb3 } from '../client/src/hooks/useWeb3';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../client/src/lib/queryClient';

// Function to shorten addresses for display
const shortenAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  if (!address) return '';
  if (address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Format currency
const formatCurrency = (amount: string) => {
  // Remove any existing commas
  const cleanAmount = amount.replace(/,/g, '');
  // Add commas for thousands separator
  return parseFloat(cleanAmount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Define interface for balance
interface Balance {
  amount: string;
  currency: string;
  currencyType: 'fiat' | 'crypto';
}

// Define interface for multi-currency wallet
interface MultiCurrencyWallet {
  id: number;
  userId: number;
  walletType: string;
  walletProvider: string;
  primaryCurrency: string;
  balances: Balance[];
  contractId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Define interface for transaction
interface Transaction {
  id: number;
  fromWalletId: number | null;
  toWalletId: number | null;
  fromAddress: string | null;
  toAddress: string | null;
  amount: string;
  currency: string;
  currencyType: string;
  txType: string;
  status: string;
  description: string;
  contractId: number | null;
  createdAt: Date;
  completedAt?: Date;
  provider: string;
  papssReference?: string;
  papssStatus?: string;
  sourceBank?: string;
  destinationBank?: string;
  exchangeRate?: string;
  metadata: any;
}

/**
 * Multi-currency wallet page with USD, NGN, XOF balances
 */
const MultiCurrencyWalletPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('wallets');
  const [selectedWalletType, setSelectedWalletType] = useState<'fiat' | 'crypto' | 'escrow'>('fiat');
  
  // Fiat wallet deposit states
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositMethod, setDepositMethod] = useState<'bank' | 'mobile_money' | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositCurrency, setDepositCurrency] = useState('NGN');
  const [depositBank, setDepositBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileProvider, setMobileProvider] = useState('');
  const [isDepositProcessing, setIsDepositProcessing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);
  
  // Fiat wallet withdrawal states
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'mobile_money' | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawCurrency, setWithdrawCurrency] = useState('NGN');
  const [withdrawBank, setWithdrawBank] = useState('');
  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState('');
  const [withdrawMobileNumber, setWithdrawMobileNumber] = useState('');
  const [withdrawMobileProvider, setWithdrawMobileProvider] = useState('');
  const [isWithdrawProcessing, setIsWithdrawProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  
  // Crypto wallet states
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendCurrency, setSendCurrency] = useState('ETH');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isSendProcessing, setIsSendProcessing] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const { account, user } = useWeb3();
  const { toast } = useToast();
  const userId = 1; // Hardcoded user ID for demo purposes
  
  // Fetch multi-currency wallet data
  const {
    data: multiCurrencyWallet,
    isLoading: isLoadingWallet,
    error: walletError,
  } = useQuery({
    queryKey: ['/api/users', userId, 'multicurrency-wallet'],
    queryFn: async () => {
      try {
        console.log('Fetching wallet data for user ID:', userId);
        const res = await apiRequest('GET', `/api/users/${userId}/multicurrency-wallet`);
        const data = await res.json() as MultiCurrencyWallet;
        console.log('Wallet data received:', data);
        return data;
      } catch (err) {
        console.error('Failed to fetch wallet balance:', err);
        throw err;
      }
    },
  });
  
  // Fetch transaction history with multi-currency support
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ['/api/users', userId, 'transactions', 'multicurrency'],
    queryFn: async () => {
      try {
        console.log('Fetching transactions for user ID:', userId);
        const res = await apiRequest('GET', `/api/users/${userId}/transactions?multiCurrency=true`);
        const data = await res.json() as Transaction[];
        console.log('Transactions received:', data);
        return data;
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        throw err;
      }
    },
  });
  
  // Set up wallets object for display
  const wallets = {
    fiat: multiCurrencyWallet ? [{
      id: multiCurrencyWallet.id,
      walletType: 'multi-currency',
      walletProvider: multiCurrencyWallet.walletProvider,
      primaryCurrency: multiCurrencyWallet.primaryCurrency,
      balances: multiCurrencyWallet.balances.map(balance => ({
        ...balance,
        amount: formatCurrency(balance.amount)
      }))
    }] : [],
    crypto: [{
      id: 2,
      walletType: 'crypto',
      walletProvider: 'self_custody',
      walletAddress: account || '0x1a2b3c4d5e6f7g8h9i0j',
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

  // Helper function to get icon for transaction type
  const getTransactionIcon = (txType: string) => {
    switch (txType) {
      case 'DEPOSIT': return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'WITHDRAWAL': return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'TRANSFER': 
      case 'CROSS_BORDER_PAYMENT': return <Upload className="h-5 w-5 text-orange-500" />;
      case 'ESCROW_LOCK': return <ShieldCheck className="h-5 w-5 text-purple-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper function to get status badge class names
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
            Multi-Currency Wallet
          </span>
          <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">NEW</Badge>
        </h1>
        <p className="text-gray-600">Manage your global trade finances across multiple currencies with PAPSS integration</p>
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
            {isLoadingWallet && selectedWalletType === 'fiat' ? (
              <Card className="lg:col-span-3">
                <CardContent className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="ml-2 text-gray-500">Loading wallet data...</p>
                </CardContent>
              </Card>
            ) : walletError && selectedWalletType === 'fiat' ? (
              <Card className="lg:col-span-3">
                <CardContent className="text-center py-8">
                  <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
                  <p className="mt-2 text-gray-500">Error loading wallet data</p>
                </CardContent>
              </Card>
            ) : selectedWalletType === 'fiat' && wallets.fiat.map(wallet => (
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
                          {balance.currency === 'NGN' ? 'Nigerian Naira' : 
                           balance.currency === 'XOF' ? 'West African CFA Franc' : 
                           balance.currency === 'GHS' ? 'Ghanaian Cedi' :
                           balance.currency === 'KES' ? 'Kenyan Shilling' :
                           balance.currency === 'ZAR' ? 'South African Rand' :
                           balance.currency}
                        </div>
                        <div className="text-2xl font-bold">{balance.currency} {balance.amount}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    setIsDepositOpen(true);
                    setDepositMethod(null);
                    setDepositAmount('');
                    setDepositCurrency(wallet.balances[0]?.currency || 'NGN');
                    setDepositSuccess(false);
                  }}>
                    <ArrowDownLeft className="h-4 w-4 mr-2" />
                    Deposit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setIsWithdrawOpen(true);
                      setWithdrawMethod(null);
                      setWithdrawAmount('');
                      setWithdrawCurrency(wallet.balances[0]?.currency || 'NGN');
                      setWithdrawSuccess(false);
                    }}
                  >
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
                        Self-Custody • {shortenAddress(wallet.walletAddress || '')}
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
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setIsReceiveOpen(true);
                    }}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Receive
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setIsSendOpen(true);
                      setSendAmount('');
                      setSendCurrency(wallet.balances[0]?.currency || 'ETH');
                      setRecipientAddress('');
                      setSendSuccess(false);
                    }}
                  >
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
              <CardDescription>Your recent payment activity across all currencies</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
                  <p className="mt-2 text-gray-500">Loading transactions...</p>
                </div>
              ) : transactionsError ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
                  <p className="mt-2 text-gray-500">Error loading transactions</p>
                </div>
              ) : transactions && Array.isArray(transactions) && transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="mr-4 p-2 bg-gray-100 rounded-full">
                          {getTransactionIcon(transaction.txType)}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.txType === 'DEPOSIT' ? 'Deposit' : 
                             transaction.txType === 'WITHDRAWAL' ? 'Withdrawal' : 
                             transaction.txType === 'TRANSFER' ? 'Transfer' :
                             transaction.txType === 'CROSS_BORDER_PAYMENT' ? 'Cross-Border Payment' :
                             transaction.txType === 'ESCROW_LOCK' ? 'Escrow Lock' :
                             transaction.txType}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                          {transaction.description && (
                            <div className="text-sm">{transaction.description}</div>
                          )}
                          {transaction.provider === 'papss' && (
                            <div className="flex items-center mt-1">
                              <Badge className="mr-2 bg-blue-100 text-blue-800">PAPSS</Badge>
                              {transaction.papssReference && (
                                <span className="text-xs text-gray-500">Ref: {transaction.papssReference}</span>
                              )}
                            </div>
                          )}
                          {transaction.exchangeRate && transaction.metadata?.equivalentCurrency && (
                            <div className="text-xs text-gray-500 mt-1">
                              Rate: 1 {transaction.metadata.equivalentCurrency} = 
                              {' '}{parseFloat(transaction.exchangeRate).toFixed(2)}{' '}
                              {transaction.currency}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={transaction.fromWalletId === null
                          ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {transaction.fromWalletId === null ? '+' : '-'} {transaction.currency}{' '}
                          {formatCurrency(transaction.amount)}
                        </div>
                        {transaction.metadata?.equivalentValue && (
                          <div className="text-sm text-gray-500">
                            ≈ {transaction.metadata.equivalentCurrency}{' '}
                            {formatCurrency(transaction.metadata.equivalentValue)}
                          </div>
                        )}
                        <div className="mt-1">
                          <Badge className={getStatusClass(transaction.status)}>
                            {transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">No transactions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Deposit Dialog for Fiat Wallet */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {depositSuccess ? (
                <div className="flex items-center text-green-500">
                  <Check className="mr-2 h-6 w-6" />
                  Deposit Successful
                </div>
              ) : (
                'Deposit Funds'
              )}
            </DialogTitle>
            <DialogDescription>
              {depositSuccess 
                ? 'Your deposit has been processed successfully.' 
                : 'Add funds to your multi-currency wallet via bank transfer or mobile money.'}
            </DialogDescription>
          </DialogHeader>

          {depositSuccess ? (
            <div className="py-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-xl font-semibold mb-2">Deposit Completed</p>
              <p className="text-gray-500 mb-4">Your funds have been added to your account.</p>
              <div className="bg-gray-50 rounded-md p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium">{depositCurrency} {depositAmount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Reference:</span>
                  <span className="font-medium">PAPSS-{Math.floor(Math.random() * 10000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-green-600 font-medium">Completed</span>
                </div>
              </div>
            </div>
          ) : (
            depositMethod === null ? (
              <div className="grid grid-cols-2 gap-4 py-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center" 
                  onClick={() => setDepositMethod('bank')}
                >
                  <CreditCard className="h-8 w-8 mb-2" />
                  <span>Bank Transfer</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center" 
                  onClick={() => setDepositMethod('mobile_money')}
                >
                  <Smartphone className="h-8 w-8 mb-2" />
                  <span>Mobile Money</span>
                </Button>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue={depositCurrency} onValueChange={setDepositCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                      <SelectItem value="XOF">West African CFA Franc (XOF)</SelectItem>
                      <SelectItem value="GHS">Ghanaian Cedi (GHS)</SelectItem>
                      <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                      <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    value={depositAmount} 
                    onChange={(e) => setDepositAmount(e.target.value)} 
                    placeholder="Enter amount" 
                    min="1"
                  />
                </div>

                {depositMethod === 'bank' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bank">Bank Name</Label>
                      <Select defaultValue="" onValueChange={setDepositBank}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="first_bank">First Bank Nigeria</SelectItem>
                          <SelectItem value="gtb">Guaranty Trust Bank</SelectItem>
                          <SelectItem value="uba">United Bank for Africa</SelectItem>
                          <SelectItem value="zenith">Zenith Bank</SelectItem>
                          <SelectItem value="access">Access Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account">Account Number</Label>
                      <Input 
                        id="account" 
                        value={accountNumber} 
                        onChange={(e) => setAccountNumber(e.target.value)} 
                        placeholder="Enter account number" 
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="provider">Mobile Money Provider</Label>
                      <Select defaultValue="" onValueChange={setMobileProvider}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                          <SelectItem value="airtel">Airtel Money</SelectItem>
                          <SelectItem value="orange">Orange Money</SelectItem>
                          <SelectItem value="mpesa">M-Pesa</SelectItem>
                          <SelectItem value="wave">Wave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input 
                        id="mobile" 
                        value={mobileNumber} 
                        onChange={(e) => setMobileNumber(e.target.value)} 
                        placeholder="Enter mobile number" 
                      />
                    </div>
                  </>
                )}
              </div>
            )
          )}

          <DialogFooter>
            {depositSuccess ? (
              <Button 
                onClick={() => {
                  setIsDepositOpen(false);
                  setDepositSuccess(false);
                }}
              >
                Close
              </Button>
            ) : depositMethod === null ? (
              <Button variant="outline" onClick={() => setIsDepositOpen(false)}>Cancel</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setDepositMethod(null)}>Back</Button>
                <Button 
                  disabled={
                    !depositAmount || 
                    (depositMethod === 'bank' && (!depositBank || !accountNumber)) ||
                    (depositMethod === 'mobile_money' && (!mobileProvider || !mobileNumber)) ||
                    isDepositProcessing
                  }
                  onClick={async () => {
                    if (!multiCurrencyWallet) return;
                    
                    setIsDepositProcessing(true);
                    
                    try {
                      // Simulate API call
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      
                      // Create a deposit transaction
                      const depositData = {
                        amount: depositAmount,
                        currency: depositCurrency,
                        description: `Deposit via ${depositMethod === 'bank' ? 'bank transfer' : 'mobile money'}`,
                        txType: 'DEPOSIT',
                        walletId: multiCurrencyWallet.id,
                        userId: userId,
                        metadata: {
                          depositMethod,
                          ...(depositMethod === 'bank' 
                            ? { bank: depositBank, accountNumber } 
                            : { provider: mobileProvider, mobileNumber })
                        }
                      };
                      
                      // In a real app, you would make an API call here
                      // const response = await apiRequest('POST', '/api/transactions', depositData);
                      
                      setDepositSuccess(true);
                      setIsDepositProcessing(false);
                      
                      // Refetch wallet data and transactions
                    } catch (error) {
                      console.error('Error processing deposit:', error);
                      setIsDepositProcessing(false);
                    }
                  }}
                >
                  {isDepositProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receive Dialog for Crypto Wallet */}
      <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Receive Crypto</DialogTitle>
            <DialogDescription>
              Scan the QR code or copy the wallet address to receive cryptocurrency
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center">
            <div className="bg-white p-4 border rounded-lg mb-4">
              <QrCode className="h-48 w-48 text-gray-800" />
            </div>
            
            <div className="w-full flex flex-col mb-4">
              <Label htmlFor="wallet-address" className="mb-2">Wallet Address</Label>
              <div className="flex">
                <Input 
                  id="wallet-address" 
                  readOnly 
                  value={wallets.crypto[0]?.walletAddress || '0x1a2b3c4d5e6f7g8h9i0j'} 
                  className="flex-1 bg-gray-50"
                />
                <Button 
                  variant="outline"
                  className="ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(wallets.crypto[0]?.walletAddress || '0x1a2b3c4d5e6f7g8h9i0j');
                    toast({
                      title: "Address Copied",
                      description: "Wallet address copied to clipboard",
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Important</AlertTitle>
              <AlertDescription className="text-amber-700">
                Only send ETH and ERC-20 tokens to this address. Sending other types of tokens may result in permanent loss.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setIsReceiveOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Dialog for Crypto Wallet */}
      <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {sendSuccess ? (
                <div className="flex items-center text-green-500">
                  <Check className="mr-2 h-6 w-6" />
                  Transaction Submitted
                </div>
              ) : (
                'Send Crypto'
              )}
            </DialogTitle>
            <DialogDescription>
              {sendSuccess 
                ? 'Your transaction has been submitted to the blockchain.' 
                : 'Send cryptocurrency to another wallet address.'}
            </DialogDescription>
          </DialogHeader>

          {sendSuccess ? (
            <div className="py-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-xl font-semibold mb-2">Transaction Sent</p>
              <p className="text-gray-500 mb-4">Your transaction is being processed on the blockchain.</p>
              <div className="bg-gray-50 rounded-md p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium">{sendAmount} {sendCurrency}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">To:</span>
                  <span className="font-medium">{shortenAddress(recipientAddress)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-yellow-600 font-medium">Pending</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <span className="block mb-1">Transaction Hash:</span>
                <div className="bg-gray-100 p-2 rounded flex items-center justify-between">
                  <span className="font-mono text-xs truncate">0x{Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      navigator.clipboard.writeText(`0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`);
                      toast({
                        title: "Copied",
                        description: "Transaction hash copied to clipboard",
                      });
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sendCurrency">Currency</Label>
                <Select defaultValue={sendCurrency} onValueChange={setSendCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDT">Tether USD (USDT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sendAmount">Amount</Label>
                <Input 
                  id="sendAmount" 
                  type="number" 
                  value={sendAmount} 
                  onChange={(e) => setSendAmount(e.target.value)} 
                  placeholder="Enter amount" 
                  min="0.001"
                  step="0.001"
                />
                <div className="text-xs text-right text-gray-500">
                  Balance: {
                    wallets.crypto[0]?.balances.find(b => b.currency === sendCurrency)?.amount || '0'
                  } {sendCurrency}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientAddress">Recipient Address</Label>
                <Input 
                  id="recipientAddress" 
                  value={recipientAddress} 
                  onChange={(e) => setRecipientAddress(e.target.value)} 
                  placeholder="Enter wallet address (0x...)" 
                />
              </div>

              <Alert className="bg-gray-50 border-gray-200">
                <Info className="h-4 w-4 text-gray-600" />
                <AlertTitle>Network Fee</AlertTitle>
                <AlertDescription className="text-sm">
                  Estimated Gas Fee: 0.00041 ETH (~$1.23 USD)
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            {sendSuccess ? (
              <Button 
                onClick={() => {
                  setIsSendOpen(false);
                  setSendSuccess(false);
                }}
              >
                Close
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsSendOpen(false)}>Cancel</Button>
                <Button 
                  disabled={!sendAmount || !recipientAddress || isSendProcessing}
                  onClick={async () => {
                    setIsSendProcessing(true);
                    
                    try {
                      // Simulate blockchain transaction delay
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      
                      // In a real app, you would send a blockchain transaction here
                      
                      setSendSuccess(true);
                      setIsSendProcessing(false);
                    } catch (error) {
                      console.error('Error sending transaction:', error);
                      setIsSendProcessing(false);
                      
                      toast({
                        title: "Transaction Failed",
                        description: "There was an error sending your transaction.",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  {isSendProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Send'
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Withdrawal Dialog for Fiat Wallet */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {withdrawSuccess ? (
                <div className="flex items-center text-green-500">
                  <Check className="mr-2 h-6 w-6" />
                  Withdrawal Successful
                </div>
              ) : (
                'Withdraw Funds'
              )}
            </DialogTitle>
            <DialogDescription>
              {withdrawSuccess 
                ? 'Your withdrawal has been processed successfully.' 
                : 'Withdraw funds from your multi-currency wallet to your bank account or mobile money.'}
            </DialogDescription>
          </DialogHeader>

          {withdrawSuccess ? (
            <div className="py-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-xl mb-2">Withdrawal Initiated</h3>
              <p className="text-gray-500 mb-4">
                Your withdrawal of {withdrawCurrency} {withdrawAmount} is being processed.
              </p>
              <div className="bg-gray-50 rounded-md p-4 mb-4 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-medium">TX-{Math.floor(Math.random() * 10000000)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Status:</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated time:</span>
                  <span className="font-medium">1-2 business days</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {withdrawMethod === null ? (
                <>
                  <div className="flex justify-around gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 flex flex-col items-center py-6"
                      onClick={() => setWithdrawMethod('bank')}
                    >
                      <Building className="h-10 w-10 mb-2 text-primary" />
                      <div className="font-medium">Bank Transfer</div>
                      <div className="text-xs text-gray-500">2-3 business days</div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 flex flex-col items-center py-6"
                      onClick={() => setWithdrawMethod('mobile_money')}
                    >
                      <Smartphone className="h-10 w-10 mb-2 text-primary" />
                      <div className="font-medium">Mobile Money</div>
                      <div className="text-xs text-gray-500">Instant transfer</div>
                    </Button>
                  </div>
                </>
              ) : withdrawMethod === 'bank' ? (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="withdrawAmount">Amount</Label>
                      <div className="flex space-x-2">
                        <Select value={withdrawCurrency} onValueChange={setWithdrawCurrency}>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NGN">NGN</SelectItem>
                            <SelectItem value="XOF">XOF</SelectItem>
                            <SelectItem value="GHS">GHS</SelectItem>
                            <SelectItem value="KES">KES</SelectItem>
                            <SelectItem value="ZAR">ZAR</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="withdrawAmount"
                          placeholder="Enter amount"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          type="number"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="withdrawBank">Bank</Label>
                      <Select value={withdrawBank} onValueChange={setWithdrawBank}>
                        <SelectTrigger id="withdrawBank">
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="first_bank">First Bank Nigeria</SelectItem>
                          <SelectItem value="gtb">Guaranty Trust Bank</SelectItem>
                          <SelectItem value="zenith">Zenith Bank</SelectItem>
                          <SelectItem value="uba">United Bank for Africa (UBA)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="withdrawAccountNumber">Account Number</Label>
                      <Input 
                        id="withdrawAccountNumber" 
                        placeholder="Enter account number"
                        value={withdrawAccountNumber}
                        onChange={(e) => setWithdrawAccountNumber(e.target.value)}
                      />
                    </div>
                    
                    <Alert className="bg-gray-50 border-gray-200">
                      <Info className="h-4 w-4 text-gray-600" />
                      <AlertTitle>Processing Time</AlertTitle>
                      <AlertDescription className="text-sm">
                        Bank withdrawals typically take 2-3 business days to process.
                      </AlertDescription>
                    </Alert>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="withdrawAmount">Amount</Label>
                      <div className="flex space-x-2">
                        <Select value={withdrawCurrency} onValueChange={setWithdrawCurrency}>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NGN">NGN</SelectItem>
                            <SelectItem value="XOF">XOF</SelectItem>
                            <SelectItem value="GHS">GHS</SelectItem>
                            <SelectItem value="KES">KES</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="withdrawAmount"
                          placeholder="Enter amount"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          type="number"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="withdrawMobileProvider">Mobile Money Provider</Label>
                      <Select value={withdrawMobileProvider} onValueChange={setWithdrawMobileProvider}>
                        <SelectTrigger id="withdrawMobileProvider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                          <SelectItem value="airtel">Airtel Money</SelectItem>
                          <SelectItem value="orange">Orange Money</SelectItem>
                          <SelectItem value="mpesa">M-Pesa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="withdrawMobileNumber">Mobile Number</Label>
                      <Input 
                        id="withdrawMobileNumber" 
                        placeholder="Enter mobile number"
                        value={withdrawMobileNumber}
                        onChange={(e) => setWithdrawMobileNumber(e.target.value)}
                      />
                    </div>
                    
                    <Alert className="bg-gray-50 border-gray-200">
                      <Info className="h-4 w-4 text-gray-600" />
                      <AlertTitle>Instant Transfer</AlertTitle>
                      <AlertDescription className="text-sm">
                        Mobile money withdrawals are usually processed instantly.
                      </AlertDescription>
                    </Alert>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            {withdrawSuccess ? (
              <Button 
                onClick={() => {
                  setIsWithdrawOpen(false);
                  setWithdrawSuccess(false);
                }}
              >
                Close
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => {
                  if (withdrawMethod) {
                    setWithdrawMethod(null);
                  } else {
                    setIsWithdrawOpen(false);
                  }
                }}>
                  {withdrawMethod ? 'Back' : 'Cancel'}
                </Button>
                {withdrawMethod && (
                  <Button 
                    disabled={!withdrawAmount || isWithdrawProcessing || 
                      (withdrawMethod === 'bank' && (!withdrawBank || !withdrawAccountNumber)) ||
                      (withdrawMethod === 'mobile_money' && (!withdrawMobileProvider || !withdrawMobileNumber))}
                    onClick={async () => {
                      setIsWithdrawProcessing(true);
                      
                      try {
                        // Simulate API call
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        
                        setWithdrawSuccess(true);
                        setIsWithdrawProcessing(false);
                        
                        toast({
                          title: "Withdrawal Initiated",
                          description: `Your withdrawal of ${withdrawCurrency} ${withdrawAmount} has been initiated.`,
                        });
                      } catch (error) {
                        console.error('Error processing withdrawal:', error);
                        setIsWithdrawProcessing(false);
                        
                        toast({
                          title: "Withdrawal Failed",
                          description: "There was an error processing your withdrawal request.",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    {isWithdrawProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Withdraw'
                    )}
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiCurrencyWalletPage;