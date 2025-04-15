
import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, FileText, Upload, Wallet, 
  CreditCard, Globe, UserCheck, Receipt
} from 'lucide-react';

const Sidebar = () => {
  const [location] = useLocation();

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
      <div className={`flex items-center px-4 py-2.5 text-sm font-medium cursor-pointer ${
        active 
          ? "bg-blue-700 text-white" 
          : "text-gray-700 hover:bg-gray-100"
      }`}>
        <div className="w-6 h-6 flex items-center justify-center mr-3">
          {icon}
        </div>
        <span>{label}</span>
      </div>
    </Link>
  );

  return (
    <aside className="h-full fixed left-0 top-0 w-[170px] z-40 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="py-4 px-2">
          <nav className="flex-1 space-y-0.5">
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
              active={isGroupActive(["/kyc", "/passport"])} 
            />
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
