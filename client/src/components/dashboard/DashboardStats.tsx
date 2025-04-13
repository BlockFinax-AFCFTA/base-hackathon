import React from 'react';
import { 
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Globe,
  Landmark,
  BadgeDollarSign
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useContracts } from '@/hooks/useContracts';

const DashboardStats = () => {
  const { contracts, isLoadingContracts } = useContracts();

  const totalContractValue = contracts && Array.isArray(contracts)
    ? contracts.reduce((sum, contract) => {
        const amount = contract.tradeTerms?.amount || 0;
        return sum + amount;
      }, 0)
    : 0;

  const activeDeals = contracts && Array.isArray(contracts)
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
              <p className="text-sm font-medium text-white/80">Total Trade Volume</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{totalContractValue.toFixed(2)} USD</h3>
            </div>
            <Globe className="h-8 w-8 text-white/90" />
          </div>
          <div className="mt-4 flex items-center text-sm text-white/80">
            <BarChart3 className="mr-2 h-4 w-4" />
            Global trade activity
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Active Trade Deals</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{activeDeals}</h3>
            </div>
            <Landmark className="h-8 w-8 text-white/90" />
          </div>
          <div className="mt-4 flex items-center text-sm text-white/80">
            <TrendingUp className="mr-2 h-4 w-4" />
            Current transactions
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Secured Transactions</p>
              <h3 className="mt-2 text-2xl font-bold text-white">100%</h3>
            </div>
            <BadgeDollarSign className="h-8 w-8 text-white/90" />
          </div>
          <div className="mt-4 flex items-center text-sm text-white/80">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Smart contract protected
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;