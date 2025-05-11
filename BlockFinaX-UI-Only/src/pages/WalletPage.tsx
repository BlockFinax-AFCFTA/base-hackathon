import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  BarChart3, 
  Clock, 
  Check,
  Landmark,
  SearchIcon,
  Plus,
  ArrowRightLeft
} from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { tokens, transactions, escrowItems } from '@/data/mockData';
import { formatDate, shortenAddress } from '@/utils/helpers';

const WalletPage: React.FC = () => {
  const { account } = useWeb3();
  const [activeTab, setActiveTab] = useState('tokens');
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Token Display section
  const TokensSection = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {tokens.map((token, index) => (
          <div key={index} className="rounded-lg border bg-card p-5 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  {token.symbol.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{token.name}</h3>
                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">
              {token.balance}
            </div>
            <div className="absolute bottom-0 right-0 opacity-5">
              <Wallet className="h-24 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button 
          onClick={() => setShowTransferModal(true)}
          className="flex-1 flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-md"
        >
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Send
        </button>
        <button className="flex-1 flex items-center justify-center px-4 py-3 border border-input rounded-md">
          <ArrowDownLeft className="h-4 w-4 mr-2" />
          Receive
        </button>
        <button className="flex-1 flex items-center justify-center px-4 py-3 border border-input rounded-md">
          <ArrowRightLeft className="h-4 w-4 mr-2" />
          Swap
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="rounded-lg border overflow-hidden">
          {transactions.length > 0 ? (
            <div className="divide-y">
              {transactions.map(tx => (
                <div key={tx.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                        tx.txType === 'ESCROW_DEPOSIT' 
                          ? 'bg-amber-100 text-amber-800' 
                          : tx.txType === 'DEPOSIT' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tx.txType === 'ESCROW_DEPOSIT' ? (
                          <Landmark className="h-5 w-5" />
                        ) : tx.txType === 'DEPOSIT' ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{tx.description || tx.txType}</h4>
                        <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        tx.txType === 'DEPOSIT' || tx.txType === 'ESCROW_RELEASE' 
                          ? 'text-green-600' 
                          : ''
                      }`}>
                        {tx.txType === 'DEPOSIT' || tx.txType === 'ESCROW_RELEASE' ? '+' : ''}
                        {tx.amount} {tx.currency}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tx.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <h4 className="text-lg font-medium mb-1">No transactions yet</h4>
              <p className="text-sm text-muted-foreground">
                Your transaction history will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Escrow Section
  const EscrowSection = () => (
    <div>
      <div className="mb-6">
        <div className="rounded-lg border p-5 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Your Escrow Wallets</h3>
            <div className="flex gap-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search escrows..." 
                  className="w-full rounded-md border border-input pl-9 py-1 text-sm"
                />
              </div>
              <button className="p-2 rounded-md border">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {escrowItems.length > 0 ? (
            <div className="rounded-lg border overflow-hidden divide-y">
              {escrowItems.map(escrow => (
                <div key={escrow.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                        escrow.status === 'FUNDED' 
                          ? 'bg-blue-100 text-blue-800' 
                          : escrow.status === 'RELEASED' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        <Landmark className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Escrow for Contract #{escrow.contractId}</h4>
                        <p className="text-xs text-muted-foreground">
                          {shortenAddress(escrow.escrowAddress)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {escrow.amount} {escrow.currency}
                      </div>
                      <div className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${
                        escrow.status === 'FUNDED' 
                          ? 'bg-blue-100 text-blue-800' 
                          : escrow.status === 'RELEASED' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {escrow.status}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <p className="text-muted-foreground line-clamp-1">
                      {escrow.contractTitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Landmark className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <h4 className="text-lg font-medium mb-1">No escrow wallets</h4>
              <p className="text-sm text-muted-foreground">
                Create a contract to set up an escrow wallet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-sm text-muted-foreground">
            Manage your blockchain assets
          </p>
        </div>
        <div className="mt-4 sm:mt-0 px-4 py-2 rounded-md bg-muted/50 border">
          <span className="text-sm font-medium">Address: </span>
          <span className="text-sm font-mono">{shortenAddress(account)}</span>
        </div>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === 'tokens' 
              ? 'border-primary text-primary' 
              : 'border-transparent hover:border-muted-foreground/20'
          }`}
          onClick={() => setActiveTab('tokens')}
        >
          Tokens
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === 'escrow' 
              ? 'border-primary text-primary' 
              : 'border-transparent hover:border-muted-foreground/20'
          }`}
          onClick={() => setActiveTab('escrow')}
        >
          Escrow
        </button>
      </div>

      {activeTab === 'tokens' ? <TokensSection /> : <EscrowSection />}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Transfer Tokens</h2>
            <p className="text-muted-foreground mb-4">
              Modal content would go here with transfer form
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;