import React, { useState } from 'react';
import {
  Truck,
  Ship,
  Plane,
  Package,
  MapPin,
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BarChart,
  Star,
  Building,
  Globe,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';

import { mockLogistics, mockLogisticsProviders } from '@/data/mockLogistics';
import { formatDate } from '@/lib/utils';

const LogisticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trackings');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracking, setSelectedTracking] = useState<typeof mockLogistics[0] | null>(null);
  
  // Filter logistics based on active tab and search query
  const filteredTrackings = mockLogistics.filter(tracking => {
    const matchesSearch = 
      searchQuery === '' ||
      tracking.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tracking.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tracking.cargoType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tracking.trackingNumber && tracking.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesSearch;
  });
  
  // Helper to get transport icon based on cargo type
  const getTransportIcon = (cargoType: string) => {
    if (cargoType.toLowerCase().includes('air') || cargoType.toLowerCase().includes('express')) {
      return <Plane className="h-5 w-5" />;
    } else if (cargoType.toLowerCase().includes('sea') || cargoType.toLowerCase().includes('ocean')) {
      return <Ship className="h-5 w-5" />;
    } else {
      return <Truck className="h-5 w-5" />;
    }
  };
  
  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'DELIVERED':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Delivered
          </Badge>
        );
      case 'IN_TRANSIT':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Truck className="mr-1 h-3 w-3" />
            In Transit
          </Badge>
        );
      case 'CONFIRMED':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmed
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Logistics Management" 
        subtitle="Track and manage shipments with blockchain verification" 
      />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="trackings" className="flex items-center">
              <Truck className="mr-2 h-4 w-4" />
              Trackings
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search trackings..."
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
            New Logistics
          </Button>
        </div>
      </div>
      
      <TabsContent value="trackings" className="mt-0">
        {/* Tracking List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrackings.length > 0 ? (
            filteredTrackings.map((tracking) => (
              <Card 
                key={tracking.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTracking(tracking)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {getTransportIcon(tracking.cargoType)}
                    </div>
                    {getStatusBadge(tracking.status)}
                  </div>
                  <CardTitle className="mt-2 text-lg">Shipment #{tracking.id}</CardTitle>
                  <CardDescription>
                    {tracking.cargoType} • {tracking.weight}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="min-w-[100px] flex-none">
                      <div className="text-sm text-muted-foreground">Origin</div>
                      <div className="font-medium">{tracking.origin}</div>
                    </div>
                    <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground flex-none" />
                    <div>
                      <div className="text-sm text-muted-foreground">Destination</div>
                      <div className="font-medium">{tracking.destination}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Shipment Date</div>
                      <div className="font-medium">{formatDate(tracking.shipmentDate)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Est. Delivery</div>
                      <div className="font-medium">
                        {tracking.estimatedDelivery ? formatDate(tracking.estimatedDelivery) : 'TBD'}
                      </div>
                    </div>
                  </div>
                  
                  {tracking.trackingNumber && (
                    <>
                      <Separator className="my-3" />
                      <div className="text-sm">
                        <div className="text-muted-foreground">Tracking Number</div>
                        <div className="font-medium">{tracking.trackingNumber}</div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  {tracking.contractId ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/contracts/${tracking.contractId}`}>
                        <FileText className="mr-2 h-3 w-3" />
                        View Contract
                      </a>
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <Package className="mr-2 h-3 w-3" />
                    Track
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div>
                <Truck className="mx-auto h-10 w-10 text-muted-foreground/60" />
                <h3 className="mt-2 text-lg font-medium">No shipments found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery
                    ? "No shipments match your search query. Try different keywords."
                    : "Get started by creating your first logistics tracking."}
                </p>
                {!searchQuery && (
                  <Button className="mt-4 gap-1">
                    <Plus className="h-4 w-4" />
                    New Logistics
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="providers" className="mt-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockLogisticsProviders.map((provider) => (
            <Card key={provider.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building className="h-5 w-5" />
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">{provider.rating}</span>
                  </div>
                </div>
                <CardTitle className="mt-2 text-lg">{provider.name}</CardTitle>
                <CardDescription>
                  {provider.specialties.join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {provider.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                  <div>
                    <div className="text-muted-foreground">Base Price</div>
                    <div className="font-medium">{provider.basePrice} {provider.currency}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Est. Days</div>
                    <div className="font-medium">{provider.estimatedDays} days</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="outline" size="sm">
                  <Globe className="mr-2 h-3 w-3" />
                  Website
                </Button>
                <Button size="sm">
                  <Truck className="mr-2 h-3 w-3" />
                  Book Shipment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="calendar" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Logistics Calendar</CardTitle>
            <CardDescription>
              View your upcoming and past shipments on the calendar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center bg-muted rounded-md p-6">
              <div className="text-center">
                <Calendar className="h-10 w-10 mx-auto text-muted-foreground/60" />
                <h3 className="mt-2 text-lg font-medium">Calendar View</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  This feature would display a calendar with shipment dates in a real application.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Tracking Details Modal */}
      {selectedTracking && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-background w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                  {getTransportIcon(selectedTracking.cargoType)}
                </div>
                <h3 className="font-medium">Shipment #{selectedTracking.id}</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedTracking(null)}
              >
                &times;
              </Button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Tracking Details</h2>
                {getStatusBadge(selectedTracking.status)}
              </div>
              
              <div className="grid gap-6 md:grid-cols-3 mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Origin</div>
                  <div className="font-medium">{selectedTracking.origin}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Destination</div>
                  <div className="font-medium">{selectedTracking.destination}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Tracking Number</div>
                  <div className="font-medium">{selectedTracking.trackingNumber || 'Not assigned'}</div>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3 mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Cargo Type</div>
                  <div className="font-medium">{selectedTracking.cargoType}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Weight</div>
                  <div className="font-medium">{selectedTracking.weight}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Created On</div>
                  <div className="font-medium">{formatDate(selectedTracking.createdAt)}</div>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Shipment Date</div>
                  <div className="font-medium">{formatDate(selectedTracking.shipmentDate)}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Estimated Delivery</div>
                  <div className="font-medium">
                    {selectedTracking.estimatedDelivery 
                      ? formatDate(selectedTracking.estimatedDelivery) 
                      : 'Not estimated'}
                  </div>
                </div>
              </div>
              
              {selectedTracking.specialRequirements && (
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-1">Special Requirements</div>
                  <div className="rounded-md border p-3">
                    {selectedTracking.specialRequirements}
                  </div>
                </div>
              )}
              
              {/* Milestone Timeline */}
              {selectedTracking.milestones && (
                <div className="mb-6">
                  <div className="text-lg font-medium mb-3">Tracking Timeline</div>
                  <div className="relative">
                    <div className="absolute left-3.5 top-0 h-full w-px bg-muted-foreground/20"></div>
                    
                    {Object.entries(selectedTracking.milestones).map(([key, milestone]) => (
                      <div key={key} className="relative mb-4 ml-10 pl-6">
                        <div className={`absolute left-[-10px] top-1 flex h-7 w-7 items-center justify-center rounded-full 
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
              
              <div className="flex justify-between items-center">
                {selectedTracking.contractId ? (
                  <Button variant="outline" asChild>
                    <a href={`/contracts/${selectedTracking.contractId}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Contract
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    No Contract
                  </Button>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Package className="mr-2 h-4 w-4" />
                    Update Status
                  </Button>
                  
                  <Button>
                    <MapPin className="mr-2 h-4 w-4" />
                    Track on Map
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsPage;