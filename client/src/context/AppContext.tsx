import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router'; // Added import for useRouter

// Assume a basic implementation of useKYC hook.  Replace with your actual implementation.
const useKYC = () => {
  // Simulate fetching KYC data.  Replace with your actual data fetching logic.
  const kycData = localStorage.getItem('kycData');
  const kycStatus = kycData ? 'completed' : 'pending';
  return { kycData, kycStatus };
};


interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isKYCCompleted: boolean; // Added isKYCCompleted
  kycStatus: string; //Added kycStatus
}

export const AppContext = createContext<AppContextType>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  isKYCCompleted: false, // Added default value
  kycStatus: 'pending', // Added default value
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { kycData, kycStatus } = useKYC();
  const router = useRouter();

  useEffect(() => {
    const protectedRoutes = ['/contracts', '/documents', '/trade-finance'];
    if (protectedRoutes.some(route => router.pathname.startsWith(route)) && !kycData) {
      router.push('/kyc');
    }
  }, [router.pathname, kycData]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        isKYCCompleted: !!kycData,
        kycStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};