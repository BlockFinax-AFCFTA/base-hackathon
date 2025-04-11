import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { shortenAddress } from '@/types/user';

const ConnectWallet = () => {
  const { account, isConnected, isConnecting, connectWallet, disconnectWallet } = useWeb3();
  
  return (
    <div className="relative inline-block">
      {isConnected ? (
        <Button 
          onClick={disconnectWallet}
          className="flex items-center"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {shortenAddress(account || '')}
        </Button>
      ) : (
        <Button 
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
