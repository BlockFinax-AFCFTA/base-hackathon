import React from 'react';
import { 
  Globe,
  Landmark,
  BarChart3,
  TrendingUp,
  ShieldCheck,
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Total Trade Volume */}
      <Card className="overflow-hidden border border-gray-100 shadow-sm">
        <div className="bg-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/90">Total Trade Volume</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{totalContractValue.toFixed(2)} USD</h3>
            </div>
            <div className="bg-blue-600 rounded-full p-3">
              <Globe className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-white/80">
            <BarChart3 className="mr-2 h-4 w-4" />
            Global trade activity
          </div>
        </div>
      </Card>

      {/* Active Trade Deals */}
      <Card className="overflow-hidden border border-gray-100 shadow-sm">
        <div className="bg-green-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/90">Active Trade Deals</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{activeDeals}</h3>
            </div>
            <div className="bg-green-500 rounded-full p-3">
              <Landmark className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-white/80">
            <TrendingUp className="mr-2 h-4 w-4" />
            Current transactions
          </div>
        </div>
      </Card>

      {/* Secured Transactions */}
      <Card className="overflow-hidden border border-gray-100 shadow-sm">
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/90">Secured Transactions</p>
              <h3 className="mt-2 text-2xl font-bold text-white">100%</h3>
            </div>
            <div className="bg-blue-500 rounded-full p-3">
              <BadgeDollarSign className="h-6 w-6 text-white" />
            </div>
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