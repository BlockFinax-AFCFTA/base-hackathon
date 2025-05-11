import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Upload, 
  Wallet, 
  X, 
  CreditCard, 
  DollarSign, 
  Receipt,
  Truck
} from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAppContext } from '@/hooks/useAppContext';
import { shortenAddress } from '@/utils/helpers';

// Helper function to check if a path is active
const isActiveRoute = (currentPath: string, routePath: string) => {
  if (routePath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(routePath);
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useAppContext();
  const { user, account } = useWeb3();

  return (
    <div className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto`}>
      {/* Mobile sidebar header with close button */}
      <div className="flex h-14 items-center justify-between border-b px-4 lg:hidden">
        <span className="font-semibold">BlockFinaX</span>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="rounded-full p-1 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* User info section */}
      <div className="flex flex-col items-center p-4 border-b">
        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="mt-2 text-sm font-medium">{user?.username || 'User'}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {shortenAddress(account)}
        </div>
      </div>
      
      {/* Navigation items */}
      <nav className="flex-1 overflow-auto p-3">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/" 
              className={`flex items-center rounded-md px-3 py-2 text-sm ${
                isActiveRoute(location.pathname, '/') && location.pathname === '/' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </li>
          
          <li>
            <Link 
              to="/contracts" 
              className={`flex items-center rounded-md px-3 py-2 text-sm ${
                isActiveRoute(location.pathname, '/contracts') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <FileText className="mr-2 h-4 w-4" />
              Contracts
            </Link>
          </li>
          
          <li>
            <Link 
              to="/documents" 
              className={`flex items-center rounded-md px-3 py-2 text-sm ${
                isActiveRoute(location.pathname, '/documents') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <Upload className="mr-2 h-4 w-4" />
              Documents
            </Link>
          </li>
          
          <li>
            <Link 
              to="/wallet" 
              className={`flex items-center rounded-md px-3 py-2 text-sm ${
                isActiveRoute(location.pathname, '/wallet') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <Wallet className="mr-2 h-4 w-4" />
              Wallet
            </Link>
          </li>
          
          <li>
            <Link 
              to="/invoices" 
              className={`flex items-center rounded-md px-3 py-2 text-sm ${
                isActiveRoute(location.pathname, '/invoices') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Invoices
            </Link>
          </li>
          
          <li>
            <Link 
              to="/logistics" 
              className={`flex items-center rounded-md px-3 py-2 text-sm ${
                isActiveRoute(location.pathname, '/logistics') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <Truck className="mr-2 h-4 w-4" />
              Logistics
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="border-t p-3">
        <div className="text-xs text-muted-foreground mb-2">Wallet Balance</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-emerald-600" />
            <span className="text-sm font-medium">USDC:</span>
          </div>
          <span className="text-sm">150,000.25</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;