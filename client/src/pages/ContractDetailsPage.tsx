import React from 'react';
import { useRoute } from 'wouter';
import ContractDetails from '../../../components/contracts/ContractDetails';
import { BlockchainSidebar } from '../../../components/layout/BlockchainSidebar';

const ContractDetailsPage: React.FC = () => {
  const [, params] = useRoute('/contracts/:id');
  const contractId = params?.id;

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-64 flex-col border-r bg-background z-30">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="font-semibold">Base Network Finance</div>
        </div>
        <BlockchainSidebar className="flex-1" />
      </div>
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-xl font-semibold">Contract Details</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your contract details and logistics
          </p>
        </header>
        
        <main>
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
  );
};

export default ContractDetailsPage;