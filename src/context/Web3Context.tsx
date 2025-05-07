'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
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

  // Login user (simulated)
  const loginUser = async (username: string, password: string) => {
    try {
      setIsInitializing(true);
      setError(null);
      
      // Create mock user with provided username
      const mockUser: User = {
        id: 1,
        username: username || 'demouser',
        walletAddress: '0x1234567890123456789012345678901234567890',
        profileImage: null
      };
      
      setUser(mockUser);
      setAccount(mockUser.walletAddress);
      setBalance('10000.00');
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${mockUser.username}!`,
      });
      
    } catch (err: any) {
      setError('Login failed');
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Create account (simulated)
  const createAccount = async (username: string, password: string) => {
    try {
      setIsInitializing(true);
      setError(null);
      
      // Create mock user with provided username
      const mockUser: User = {
        id: 1,
        username: username || 'demouser',
        walletAddress: '0x1234567890123456789012345678901234567890',
        profileImage: null
      };
      
      setUser(mockUser);
      setAccount(mockUser.walletAddress);
      setBalance('10000.00');
      
      toast({
        title: "Account Created",
        description: `Welcome, ${mockUser.username}! Your account is ready.`,
      });
      
    } catch (err: any) {
      setError('Registration failed');
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Logout user
  const logoutUser = () => {
    setUser(null);
    setAccount(null);
    setBalance('0');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    
    // Auto re-login after 1 second to keep the app functional
    setTimeout(() => {
      const mockUser: User = {
        id: 1,
        username: 'demouser',
        walletAddress: '0x1234567890123456789012345678901234567890',
        profileImage: null
      };
      
      setUser(mockUser);
      setAccount(mockUser.walletAddress);
      setBalance('10000.00');
    }, 1000);
  };

  useEffect(() => {
    // Create a mock user instead of trying to fetch one
    const mockUser: User = {
      id: 1,
      username: 'demouser',
      walletAddress: '0x1234567890123456789012345678901234567890',
      profileImage: null
    };
    
    setUser(mockUser);
    setAccount(mockUser.walletAddress);
    setBalance('10000.00');
    setIsInitializing(false);
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