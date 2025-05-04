import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
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
  ChevronsUpDown,
  Landmark,
  Coins,
  Globe,
  QrCode,
  Share,
  ShieldCheck
} from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { shortenAddress } from '../../lib/utils';

/**
 * WalletPage component with internationalization
 * Uses the wallet namespace for translations
 */
const WalletPageI18n: React.FC = () => {
  // Use the 'wallet' namespace for translations
  const { t } = useLocalization('wallet');
  
  const [activeTab, setActiveTab] = useState('wallets');
  const [selectedWalletType, setSelectedWalletType] = useState<'fiat' | 'crypto' | 'escrow'>('fiat');
  const [createWalletType, setCreateWalletType] = useState<'fiat' | 'crypto'>('fiat');
  const [isCreateWalletOpen, setIsCreateWalletOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Mock data - this would come from the useWallet hook in a real implementation
  const mockWallets = {
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

  // Mock transactions
  const mockTransactions = [
    {
      id: 1,
      type: 'deposit',
      amount: '5,000.00',
      currency: 'USD',
      currencyType: 'fiat',
      status: 'completed',
      date: '2025-04-01T10:30:00Z',
      description: 'Initial deposit'
    },
    {
      id: 2,
      type: 'withdrawal',
      amount: '1,000.00',
      currency: 'USD',
      currencyType: 'fiat',
      status: 'pending',
      date: '2025-04-02T14:20:00Z',
      description: 'Withdrawal to bank account'
    },
    {
      id: 3,
      type: 'sent',
      amount: '0.5',
      currency: 'ETH',
      currencyType: 'crypto',
      status: 'completed',
      date: '2025-04-03T09:15:00Z',
      description: 'Transfer to external wallet',
      transactionHash: '0xabcdef123456789',
      blockConfirmations: 24
    },
    {
      id: 4,
      type: 'escrowFunded',
      amount: '10,000.00',
      currency: 'USD',
      currencyType: 'fiat',
      status: 'completed',
      date: '2025-04-04T16:45:00Z',
      description: 'Funding for contract #12345'
    }
  ];

  // Mock exchange rates
  const mockExchangeRates = {
    USD: { 
      NGN: 1530.25, 
      XOF: 605.50, 
      ETH: 0.00033
    },
    NGN: { 
      USD: 0.00065, 
      XOF: 0.40, 
      ETH: 0.00000022
    },
    ETH: {
      USD: 3000.50,
      NGN: 4591500.25,
      USDT: 3000.50,
      USDC: 3000.50
    }
  };

  // Mock supported currencies
  const mockSupportedCurrencies = {
    fiat: [
      { code: 'USD', name: 'US Dollar', countries: ['International'] },
      { code: 'XOF', name: 'West African CFA Franc', countries: ['Benin', 'Burkina Faso', 'Côte d\'Ivoire'] },
      { code: 'NGN', name: 'Nigerian Naira', countries: ['Nigeria'] },
      { code: 'ZAR', name: 'South African Rand', countries: ['South Africa'] },
      { code: 'EGP', name: 'Egyptian Pound', countries: ['Egypt'] },
      { code: 'KES', name: 'Kenyan Shilling', countries: ['Kenya'] }
    ],
    crypto: [
      { code: 'ETH', name: 'Ethereum', network: 'Ethereum Mainnet' },
      { code: 'USDT', name: 'Tether USD', network: 'Ethereum ERC-20' },
      { code: 'USDC', name: 'USD Coin', network: 'Ethereum ERC-20' }
    ]
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'withdrawal': return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'sent': return <Upload className="h-5 w-5 text-orange-500" />;
      case 'received': return <Download className="h-5 w-5 text-blue-500" />;
      case 'transfer': return <RefreshCw className="h-5 w-5 text-purple-500" />;
      case 'escrowFunded': return <ShieldCheck className="h-5 w-5 text-indigo-500" />;
      case 'escrowReleased': return <Download className="h-5 w-5 text-teal-500" />;
      default: return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-200 text-green-800';
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'failed': return 'bg-red-200 text-red-800';
      case 'processing': return 'bg-blue-200 text-blue-800';
      case 'cancelled': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const renderWalletTypeIcon = (type: string) => {
    switch (type) {
      case 'fiat': return <Building className="h-6 w-6 mr-3 text-blue-500" />;
      case 'crypto': return <Coins className="h-6 w-6 mr-3 text-orange-500" />;
      case 'escrow': return <ShieldCheck className="h-6 w-6 mr-3 text-green-500" />;
      default: return <Wallet className="h-6 w-6 mr-3 text-primary" />;
    }
  };

  const getWalletProviderName = (provider: string) => {
    switch (provider) {
      case 'papss': return 'PAPSS';
      case 'self_custody': return t('wallet.selfCustody');
      case 'internal': return 'BlockFinaX';
      default: return provider;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('wallet.title')}</h1>
        <p className="text-gray-600">{t('wallet.subtitle')}</p>
      </div>

      <Tabs defaultValue="wallets" className="mb-8" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="mb-4">
          <TabsTrigger value="wallets">{t('wallet.title')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('wallet.transactions')}</TabsTrigger>
          <TabsTrigger value="exchange">{t('wallet.exchangeRates')}</TabsTrigger>
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
                {t('wallet.fiatWallet')}
              </Button>
              <Button 
                variant={selectedWalletType === 'crypto' ? 'default' : 'outline'} 
                onClick={() => setSelectedWalletType('crypto')}
                className="flex items-center"
              >
                <Coins className="h-4 w-4 mr-2" />
                {t('wallet.cryptoWallet')}
              </Button>
              <Button 
                variant={selectedWalletType === 'escrow' ? 'default' : 'outline'} 
                onClick={() => setSelectedWalletType('escrow')}
                className="flex items-center"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                {t('wallet.escrowWallet')}
              </Button>
            </div>
            <Dialog open={isCreateWalletOpen} onOpenChange={setIsCreateWalletOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('wallet.createWallet')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('wallet.createWallet')}</DialogTitle>
                  <DialogDescription>
                    {t('wallet.createWalletDesc')}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex justify-center space-x-4 mb-6">
                    <Button 
                      variant={createWalletType === 'fiat' ? 'default' : 'outline'} 
                      onClick={() => setCreateWalletType('fiat')}
                      className="w-full"
                    >
                      <Bank className="h-4 w-4 mr-2" />
                      {t('wallet.fiatWallet')}
                    </Button>
                    <Button 
                      variant={createWalletType === 'crypto' ? 'default' : 'outline'} 
                      onClick={() => setCreateWalletType('crypto')}
                      className="w-full"
                    >
                      <Coins className="h-4 w-4 mr-2" />
                      {t('wallet.cryptoWallet')}
                    </Button>
                  </div>

                  {createWalletType === 'fiat' ? (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="bankName">{t('wallet.bankName')}</Label>
                        <Input id="bankName" placeholder="Enter bank name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="accountNumber">{t('wallet.accountNumber')}</Label>
                        <Input id="accountNumber" placeholder="Enter account number" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="accountName">{t('wallet.accountName')}</Label>
                        <Input id="accountName" placeholder="Enter account name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="bankCode">{t('wallet.bankCode')}</Label>
                        <Input id="bankCode" placeholder="Enter bank code/SWIFT" />
                      </div>
                      <div className="flex items-center p-3 bg-blue-50 rounded-md">
                        <Landmark className="h-5 w-5 text-blue-500 mr-2" />
                        <p className="text-sm text-blue-700">{t('wallet.papssIntegration')}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center space-x-4 mb-4">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {}}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {t('wallet.createWallet')}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {}}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {t('wallet.importWallet')}
                        </Button>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="privateKey">{t('wallet.privateKey')}</Label>
                        <Input id="privateKey" type="password" placeholder="Enter private key" />
                        <p className="text-xs text-gray-500 mt-1">
                          {t('wallet.privateKeyDesc')}
                        </p>
                      </div>
                      <div className="flex items-center p-3 bg-amber-50 rounded-md">
                        <ShieldCheck className="h-5 w-5 text-amber-500 mr-2" />
                        <p className="text-sm text-amber-700">{t('wallet.selfCustody')}</p>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateWalletOpen(false)}>
                    {t('wallet.cancel')}
                  </Button>
                  <Button type="submit">
                    {t('wallet.createWallet')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {selectedWalletType === 'fiat' && mockWallets.fiat.map(wallet => (
              <Card key={wallet.id} className="lg:col-span-3">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <Bank className="h-6 w-6 mr-2 text-primary" />
                        {t('wallet.fiatWallet')}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Landmark className="h-4 w-4 mr-1 text-blue-500" />
                        {t('wallet.papssIntegration')} • {t('wallet.multiCurrency')}
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {getWalletProviderName(wallet.walletProvider)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {wallet.balances.map((balance, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">
                          {mockSupportedCurrencies.fiat.find(c => c.code === balance.currency)?.name || balance.currency}
                        </div>
                        <div className="text-2xl font-bold">{balance.currency} {balance.amount}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <ArrowDownLeft className="h-4 w-4 mr-2" />
                        {t('wallet.deposit')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('wallet.depositFunds')}</DialogTitle>
                        <DialogDescription>
                          {t('wallet.depositDesc')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="currency">{t('wallet.currency')}</Label>
                          <Select defaultValue="USD">
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockSupportedCurrencies.fiat.map(currency => (
                                <SelectItem key={currency.code} value={currency.code}>
                                  {currency.code} - {currency.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount">{t('wallet.amount')}</Label>
                          <Input id="amount" type="number" placeholder="0.00" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="sourceAccount">{t('wallet.sourceAccount')}</Label>
                          <Input id="sourceAccount" placeholder="Enter source account" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {t('wallet.confirm')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        {t('wallet.withdraw')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('wallet.withdrawFunds')}</DialogTitle>
                        <DialogDescription>
                          {t('wallet.withdrawDesc')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="currency">{t('wallet.currency')}</Label>
                          <Select defaultValue="USD">
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {wallet.balances.map((balance) => (
                                <SelectItem key={balance.currency} value={balance.currency}>
                                  {balance.currency} - {balance.amount}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount">{t('wallet.amount')}</Label>
                          <Input id="amount" type="number" placeholder="0.00" />
                          <p className="text-xs text-gray-500">
                            {t('wallet.maxAmount')} USD 25,000.00
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="destinationAccount">{t('wallet.destinationAccount')}</Label>
                          <Input id="destinationAccount" placeholder="Enter destination account" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bankCode">{t('wallet.bankCode')}</Label>
                          <Input id="bankCode" placeholder="Enter bank code/SWIFT" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {t('wallet.confirm')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {t('wallet.transfer')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('wallet.transferFunds')}</DialogTitle>
                        <DialogDescription>
                          {t('wallet.transferDesc')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="currency">{t('wallet.currency')}</Label>
                          <Select defaultValue="USD">
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {wallet.balances.map((balance) => (
                                <SelectItem key={balance.currency} value={balance.currency}>
                                  {balance.currency} - {balance.amount}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount">{t('wallet.amount')}</Label>
                          <Input id="amount" type="number" placeholder="0.00" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="destinationWallet">{t('wallet.destinationWallet')}</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder={t('wallet.selectDestination')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="crypto">Crypto Wallet</SelectItem>
                              <SelectItem value="escrow">Escrow Wallet (Contract #12345)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">{t('wallet.description')}</Label>
                          <Input id="description" placeholder={t('wallet.descriptionPlaceholder')} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {t('wallet.confirm')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}

            {selectedWalletType === 'crypto' && mockWallets.crypto.map(wallet => (
              <Card key={wallet.id} className="lg:col-span-3">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <Coins className="h-6 w-6 mr-2 text-amber-500" />
                        {t('wallet.cryptoWallet')}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <ShieldCheck className="h-4 w-4 mr-1 text-amber-500" />
                        {t('wallet.selfCustody')} • {shortenAddress(wallet.walletAddress || '')}
                      </CardDescription>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                      {getWalletProviderName(wallet.walletProvider)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {wallet.balances.map((balance, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">
                          {mockSupportedCurrencies.crypto.find(c => c.code === balance.currency)?.name || balance.currency}
                        </div>
                        <div className="text-2xl font-bold">{balance.amount} {balance.currency}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          ≈ ${(
                            parseFloat(balance.amount.replace(/,/g, '')) * 
                            (mockExchangeRates[balance.currency as keyof typeof mockExchangeRates]?.USD || 0)
                          ).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <QrCode className="h-4 w-4 mr-2" />
                        {t('wallet.receive')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('wallet.receive.title')}</DialogTitle>
                        <DialogDescription>
                          {t('wallet.receive.subtitle')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="grid gap-2">
                          <Label>{t('wallet.selectCurrency')}</Label>
                          <Select defaultValue="ETH">
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockSupportedCurrencies.crypto.map(currency => (
                                <SelectItem key={currency.code} value={currency.code}>
                                  {currency.code} - {currency.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-center py-4">
                          <div className="bg-white p-2 border rounded-md w-48 h-48 flex items-center justify-center">
                            <QrCode className="w-32 h-32 text-gray-800" />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>{t('wallet.receive.address')}</Label>
                          <div className="flex">
                            <Input readOnly value={wallet.walletAddress || ''} className="flex-1" />
                            <Button variant="ghost" size="icon" className="ml-2">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="ml-1">
                              <Share className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-center p-3 bg-amber-50 rounded-md">
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                          <p className="text-sm text-amber-700">
                            {t('wallet.receiveWarning')}
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setIsReceiveOpen(false)}>
                          {t('wallet.close')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />
                        {t('wallet.send')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('wallet.send')}</DialogTitle>
                        <DialogDescription>
                          {t('wallet.sendDesc')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="currency">{t('wallet.currency')}</Label>
                          <Select defaultValue="ETH">
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {wallet.balances.map((balance) => (
                                <SelectItem key={balance.currency} value={balance.currency}>
                                  {balance.currency} - {balance.amount}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount">{t('wallet.amount')}</Label>
                          <Input id="amount" type="number" placeholder="0.00" />
                          <div className="flex justify-between">
                            <p className="text-xs text-gray-500">
                              {t('wallet.maxAmount')} 2.5 ETH
                            </p>
                            <p className="text-xs text-gray-500">
                              ≈ $7,501.25
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="toAddress">{t('wallet.destinationAddress')}</Label>
                          <Input id="toAddress" placeholder="0x..." />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="gasPrice">{t('wallet.gasPrice')}</Label>
                          <Input id="gasPrice" placeholder="20 GWEI" />
                          <p className="text-xs text-gray-500">
                            {t('wallet.estimatedFee')}: 0.0042 ETH ≈ $12.60
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {t('wallet.confirm')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('wallet.viewOnExplorer')}
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {selectedWalletType === 'escrow' && mockWallets.escrow.map(wallet => (
              <Card key={wallet.id} className="lg:col-span-3">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <ShieldCheck className="h-6 w-6 mr-2 text-green-500" />
                        {t('wallet.escrowWallet')}
                      </CardTitle>
                      <CardDescription>
                        {t('wallet.escrowForContract', { contractId: wallet.contractId })}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      {getWalletProviderName(wallet.walletProvider)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {wallet.balances.map((balance, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">
                          {t('wallet.escrowBalance')}
                        </div>
                        <div className="text-2xl font-bold">{balance.currency} {balance.amount}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    {t('wallet.fundEscrow')}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    {t('wallet.escrow.release')}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    {t('wallet.escrow.refund')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>{t('wallet.transactionHistory')}</CardTitle>
              <CardDescription>{t('wallet.recentActivity')}</CardDescription>
            </CardHeader>
            <CardContent>
              {mockTransactions.length > 0 ? (
                <div className="space-y-4">
                  {mockTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="mr-4 p-2 bg-gray-100 rounded-full">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="font-medium">
                            {t(`wallet.transaction.${transaction.type}`)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                          {transaction.description && (
                            <div className="text-sm">{transaction.description}</div>
                          )}
                          {transaction.transactionHash && (
                            <div className="text-xs text-blue-600 flex items-center mt-1">
                              <Globe className="h-3 w-3 mr-1" />
                              {shortenAddress(transaction.transactionHash)}
                              {transaction.blockConfirmations && (
                                <span className="ml-2 text-gray-600">
                                  {transaction.blockConfirmations} {t('wallet.blockConfirmations')}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={transaction.type === 'deposit' || transaction.type === 'received' 
                          ? 'text-green-600 font-medium' 
                          : 'text-red-600 font-medium'}>
                          {transaction.type === 'deposit' || transaction.type === 'received' ? '+' : '-'}
                          {transaction.currencyType === 'fiat' 
                            ? `${transaction.currency} ${transaction.amount}` 
                            : `${transaction.amount} ${transaction.currency}`}
                        </div>
                        <div className="flex items-center justify-end mt-1">
                          {getStatusIcon(transaction.status)}
                          <Badge className={`ml-2 ${getStatusColor(transaction.status)}`}>
                            {t(`wallet.status.${transaction.status}`)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg font-medium">{t('wallet.noTransactions')}</p>
                  <p className="text-gray-500">{t('wallet.noTransactionsDesc')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchange">
          <Card>
            <CardHeader>
              <CardTitle>{t('wallet.exchangeRates')}</CardTitle>
              <CardDescription>{t('wallet.exchangeRatesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4">
                  <Label>{t('wallet.baseCurrency')}</Label>
                  <Select
                    value={selectedCurrency}
                    onValueChange={setSelectedCurrency}
                  >
                    <SelectTrigger className="w-full md:w-[240px]">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(mockExchangeRates[selectedCurrency as keyof typeof mockExchangeRates] || {}).map(([currency, rate]) => (
                    <div key={currency} className="border rounded-lg p-4">
                      <div className="text-sm text-gray-500 mb-1">
                        {currency}
                      </div>
                      <div className="text-2xl font-bold">
                        {rate.toLocaleString('en-US', { 
                          minimumFractionDigits: rate < 0.01 ? 8 : 2, 
                          maximumFractionDigits: rate < 0.01 ? 8 : 2
                        })}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        1 {selectedCurrency} = {rate.toLocaleString('en-US', { 
                          minimumFractionDigits: rate < 0.01 ? 8 : 2,
                          maximumFractionDigits: rate < 0.01 ? 8 : 2 
                        })} {currency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletPageI18n;