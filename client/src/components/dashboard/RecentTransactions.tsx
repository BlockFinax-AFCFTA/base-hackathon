import React from 'react';
import { Calendar, Clock, Users, File, ArrowRight } from 'lucide-react';
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
  const recentContracts = contracts
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
  
  return (
    <div className="mt-8">
      <Card>
        <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Contracts</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Your most recent trade contracts.</p>
          </div>
          <Link href="/contracts/new">
            <Button className="inline-flex items-center">
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Contract
            </Button>
          </Link>
        </CardHeader>

        {isLoadingContracts ? (
          <CardContent className="py-12 text-center text-gray-500">
            Loading contracts...
          </CardContent>
        ) : recentContracts.length === 0 ? (
          <CardContent className="py-12 text-center text-gray-500">
            <p>No contracts found. Get started by creating your first contract.</p>
          </CardContent>
        ) : (
          recentContracts.map((contract, index) => (
            <div 
              key={contract.id} 
              className={`${index > 0 ? 'border-t border-gray-200' : ''} px-4 py-5 sm:p-6`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h4 className="text-lg font-medium text-gray-900">{contract.title}</h4>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="mr-3 flex items-center">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      Created on {formatDate(contract.createdAt)}
                    </span>
                    {contract.tradeTerms?.deliveryDeadline && (
                      <span className="flex items-center">
                        <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        Delivery by {formatDate(contract.tradeTerms.deliveryDeadline)}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <Badge 
                      variant="outline" 
                      className={`bg-${getStatusColor(contract.status)}-100 text-${getStatusColor(contract.status)}-800 border-${getStatusColor(contract.status)}-200`}
                    >
                      {getStatusText(contract.status)}
                    </Badge>
                    <span className="ml-2 text-sm text-gray-500">
                      Value: {contract.tradeTerms?.amount || 0} ETH
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="flex items-center mr-4">
                      <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {contract.parties?.length || 0} Parties
                    </span>
                    <span className="flex items-center">
                      <File className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {contract.documents?.length || 0} Documents
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <Link href={`/contracts/${contract.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}

        <CardFooter className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <Link href="/contracts">
            <a className="text-sm font-medium text-primary hover:text-primary-700">
              View all contracts <ArrowRight className="inline h-4 w-4 ml-1" />
            </a>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecentTransactions;
