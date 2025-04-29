import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Loader2, Search, Truck, MapPin, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Logistics, LogisticsProvider, LOGISTICS_STATUS, LOGISTICS_TYPE } from '../../shared/schema';
import { Web3Context } from '../../context/Web3Context';
import { useContext } from 'react';
import { apiRequest } from '../../lib/queryClient';
import { format } from 'date-fns';

// Define milestone type for improved readability
interface Milestone {
  type: string;
  date: string;
  details: string;
}

// Define a fully typed interface that includes all properties from the API
interface ExtendedLogistics {
  id: number;
  userId: number;
  contractId: number | null;
  type: string;
  status: string;
  origin: string;
  destination: string;
  shipmentDate: Date;
  estimatedDelivery: Date | null;
  cargoType: string;
  weight: string;
  specialRequirements: string | null;
  providerId: number | null;
  trackingNumber: string | null;
  milestones: Milestone[] | null;
  createdAt: Date;
  updatedAt: Date;
  // Additional properties from API
  trackingId?: string;
  provider?: string;
}

const LogisticsPage: React.FC = () => {
  const { user } = useContext(Web3Context);
  const userId = user?.id;
  
  // State for booking form
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [shipmentDate, setShipmentDate] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [weight, setWeight] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [trackingId, setTrackingId] = useState('');
  const [showingOffers, setShowingOffers] = useState(false);
  const [filteredOffers, setFilteredOffers] = useState<LogisticsProvider[]>([]);
  
  // Fetch logistics data
  const { 
    data: logisticsData,
    isLoading: isLogisticsLoading,
    refetch: refetchLogistics
  } = useQuery<ExtendedLogistics[]>({
    queryKey: ['/api/logistics', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await fetch(`/api/logistics?userId=${userId}`);
      return res.json();
    },
    enabled: !!userId
  });
  
  // Fetch logistics providers
  const {
    data: providers,
    isLoading: isProvidersLoading
  } = useQuery<LogisticsProvider[]>({
    queryKey: ['/api/logistics-providers'],
    queryFn: async () => {
      const res = await fetch('/api/logistics-providers');
      return res.json();
    }
  });
  
  // Handle booking submission
  const handleBookLogistics = async () => {
    if (!userId || !selectedProviderId) return;
    
    try {
      const provider = providers?.find(p => p.id === selectedProviderId);
      if (!provider) return;
      
      const shipmentDateObj = new Date(shipmentDate);
      const estimatedDeliveryDate = new Date(shipmentDateObj);
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + provider.estimatedDays);
      
      const bookingData = {
        userId,
        type: LOGISTICS_TYPE.BOOKING,
        status: LOGISTICS_STATUS.PENDING,
        origin,
        destination,
        shipmentDate: shipmentDateObj.toISOString(),
        estimatedDelivery: estimatedDeliveryDate.toISOString(),
        cargoType,
        weight,
        specialRequirements,
        provider: provider.name,
        trackingId: `BFX-${Date.now().toString().slice(-8)}`,
        contractId: null,
        milestones: [
          {
            type: 'BOOKING_CONFIRMED',
            date: new Date().toISOString(),
            details: 'Booking confirmed with ' + provider.name
          }
        ]
      };
      
      await apiRequest('POST', '/api/logistics', bookingData);
      
      // Reset form
      setOrigin('');
      setDestination('');
      setShipmentDate('');
      setCargoType('');
      setWeight('');
      setSpecialRequirements('');
      setSelectedProviderId(null);
      
      // Refresh data
      refetchLogistics();
      
    } catch (error) {
      console.error('Failed to book logistics:', error);
    }
  };
  
  // Handle tracking search
  const handleTrackSearch = () => {
    // Filter logistics data by tracking ID
    // This is client-side filtering, as we already have the data
  };
  
  // Search and filter available offers
  const searchOffers = () => {
    console.log("Searching offers...");
    
    // If there are no providers in database yet, create mock providers for demo
    if (!providers || providers.length === 0) {
      const mockProviders: LogisticsProvider[] = [
        {
          id: 1,
          name: "FastShip Global",
          logo: "",
          rating: "4.8",
          specialties: ["General", "Oversized"],
          description: "Leading global logistics provider with extensive network",
          basePrice: "1250",
          currency: "USD",
          estimatedDays: 7,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: "CoolFreight",
          logo: "",
          rating: "4.5",
          specialties: ["Refrigerated", "General"],
          description: "Specialized in temperature-controlled shipping worldwide",
          basePrice: "1400",
          currency: "USD",
          estimatedDays: 8,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          name: "CargoSafe Express",
          logo: "",
          rating: "4.7",
          specialties: ["General", "Hazardous"],
          description: "Secure and efficient shipping for all cargo types",
          basePrice: "1150",
          currency: "USD",
          estimatedDays: 6,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      setFilteredOffers(mockProviders);
      setShowingOffers(true);
      console.log("Using demo providers:", mockProviders);
      return;
    }
    
    // Apply filtering based on cargo type and other criteria
    const filtered = providers.filter(provider => {
      // Check if this provider can handle the selected cargo type
      if (provider.specialties && Array.isArray(provider.specialties)) {
        // If the provider has cargo specialties defined, ensure they can handle this type
        if (provider.specialties.length > 0 && 
            !provider.specialties.some(s => s.includes(cargoType))) {
          return false;
        }
      }
      
      // Add more filtering criteria here as needed
      return true;
    });
    
    // Sort by price, estimated days, or rating
    // By default, sort by estimated delivery time
    const sorted = [...filtered].sort((a, b) => a.estimatedDays - b.estimatedDays);
    
    console.log("Filtered providers:", sorted);
    
    // Update state
    setFilteredOffers(sorted);
    setShowingOffers(true);
  };
  
  // Reset search form
  const resetSearch = () => {
    setShowingOffers(false);
    setFilteredOffers([]);
  };
  
  const filteredLogistics = trackingId 
    ? logisticsData?.filter(item => 
        item.trackingId?.toLowerCase().includes(trackingId.toLowerCase())
      )
    : logisticsData;
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Logistics Management</h1>
      <p className="text-gray-600 mb-6">
        Book and track shipments across your supply chain with our logistics network.
      </p>
      
      <Tabs defaultValue="track" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="track">Track Shipments</TabsTrigger>
          <TabsTrigger value="book">Find & Book</TabsTrigger>
          <TabsTrigger value="providers">Logistics Providers</TabsTrigger>
        </TabsList>
        
        {/* Track Shipments Tab */}
        <TabsContent value="track">
          <Card>
            <CardHeader>
              <CardTitle>Track Your Shipments</CardTitle>
              <CardDescription>
                Enter a tracking ID to get real-time updates on your shipment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Input 
                  placeholder="Enter tracking ID" 
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleTrackSearch}>
                  <Search className="mr-2 h-4 w-4" /> Track
                </Button>
              </div>
              
              {isLogisticsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLogistics && filteredLogistics.length > 0 ? (
                    filteredLogistics.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="bg-blue-50 p-4 flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Tracking ID: {item.trackingId}</p>
                              <p className="text-sm text-gray-500">{item.provider}</p>
                            </div>
                            <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.status}
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex items-center mb-4">
                              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                              <div className="flex-1 flex items-center">
                                <span className="font-medium">{item.origin}</span>
                                <ArrowRight className="mx-2 h-4 w-4 text-gray-400" />
                                <span className="font-medium">{item.destination}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Shipment Date</p>
                                <p>{format(new Date(item.shipmentDate), 'MMM dd, yyyy')}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Estimated Delivery</p>
                                <p>{format(new Date(item.estimatedDelivery || Date.now()), 'MMM dd, yyyy')}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Cargo Type</p>
                                <p>{item.cargoType}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Weight</p>
                                <p>{item.weight}</p>
                              </div>
                            </div>
                            
                            {item.milestones && Array.isArray(item.milestones) && (
                              <div className="mt-4">
                                <h4 className="font-medium mb-2">Shipment Status</h4>
                                <div className="space-y-2">
                                  {item.milestones.map((milestone, idx) => (
                                    <div key={idx} className="flex items-start">
                                      <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 mr-2"></div>
                                      <div>
                                        <p className="font-medium">{milestone.type}</p>
                                        <p className="text-sm text-gray-500">
                                          {format(new Date(milestone.date), 'MMM dd, yyyy')} - {milestone.details}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900">No shipments found</h3>
                      <p className="text-gray-500 mt-1">
                        {trackingId ? "We couldn't find that tracking ID. Please check and try again." : "You don't have any active shipments."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Find & Book Tab */}
        <TabsContent value="book">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Book Shipping Services</CardTitle>
                <CardDescription>
                  Fill out the form to book a logistics provider for your shipment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Origin</Label>
                      <Input
                        id="origin"
                        placeholder="City, Country"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        placeholder="City, Country"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipmentDate">Shipment Date</Label>
                    <Input
                      id="shipmentDate"
                      type="date"
                      value={shipmentDate}
                      onChange={(e) => setShipmentDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cargoType">Cargo Type</Label>
                    <Select
                      onValueChange={setCargoType}
                      value={cargoType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cargo type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General Cargo</SelectItem>
                        <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                        <SelectItem value="Liquid">Liquid Bulk</SelectItem>
                        <SelectItem value="Dry Bulk">Dry Bulk</SelectItem>
                        <SelectItem value="Hazardous">Hazardous Materials</SelectItem>
                        <SelectItem value="Oversized">Oversized Cargo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      placeholder="Enter weight in kg"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Input
                      id="specialRequirements"
                      placeholder="Any special requirements"
                      value={specialRequirements}
                      onChange={(e) => setSpecialRequirements(e.target.value)}
                    />
                  </div>
                  
                  {!showingOffers ? (
                    <Button 
                      className="w-full mt-4" 
                      onClick={searchOffers}
                      disabled={
                        !origin || !destination || !shipmentDate || !cargoType || 
                        !weight || isProvidersLoading
                      }
                    >
                      Find Available Offers
                    </Button>
                  ) : (
                    <div className="space-y-4 mt-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Available Offers</h3>
                        <Button variant="ghost" size="sm" onClick={resetSearch}>
                          Back to Search
                        </Button>
                      </div>
                      
                      {filteredOffers.length === 0 ? (
                        <div className="text-center py-4">
                          <p>No matching providers found for your shipment requirements.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredOffers.map((provider) => (
                            <div 
                              key={provider.id} 
                              className={`p-3 border rounded-md ${
                                selectedProviderId === provider.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
                              } cursor-pointer transition-colors`}
                              onClick={() => setSelectedProviderId(provider.id)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <img 
                                      src={provider.logo}
                                      alt={provider.name}
                                      className="h-5 w-5 object-contain"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=' + provider.name.charAt(0);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{provider.name}</h4>
                                    <div className="flex text-xs text-yellow-500">
                                      {'★'.repeat(Math.floor(Number(provider.rating)))}
                                      {'☆'.repeat(5 - Math.floor(Number(provider.rating)))}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">{provider.basePrice} {provider.currency}</p>
                                  <p className="text-xs text-gray-500">{provider.estimatedDays} days delivery</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <Button 
                            className="w-full mt-4" 
                            onClick={handleBookLogistics}
                            disabled={!selectedProviderId}
                          >
                            Book with Selected Provider
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>
                  What to know before booking your shipment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Shipping Process</h3>
                    <p className="text-gray-600 mt-1">
                      Our logistics partners offer secure and reliable shipping services for your goods.
                      From pick-up to delivery, we ensure your cargo reaches its destination safely.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 mt-1">
                      <li>Complete and accurate shipping information</li>
                      <li>Proper packaging for your cargo type</li>
                      <li>Any required documentation for international shipping</li>
                      <li>Special handling instructions if applicable</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium">Tracking</h3>
                    <p className="text-gray-600 mt-1">
                      Once your shipment is booked, you'll receive a tracking ID. Use this to monitor
                      your shipment's progress in real-time on the "Track Shipments" tab.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Logistics Providers Tab */}
        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Our Logistics Partners</CardTitle>
              <CardDescription>
                Choose from our trusted network of logistics providers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProvidersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {providers?.map((provider) => (
                    <Card key={provider.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center mb-4">
                          <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mr-4">
                            <img 
                              src={provider.logo} 
                              alt={provider.name}
                              className="h-8 w-8 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=' + provider.name.charAt(0);
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{provider.name}</h3>
                            <div className="flex items-center text-yellow-500">
                              {'★'.repeat(Math.floor(Number(provider.rating)))}
                              {'☆'.repeat(5 - Math.floor(Number(provider.rating)))}
                              <span className="text-gray-600 text-sm ml-1">({provider.rating})</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">{provider.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Base Price</p>
                            <p>{provider.basePrice} {provider.currency}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Typical Delivery</p>
                            <p>{provider.estimatedDays} days</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-gray-500 text-sm">Specialties:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {provider.specialties && Array.isArray(provider.specialties) && 
                              provider.specialties.map((specialty, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs"
                                >
                                  {specialty}
                                </span>
                              ))
                            }
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsPage;