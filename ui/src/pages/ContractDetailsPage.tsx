import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  CheckCircle2,
  Wallet,
  Package,
  Landmark,
  Users,
  FileText,
  ArrowLeft,
  TrendingUp,
  CalendarClock,
  Truck,
  Clock,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';

import { mockContracts, getStatusColor, getStatusText } from '@/data/mockContracts';
import { mockDocuments } from '@/data/mockDocuments';
import { mockLogistics } from '@/data/mockLogistics';
import { formatDate, shortenAddress } from '@/lib/utils';

interface ContractDetailsPageProps {
  contractId: string;
}

const ContractDetailsPage: React.FC<ContractDetailsPageProps> = ({ contractId }) => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get contract data from mock data
  const contract = mockContracts.find(c => c.id.toString() === contractId);
  const documents = mockDocuments.filter(d => d.contractId?.toString() === contractId);
  const logistics = mockLogistics.filter(l => l.contractId?.toString() === contractId);
  
  // If contract not found, redirect to contracts page
  useEffect(() => {
    if (!contract) {
      setLocation('/contracts');
    }
  }, [contract, setLocation]);

  if (!contract) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">Contract not found</h3>
          <p className="text-sm text-muted-foreground">
            The contract you're looking for does not exist.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setLocation('/contracts')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contracts
          </Button>
        </div>
      </div>
    );
  }

  // Helper function to check contract status
  const checkStatus = (statusToCheck: string | string[]) => {
    const statuses = Array.isArray(statusToCheck) ? statusToCheck : [statusToCheck];
    return statuses.some(s => contract.status.toLowerCase().includes(s.toLowerCase()));
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Contract Details" 
        subtitle="View and manage your contract details"
      />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/contracts">
              <a>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Contracts
              </a>
            </Link>
          </Button>
          
          <Badge className="ml-2">
            {getStatusText(contract.status)}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          {checkStatus('draft') && (
            <Button>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve Contract
            </Button>
          )}
          
          {checkStatus('pendingapproval') && (
            <Button>
              <Wallet className="mr-2 h-4 w-4" />
              Fund Escrow
            </Button>
          )}
          
          {checkStatus('goodsreceived') && (
            <Button>
              <Landmark className="mr-2 h-4 w-4" />
              Release Funds
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{contract.title}</CardTitle>
              <CardDescription>{contract.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="logistics">Logistics</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 text-lg font-medium">Contract Details</h3>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-2 gap-4 p-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Contract Type</div>
                            <div className="font-medium">International Trade</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Created On</div>
                            <div className="font-medium">{formatDate(contract.createdAt)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Status</div>
                            <div className="font-medium">{getStatusText(contract.status)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Value</div>
                            <div className="font-medium">{contract.tradeTerms.value} {contract.tradeTerms.currency}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Incoterm</div>
                            <div className="font-medium">{contract.tradeTerms.incoterm}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Payment Terms</div>
                            <div className="font-medium">{contract.tradeTerms.paymentTerms}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Delivery Deadline</div>
                            <div className="font-medium">{formatDate(contract.tradeTerms.deliveryDeadline)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Inspection Period</div>
                            <div className="font-medium">{contract.tradeTerms.inspectionPeriod} days</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 text-lg font-medium">Parties</h3>
                      <div className="space-y-3">
                        {contract.parties.map((party, index) => (
                          <div key={index} className="rounded-md border p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Users className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-medium">{party.name}</div>
                                <div className="text-sm text-muted-foreground">{party.role}</div>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
                              <div>
                                <span className="text-muted-foreground">Country:</span>{' '}
                                <span>{party.country}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Address:</span>{' '}
                                <span>{shortenAddress(party.address)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="mb-2 text-lg font-medium">Escrow Status</h3>
                    <div className="bg-muted/30 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-6">Escrow Lifecycle</h3>
                      <div className="relative">
                        <div className="absolute left-3.5 top-0 h-full w-px bg-muted-foreground/20"></div>
                        
                        {/* Contract Created */}
                        <div className="relative mb-6">
                          <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <div className="ml-10">
                            <div className="font-medium text-base">Contract Created</div>
                            <div className="text-muted-foreground text-sm mt-1">
                              {formatDate(contract.createdAt)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Parties Approved */}
                        <div className={`relative mb-6 ${
                          checkStatus(['pendingapproval', 'awaitingfunds', 'funded', 'active', 'goodsshipped', 'goodsreceived', 'completed'])
                          ? 'opacity-100' : 'opacity-60'
                        }`}>
                          <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
                            checkStatus(['pendingapproval', 'awaitingfunds', 'funded', 'active', 'goodsshipped', 'goodsreceived', 'completed'])
                            ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                          }`}>
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <div className="ml-10">
                            <div className="font-medium text-base">Parties Approved</div>
                            <div className="text-muted-foreground text-sm mt-1">
                              Contract terms approved by all participants
                            </div>
                          </div>
                        </div>
                        
                        {/* Escrow Funded */}
                        <div className={`relative mb-6 ${
                          checkStatus(['funded', 'active', 'goodsshipped', 'goodsreceived', 'completed'])
                          ? 'opacity-100' : 'opacity-60'
                        }`}>
                          <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
                            checkStatus(['funded', 'active', 'goodsshipped', 'goodsreceived', 'completed'])
                            ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                          }`}>
                            <Wallet className="h-4 w-4" />
                          </div>
                          <div className="ml-10">
                            <div className="font-medium text-base">Escrow Funded</div>
                            <div className="text-muted-foreground text-sm mt-1">
                              {contract.tradeTerms.value} {contract.tradeTerms.currency} locked in escrow
                            </div>
                          </div>
                        </div>
                        
                        {/* Goods Received */}
                        <div className={`relative mb-6 ${
                          checkStatus(['goodsreceived', 'completed'])
                          ? 'opacity-100' : 'opacity-60'
                        }`}>
                          <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
                            checkStatus(['goodsreceived', 'completed'])
                            ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                          }`}>
                            <Package className="h-4 w-4" />
                          </div>
                          <div className="ml-10">
                            <div className="font-medium text-base">Goods Received</div>
                            <div className="text-muted-foreground text-sm mt-1">
                              Buyer confirmed receipt of goods
                            </div>
                          </div>
                        </div>
                        
                        {/* Funds Released */}
                        <div className={`relative ${
                          checkStatus('completed')
                          ? 'opacity-100' : 'opacity-60'
                        }`}>
                          <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
                            checkStatus('completed')
                            ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                          }`}>
                            <Landmark className="h-4 w-4" />
                          </div>
                          <div className="ml-10">
                            <div className="font-medium text-base">Funds Released</div>
                            <div className="text-muted-foreground text-sm mt-1">
                              {checkStatus('completed') 
                                ? `Payment of ${contract.tradeTerms.value} ${contract.tradeTerms.currency} sent to seller` 
                                : "Awaiting confirmation to release funds"
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="mt-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-medium">Contract Documents</h3>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>
                  
                  {documents.length > 0 ? (
                    <div className="space-y-3">
                      {documents.map(doc => (
                        <div key={doc.id} className="rounded-md border p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-medium">{doc.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {doc.fileType.toUpperCase()} • {formatDate(doc.createdAt)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {doc.isVerified && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Verified
                                </Badge>
                              )}
                              <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <div>
                        <FileText className="mx-auto h-10 w-10 text-muted-foreground/60" />
                        <h3 className="mt-2 text-lg font-medium">No documents yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Upload documents to this contract to get started.
                        </p>
                        <Button className="mt-4">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="logistics" className="mt-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-medium">Logistics Tracking</h3>
                    <Button>
                      <Truck className="mr-2 h-4 w-4" />
                      Add Logistics
                    </Button>
                  </div>
                  
                  {logistics.length > 0 ? (
                    <div className="space-y-6">
                      {logistics.map(item => (
                        <Card key={item.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">Shipment #{item.id}</CardTitle>
                              <Badge>{item.status}</Badge>
                            </div>
                            <CardDescription>
                              {item.origin} to {item.destination} • {item.cargoType}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-3">
                              <div>
                                <div className="text-sm text-muted-foreground">Tracking Number</div>
                                <div className="font-medium">
                                  {item.trackingNumber || 'Not assigned'}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Shipment Date</div>
                                <div className="font-medium">{formatDate(item.shipmentDate)}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Est. Delivery</div>
                                <div className="font-medium">
                                  {item.estimatedDelivery 
                                    ? formatDate(item.estimatedDelivery)
                                    : 'Not estimated'}
                                </div>
                              </div>
                            </div>
                            
                            {item.milestones && (
                              <div className="mt-4">
                                <div className="text-sm font-medium mb-2">Tracking Timeline</div>
                                <div className="relative">
                                  <div className="absolute left-3.5 top-0 h-full w-px bg-muted-foreground/20"></div>
                                  
                                  {Object.entries(item.milestones).map(([key, milestone], index) => (
                                    <div key={key} className="relative mb-4 pl-10">
                                      <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full 
                                        ${milestone.status === 'COMPLETED' 
                                          ? 'bg-primary text-primary-foreground' 
                                          : milestone.status === 'IN_PROGRESS'
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-muted-foreground/20 text-muted-foreground'
                                        }`}>
                                        <Clock className="h-4 w-4" />
                                      </div>
                                      <div className="font-medium">{milestone.name}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {milestone.timestamp ? formatDate(milestone.timestamp) : 'Pending'}
                                        {milestone.location && ` • ${milestone.location}`}
                                      </div>
                                      {milestone.notes && (
                                        <div className="mt-1 text-sm">{milestone.notes}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <div>
                        <Truck className="mx-auto h-10 w-10 text-muted-foreground/60" />
                        <h3 className="mt-2 text-lg font-medium">No logistics data yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Add logistics tracking to monitor your shipment.
                        </p>
                        <Button className="mt-4">
                          <Truck className="mr-2 h-4 w-4" />
                          Add Logistics
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="history" className="mt-6">
                  <h3 className="mb-2 text-lg font-medium">Contract History</h3>
                  <div className="relative">
                    <div className="absolute left-3.5 top-0 h-full w-px bg-muted-foreground/20"></div>
                    
                    <div className="relative pl-10 pb-8">
                      <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="font-medium">Contract Created</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(contract.createdAt)} by {contract.createdBy}
                      </div>
                    </div>
                    
                    {checkStatus(['pendingapproval', 'awaitingfunds', 'funded', 'active', 'goodsshipped', 'goodsreceived', 'completed']) && (
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="font-medium">Contract Approved</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(new Date(new Date(contract.createdAt).getTime() + 86400000))} by Buyer
                        </div>
                      </div>
                    )}
                    
                    {checkStatus(['funded', 'active', 'goodsshipped', 'goodsreceived', 'completed']) && (
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Wallet className="h-4 w-4" />
                        </div>
                        <div className="font-medium">Escrow Funded</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(new Date(new Date(contract.createdAt).getTime() + 172800000))} by Buyer
                        </div>
                        <div className="text-sm">
                          {contract.tradeTerms.value} {contract.tradeTerms.currency} deposited into escrow wallet
                        </div>
                      </div>
                    )}
                    
                    {checkStatus(['goodsshipped', 'goodsreceived', 'completed']) && (
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Truck className="h-4 w-4" />
                        </div>
                        <div className="font-medium">Goods Shipped</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(new Date(new Date(contract.createdAt).getTime() + 259200000))} by Seller
                        </div>
                        <div className="text-sm">
                          Shipping documents uploaded and tracking number provided
                        </div>
                      </div>
                    )}
                    
                    {checkStatus(['goodsreceived', 'completed']) && (
                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Package className="h-4 w-4" />
                        </div>
                        <div className="font-medium">Goods Received</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(new Date(new Date(contract.createdAt).getTime() + 604800000))} by Buyer
                        </div>
                        <div className="text-sm">
                          Buyer confirmed successful delivery of goods
                        </div>
                      </div>
                    )}
                    
                    {checkStatus('completed') && (
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Landmark className="h-4 w-4" />
                        </div>
                        <div className="font-medium">Funds Released</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(new Date(new Date(contract.createdAt).getTime() + 691200000))} by Escrow Smart Contract
                        </div>
                        <div className="text-sm">
                          {contract.tradeTerms.value} {contract.tradeTerms.currency} released to Seller
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {/* Contract Action Card */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contract Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {checkStatus('draft') && (
                <Button className="w-full justify-start">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve Contract
                </Button>
              )}
              
              {checkStatus('pendingapproval') && (
                <Button className="w-full justify-start">
                  <Wallet className="mr-2 h-4 w-4" />
                  Fund Escrow
                </Button>
              )}
              
              {checkStatus(['funded', 'active']) && (
                <Button className="w-full justify-start">
                  <Truck className="mr-2 h-4 w-4" />
                  Update Shipping
                </Button>
              )}
              
              {checkStatus('goodsshipped') && (
                <Button className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Confirm Receipt
                </Button>
              )}
              
              {checkStatus('goodsreceived') && (
                <Button className="w-full justify-start">
                  <Landmark className="mr-2 h-4 w-4" />
                  Release Funds
                </Button>
              )}
              
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View Contract Document
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
          
          {/* Contract Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contract Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Contract Value</div>
                  <div className="text-xl font-bold">{contract.tradeTerms.value} {contract.tradeTerms.currency}</div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="text-sm text-muted-foreground">Parties</div>
                  <div className="mt-1 space-y-1">
                    {contract.parties.map((party, index) => (
                      <div key={index} className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{party.name} ({party.role})</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="text-sm text-muted-foreground">Incoterm</div>
                  <div className="font-medium">{contract.tradeTerms.incoterm}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Payment Terms</div>
                  <div className="font-medium">{contract.tradeTerms.paymentTerms}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Delivery Deadline</div>
                  <div className="font-medium">{formatDate(contract.tradeTerms.deliveryDeadline)}</div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="text-sm text-muted-foreground">Contract Address</div>
                  <div className="font-mono text-sm">
                    {contract.contractAddress ? shortenAddress(contract.contractAddress) : 'Not deployed'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailsPage;