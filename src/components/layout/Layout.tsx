'use client'

import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppContext } from '@/hooks/useAppContext';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isKYCCompleted, sidebarOpen } = useAppContext();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {sidebarOpen && <Sidebar />}
        <main className={`flex-1 p-6 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {!isKYCCompleted && (
            <div className="bg-yellow-50 p-4 mb-6 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Please complete identity verification to access all features.
                    <Link href="/kyc" className="font-medium underline ml-2">Complete KYC</Link>
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;