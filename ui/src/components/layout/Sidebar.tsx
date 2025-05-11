import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, FileText, Upload, Wallet, 
  CreditCard, DollarSign, Receipt,
  Truck, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAppContext } from '@/hooks/useAppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { shortenAddress } from '@/lib/utils';

const Sidebar = () => {
  const [location] = useLocation();
  const { account, isConnected, user, ethBalance } = useWeb3();
  const { sidebarOpen, setSidebarOpen } = useAppContext();

  // Helper to check if a path is active
  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="h-full flex flex-col">
      {/* User Profile Section */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar>
            {user?.profileImage ? (
              <AvatarImage src={user.profileImage} alt={user.username} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.username?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user?.username || 'User'}</span>
            <span className="text-xs text-muted-foreground">
              {isConnected ? shortenAddress(account) : 'Not connected'}
            </span>
          </div>
        </div>
        
        {isConnected && (
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">Balance: </span>
            <span className="font-medium">{ethBalance} ETH</span>
          </div>
        )}
      </div>
      
      <Separator />
      
      {/* Main Navigation */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          <Link href="/">
            <a className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm ${isActive('/') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
          </Link>
          
          <Link href="/wallet">
            <a className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm ${isActive('/wallet') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </a>
          </Link>
          
          <Link href="/contracts">
            <a className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm ${isActive('/contracts') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <FileText className="h-5 w-5" />
              <span>Contracts</span>
            </a>
          </Link>
          
          <Link href="/documents">
            <a className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm ${isActive('/documents') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <Upload className="h-5 w-5" />
              <span>Documents</span>
            </a>
          </Link>
          
          <Link href="/invoices">
            <a className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm ${isActive('/invoices') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <Receipt className="h-5 w-5" />
              <span>Invoices</span>
            </a>
          </Link>
          
          <Link href="/logistics">
            <a className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm ${isActive('/logistics') ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <Truck className="h-5 w-5" />
              <span>Logistics</span>
            </a>
          </Link>
        </nav>
      </div>
      
      <Separator />
      
      {/* Footer Section */}
      <div className="px-4 py-4">
        <div className="rounded-md bg-muted p-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">BlockFinaX</div>
              <div className="text-xs text-muted-foreground">Blockchain Finance Platform</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;