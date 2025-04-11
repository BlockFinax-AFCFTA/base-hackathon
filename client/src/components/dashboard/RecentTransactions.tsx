import React from 'react';
import { Calendar, Clock, Users, File, ArrowRight, ArrowUpRight, BarChart3 } from 'lucide-react';
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
    <div className="mt-8">
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 shadow-md overflow-hidden">
        <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-primary">Transaction Ledger</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Recent escrow contract activities and settlements</p>
          </div>
          <Link href="/contracts/new">
            <Button className="inline-flex items-center bg-primary hover:bg-primary/90">
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Transaction
            </Button>
          </Link>
        </CardHeader>

        {isLoadingContracts ? (
          <CardContent className="py-12 text-center text-gray-500">
            <div className="flex justify-center">
              <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4">Loading transaction data...</p>
          </CardContent>
        ) : recentContracts.length === 0 ? (
          <CardContent className="py-12 text-center">
            <div className="bg-white rounded-lg p-6 max-w-lg mx-auto shadow-sm">
              <BarChart3 className="h-12 w-12 text-primary/60 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Transaction History</h3>
              <p className="text-gray-500 mb-6">Create your first secure trading contract to get started with blockchain-protected escrow transactions.</p>
              <Link href="/contracts/new">
                <Button className="w-full">Initiate New Transaction</Button>
              </Link>
            </div>
          </CardContent>
        ) : (
          <div className="bg-white rounded-lg mx-4 mb-4 overflow-hidden shadow-sm">
            {recentContracts.map((contract, index) => (
              <div 
                key={contract.id} 
                className={`${index > 0 ? 'border-t border-gray-100' : ''} px-6 py-4 hover:bg-gray-50 transition-colors`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <h4 className="text-md font-medium text-slate-800">{contract.title}</h4>
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
                      <span className="flex items-center font-medium text-primary mr-3">
                        {contract.tradeTerms?.amount || 0} ETH
                      </span>
                      <span className="flex items-center">
                        <Users className="flex-shrink-0 mr-1 h-3.5 w-3.5 text-gray-400" />
                        {contract.parties?.length || 0} parties
                      </span>
                    </div>
                  </div>
                  <Link href={`/contracts/${contract.id}`}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary hover:text-primary/90 hover:bg-primary/5"
                    >
                      Details
                      <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <CardFooter className="px-6 py-4 flex justify-between items-center bg-white border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Displaying {recentContracts.length} of {contracts && Array.isArray(contracts) ? contracts.length : 0} transactions
          </div>
          <Link href="/contracts">
            <div className="text-sm font-medium text-primary hover:text-primary-700 cursor-pointer">
              View Complete Ledger <ArrowRight className="inline h-3.5 w-3.5 ml-1" />
            </div>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecentTransactions;
