import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, FileText, Upload, Wallet, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/useWeb3';
import { shortenAddress } from '@/types/user';
import { useAppContext } from '@/hooks/useAppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Sidebar = () => {
  const [location] = useLocation();
  const { account, user } = useWeb3();
  const { sidebarOpen, toggleSidebar } = useAppContext();

  const sidebarClasses = sidebarOpen 
    ? "fixed inset-0 z-40 flex md:static md:inset-auto md:flex md:flex-shrink-0 transform translate-x-0 transition-transform duration-200 ease-in-out"
    : "fixed inset-0 z-40 flex md:static md:inset-auto md:flex md:flex-shrink-0 transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out";

  return (
    <aside className={sidebarClasses}>
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">TradeSecure</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-col flex-grow overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <Link href="/">
              <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location === "/" 
                  ? "text-white bg-primary" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}>
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </a>
            </Link>
            <Link href="/contracts">
              <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location === "/contracts" 
                  ? "text-white bg-primary" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}>
                <FileText className="mr-3 h-5 w-5" />
                Contracts
              </a>
            </Link>
            <Link href="/documents">
              <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location === "/documents" 
                  ? "text-white bg-primary" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}>
                <Upload className="mr-3 h-5 w-5" />
                Documents
              </a>
            </Link>
            <Link href="/wallet">
              <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location === "/wallet" 
                  ? "text-white bg-primary" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}>
                <Wallet className="mr-3 h-5 w-5" />
                Wallet
              </a>
            </Link>
          </nav>
          {account && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImage} alt="User" />
                  <AvatarFallback className="bg-primary text-white">
                    {user?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-xs font-medium text-gray-500 font-mono truncate">
                    {shortenAddress(account)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Dark overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-[-1] md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </aside>
  );
};

export default Sidebar;
