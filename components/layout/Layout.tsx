import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAppContext } from '@/hooks/useAppContext'; // Fix import path
import { AlertCircle } from 'lucide-react'; // Using lucide-react which is already installed


interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isKYCCompleted, kycStatus } = useAppContext();

  return (
    <div className="min-h-screen bg-background">
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
      <Sidebar />
      <div className="lg:pl-72">
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />

          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;