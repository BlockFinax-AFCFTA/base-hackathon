import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Clock, Users, File, Plus, DollarSign } from 'lucide-react';
import { useContracts } from '../../hooks/useContracts';
import { getStatusColor, getStatusText } from '../../types/contract';
import { format } from 'date-fns';

const ContractList = () => {
  const { contracts, isLoadingContracts } = useContracts();
  
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Contracts</h1>
        <Link href="/contracts/new">
          <Button className="inline-flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            New Contract
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Your Contracts</h2>
            <div className="flex space-x-2">
              {/* Filter buttons could go here */}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoadingContracts ? (
            <div className="py-12 text-center text-gray-500">
              Loading contracts...
            </div>
          ) : contracts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p>No contracts found. Get started by creating your first contract.</p>
              <Link href="/contracts/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Contract
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {contracts.map((contract, index) => (
                <div
                  key={contract.id}
                  className={`px-4 py-5 border ${
                    index > 0 ? 'border-t' : 'border-t-0'
                  } border-l-0 border-r-0 border-b-0 border-gray-200`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <h4 className="text-lg font-medium text-gray-900">{contract.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{contract.description}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="mr-3 flex items-center">
                          <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          Created on {formatDate(contract.createdAt)}
                        </span>
                        {contract.tradeTerms?.endDate && (
                          <span className="flex items-center">
                            <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {contract.status === 'COMPLETED' ? 'Completed on' : 'End date'}: {formatDate(contract.tradeTerms.endDate)}
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <Badge 
                          variant="outline" 
                          className={`bg-${getStatusColor(contract.status)}-100 text-${getStatusColor(contract.status)}-800`}
                        >
                          {getStatusText(contract.status)}
                        </Badge>
                        <span className="ml-2 text-sm text-gray-500 flex items-center inline-flex">
                          <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                          {contract.tradeTerms?.value || contract.tradeTerms?.amount || '0'} {contract.tradeTerms?.currency || 'ETH'}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="flex items-center mr-4">
                          <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {Array.isArray(contract.parties) ? contract.parties.length : 0} Parties
                        </span>
                        {contract.milestones && (
                          <span className="flex items-center">
                            <File className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {contract.milestones.length} Milestones
                          </span>
                        )}
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractList;
