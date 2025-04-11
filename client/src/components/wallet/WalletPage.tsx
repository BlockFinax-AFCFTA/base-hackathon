import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/useWeb3';
import WalletBalance from './WalletBalance';
import ConnectWallet from './ConnectWallet';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { shortenAddress } from '@/types/user';

const TransactionHistory = () => {
  // In a real app, this would come from the blockchain or an indexer service
  const transactions = [];
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="text-lg font-medium">Transaction History</h3>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Transaction items would go here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const NetworkInfo = () => {
  // In a real app, these would come from the provider
  const networkId = '1';
  const networkName = 'Ethereum Mainnet';
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="text-lg font-medium">Network Information</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-500">Network</p>
            <p className="font-medium">{networkName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Chain ID</p>
            <p className="font-medium">{networkId}</p>
          </div>
          <div className="pt-2">
            <a 
              href={`https://etherscan.io`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              View on Etherscan
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const WalletPage = () => {
  const { isConnected, account } = useWeb3();
  
  if (!isConnected) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Wallet</h1>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Connect Your Wallet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Connect your Ethereum wallet to see your balance and transaction history.
              </p>
              <div className="mt-6">
                <ConnectWallet />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Wallet</h1>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Connected as:</span>
          <span className="text-sm font-mono">{shortenAddress(account || '')}</span>
        </div>
      </div>
      
      <WalletBalance />
      <TransactionHistory />
      <NetworkInfo />
    </div>
  );
};

export default WalletPage;
