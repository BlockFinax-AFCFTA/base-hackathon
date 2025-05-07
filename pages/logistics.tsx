'use client'

import React, { useState } from 'react';
import Head from 'next/head'
import { BlockchainSidebar } from '../components/layout/BlockchainSidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Truck, Plus, Calendar, Package, FileSearch } from 'lucide-react';
import LogisticsTracking from '../components/logistics/LogisticsTracking';
import LogisticsProviders from '../components/logistics/LogisticsProviders';
import LogisticsForm from '../components/logistics/LogisticsForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLogistics, Logistics } from '../hooks/useLogistics';

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState<string>('trackings');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [selectedLogistics, setSelectedLogistics] = useState<Logistics | null>(null);
  const [selectedLogisticsId, setSelectedLogisticsId] = useState<number | undefined>(undefined);
  
  const { 
    userLogistics, 
    isLoadingUserLogistics, 
    refetchUserLogistics 
  } = useLogistics(undefined, undefined, 1); // Assuming user ID 1 for demo
  
  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    refetchUserLogistics();
  };
  
  return (
    <>
      <Head>
        <title>Logistics | Base Network Finance</title>
      </Head>
      
      <div className="flex min-h-screen">
        <div className="hidden md:flex w-64 flex-col border-r bg-background z-30">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <div className="font-semibold">Base Network Finance</div>
          </div>
          <BlockchainSidebar className="flex-1" />
        </div>
        
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 lg:gap-6 lg:px-6">
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Logistics Management</h1>
                <p className="text-sm text-muted-foreground">
                  Track and manage shipments with blockchain verification
                </p>
              </div>
              <Button onClick={() => setIsCreateOpen(true)} className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                New Logistics
              </Button>
            </div>
          </header>
          
          <main className="p-4 lg:p-6">
            <Tabs defaultValue="trackings" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="trackings" className="flex items-center">
                  <Truck className="mr-2 h-4 w-4" />
                  Trackings
                </TabsTrigger>
                <TabsTrigger value="providers" className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Providers
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center">
                  <FileSearch className="mr-2 h-4 w-4" />
                  Documents
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="trackings" className="space-y-4">
                {isLoadingUserLogistics ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Logistics Trackings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center items-center py-8">
                        <div className="text-center">
                          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
                          <p className="mt-4 text-muted-foreground">Loading your logistics...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : userLogistics && userLogistics.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {userLogistics.map((logistics) => (
                      <div 
                        key={logistics.id} 
                        onClick={() => setSelectedLogisticsId(logistics.id)}
                        className="cursor-pointer"
                      >
                        <LogisticsTracking logisticsId={logistics.id} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Logistics Trackings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center py-12">
                        <Truck className="h-16 w-16 text-muted-foreground opacity-30 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Logistics Found</h3>
                        <p className="text-sm text-center text-muted-foreground max-w-md mb-6">
                          You don't have any logistics records yet. Create a new logistics record to track your shipments with blockchain verification.
                        </p>
                        <Button onClick={() => setIsCreateOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Logistics
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="providers">
                <LogisticsProviders />
              </TabsContent>
              
              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <CardTitle>Logistics Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">Logistics calendar view coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Logistics Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">Documents view will display shipping manifests, bills of lading, and customs clearance documents</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      
      {/* Create Logistics Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" />
              Create New Logistics
            </DialogTitle>
          </DialogHeader>
          <LogisticsForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* View Logistics Dialog */}
      <Dialog open={!!selectedLogisticsId} onOpenChange={(open) => !open && setSelectedLogisticsId(undefined)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" />
              Logistics Details
            </DialogTitle>
          </DialogHeader>
          {selectedLogisticsId && (
            <LogisticsForm 
              logisticsId={selectedLogisticsId} 
              onSuccess={() => {
                setSelectedLogisticsId(undefined);
                refetchUserLogistics();
              }}
              onCancel={() => setSelectedLogisticsId(undefined)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}