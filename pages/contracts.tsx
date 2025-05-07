import React from 'react';
import Head from 'next/head';
import ContractList from '../components/contracts/ContractList';
import { BlockchainSidebar } from '../components/layout/BlockchainSidebar';

export default function ContractsPage() {
  return (
    <>
      <Head>
        <title>Contracts | BlockFinaX</title>
      </Head>
      
      <div className="flex min-h-screen">
        <div className="hidden md:flex w-64 flex-col border-r bg-background z-30">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <div className="font-semibold">BlockFinaX</div>
          </div>
          <BlockchainSidebar className="flex-1" />
        </div>
        
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 lg:gap-6 lg:px-6">
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Contract Management</h1>
                <p className="text-sm text-muted-foreground">
                  Manage and track your blockchain-based contracts
                </p>
              </div>
            </div>
          </header>
          
          <main className="p-4 lg:p-6">
            <ContractList />
          </main>
        </div>
      </div>
    </>
  );
}