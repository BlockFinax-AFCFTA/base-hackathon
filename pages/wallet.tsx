import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import EscrowWallet from '../components/wallet/EscrowWallet';
import { useWeb3 } from '../hooks/useWeb3';
import { shortenAddress } from '../lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';

// Sample escrow data for demonstration
const sampleEscrows = [
  {
    id: 1,
    contractId: 101,
    contractTitle: 'Electronics Import Contract',
    escrowAddress: '0x8f532f9aE789DD4221BC9e15E050dfa7b3f47E8B',
    amount: '10,000',
    currency: 'USDC',
    status: 'FUNDED' as const,
    createdAt: new Date('2025-04-01'),
    updatedAt: new Date('2025-04-05'),
    releaseConditions: 'Funds will be released when proof of delivery is verified on blockchain.',
    parties: {
      buyer: '0x2eD29d982B0120d49899a7cC7AfE7f5d5435BdBb',
      seller: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
    }
  },
  {
    id: 2,
    contractId: 102,
    contractTitle: 'Agricultural Commodities',
    escrowAddress: '0x2eD29d982B0120d49899a7cC7AfE7f5d5435BdBb',
    amount: '25,500',
    currency: 'USDT',
    status: 'PENDING' as const,
    createdAt: new Date('2025-04-10'),
    updatedAt: new Date('2025-04-10'),
    releaseConditions: 'Funds will be released when Certificate of Origin is verified and goods are delivered.',
    parties: {
      buyer: '0x2eD29d982B0120d49899a7cC7AfE7f5d5435BdBb',
      seller: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
    }
  }
];

// Sample token balances
const sampleTokens = [
  {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    balance: '50,000.00',
    decimals: 6,
    icon: '💵'
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    balance: '25,000.00',
    decimals: 6,
    icon: '💴'
  },
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    balance: '10,000.00',
    decimals: 18,
    icon: '🪙'
  }
];

export default function WalletPage() {
  const { t } = useTranslation();
  const { account, ethBalance, connectWallet, isConnected } = useWeb3();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Copy address to clipboard
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">{t('wallet.title')}</h1>

        {/* Wallet Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">{t('wallet.mainWallet')}</h2>
              <div className="text-sm text-gray-500 mt-1">{t('wallet.baseCurrency')}</div>
            </div>
            {isConnected ? (
              <div className="mt-4 md:mt-0 flex items-center">
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {t('wallet.connected')}
                </div>
                <button 
                  className="ml-3 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  onClick={() => connectWallet()}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {t('wallet.refresh')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => connectWallet()}
                className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t('wallet.connectWallet')}
              </button>
            )}
          </div>

          {isConnected && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-6">
                <div>
                  <div className="text-sm text-gray-600">{t('wallet.walletAddress')}</div>
                  <div className="font-mono mt-1 flex items-center">
                    {account ? shortenAddress(account, 10, 6) : 'N/A'}
                    <button
                      onClick={copyAddress}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      title={t('wallet.copyAddress')}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <a
                      href={account ? `https://basescan.org/address/${account}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      title={t('wallet.viewOnExplorer')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mt-4 md:mt-0">{t('wallet.nativeBalance')}</div>
                  <div className="font-medium text-xl mt-1">
                    {ethBalance} ETH
                  </div>
                </div>
              </div>

              {/* Token Balances */}
              <h3 className="text-lg font-medium mb-4">{t('wallet.tokenBalances')}</h3>
              <div className="space-y-4">
                {sampleTokens.map((token) => (
                  <div 
                    key={token.address}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {token.icon}
                      </div>
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-sm text-gray-500">
                          {shortenAddress(token.address, 6, 4)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{token.balance}</div>
                      <div className="text-sm text-gray-500">{token.symbol}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Escrow Wallet Section */}
        <div className="my-6">
          <Tabs defaultValue="active">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('wallet.escrowWallets')}</h2>
              <TabsList>
                <TabsTrigger value="active">
                  {t('wallet.active')}
                  <Badge variant="secondary" className="ml-2">{sampleEscrows.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="history">
                  {t('wallet.history')}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="active">
              <EscrowWallet 
                escrows={sampleEscrows} 
                isLoading={isLoading} 
              />
            </TabsContent>
            
            <TabsContent value="history">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">
                  {t('wallet.noHistoricalEscrows')}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}