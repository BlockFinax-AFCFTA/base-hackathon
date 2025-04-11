import React from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import ConnectWallet from '@/components/wallet/ConnectWallet';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAppContext } from '@/hooks/useAppContext';

const Header = () => {
  const { toggleSidebar } = useAppContext();
  const { isConnected } = useWeb3();

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="mr-2"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-xl font-bold text-primary">TradeSecure</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex space-x-4">
                <Link href="/">
                  <a className="px-3 py-2 text-sm font-medium text-primary">Home</a>
                </Link>
                <a href="#" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">API</a>
                <a href="#" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Documentation</a>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
