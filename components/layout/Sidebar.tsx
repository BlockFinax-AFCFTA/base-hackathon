import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, FileText, Upload, Wallet, 
  CreditCard, Globe, UserCheck, Receipt,
  Truck, BookOpen
} from 'lucide-react';

const Sidebar = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const isGroupActive = (paths: string[]) => {
    return paths.some(path => location.startsWith(path));
  };

  const NavItem = ({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) => (
    <Link href={href}>
      <div className={`flex items-center px-4 py-2.5 text-sm font-medium cursor-pointer ${
        active 
          ? "bg-blue-700 text-white" 
          : "text-gray-700 hover:bg-gray-100"
      }`}>
        {icon}
        <span className="ml-3">{label}</span>
      </div>
    </Link>
  );

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] fixed bg-white border-r border-gray-200">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-700">BlockFinaX</h1>
      </div>
      <nav className="mt-4 px-2 space-y-1">
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
          active={isActive("/documents")} 
        />
        <NavItem 
          href="/logistics" 
          icon={<Truck className="h-5 w-5" />} 
          label="Logistics" 
          active={isGroupActive(["/logistics"])} 
        />
        <NavItem 
          href="/kyc" 
          icon={<UserCheck className="h-5 w-5" />} 
          label="Identity Verification" 
          active={isGroupActive(["/kyc"])} 
        />
        <NavItem 
          href="/regulatory-ai" 
          icon={<BookOpen className="h-5 w-5" />} 
          label="Regulatory AI" 
          active={isGroupActive(["/regulatory-ai"])} 
        />
      </nav>
    </aside>
  );
};

export default Sidebar;