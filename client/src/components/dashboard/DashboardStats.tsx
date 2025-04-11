import React from 'react';
import { 
  CreditCard, 
  FileText, 
  DollarSign,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useWeb3 } from '@/hooks/useWeb3';
import { useContracts } from '@/hooks/useContracts';
import { Link } from 'wouter';

const DashboardStats = () => {
  const { balance } = useWeb3();
  const { contracts, isLoadingContracts } = useContracts();
  
  // Calculate the total value of all contracts
  const totalContractValue = contracts && Array.isArray(contracts)
    ? contracts.reduce((sum, contract) => {
        const amount = contract.tradeTerms?.amount || 0;
        return sum + amount;
      }, 0)
    : 0;
  
  // Count active contracts (not DRAFT, COMPLETED, CANCELLED)
  const activeContracts = contracts && Array.isArray(contracts)
    ? contracts.filter(contract => 
        !['DRAFT', 'COMPLETED', 'CANCELLED'].includes(contract.status)
      ).length
    : 0;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {/* Wallet Balance Card */}
      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-gradient-to-r from-primary to-primary/90 p-4">
          <h3 className="text-sm font-medium text-white/80">Digital Wallet Balance</h3>
          <div className="mt-3 flex items-center">
            <CreditCard className="h-5 w-5 text-white/90" />
            <div className="ml-2 text-2xl font-semibold text-white">{Number(balance).toFixed(4)} ETH</div>
          </div>
          <div className="mt-3 h-1 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-1 bg-white rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
        <CardContent className="p-4 bg-white">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+2.4% this week</span>
            </div>
            <Link href="/wallet">
              <div className="font-medium text-primary hover:text-primary/80 cursor-pointer">
                Transaction History
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Active Contracts Card */}
      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4">
          <h3 className="text-sm font-medium text-white/80">Active Financial Contracts</h3>
          <div className="mt-3 flex items-center">
            <FileText className="h-5 w-5 text-white/90" />
            <div className="ml-2 text-2xl font-semibold text-white">
              {isLoadingContracts ? '...' : activeContracts}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="px-2 py-1 rounded-full bg-white/10 text-white/90 text-xs">
              {isLoadingContracts ? '0' : Math.floor(activeContracts / 2)} Pending
            </div>
            <div className="px-2 py-1 rounded-full bg-primary/30 text-white/90 text-xs">
              {isLoadingContracts ? '0' : Math.ceil(activeContracts / 2)} In Progress
            </div>
          </div>
        </div>
        <CardContent className="p-4 bg-white">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-yellow-600">
              <BarChart3 className="h-4 w-4 mr-1" />
              <span>Medium activity</span>
            </div>
            <Link href="/contracts">
              <div className="font-medium text-primary hover:text-primary/80 cursor-pointer">
                Manage Contracts
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Total Value Card */}
      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-4">
          <h3 className="text-sm font-medium text-white/80">Total Asset Value</h3>
          <div className="mt-3 flex items-center">
            <DollarSign className="h-5 w-5 text-white/90" />
            <div className="ml-2 text-2xl font-semibold text-white">
              {isLoadingContracts ? '...' : `${totalContractValue.toFixed(2)} ETH`}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1">
            <div className="h-1.5 bg-white/20 rounded-full">
              <div className="h-full bg-white rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full">
              <div className="h-full bg-white rounded-full" style={{ width: '40%' }}></div>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full">
              <div className="h-full bg-white rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
        <CardContent className="p-4 bg-white">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+5.2% increase</span>
            </div>
            <Link href="/contracts">
              <div className="font-medium text-primary hover:text-primary/80 cursor-pointer">
                Financial Reports
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
