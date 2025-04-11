import React from 'react';
import DashboardStats from './DashboardStats';
import RecentTransactions from './RecentTransactions';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useWeb3 } from '@/hooks/useWeb3';
import { Plus, Upload, Check } from 'lucide-react';
import { useContracts } from '@/hooks/useContracts';

const ContractStatusOverview = () => {
  const { contracts, isLoadingContracts } = useContracts();
  
  const countByStatus = {
    DRAFT: 0,
    AWAITING_FUNDS: 0,
    ACTIVE: 0, // Combine FUNDED and GOODS_SHIPPED
    COMPLETED: 0
  };
  
  if (contracts && !isLoadingContracts) {
    contracts.forEach(contract => {
      if (contract.status === 'DRAFT') {
        countByStatus.DRAFT += 1;
      } else if (contract.status === 'AWAITING_FUNDS') {
        countByStatus.AWAITING_FUNDS += 1;
      } else if (['FUNDED', 'GOODS_SHIPPED', 'GOODS_RECEIVED'].includes(contract.status)) {
        countByStatus.ACTIVE += 1;
      } else if (contract.status === 'COMPLETED') {
        countByStatus.COMPLETED += 1;
      }
    });
  }
  
  return (
    <div className="mt-8">
      <Card>
        <CardHeader className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Contract Status Overview</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Current status of all your contracts.</p>
        </CardHeader>
        <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div>
                  <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                    <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Draft</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {isLoadingContracts ? '...' : countByStatus.DRAFT}
                      </dd>
                    </div>
                    <div className="px-4 py-5 bg-yellow-50 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-yellow-800 truncate">Awaiting Funds</dt>
                      <dd className="mt-1 text-3xl font-semibold text-yellow-800">
                        {isLoadingContracts ? '...' : countByStatus.AWAITING_FUNDS}
                      </dd>
                    </div>
                    <div className="px-4 py-5 bg-green-50 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-green-800 truncate">Active</dt>
                      <dd className="mt-1 text-3xl font-semibold text-green-800">
                        {isLoadingContracts ? '...' : countByStatus.ACTIVE}
                      </dd>
                    </div>
                    <div className="px-4 py-5 bg-blue-50 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-blue-800 truncate">Completed</dt>
                      <dd className="mt-1 text-3xl font-semibold text-blue-800">
                        {isLoadingContracts ? '...' : countByStatus.COMPLETED}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const QuickActions = () => {
  return (
    <div className="mt-8">
      <Card>
        <CardHeader className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Common tasks and actions.</p>
        </CardHeader>
        <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/contracts/new">
              <a className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-300 focus:outline-none">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Create New Contract</p>
                  <p className="text-sm text-gray-500">Start a new trade agreement</p>
                </div>
              </a>
            </Link>
            
            <Link href="/documents/upload">
              <a className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-300 focus:outline-none">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Upload Document</p>
                  <p className="text-sm text-gray-500">Add support documentation</p>
                </div>
              </a>
            </Link>
            
            <Link href="/contracts">
              <a className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-300 focus:outline-none">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Verify Shipment</p>
                  <p className="text-sm text-gray-500">Confirm receipt of goods</p>
                </div>
              </a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const { isConnected } = useWeb3();

  if (!isConnected) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Connect your wallet to get started</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Connect your Ethereum wallet to start creating and managing trade contracts securely on the blockchain.</p>
            </div>
            <div className="mt-5">
              <Button 
                onClick={() => {
                  const { connectWallet } = require('@/hooks/useWeb3').useWeb3();
                  connectWallet();
                }}
                className="inline-flex items-center"
              >
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Connect with MetaMask
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <DashboardStats />
      <RecentTransactions />
      <ContractStatusOverview />
      <QuickActions />
    </div>
  );
};

export default Dashboard;
