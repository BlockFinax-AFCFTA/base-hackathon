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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}