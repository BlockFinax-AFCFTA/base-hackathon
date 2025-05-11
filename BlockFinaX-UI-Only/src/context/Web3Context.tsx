import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { delay } from '@/utils/helpers';
import { User, TokenInfo } from '@/types';
import { currentUser, tokens } from '@/data/mockData';

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

export const Web3Context = createContext<Web3ContextType>({
  account: null,
  user: null,
  isLoggedIn: false,
  isInitializing: true,
  error: null,
  
  networkName: 'Base Goerli',
  chainId: 84531,
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
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [networkName, setNetworkName] = useState('Base Goerli');
  const [chainId, setChainId] = useState(84531);
  const [isConnected, setIsConnected] = useState(false);
  const [isBaseNetwork, setIsBaseNetwork] = useState(false);
  
  const [ethBalance, setEthBalance] = useState('0');
  const [tokenList, setTokenList] = useState<TokenInfo[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);

  // Simulate initialization
  useEffect(() => {
    const init = async () => {
      try {
        // Simulate a network request
        await delay(1000);
        
        // Auto-login in this demo
        setUser(currentUser);
        setAccount(currentUser.walletAddress);
        setIsLoggedIn(true);
        setIsConnected(true);
        setIsBaseNetwork(true);
        setTokenList(tokens);
        if (tokens.length > 0) {
          setSelectedToken(tokens[0]);
        }
        setEthBalance('1.256');
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to initialize wallet connection");
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  // Mock login function
  const loginUser = async (username: string, password: string) => {
    setIsInitializing(true);
    setError(null);
    
    try {
      // Simulate API delay
      await delay(1000);
      
      // Demo credentials check
      if (username === 'demo' && password === 'password') {
        setUser(currentUser);
        setAccount(currentUser.walletAddress);
        setIsLoggedIn(true);
        setIsConnected(true);
        await refreshBalances();
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setIsInitializing(false);
    }
  };

  // Mock logout function
  const logoutUser = () => {
    setUser(null);
    setAccount(null);
    setIsLoggedIn(false);
    setIsConnected(false);
    setSelectedToken(null);
  };

  // Mock signup function
  const createAccount = async (username: string, password: string) => {
    setIsInitializing(true);
    setError(null);
    
    try {
      // Simulate API delay
      await delay(1000);
      
      // In a real app, we'd call an API to create a user
      setUser({
        ...currentUser,
        username
      });
      setAccount(currentUser.walletAddress);
      setIsLoggedIn(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create account');
      }
    } finally {
      setIsInitializing(false);
    }
  };

  // Mock connect wallet function
  const connectWallet = async (useTestnet: boolean = true) => {
    setIsInitializing(true);
    setError(null);
    
    try {
      // Simulate API delay
      await delay(1000);
      
      setAccount(currentUser.walletAddress);
      setIsConnected(true);
      setNetworkName(useTestnet ? 'Base Goerli' : 'Base Mainnet');
      setChainId(useTestnet ? 84531 : 8453);
      setIsBaseNetwork(true);
      
      await refreshBalances();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to connect wallet');
      }
    } finally {
      setIsInitializing(false);
    }
  };

  // Mock disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setSelectedToken(null);
  };

  // Mock refresh balances function
  const refreshBalances = async () => {
    setIsInitializing(true);
    
    try {
      // Simulate API delay
      await delay(500);
      
      setTokenList(tokens);
      if (tokens.length > 0 && !selectedToken) {
        setSelectedToken(tokens[0]);
      }
      setEthBalance('1.256');
    } catch (error) {
      console.error("Error refreshing balances:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  // Mock select token function
  const selectToken = (tokenAddress: string) => {
    const token = tokenList.find(t => t.address === tokenAddress);
    if (token) {
      setSelectedToken(token);
    }
  };

  // Mock transfer tokens function
  const transferTokens = async (to: string, amount: string) => {
    setIsInitializing(true);
    setError(null);
    
    try {
      // Simulate API delay
      await delay(1500);
      
      // Simulate successful transaction
      console.log(`Transfer ${amount} ${selectedToken?.symbol} to ${to}`);
      
      // In a real app, we'd update the balance after a successful transfer
      await refreshBalances();
      
      return;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Transfer failed');
      }
      throw error;
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Web3Context.Provider value={{
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
      tokens: tokenList,
      selectedToken,
      
      loginUser,
      logoutUser,
      createAccount,
      connectWallet,
      disconnectWallet,
      refreshBalances,
      selectToken,
      transferTokens,
    }}>
      {children}
    </Web3Context.Provider>
  );
};