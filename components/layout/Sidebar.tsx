import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  Wallet, 
  FileText, 
  Briefcase, 
  Truck, 
  FileIcon, 
  Settings, 
  LogOut, 
  User
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { t } = useTranslation();
  
  const isActive = (path: string) => {
    return location === path ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100';
  };

  return (
    <div className="flex flex-col h-full bg-white border-r shadow-sm">
      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1 px-2">
          <li>
            <Link href="/">
              <a className={`flex items-center px-4 py-2 text-sm rounded-md ${isActive('/')}`}>
                <Home className="h-5 w-5 mr-3" />
                {t('common.home')}
              </a>
            </Link>
          </li>
          
          <li>
            <Link href="/wallet">
              <a className={`flex items-center px-4 py-2 text-sm rounded-md ${isActive('/wallet')}`}>
                <Wallet className="h-5 w-5 mr-3" />
                {t('wallet.title')}
              </a>
            </Link>
          </li>
          
          <li>
            <Link href="/contracts">
              <a className={`flex items-center px-4 py-2 text-sm rounded-md ${isActive('/contracts')}`}>
                <Briefcase className="h-5 w-5 mr-3" />
                {t('contracts.title')}
              </a>
            </Link>
          </li>
          
          <li>
            <Link href="/documents">
              <a className={`flex items-center px-4 py-2 text-sm rounded-md ${isActive('/documents')}`}>
                <FileText className="h-5 w-5 mr-3" />
                {t('documents.title')}
              </a>
            </Link>
          </li>
          
          <li>
            <Link href="/invoices">
              <a className={`flex items-center px-4 py-2 text-sm rounded-md ${isActive('/invoices')}`}>
                <FileIcon className="h-5 w-5 mr-3" />
                {t('common.invoices')}
              </a>
            </Link>
          </li>
          
          <li>
            <Link href="/logistics">
              <a className={`flex items-center px-4 py-2 text-sm rounded-md ${isActive('/logistics')}`}>
                <Truck className="h-5 w-5 mr-3" />
                {t('logistics.title')}
              </a>
            </Link>
          </li>
        </ul>
        
        <div className="mt-6 pt-4 border-t mx-2">
          <div className="px-2 mb-2 text-xs font-medium text-gray-400 uppercase">
            Account
          </div>
          <ul className="space-y-1 px-2">
            <li>
              <Link href="/settings">
                <a className={`flex items-center px-4 py-2 text-sm rounded-md ${isActive('/settings')}`}>
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </a>
              </Link>
            </li>
            
            <li>
              <button 
                className="w-full flex items-center px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => console.log('Logout clicked')}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
      
      {/* User Section */}
      <div className="p-3 border-t flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="h-4 w-4 text-gray-600" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-medium">User</div>
          <div className="text-xs text-gray-500">user@example.com</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;