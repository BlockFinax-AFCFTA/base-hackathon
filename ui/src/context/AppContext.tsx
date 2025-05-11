import React, { createContext, useState, ReactNode } from 'react';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

// Default context value
export const AppContext = createContext<AppContextType>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  setSidebarOpen: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};