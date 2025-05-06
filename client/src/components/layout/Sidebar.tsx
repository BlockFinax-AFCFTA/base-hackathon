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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../../../context/LanguageContext';

const Sidebar = () => {
  const [location] = useLocation();
  const { account, user } = useWeb3();
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const { translate } = useLanguage();

  const sidebarClasses = sidebarOpen 
    ? "fixed inset-0 z-40 flex md:static md:inset-auto md:flex md:flex-shrink-0 transform translate-x-0 transition-transform duration-200 ease-in-out"
    : "fixed inset-0 z-40 flex md:static md:inset-auto md:flex md:flex-shrink-0 transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out";

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
      <div className={`flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer ${
        active 
          ? "text-white bg-primary" 
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}>
        {icon}
        {label}
      </div>
    </Link>
  );

  return (
    <aside className={sidebarClasses}>
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">{translate('app.title')}</h1>
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
            <NavItem 
              href="/dashboard" 
              icon={<Home className="mr-3 h-5 w-5" />} 
              label={translate('nav.dashboard')} 
              active={isActive("/dashboard") || isActive("/")} 
            />

            <NavItem 
              href="/contracts" 
              icon={<FileText className="mr-3 h-5 w-5" />} 
              label={translate('nav.contracts')} 
              active={isGroupActive(["/contracts"])} 
            />

            {/* Make multi-currency wallet the primary wallet */}
            <NavItem 
              href="/wallet/multi-currency" 
              icon={<CreditCard className="mr-3 h-5 w-5" />} 
              label={"Multi-Currency Wallet"} 
              active={location === "/wallet/multi-currency"} 
            />
            
            {/* Legacy wallet as secondary option */}
            <NavItem 
              href="/wallet" 
              icon={<Wallet className="mr-3 h-5 w-5" />} 
              label={translate('nav.wallet')} 
              active={location === "/wallet" || (isGroupActive(["/wallet"]) && location !== "/wallet/multi-currency")} 
            />

            <NavItem 
              href="/invoices" 
              icon={<Receipt className="mr-3 h-5 w-5" />} 
              label={translate('nav.invoices')} 
              active={isGroupActive(["/invoices"])} 
            />

            <NavItem 
              href="/trade-finance" 
              icon={<Globe className="mr-3 h-5 w-5" />} 
              label={translate('nav.tradeFinance')} 
              active={isGroupActive(["/trade-finance"])} 
            />

            <NavItem 
              href="/documents" 
              icon={<Upload className="mr-3 h-5 w-5" />} 
              label={translate('nav.documents')} 
              active={isGroupActive(["/documents"])} 
            />

            <NavItem 
              href="/logistics" 
              icon={<svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3" /><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" /><path d="M14 17h1" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>} 
              label={translate('nav.logistics')} 
              active={isGroupActive(["/logistics"])} 
            />

            <NavItem 
              href="/kyc" 
              icon={<UserCheck className="mr-3 h-5 w-5" />} 
              label={translate('nav.kyc')} 
              active={isGroupActive(["/kyc", "/passport"])} 
            />
          </nav>

          {account && (
            <div className="mt-auto">
              <Separator />
              {user && (
                <div className="p-2 px-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">{translate('nav.kyc')}</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">{translate('kyc.status')}</Badge>
                  </div>
                </div>
              )}

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