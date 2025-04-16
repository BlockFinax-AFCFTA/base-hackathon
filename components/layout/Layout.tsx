
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
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1">
        {!isKYCCompleted && (
          <div className="bg-yellow-50 p-4">
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
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
