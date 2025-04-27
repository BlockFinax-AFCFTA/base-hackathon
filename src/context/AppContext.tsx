'use client'

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-mobile';

// Basic implementation of useKYC hook
const useKYC = () => {
  // This will be replaced with actual implementation later
  const [kycData, setKycData] = useState(null);
  
  useEffect(() => {
    // Simulate fetching KYC data
    const storedKycData = typeof window !== 'undefined' ? localStorage.getItem('kycData') : null;
    setKycData(storedKycData ? JSON.parse(storedKycData) : null);
  }, []);
  
  const kycStatus = kycData ? 'VERIFIED' : 'PENDING';
  return { kycData, kycStatus };
};

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  isKYCCompleted: boolean;
  kycStatus: string;
}

export const AppContext = createContext<AppContextType>({
  sidebarOpen: true,
  toggleSidebar: () => {},
  setSidebarOpen: () => {},
  isKYCCompleted: false,
  kycStatus: 'PENDING',
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Default to open on desktop, closed on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { kycData, kycStatus } = useKYC();
  const pathname = usePathname();
  const router = useRouter();

  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  useEffect(() => {
    const protectedRoutes = ['/contracts', '/documents', '/trade-finance'];
    if (protectedRoutes.some(route => pathname?.startsWith(route)) && !kycData) {
      router.push('/kyc');
    }
  }, [pathname, kycData, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        isKYCCompleted: !!kycData,
        kycStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};