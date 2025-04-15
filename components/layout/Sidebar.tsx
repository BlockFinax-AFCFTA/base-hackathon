import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, FileText, Upload, Wallet, X, 
  CreditCard, Globe, UserCheck, Receipt, 
  Shield,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useWeb3 } from '../../hooks/useWeb3';
import { shortenAddress } from '../../lib/utils'; // Updated this import
import { useAppContext } from '../../hooks/useAppContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

const Sidebar = () => {
  const [location] = useLocation();
  const { account, user } = useWeb3();
  const { sidebarOpen, toggleSidebar } = useAppContext();

  const sidebarClasses = sidebarOpen 
    ? "h-full fixed inset-y-0 left-0 z-40 flex md:sticky md:top-16 md:flex-shrink-0 transform translate-x-0 transition-transform duration-200 ease-in-out"
    : "h-full fixed inset-y-0 left-0 z-40 flex md:sticky md:top-16 md:flex-shrink-0 transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out";

  // Check if a route is active
  const isActive = (path: string) => {
    return location === path;
  };

  // Check if a route is part of a group that is active
  const isGroupActive = (paths: string[]) => {
    return paths.some(path => location.startsWith(path));
  };

  // Navigation item component
  const NavItem = ({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) => (
    <Link href={href}>
      <div className={`flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer ${
        active 
          ? "text-white bg-primary" 
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}>
        {icon}
        <span className={`${sidebarOpen ? 'ml-3 block' : 'hidden'}`}>{label}</span>
      </div>
    </Link>
  );

  return (
    <aside className={sidebarClasses}>
      <div className={`flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'} border-r border-gray-200 bg-white transition-all duration-300`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-primary">BlockFinaX</h1>
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">B</div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col flex-grow overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <NavItem 
              href="/" 
              icon={<Home className="h-5 w-5 flex-shrink-0" />} 
              label="Dashboard" 
              active={isActive("/")} 
            />

            <NavItem 
              href="/contracts" 
              icon={<FileText className="h-5 w-5 flex-shrink-0" />} 
              label="Contracts" 
              active={isGroupActive(["/contracts"])} 
            />

            <NavItem 
              href="/wallet" 
              icon={<Wallet className="h-5 w-5 flex-shrink-0" />} 
              label="Wallet" 
              active={isGroupActive(["/wallet"])} 
            />

            <NavItem 
              href="/invoices" 
              icon={<Receipt className="h-5 w-5 flex-shrink-0" />} 
              label="Invoices" 
              active={isGroupActive(["/invoices"])} 
            />

            <NavItem 
              href="/trade-finance" 
              icon={<Globe className="h-5 w-5 flex-shrink-0" />} 
              label="Trade Finance" 
              active={isGroupActive(["/trade-finance"])} 
            />

            <NavItem 
              href="/documents" 
              icon={<Upload className="h-5 w-5 flex-shrink-0" />} 
              label="Documents" 
              active={isGroupActive(["/documents"])} 
            />

            <NavItem 
              href="/kyc" 
              icon={<UserCheck className="h-5 w-5 flex-shrink-0" />} 
              label="Identity Verification" 
              active={isGroupActive(["/kyc", "/passport"])} 
            />
          </nav>

          {account && (
            <div className="mt-auto">
              <Separator />
              {user && sidebarOpen && (
                <div className="p-2 px-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Identity Verification</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                  </div>
                </div>
              )}

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={user?.profileImage} alt="User" />
                    <AvatarFallback className="bg-primary text-white">
                      {user?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {sidebarOpen && (
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-xs font-medium text-gray-500 font-mono truncate">
                        {shortenAddress(account)}
                      </p>
                    </div>
                  )}
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