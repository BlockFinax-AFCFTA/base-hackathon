import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Web3ContextType {
  account: string | null;
  user: User | null;
  balance: string;
  isLoggedIn: boolean;
  isInitializing: boolean;
  error: string | null;
  loginUser: (username: string, password: string) => Promise<void>;
  logoutUser: () => void;
  createAccount: (username: string, password: string) => Promise<void>;
}

export const Web3Context = createContext<Web3ContextType>({
  account: null,
  user: null,
  balance: '0',
  isLoggedIn: false,
  isInitializing: false,
  error: null,
  loginUser: async () => {},
  logoutUser: () => {},
  createAccount: async () => {}
});

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState('0');
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current user session
  const fetchCurrentUser = async () => {
    try {
      setIsInitializing(true);
      const response = await apiRequest('GET', '/api/auth/session');
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setAccount(userData.walletAddress || `user-${userData.id}`);
        
        // Fetch user wallet balance
        await fetchWalletBalance(userData.id);
      }
    } catch (err) {
      console.error('Failed to fetch user session:', err);
    } finally {
      setIsInitializing(false);
    }
  };

  // Fetch wallet balance
  const fetchWalletBalance = async (userId: number) => {
    try {
      const response = await apiRequest('GET', `/api/users/${userId}/wallets/main/balance`);
      
      if (response.ok) {
        const { balance, currency } = await response.json();
        setBalance(balance);
      }
    } catch (err) {
      console.error('Failed to fetch wallet balance:', err);
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
      setAccount(userData.walletAddress || `user-${userData.id}`);
      
      // Fetch user wallet balance
      await fetchWalletBalance(userData.id);
      
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
        password
      });
      
      if (!response.ok) {
        throw new Error('Failed to create account');
      }
      
      const userData = await response.json();
      setUser(userData);
      setAccount(userData.walletAddress || `user-${userData.id}`);
      
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
      setAccount(null);
      setBalance('0');
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    // Try to get current user session on component mount
    fetchCurrentUser();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        user,
        balance,
        isLoggedIn: !!user,
        isInitializing,
        error,
        loginUser,
        logoutUser,
        createAccount
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
