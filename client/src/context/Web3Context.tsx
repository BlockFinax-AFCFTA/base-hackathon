import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { User } from '../types/user';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  user: User | null;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
}

export const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  account: null,
  user: null,
  balance: '0',
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
  isConnected: false,
  error: null,
});

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const detectProvider = (): any => {
    if (window.ethereum) return window.ethereum;
    
    if (window.web3?.currentProvider) return window.web3.currentProvider;
    
    return null;
  };

  const registerOrFetchUser = async (address: string) => {
    try {
      const response = await apiRequest('POST', '/api/users', {
        walletAddress: address
      });
      
      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Error registering user:', err);
      return null;
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const ethereum = detectProvider();
      
      if (!ethereum) {
        throw new Error('No Ethereum browser extension detected. Please install MetaMask or similar provider.');
      }
      
      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const ethersProvider = new ethers.providers.Web3Provider(ethereum);
      const ethersSigner = ethersProvider.getSigner();
      const address = accounts[0];
      
      // Get account balance
      const accountBalance = await ethersProvider.getBalance(address);
      const balanceInEth = ethers.utils.formatEther(accountBalance);
      
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      setAccount(address);
      setBalance(balanceInEth);
      
      // Register or fetch user
      const userData = await registerOrFetchUser(address);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      });
      
      // Listen for account changes
      ethereum.on('accountsChanged', (newAccounts: string[]) => {
        if (newAccounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(newAccounts[0]);
          updateBalance(ethersProvider, newAccounts[0]);
          registerOrFetchUser(newAccounts[0]);
        }
      });
      
      // Listen for chain changes
      ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Connection Error",
        description: err.message,
        variant: "destructive",
      });
      console.error("Error connecting wallet:", err);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const updateBalance = async (
    provider: ethers.providers.Web3Provider, 
    address: string
  ) => {
    const accountBalance = await provider.getBalance(address);
    const balanceInEth = ethers.utils.formatEther(accountBalance);
    setBalance(balanceInEth);
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setUser(null);
    setBalance('0');
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  useEffect(() => {
    // Check if there's a connected wallet on component mount
    const checkConnection = async () => {
      const ethereum = detectProvider();
      if (ethereum) {
        try {
          const ethersProvider = new ethers.providers.Web3Provider(ethereum);
          const accounts = await ethersProvider.listAccounts();
          
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (err) {
          console.error("Failed to reconnect wallet:", err);
        }
      }
    };
    
    checkConnection();
    
    return () => {
      const ethereum = detectProvider();
      if (ethereum) {
        ethereum.removeAllListeners('accountsChanged');
        ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        user,
        balance,
        connectWallet,
        disconnectWallet,
        isConnecting,
        isConnected: !!account,
        error,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
