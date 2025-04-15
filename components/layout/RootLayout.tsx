import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppContext } from '../../hooks/useAppContext';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const { sidebarOpen } = useAppContext();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main 
          className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}