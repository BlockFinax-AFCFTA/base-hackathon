import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  CreditCard, 
  FileText as FileContract, 
  Pen as FilePen, 
  Box, 
  Truck, 
  ChevronRight,
  Home,
  BarChart3,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';

import { cn } from '../../lib/utils';
import { useWeb3 } from '../../hooks/useWeb3';

interface BlockchainSidebarProps {
  className?: string;
}

export const BlockchainSidebar: React.FC<BlockchainSidebarProps> = ({ className }) => {
  const [location] = useLocation();
  const { logoutUser } = useWeb3();

  const isActive = (path: string) => {
    if (path === '/') return location === path;
    return location.startsWith(path);
  }

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Wallet', path: '/wallet', icon: CreditCard },
    { name: 'Contracts', path: '/contracts', icon: FileContract },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Invoices', path: '/invoices', icon: FilePen },
    { name: 'Logistics', path: '/logistics', icon: Truck },
  ];

  return (
    <div className={cn("flex flex-col space-y-1 p-2", className)}>
      <div className="py-2">
        <h3 className="px-4 text-sm font-medium text-muted-foreground">Trade Finance</h3>
        
        <nav className="mt-2 flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                isActive(item.path) ? "bg-accent text-accent-foreground" : "transparent"
              )}>
                <item.icon className="mr-3 h-4 w-4" />
                <span>{item.name}</span>
                {isActive(item.path) && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </a>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="py-2">
        <h3 className="px-4 text-sm font-medium text-muted-foreground">Account</h3>
        
        <nav className="mt-2 flex flex-col space-y-1">
          <Link href="/settings">
            <a className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              isActive('/settings') ? "bg-accent text-accent-foreground" : "transparent"
            )}>
              <Settings className="mr-3 h-4 w-4" />
              <span>Settings</span>
              {isActive('/settings') && (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </a>
          </Link>
          
          <button 
            onClick={logoutUser}
            className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default BlockchainSidebar;