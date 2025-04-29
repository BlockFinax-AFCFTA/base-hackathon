import React, { useState } from 'react';
import DashboardStats from './DashboardStats';
import RecentTransactions from './RecentTransactions';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'wouter';
import { useWeb3 } from '../../hooks/useWeb3';
import { Plus, Upload, Check, LineChart, AlertTriangle, ArrowRight } from 'lucide-react';
import { useContracts } from '../../hooks/useContracts';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "../ui/tabs";
import RiskDashboard from '../risk/RiskDashboard';
import RegulatoryAIWidget from './RegulatoryAIWidget';

const ContractStatusOverview = () => {
  const { contracts, isLoadingContracts } = useContracts();
  
  const countByStatus = {
    DRAFT: 0,
    AWAITING_FUNDS: 0,
    ACTIVE: 0, // Combine FUNDED and GOODS_SHIPPED
    COMPLETED: 0
  };
  
  if (contracts && Array.isArray(contracts) && !isLoadingContracts) {
    contracts.forEach((contract: any) => {
      if (contract.status === 'DRAFT') {
        countByStatus.DRAFT += 1;
      } else if (contract.status === 'AWAITING_FUNDS') {
        countByStatus.AWAITING_FUNDS += 1;
      } else if (['FUNDED', 'GOODS_SHIPPED', 'GOODS_RECEIVED'].includes(contract.status)) {
        countByStatus.ACTIVE += 1;
      } else if (contract.status === 'COMPLETED') {
        countByStatus.COMPLETED += 1;
      }
    });
  }
  
  return (
    <div className="mt-8">
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 shadow-md">
        <CardHeader className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-primary">Contract Portfolio Status</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Asset distribution by contract status</p>
        </CardHeader>
        <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div>
                  <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                    <div className="px-4 py-5 bg-white shadow-md rounded-lg overflow-hidden sm:p-6 border-l-4 border-l-slate-500">
                      <dt className="text-sm font-medium text-gray-500 truncate">Draft</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {isLoadingContracts ? '...' : countByStatus.DRAFT}
                      </dd>
                      <div className="mt-1 text-sm text-gray-500">Pending finalization</div>
                    </div>
                    <div className="px-4 py-5 bg-white shadow-md rounded-lg overflow-hidden sm:p-6 border-l-4 border-l-amber-500">
                      <dt className="text-sm font-medium text-gray-500 truncate">Escrow Required</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {isLoadingContracts ? '...' : countByStatus.AWAITING_FUNDS}
                      </dd>
                      <div className="mt-1 text-sm text-gray-500">Awaiting deposit</div>
                    </div>
                    <div className="px-4 py-5 bg-white shadow-md rounded-lg overflow-hidden sm:p-6 border-l-4 border-l-primary">
                      <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                      <dd className="mt-1 text-3xl font-semibold text-primary">
                        {isLoadingContracts ? '...' : countByStatus.ACTIVE}
                      </dd>
                      <div className="mt-1 text-sm text-gray-500">In-transit assets</div>
                    </div>
                    <div className="px-4 py-5 bg-white shadow-md rounded-lg overflow-hidden sm:p-6 border-l-4 border-l-green-600">
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                      <dd className="mt-1 text-3xl font-semibold text-green-600">
                        {isLoadingContracts ? '...' : countByStatus.COMPLETED}
                      </dd>
                      <div className="mt-1 text-sm text-gray-500">Settled transactions</div>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const QuickActions = () => {
  return (
    <div className="mt-8">
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 shadow-md">
        <CardHeader className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-primary">Financial Actions</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Execute trade operations</p>
        </CardHeader>
        <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/contracts/new">
              <div className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-md flex items-center space-x-3 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary flex items-center justify-center">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">New Trade Contract</p>
                  <p className="text-sm text-gray-500">Initiate escrow transaction</p>
                </div>
              </div>
            </Link>
            
            <Link href="/documents/upload">
              <div className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-md flex items-center space-x-3 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-slate-800 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Secure Documents</p>
                  <p className="text-sm text-gray-500">Upload verification files</p>
                </div>
              </div>
            </Link>
            
            <Link href="/contracts">
              <div className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-md flex items-center space-x-3 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-green-600 flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Release Payment</p>
                  <p className="text-sm text-gray-500">Confirm & settle transaction</p>
                </div>
              </div>
            </Link>
            
            <Link href="/risk-dashboard">
              <div className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-md flex items-center space-x-3 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-600 flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Risk Assessment</p>
                  <p className="text-sm text-gray-500">View predictive insights</p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RiskSummary = () => {
  return (
    <div className="mt-8">
      <Card className="border border-amber-200 bg-amber-50/50 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start">
              <div className="p-2 bg-amber-100 rounded-full mr-3 mt-1">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Trade Risk Assessment</h3>
                <p className="text-gray-600 mt-1">
                  AI-powered risk analysis has identified 3 potential issues in your trade portfolio that require attention.
                  These include geopolitical factors, payment reliability concerns, and shipping logistics vulnerabilities.
                </p>
              </div>
            </div>
            <Link href="/risk-dashboard">
              <Button className="whitespace-nowrap">
                View Risk Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const { isLoggedIn } = useWeb3();
  const { contracts } = useContracts();
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="overview">Financial Dashboard</TabsTrigger>
            <TabsTrigger value="risk">Risk Intelligence</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory AI</TabsTrigger>
            <TabsTrigger value="translation">Translation Demo</TabsTrigger>
            <TabsTrigger value="logistics">Logistics</TabsTrigger>
          </TabsList>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <TabsContent value="overview" className="space-y-6 mt-0">
          <DashboardStats />
          <RecentTransactions />
          <RiskSummary />
          <ContractStatusOverview />
          <QuickActions />
        </TabsContent>
        
        <TabsContent value="risk" className="mt-0">
          <RiskDashboard />
        </TabsContent>
        
        <TabsContent value="regulatory" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <RegulatoryAIWidget />
            
            <Card className="md:col-span-8 xl:col-span-8">
              <CardHeader className="pb-2">
                <CardTitle>About Export Regulatory Assistant</CardTitle>
                <CardDescription>
                  AI-powered guidance for navigating international trade regulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Our Export Regulatory Assistant helps traders navigate the complex landscape of international export regulations 
                    by providing guidance tailored to specific products and destinations.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Required Documentation</h4>
                        <p className="text-sm text-muted-foreground">
                          Understand what paperwork is needed for your export
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Tariffs & Duties</h4>
                        <p className="text-sm text-muted-foreground">
                          Get insights on applicable tariffs for your goods
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Compliance Requirements</h4>
                        <p className="text-sm text-muted-foreground">
                          Learn about relevant regulations and standards
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Restrictions & Prohibitions</h4>
                        <p className="text-sm text-muted-foreground">
                          Identify potential import restrictions at destination
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Link href="/regulatory-ai">
                      <Button>
                        Access Full Regulatory AI Assistant
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="translation" className="mt-0">
          <div className="space-y-4">
            <Card className="bg-white shadow-md">
              <CardHeader className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-primary">Translation Demo</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Test our AI-powered translation system</p>
              </CardHeader>
              <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="p-6 bg-blue-50 rounded-lg text-center">
                  <h3 className="text-lg font-medium mb-2">AI-Powered Translation System</h3>
                  <p className="mb-4">Switch languages using the language selector in the top-right corner of the page</p>
                  <div className="flex justify-center">
                    <Button variant="outline" className="mx-1">English</Button>
                    <Button variant="outline" className="mx-1">Español</Button>
                    <Button variant="outline" className="mx-1">中文</Button>
                    <Button variant="outline" className="mx-1">Français</Button>
                    <Button variant="outline" className="mx-1">العربية</Button>
                    <Button variant="outline" className="mx-1">Русский</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="logistics" className="mt-0">
          <div className="space-y-4">
            <Card className="bg-white shadow-md">
              <CardHeader className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-primary">Logistics Management</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Track shipments and manage logistics</p>
              </CardHeader>
              <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="p-6 bg-blue-50 rounded-lg text-center">
                  <h3 className="text-lg font-medium mb-2">Logistics Dashboard</h3>
                  <p className="mb-4">View the full logistics dashboard by clicking the button below or selecting "Documents & Logistics" from the sidebar</p>
                  <div className="flex justify-center">
                    <Link href="/documents">
                      <Button>Go to Documents & Logistics</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
