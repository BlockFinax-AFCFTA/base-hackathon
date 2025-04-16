import React from 'react';
import { Globe, Landmark, ShieldCheck } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Total Trade Volume</p>
            <h3 className="mt-2 text-2xl font-bold">{totalContractValue.toFixed(2)} USD</h3>
          </div>
          <Globe className="h-8 w-8 text-white/90" />
        </div>
        <div className="mt-4 flex items-center text-sm text-white/80">
          Global trade activity
        </div>
      </Card>

      <Card className="bg-green-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Active Trade Deals</p>
            <h3 className="mt-2 text-2xl font-bold">{activeDeals}</h3>
          </div>
          <Landmark className="h-8 w-8 text-white/90" />
        </div>
        <div className="mt-4 flex items-center text-sm text-white/80">
          Current transactions
        </div>
      </Card>

      <Card className="bg-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Secured Transactions</p>
            <h3 className="mt-2 text-2xl font-bold">100%</h3>
          </div>
          <ShieldCheck className="h-8 w-8 text-white/90" />
        </div>
        <div className="mt-4 flex items-center text-sm text-white/80">
          Smart contract protected
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;