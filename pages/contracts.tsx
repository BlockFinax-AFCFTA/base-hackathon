import React from 'react';
import ContractList from '../components/contracts/ContractList';
import Layout from '../components/layout/Layout';

export default function ContractsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
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
    </Layout>
  );
}