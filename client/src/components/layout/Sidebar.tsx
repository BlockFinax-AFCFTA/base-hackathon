import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, FileText, Upload, Wallet, X, 
  CreditCard, Globe, UserCheck, Receipt, 
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/useWeb3';
import { shortenAddress } from '@/types/user';
import { useAppContext } from '@/hooks/useAppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Sidebar = () => {
  const [location] = useLocation();
  const { account, user } = useWeb3();
  const { sidebarOpen, toggleSidebar } = useAppContext();

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
      <div className={`flex items-center px-4 py-3 text-sm font-medium cursor-pointer ${
        active 
          ? "text-white bg-blue-700" 
          : "text-gray-700 hover:bg-gray-100"
      }`}>
        {icon}
        <span className="ml-3">{label}</span>
      </div>
    </Link>
  );

  return (
    <aside className="fixed top-16 left-0 h-full w-[172px] bg-white border-r border-gray-200 shadow-sm z-10">
      <div className="flex flex-col h-full">
        <nav className="flex-1 py-2">
          <NavItem 
            href="/" 
            icon={<Home className="h-5 w-5" />} 
            label="Dashboard" 
            active={isActive("/")} 
          />

          <NavItem 
            href="/contracts" 
            icon={<FileText className="h-5 w-5" />} 
            label="Contracts" 
            active={isGroupActive(["/contracts"])} 
          />

          <NavItem 
            href="/wallet" 
            icon={<Wallet className="h-5 w-5" />} 
            label="Wallet" 
            active={isGroupActive(["/wallet"])} 
          />

          <NavItem 
            href="/invoices" 
            icon={<Receipt className="h-5 w-5" />} 
            label="Invoices" 
            active={isGroupActive(["/invoices"])} 
          />

          <NavItem 
            href="/trade-finance" 
            icon={<Globe className="h-5 w-5" />} 
            label="Trade Finance" 
            active={isGroupActive(["/trade-finance"])} 
          />

          <NavItem 
            href="/documents" 
            icon={<Upload className="h-5 w-5" />} 
            label="Documents" 
            active={isGroupActive(["/documents"])} 
          />

          <NavItem 
            href="/kyc" 
            icon={<UserCheck className="h-5 w-5" />} 
            label="Identity Verification" 
            active={isGroupActive(["/kyc"])} 
          />
        </nav>

        {account && (
          <div className="mt-auto p-4 border-t border-gray-200">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImage} alt="User" />
                <AvatarFallback className="bg-blue-700 text-white">
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
      
      {/* Mobile sidebar controls - only shown on small screens */}
      <div className="md:hidden">
        {sidebarOpen ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="absolute top-3 right-3"
          >
            <X className="h-6 w-6" />
          </Button>
        ) : null}
        
        {/* Dark overlay when sidebar is open on mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-[-1]"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;