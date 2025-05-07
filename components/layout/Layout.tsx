import React, { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAppContext } from '../../hooks/useAppContext';
import { useMediaQuery } from '../../hooks/use-mobile';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen, setSidebarOpen } = useAppContext();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile, setSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed z-20 bottom-4 right-4 p-2 rounded-full bg-primary text-white shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isMobile ? 'fixed z-10' : 'relative'
        } transition-transform duration-300 ease-in-out w-64 h-full`}
      >
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
        sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
      }`}>
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;