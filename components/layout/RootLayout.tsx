import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppContext } from '../../hooks/useAppContext';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto ml-[170px]">
          {children}
        </main>
      </div>
    </div>
  );
}