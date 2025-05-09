import React from 'react';
import { useLocation } from 'wouter';
import ContractDetails from '../components/contracts/ContractDetails';
import Sidebar from '../components/layout/Sidebar';

interface ContractDetailsPageProps {
  contractId: string;
}

export const ContractDetailsPage: React.FC<ContractDetailsPageProps> = ({ contractId }) => {
  const [, setLocation] = useLocation();
  
  if (!contractId) {
    setLocation('/contracts');
    return null;
  }
  
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
                <h1 className="text-xl font-semibold">Contract Details</h1>
                <p className="text-sm text-muted-foreground">
                  View and manage your contract details and logistics
                </p>
              </div>
            </div>
          </header>
          
          <main className="p-4 lg:p-6">
            {contractId ? (
              <ContractDetails contractId={contractId} />
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
                Contract ID not found. Please go back to contracts page.
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default ContractDetailsPage;