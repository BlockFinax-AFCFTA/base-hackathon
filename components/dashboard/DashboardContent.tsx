import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Plus, Globe, Activity, ShieldCheck, Languages } from 'lucide-react';
import { TranslationDemo } from '../ui/TranslationDemo';
import { useLanguage } from '../../context/LanguageContext';

const DashboardContent = () => {
  const formatDate = () => {
    const date = new Date();
    const formattedDate = `Apr ${date.getDate()}, ${date.getFullYear()}, ${(date.getHours() % 12 || 12).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
    return formattedDate;
  };

  const { translate } = useLanguage();
  
  return (
    <div className="max-w-screen-xl mx-auto">
      <Tabs defaultValue="financial">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="financial">{translate('dashboard.financial')}</TabsTrigger>
            <TabsTrigger value="risk">{translate('dashboard.risk')}</TabsTrigger>
            <TabsTrigger value="translation">{translate('dashboard.translation')}</TabsTrigger>
          </TabsList>
          <div className="text-sm text-gray-500">
            {translate('dashboard.lastUpdated')} {formatDate()}
          </div>
        </div>

        <TabsContent value="financial" className="space-y-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Trade Volume */}
            <Card className="bg-blue-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{translate('dashboard.totalTradeVolume')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">0.00 USD</p>
                    <p className="text-sm mt-1 flex items-center">
                      <Activity className="h-4 w-4 mr-1" />
                      {translate('dashboard.globalTradeActivity')}
                    </p>
                  </div>
                  <div className="bg-blue-600 rounded-full p-3">
                    <Globe className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Trade Deals */}
            <Card className="bg-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{translate('dashboard.activeTradeDeals')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm mt-1">{translate('dashboard.currentTransactions')}</p>
                  </div>
                  <div className="bg-green-500 rounded-full p-3">
                    <Activity className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secured Transactions */}
            <Card className="bg-blue-500 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{translate('dashboard.securedTransactions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-sm mt-1">{translate('dashboard.smartContractProtected')}</p>
                  </div>
                  <div className="bg-blue-400 rounded-full p-3">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Ledger */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">{translate('dashboard.transactionLedger')}</CardTitle>
                <Button size="sm" className="bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" />
                  {translate('dashboard.newTransaction')}
                </Button>
              </div>
              <p className="text-sm text-gray-500">{translate('dashboard.recentEscrow')}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-gray-500">{translate('dashboard.noTransactions')}</p>
                <p className="text-sm text-gray-400 mt-1">{translate('dashboard.transactionHistory')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-gray-500">{translate('dashboard.riskAssessmentComing')}</p>
                <p className="text-sm text-gray-400 mt-1">{translate('dashboard.analyzeRisk')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="translation">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-medium">{translate('dashboard.aiTranslation')}</CardTitle>
                </div>
                <p className="text-sm text-gray-500">
                  {translate('dashboard.aiTranslationDesc')}
                </p>
              </CardHeader>
              <CardContent>
                <TranslationDemo />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;