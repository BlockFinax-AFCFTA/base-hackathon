import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter'; // Using wouter for routing
import { useMediaQuery } from '../hooks/use-mobile';

// Assume a basic implementation of useKYC hook.  Replace with your actual implementation.
const useKYC = () => {
  // Simulate fetching KYC data.  Replace with your actual data fetching logic.
  const kycData = typeof window !== 'undefined' ? localStorage.getItem('kycData') : null;
  const kycStatus = kycData ? 'completed' : 'pending';
  return { kycData, kycStatus };
};

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  isKYCCompleted: boolean; // Added isKYCCompleted
  kycStatus: string; //Added kycStatus
}

export const AppContext = createContext<AppContextType>({
  sidebarOpen: true,
  toggleSidebar: () => {},
  setSidebarOpen: () => {},
  isKYCCompleted: false, // Added default value
  kycStatus: 'pending', // Added default value
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Default to open on desktop, closed on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { kycData, kycStatus } = useKYC();
  const [location, setLocation] = useLocation();

  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  useEffect(() => {
    const protectedRoutes = ['/contracts', '/documents', '/trade-finance'];
    if (protectedRoutes.some(route => location.startsWith(route)) && !kycData) {
      setLocation('/kyc');
    }
  }, [location, kycData, setLocation]);

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