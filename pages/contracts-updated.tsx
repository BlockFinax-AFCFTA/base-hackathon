import React from 'react';
import { BlockchainSidebar } from '../components/layout/BlockchainSidebar';
import ContractList from '../components/contracts/ContractList';

export default function ContractsPage() {
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
          <h1 className="text-xl font-semibold">Contract Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your blockchain-based contracts
          </p>
        </header>
        
        <main>
          <ContractList />
        </main>
      </div>
    </div>
  );
}