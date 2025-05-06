import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';
import Web3Service, { 
  STABLECOIN_ADDRESSES, 
  BASE_NETWORK,
  BASE_TESTNET 
} from '../client/src/services/web3Service';

// Define User interface inline to avoid import issues
interface User {
  id: number;
  username: string;
  walletAddress: string | null;
  profileImage: string | null;
}

// Token details for stablecoins
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

export const Web3Context = createContext<Web3ContextType>({
  // User & account info
  account: null,
  user: null,
  isLoggedIn: false,
  isInitializing: false,
  error: null,
  
  // Network info
  networkName: '',
  chainId: 0,
  isConnected: false,
  isBaseNetwork: false,
  
  // Balance info
  ethBalance: '0',
  tokens: [],
  selectedToken: null,
  
  // Methods
  loginUser: async () => {},
  logoutUser: () => {},
  createAccount: async () => {},
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshBalances: async () => {},
  selectToken: () => {},
  transferTokens: async () => {}
});

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  // User state
  const [account, setAccount] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Network state
  const [networkName, setNetworkName] = useState<string>('');
  const [chainId, setChainId] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // Balance state
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  
  // Service instances
  const [web3Service] = useState<Web3Service>(new Web3Service());
  
  const { toast } = useToast();
  
  const isBaseNetwork = chainId === BASE_NETWORK.chainId || chainId === BASE_TESTNET.chainId;

  // Get current user session
  const fetchCurrentUser = async () => {
    try {
      setIsInitializing(true);
      const response = await apiRequest('GET', '/api/auth/session');
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // If user already has a wallet address, use it
        if (userData.walletAddress) {
          setAccount(userData.walletAddress);
        }
      }
    } catch (err) {
      console.error('Failed to fetch user session:', err);
    } finally {
      setIsInitializing(false);
    }
  };

  // Connect wallet to Base network
  const connectWallet = async (useTestnet: boolean = false) => {
    try {
      setIsInitializing(true);
      setError(null);
      
      const { address, chainId, networkName } = await web3Service.connectToBaseNetwork(useTestnet);
      
      setAccount(address);
      setChainId(chainId);
      setNetworkName(networkName);
      setIsConnected(true);
      
      // Update user's wallet address in database if logged in
      if (user) {
        await apiRequest('PATCH', `/api/users/${user.id}`, {
          walletAddress: address
        });
        
        // Update local user state
        setUser(prev => prev ? { ...prev, walletAddress: address } : null);
      }
      
      // Fetch balances
      await refreshBalances();
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${networkName}`,
      });
      
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Connection Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(0);
    setNetworkName('');
    setIsConnected(false);
    setEthBalance('0');
    setTokens([]);
    setSelectedToken(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };
  
  // Refresh ETH and token balances
  const refreshBalances = async () => {
    if (!account || !isConnected) return;
    
    try {
      // Get ETH balance
      const ethBalanceData = await web3Service.getEthBalance(account);
      setEthBalance(ethBalanceData.formatted);
      
      // Get balances for each stablecoin
      const tokenPromises = Object.entries(STABLECOIN_ADDRESSES).map(async ([symbol, address]) => {
        try {
          const tokenDetails = await web3Service.getTokenDetails(address);
          const tokenBalance = await web3Service.getTokenBalance(address, account);
          
          return {
            name: tokenDetails.name,
            symbol,
            decimals: tokenDetails.decimals,
            balance: tokenBalance.formatted,
            address
          };
        } catch (error) {
          console.error(`Error fetching ${symbol} details:`, error);
          return {
            name: symbol,
            symbol,
            decimals: 6, // Default for most stablecoins
            balance: '0',
            address
          };
        }
      });
      
      const tokenData = await Promise.all(tokenPromises);
      setTokens(tokenData);
      
      // If no token is selected, select the first one
      if (!selectedToken && tokenData.length > 0) {
        setSelectedToken(tokenData[0]);
      }
      
    } catch (error) {
      console.error('Error refreshing balances:', error);
    }
  };
  
  // Select a token by address
  const selectToken = (tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress);
    if (token) {
      setSelectedToken(token);
    }
  };
  
  // Transfer tokens
  const transferTokens = async (to: string, amount: string) => {
    if (!selectedToken || !isConnected) {
      throw new Error('No token selected or wallet not connected');
    }
    
    try {
      setIsInitializing(true);
      const tx = await web3Service.transferTokens(selectedToken.address, to, amount);
      
      toast({
        title: "Transfer Successful",
        description: `Transferred ${amount} ${selectedToken.symbol} to ${to.slice(0, 6)}...${to.slice(-4)}`,
      });
      
      // Refresh balances after transfer
      await refreshBalances();
      
      return tx;
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsInitializing(false);
    }
  };

  // Login user
  const loginUser = async (username: string, password: string) => {
    try {
      setIsInitializing(true);
      setError(null);
      
      const response = await apiRequest('POST', '/api/auth/login', {
        username,
        password
      });
      
      if (!response.ok) {
        throw new Error('Invalid username or password');
      }
      
      const userData = await response.json();
      setUser(userData);
      
      // If user has a wallet address, use it
      if (userData.walletAddress) {
        setAccount(userData.walletAddress);
        // Try to connect wallet
        try {
          await connectWallet();
        } catch (error) {
          // Silent fail - will just show connect wallet button
          console.log('Could not automatically connect wallet');
        }
      }
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.username}!`,
      });
      
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Login Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Create account
  const createAccount = async (username: string, password: string) => {
    try {
      setIsInitializing(true);
      setError(null);
      
      const response = await apiRequest('POST', '/api/auth/register', {
        username,
        password,
        walletAddress: account, // Use connected wallet if available
        profileImage: null
      });
      
      if (!response.ok) {
        throw new Error('Failed to create account');
      }
      
      const userData = await response.json();
      setUser(userData);
      
      toast({
        title: "Account Created",
        description: `Welcome, ${userData.username}! Your account is ready.`,
      });
      
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Registration Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Logout user
  const logoutUser = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout');
      
      setUser(null);
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Check for wallet connection changes
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        // Handle account change
        const handleAccountsChanged = (accounts: string[]) => {
          if (accounts.length === 0) {
            // User disconnected wallet
            disconnectWallet();
          } else if (accounts[0] !== account) {
            // Account changed
            setAccount(accounts[0]);
            refreshBalances();
          }
        };
        
        // Handle chain change
        const handleChainChanged = (chainIdHex: string) => {
          const newChainId = parseInt(chainIdHex, 16);
          setChainId(newChainId);
          
          const isBase = newChainId === BASE_NETWORK.chainId || newChainId === BASE_TESTNET.chainId;
          if (isBase) {
            setNetworkName(newChainId === BASE_NETWORK.chainId ? BASE_NETWORK.name : BASE_TESTNET.name);
            refreshBalances();
          } else {
            toast({
              title: "Network Changed",
              description: "Please switch back to Base Network for full functionality",
              variant: "destructive",
            });
          }
        };
        
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        
        return () => {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
      }
    };
    
    checkConnection();
  }, [account]);

  useEffect(() => {
    // Try to get current user session on component mount
    fetchCurrentUser();
    
    // Check if wallet is already connected (browser persistence)
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet().catch(console.error);
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        // User & account info
        account,
        user,
        isLoggedIn: !!user,
        isInitializing,
        error,
        
        // Network info
        networkName,
        chainId,
        isConnected,
        isBaseNetwork,
        
        // Balance info
        ethBalance,
        tokens,
        selectedToken,
        
        // Methods
        loginUser,
        logoutUser,
        createAccount,
        connectWallet,
        disconnectWallet,
        refreshBalances,
        selectToken,
        transferTokens
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
