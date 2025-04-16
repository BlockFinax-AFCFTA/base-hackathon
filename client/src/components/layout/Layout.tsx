import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAppContext } from '@/hooks/useAppContext';
import { AlertCircle } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isKYCCompleted } = useAppContext();

  return (
    <div className="min-h-screen bg-white">
      {/* Header at the top */}
      <Header />
      
      <div className="flex">
        {/* Sidebar on the left */}
        <Sidebar />
        
        {/* Main content area */}
        <main className="flex-1 ml-[172px]">
          {/* KYC notification if needed */}
          {!isKYCCompleted && (
            <div className="bg-yellow-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Please complete identity verification to access all features.
                    <a href="/kyc" className="font-medium underline ml-2">Complete KYC</a>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Content wrapper with padding */}
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;