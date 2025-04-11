import React from 'react';
import { 
  CreditCard, 
  FileText, 
  DollarSign 
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useWeb3 } from '@/hooks/useWeb3';
import { useContracts } from '@/hooks/useContracts';
import { Link } from 'wouter';

const DashboardStats = () => {
  const { balance } = useWeb3();
  const { contracts, isLoadingContracts } = useContracts();
  
  // Calculate the total value of all contracts
  const totalContractValue = contracts
    ? contracts.reduce((sum, contract) => {
        const amount = contract.tradeTerms?.amount || 0;
        return sum + amount;
      }, 0)
    : 0;
  
  // Count active contracts (not DRAFT, COMPLETED, CANCELLED)
  const activeContracts = contracts
    ? contracts.filter(contract => 
        !['DRAFT', 'COMPLETED', 'CANCELLED'].includes(contract.status)
      ).length
    : 0;

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {/* Wallet Balance Card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary rounded-md p-3">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Wallet Balance</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{Number(balance).toFixed(4)} ETH</div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link href="/wallet">
              <a className="font-medium text-primary hover:text-primary-700">View transactions</a>
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Active Contracts Card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Contracts</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {isLoadingContracts ? '...' : activeContracts}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link href="/contracts">
              <a className="font-medium text-primary hover:text-primary-700">View all contracts</a>
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Total Value Card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Contract Value</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {isLoadingContracts ? '...' : `${totalContractValue.toFixed(2)} ETH`}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-primary-700">View analytics</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardStats;
