import React from 'react';
import { useLocation } from 'wouter';
import Sidebar from '../components/layout/Sidebar';

const LogisticsPage: React.FC = () => {
  return (
    <>
      <div className="flex min-h-screen">
        <div className="hidden md:flex w-64 flex-col border-r bg-background z-30">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <div className="font-semibold">BlockFinaX</div>
          </div>
          <Sidebar />
        </div>
        
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 lg:gap-6 lg:px-6">
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Logistics Management</h1>
                <p className="text-sm text-muted-foreground">
                  Track and manage shipments with blockchain verification
                </p>
              </div>
            </div>
          </header>
          
          <main className="p-4 lg:p-6">
            <div className="text-center py-10">
              <h2 className="text-2xl font-medium mb-2">Logistics Management</h2>
              <p>Please use the Next.js page for logistics functionality.</p>
              <p className="mt-4">
                <a href="/logistics" className="text-primary hover:underline">
                  Go to Logistics Page
                </a>
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default LogisticsPage;