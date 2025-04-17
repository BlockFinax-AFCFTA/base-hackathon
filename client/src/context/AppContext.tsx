import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter'; // Using wouter for routing

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
  const [location, setLocation] = useLocation();

  // Removed KYC requirement for protected routes
  useEffect(() => {
    // Add any other route protection logic here if needed
  }, [location]);

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