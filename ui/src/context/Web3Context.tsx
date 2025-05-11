import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { mockUser } from '@/data/mockUsers';
import { mockTokens } from '@/data/mockTokens';

// Define types
interface User {
  id: number;
  username: string;
  walletAddress: string | null;
  profileImage: string | null;
}

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  address: string;
}

interface Web3ContextType {
  // User & account info
  account: string | null;
  user: User | null;
  isLoggedIn: boolean;
  isInitializing: boolean;
  error: string | null;
  
  // Network info
  networkName: string;
  chainId: number;
  isConnected: boolean;
  isBaseNetwork: boolean;
  
  // Balance info
  ethBalance: string;
  tokens: TokenInfo[];
  selectedToken: TokenInfo | null;
  
  // Methods
  loginUser: (username: string, password: string) => Promise<void>;
  logoutUser: () => void;
  createAccount: (username: string, password: string) => Promise<void>;
  connectWallet: (useTestnet?: boolean) => Promise<void>;
  disconnectWallet: () => void;
  refreshBalances: () => Promise<void>;
  selectToken: (tokenAddress: string) => void;
  transferTokens: (to: string, amount: string) => Promise<void>;
}

// Create Context with default values
export const Web3Context = createContext<Web3ContextType>({
  account: null,
  user: null,
  isLoggedIn: false,
  isInitializing: true,
  error: null,
  
  networkName: '',
  chainId: 0,
  isConnected: false,
  isBaseNetwork: false,
  
  ethBalance: '0',
  tokens: [],
  selectedToken: null,
  
  loginUser: async () => {},
  logoutUser: () => {},
  createAccount: async () => {},
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshBalances: async () => {},
  selectToken: () => {},
  transferTokens: async () => {},
});

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  // Mock state - for UI-only version
  const [account, setAccount] = useState<string | null>('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [networkName, setNetworkName] = useState('Base Goerli');
  const [chainId, setChainId] = useState(84531);
  const [isConnected, setIsConnected] = useState(true);
  const [isBaseNetwork, setIsBaseNetwork] = useState(true);
  
  const [ethBalance, setEthBalance] = useState('0.5');
  const [tokens, setTokens] = useState<TokenInfo[]>(mockTokens);
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(mockTokens[0]);

  // Mock methods
  const loginUser = async (username: string, password: string) => {
    setIsInitializing(true);
    try {
      // In UI-only version, just simulate a login
      console.log(`Would login with username: ${username} and password: ${password}`);
      setUser(mockUser);
      setIsLoggedIn(true);
      setAccount('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setIsLoggedIn(false);
    setAccount(null);
  };

  const createAccount = async (username: string, password: string) => {
    setIsInitializing(true);
    try {
      console.log(`Would create account with username: ${username} and password: ${password}`);
      setUser(mockUser);
      setIsLoggedIn(true);
      setAccount('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
    } catch (err) {
      console.error('Account creation error:', err);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  const connectWallet = async (useTestnet: boolean = true) => {
    setIsInitializing(true);
    try {
      console.log('Would connect wallet', useTestnet ? 'on testnet' : 'on mainnet');
      setAccount('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
      setIsConnected(true);
      setNetworkName(useTestnet ? 'Base Goerli' : 'Base Mainnet');
      setChainId(useTestnet ? 84531 : 8453);
      setIsBaseNetwork(true);
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  const refreshBalances = async () => {
    setIsInitializing(true);
    try {
      console.log('Would refresh balances');
      // No actual refresh needed, we're using mock data
    } catch (err) {
      console.error('Balance refresh error:', err);
      setError('Failed to refresh balances. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  const selectToken = (tokenAddress: string) => {
    const token = tokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase());
    setSelectedToken(token || null);
  };

  const transferTokens = async (to: string, amount: string) => {
    setIsInitializing(true);
    try {
      console.log(`Would transfer ${amount} tokens to ${to}`);
      // Just simulate the transfer in UI-only version
    } catch (err) {
      console.error('Token transfer error:', err);
      setError('Failed to transfer tokens. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  // Initialize on mount
  useEffect(() => {
    // For UI-only version, we're already "initialized" with mock data
    setIsInitializing(false);
  }, []);

  // Provide the context value
  const contextValue: Web3ContextType = {
    account,
    user,
    isLoggedIn,
    isInitializing,
    error,
    
    networkName,
    chainId,
    isConnected,
    isBaseNetwork,
    
    ethBalance,
    tokens,
    selectedToken,
    
    loginUser,
    logoutUser,
    createAccount,
    connectWallet,
    disconnectWallet,
    refreshBalances,
    selectToken,
    transferTokens,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};