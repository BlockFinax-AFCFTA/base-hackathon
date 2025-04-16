import React from 'react';
import { Calendar, Clock, Users, Plus, ArrowRight, ArrowUpRight, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useContracts } from '@/hooks/useContracts';
import { Link } from 'wouter';
import { getStatusColor, getStatusText } from '@/types/contract';
import { format } from 'date-fns';

const RecentTransactions = () => {
  const { contracts, isLoadingContracts } = useContracts();
  
  // Sort contracts by createdAt (most recent first) and take the first 5
  const recentContracts = contracts && Array.isArray(contracts)
    ? [...contracts]
        .sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
        .slice(0, 5)
    : [];

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  };
  
  // Helper for custom status badge styling
  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      'DRAFT': 'bg-slate-100 text-slate-700 border-slate-200',
      'AWAITING_FUNDS': 'bg-amber-50 text-amber-700 border-amber-200',
      'FUNDED': 'bg-primary/10 text-primary border-primary/20',
      'GOODS_SHIPPED': 'bg-blue-50 text-blue-700 border-blue-200',
      'GOODS_RECEIVED': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'COMPLETED': 'bg-green-50 text-green-700 border-green-200',
      'DISPUTED': 'bg-red-50 text-red-700 border-red-200',
      'CANCELLED': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    
    return statusMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };
  
  return (
    <div className="mt-6">
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Transaction Ledger</h3>
            <p className="text-sm text-gray-500">Recent escrow contract activities and settlements</p>
          </div>
          <Link href="/contracts/new">
            <Button className="bg-blue-700 hover:bg-blue-800">
              <Plus className="h-4 w-4 mr-1" />
              New Transaction
            </Button>
          </Link>
        </CardHeader>

        {isLoadingContracts ? (
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
            <p className="mt-4 text-gray-500">Loading transaction data...</p>
          </CardContent>
        ) : recentContracts.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-1">Your transaction history will appear here</p>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <div className="bg-white">
              {recentContracts.map((contract, index) => (
                <div 
                  key={contract.id} 
                  className={`${index > 0 ? 'border-t border-gray-100' : ''} p-4 hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-grow">
                      <div className="flex items-center mb-1">
                        <h4 className="text-md font-medium text-gray-800">{contract.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`ml-3 text-xs ${getStatusBadgeClass(contract.status)}`}
                        >
                          {getStatusText(contract.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-y-1 items-center text-xs text-gray-500">
                        <span className="mr-3 flex items-center">
                          <Calendar className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-gray-400" />
                          {formatDate(contract.createdAt)}
                        </span>
                        {contract.tradeTerms?.deliveryDeadline && (
                          <span className="mr-3 flex items-center">
                            <Clock className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-gray-400" />
                            Due {formatDate(contract.tradeTerms.deliveryDeadline)}
                          </span>
                        )}
                        <span className="flex items-center font-medium text-blue-700 mr-3">
                          {contract.tradeTerms?.amount || 0} USD
                        </span>
                      </div>
                    </div>
                    <Link href={`/contracts/${contract.id}`}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                      >
                        View
                        <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}

        {recentContracts.length > 0 && (
          <CardFooter className="flex justify-between items-center border-t border-gray-100 py-3">
            <div className="text-xs text-gray-500">
              Showing {recentContracts.length} of {contracts && Array.isArray(contracts) ? contracts.length : 0} transactions
            </div>
            <Link href="/contracts">
              <div className="text-sm font-medium text-blue-700 hover:text-blue-800 cursor-pointer">
                View Complete Ledger <ArrowRight className="inline h-3.5 w-3.5 ml-1" />
              </div>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default RecentTransactions;
