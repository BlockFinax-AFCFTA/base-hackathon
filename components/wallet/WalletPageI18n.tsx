import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  AlertCircle
} from 'lucide-react';

/**
 * WalletPage component with internationalization
 * Uses the wallet namespace for translations
 */
const WalletPageI18n: React.FC = () => {
  // Use the 'wallet' namespace for translations
  const { t } = useLocalization('wallet');
  
  // Mock wallet data
  const walletBalance = '25,000.00';
  const walletCurrency = 'USD';
  
  // Mock transactions data
  const transactions = [
    /* This would be fetched from an API in a real implementation */
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'withdrawal': return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'sent': return <Upload className="h-5 w-5 text-orange-500" />;
      case 'received': return <Download className="h-5 w-5 text-blue-500" />;
      case 'transfer': return <RefreshCw className="h-5 w-5 text-purple-500" />;
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('wallet.title')}</h1>
        <p className="text-gray-600">{t('wallet.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('wallet.mainWallet')}</CardTitle>
            <CardDescription>{t('wallet.primaryWallet')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <Wallet className="h-8 w-8 mr-4 text-primary" />
              <div>
                <div className="text-3xl font-bold">{walletCurrency} {walletBalance}</div>
                <div className="text-sm text-gray-500">{t('wallet.balance')}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" className="flex-1">
              {t('wallet.deposit')}
            </Button>
            <Button variant="outline" className="flex-1">
              {t('wallet.withdraw')}
            </Button>
            <Button variant="outline" className="flex-1">
              {t('wallet.transfer')}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('wallet.escrowWallets')}</CardTitle>
            <CardDescription>{t('wallet.escrowForContract', { contractId: '12345' })}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <CreditCard className="h-6 w-6 mr-4 text-primary" />
              <div>
                <div className="text-xl font-bold">{walletCurrency} 10,000.00</div>
                <div className="text-sm text-gray-500">{t('wallet.balance')}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {t('wallet.fundEscrow')}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">{t('wallet.transactions')}</TabsTrigger>
          <TabsTrigger value="history">{t('wallet.history')}</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>{t('wallet.transactionHistory')}</CardTitle>
              <CardDescription>{t('wallet.recentActivity')}</CardDescription>
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
                            {t(`wallet.transaction.${transaction.type}`)}
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

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t('wallet.transactionHistory')}</CardTitle>
              <CardDescription>{t('wallet.recentActivity')}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Transaction history would go here */}
              <div className="text-center py-8">
                <p className="text-gray-500">Transaction history will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletPageI18n;