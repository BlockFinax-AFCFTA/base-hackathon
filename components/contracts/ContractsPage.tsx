import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, Filter, SortDesc } from 'lucide-react';

/**
 * ContractsPage component
 * Demonstrates how to use namespaced translations
 */
const ContractsPage: React.FC = () => {
  // Use the 'contracts' namespace for translations specifically for this page
  const { t } = useLocalization('contracts');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock contracts data - in real implementation, this would come from an API
  const contracts = [
    /* This would be fetched from an API in a real implementation */
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-200 text-gray-800';
      case 'awaitingFunds': return 'bg-yellow-200 text-yellow-800';
      case 'funded': return 'bg-blue-200 text-blue-800';
      case 'goodsShipped': return 'bg-purple-200 text-purple-800';
      case 'goodsReceived': return 'bg-green-200 text-green-800';
      case 'completed': return 'bg-green-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">{t('contracts.title')}</h1>
          <p className="text-gray-600">{t('contracts.subtitle')}</p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>{t('contracts.create')}</span>
        </Button>
      </div>
      
      {/* Help and guide section */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="mb-4">
            <p className="text-blue-800 mb-2">{t('contracts.description')}</p>
          </div>
          <details className="cursor-pointer">
            <summary className="font-medium text-blue-700 mb-2">{t('contracts.guide.title')}</summary>
            <div className="pl-4 pt-2 text-sm text-blue-800 space-y-1">
              <p>{t('contracts.guide.step1')}</p>
              <p>{t('contracts.guide.step2')}</p>
              <p>{t('contracts.guide.step3')}</p>
              <p>{t('contracts.guide.step4')}</p>
              <p>{t('contracts.guide.step5')}</p>
              <p>{t('contracts.guide.step6')}</p>
            </div>
          </details>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 md:flex-row mb-6">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder={t('contracts.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>{t('contracts.filter')}</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <SortDesc className="h-4 w-4" />
            <span>{t('contracts.sortBy')}</span>
          </Button>
        </div>
      </div>

      {contracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <Card key={contract.id} className="border rounded-lg hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{contract.title}</CardTitle>
                  <Badge className={getStatusColor(contract.status)}>
                    {t(`contracts.status.${contract.status}`)}
                  </Badge>
                </div>
                <CardDescription>
                  {`ID: ${contract.id} • ${new Date(contract.date).toLocaleDateString()}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">{t('contracts.columns.buyer')}</p>
                    <p>{contract.buyer}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t('contracts.columns.seller')}</p>
                    <p>{contract.seller}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">{t('contracts.columns.value')}</p>
                    <p className="font-semibold">{contract.currency} {contract.value}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between">
                <Button variant="outline" size="sm">{t('contracts.view')}</Button>
                <Button variant="outline" size="sm">{t('contracts.edit')}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-lg font-medium mb-2">{t('contracts.noContracts')}</p>
            <p className="text-gray-500 mb-6">{t('contracts.createNew')}</p>
            <Button className="mx-auto flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>{t('contracts.create')}</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractsPage;