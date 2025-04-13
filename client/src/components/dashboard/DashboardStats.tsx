import React from 'react';
import { 
  CreditCard, 
  BarChart3,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useWeb3 } from '@/hooks/useWeb3';
import { useContracts } from '@/hooks/useContracts';
import { Link } from 'wouter';

const DashboardStats = () => {
  const { balance } = useWeb3();
  const { contracts, isLoadingContracts } = useContracts();

  const totalContractValue = contracts && Array.isArray(contracts)
    ? contracts.reduce((sum, contract) => {
        const amount = contract.tradeTerms?.amount || 0;
        return sum + amount;
      }, 0)
    : 0;

  const escrowBalance = contracts && Array.isArray(contracts)
    ? contracts.reduce((sum, contract) => {
        if (contract.status === 'FUNDED') {
          return sum + (contract.tradeTerms?.amount || 0);
        }
        return sum;
      }, 0)
    : 0;

  const activeContracts = contracts && Array.isArray(contracts)
    ? contracts.filter(contract => 
        ['FUNDED', 'GOODS_SHIPPED', 'GOODS_RECEIVED'].includes(contract.status)
      ).length
    : 0;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-gradient-to-r from-primary to-primary/90 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Available Balance</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{Number(balance).toFixed(4)} ETH</h3>
            </div>
            <CreditCard className="h-8 w-8 text-white/90" />
          </div>
          <div className="mt-4 flex items-center text-sm text-white/80">
            <Activity className="mr-2 h-4 w-4" />
            Last activity: Today
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Total Asset Value</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{totalContractValue.toFixed(4)} ETH</h3>
            </div>
            <DollarSign className="h-8 w-8 text-white/90" />
          </div>
          <div className="mt-4 flex items-center text-sm text-white/80">
            <BarChart3 className="mr-2 h-4 w-4" />
            Across {activeContracts} active contracts
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Escrow Balance</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{escrowBalance.toFixed(4)} ETH</h3>
            </div>
            <ShieldCheck className="h-8 w-8 text-white/90" />
          </div>
          <div className="mt-4 flex items-center text-sm text-white/80">
            <TrendingUp className="mr-2 h-4 w-4" />
            Secured in smart contracts
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;