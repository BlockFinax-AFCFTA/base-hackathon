import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  Plus, 
  FileText, 
  Filter, 
  Search, 
  ArrowUpDown,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';
import { mockContracts, getStatusColor, getStatusText } from '@/data/mockContracts';
import { shortenAddress, formatDate } from '@/lib/utils';

const ContractsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter contracts based on the active tab and search query
  const filteredContracts = mockContracts.filter(contract => {
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'active' && ['ACTIVE', 'FUNDED', 'GOODSSHIPPED'].includes(contract.status)) ||
                       (activeTab === 'draft' && contract.status === 'DRAFT') ||
                       (activeTab === 'completed' && contract.status === 'COMPLETED');
                       
    const matchesSearch = searchQuery === '' || 
                         contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchQuery.toLowerCase());
                         
    return matchesTab && matchesSearch;
  });
  
  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    let variant: any = 'default';
    let icon = null;
    
    switch (status) {
      case 'DRAFT':
        variant = 'outline';
        icon = <Clock className="mr-1 h-3 w-3 text-muted-foreground" />;
        break;
      case 'PENDINGAPPROVAL':
      case 'AWAITINGFUNDS':
        variant = 'warning';
        icon = <Clock className="mr-1 h-3 w-3" />;
        break;
      case 'FUNDED':
      case 'ACTIVE':
      case 'GOODSSHIPPED':
        variant = 'info';
        icon = <CheckCircle className="mr-1 h-3 w-3" />;
        break;
      case 'COMPLETED':
        variant = 'success';
        icon = <CheckCircle className="mr-1 h-3 w-3" />;
        break;
      case 'DISPUTED':
      case 'CANCELLED':
        variant = 'destructive';
        icon = <AlertTriangle className="mr-1 h-3 w-3" />;
        break;
      default:
        variant = 'default';
    }
    
    return (
      <Badge variant={variant} className="flex items-center">
        {icon}
        {getStatusText(status)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Contract Management"
        subtitle="Manage your blockchain-based trade contracts"
      />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contracts..."
              className="h-10 w-full rounded-md border border-input bg-background pl-8 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New Contract
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredContracts.length > 0 ? (
          filteredContracts.map((contract) => (
            <Link key={contract.id} href={`/contracts/${contract.id}`}>
              <a className="block">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="truncate text-lg">{contract.title}</CardTitle>
                      {renderStatusBadge(contract.status)}
                    </div>
                    <CardDescription className="line-clamp-2">{contract.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Parties:</span>{' '}
                        <span>{contract.parties.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Value:</span>{' '}
                        <span>{contract.tradeTerms.value} {contract.tradeTerms.currency}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>{' '}
                        <span>{formatDate(contract.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Documents:</span>{' '}
                        <span>{contract.documents.length}</span>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex items-center gap-1 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Contract {contract.contractAddress ? `#${shortenAddress(contract.contractAddress, 4, 4)}` : 'ID: ' + contract.id}</span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div>
              <FileText className="mx-auto h-10 w-10 text-muted-foreground/60" />
              <h3 className="mt-2 text-lg font-medium">No contracts found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "No contracts match your search query. Try different keywords."
                  : "Get started by creating your first contract."}
              </p>
              {!searchQuery && (
                <Button className="mt-4 gap-1">
                  <Plus className="h-4 w-4" />
                  New Contract
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractsPage;