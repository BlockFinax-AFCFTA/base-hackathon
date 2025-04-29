import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '../ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { 
  Truck, 
  PackageSearch, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Shield, 
  ThumbsUp,
  Star,
  Search
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';

const LogisticsProviderCard = ({ 
  name, 
  logo, 
  rating, 
  specialties, 
  description 
}: { 
  name: string; 
  logo: React.ReactNode; 
  rating: number; 
  specialties: string[]; 
  description: string; 
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              {logo}
            </div>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">View Details</Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className="bg-blue-50">
              {specialty}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const BookingForm = () => {
  const [step, setStep] = useState(1);
  
  return (
    <div className="space-y-4">
      {step === 1 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <div className="flex">
                <div className="bg-gray-100 p-2 flex items-center rounded-l-md border border-r-0 border-input">
                  <MapPin className="h-4 w-4 text-gray-500" />
                </div>
                <Input id="origin" placeholder="Enter origin city/port" className="rounded-l-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <div className="flex">
                <div className="bg-gray-100 p-2 flex items-center rounded-l-md border border-r-0 border-input">
                  <MapPin className="h-4 w-4 text-gray-500" />
                </div>
                <Input id="destination" placeholder="Enter destination city/port" className="rounded-l-none" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shipment-date">Shipment Date</Label>
              <div className="flex">
                <div className="bg-gray-100 p-2 flex items-center rounded-l-md border border-r-0 border-input">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <Input id="shipment-date" type="date" className="rounded-l-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo-type">Cargo Type</Label>
              <Select>
                <SelectTrigger id="cargo-type">
                  <SelectValue placeholder="Select cargo type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Cargo</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="bulk">Bulk Cargo</SelectItem>
                  <SelectItem value="perishable">Perishable Goods</SelectItem>
                  <SelectItem value="hazardous">Hazardous Materials</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" placeholder="Enter weight" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="special-requirements">Special Requirements</Label>
            <Input id="special-requirements" placeholder="Any special handling instructions or requirements" />
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button onClick={() => setStep(2)}>Continue to Provider Selection</Button>
          </div>
        </>
      )}
      
      {step === 2 && (
        <>
          <h3 className="text-lg font-medium mb-4">Select Logistics Provider</h3>
          
          <div className="space-y-4">
            {logisticsProviders.map((provider, index) => (
              <div key={index} className="border rounded-md p-4 flex items-center">
                <input 
                  type="radio" 
                  id={`provider-${index}`} 
                  name="provider" 
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary mr-3"
                />
                <label htmlFor={`provider-${index}`} className="flex-grow cursor-pointer">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                      {provider.logo}
                    </div>
                    <div>
                      <h4 className="font-medium">{provider.name}</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-green-600 font-medium">$245.00</span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="text-sm text-gray-600">Est. delivery: 5-7 days</span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Continue to Summary</Button>
          </div>
        </>
      )}
      
      {step === 3 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Review your shipment details before confirming</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Origin</h4>
                    <p>Shanghai, China</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Destination</h4>
                    <p>Hamburg, Germany</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Shipment Date</h4>
                    <p>May 15, 2025</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Cargo Type</h4>
                    <p>Container</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Weight</h4>
                    <p>2,500 kg</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Logistics Provider</h4>
                  <div className="flex items-center mt-1">
                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                      <Truck className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="font-medium">OceanSpeed Logistics</p>
                      <p className="text-sm text-gray-600">Premium container shipping service</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Pricing Details</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base shipping cost</span>
                      <span>$200.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance</span>
                      <span>$35.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Handling fees</span>
                      <span>$10.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>$245.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button>Confirm Booking</Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

const TrackingSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-md border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Track Your Shipment</h3>
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Input placeholder="Enter tracking number, booking reference, or container ID" />
          </div>
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Track
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
          <CardDescription>Track your ongoing shipments</CardDescription>
        </CardHeader>
        <CardContent>
          {recentShipments.length === 0 ? (
            <div className="text-center py-8">
              <PackageSearch className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No recent shipments found</p>
              <p className="text-sm text-gray-400 mt-1">Your tracked shipments will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentShipments.map((shipment, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{shipment.reference}</h4>
                        <Badge className="ml-2" variant={shipment.statusColor as any}>
                          {shipment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{shipment.route}</p>
                    </div>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200"></div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary" style={{ width: `${shipment.progress}%` }}></div>
                      <div className="relative flex justify-between">
                        {shipment.milestones.map((milestone, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full mb-2 z-10 ${
                              milestone.completed ? 'bg-primary' : 'bg-gray-200'
                            }`}></div>
                            <span className="text-xs text-gray-600">{milestone.label}</span>
                          </div>
                        ))}
                      </div>
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

// Sample data 
const logisticsProviders = [
  {
    name: "OceanSpeed Logistics",
    logo: <Truck className="h-5 w-5 text-blue-700" />,
    rating: 4.7,
    specialties: ["Container Shipping", "Customs Clearance", "Door-to-Door"],
    description: "Global leader in container shipping with services to over 120 countries. Specializing in timely deliveries and excellent tracking capabilities."
  },
  {
    name: "AirFreight Express",
    logo: <Truck className="h-5 w-5 text-purple-700" />,
    rating: 4.5,
    specialties: ["Air Freight", "Express Delivery", "Temperature Controlled"],
    description: "Premium air freight services with specialized handling for time-sensitive and perishable goods. Global network with 24/7 customer support."
  },
  {
    name: "GlobalTrade Shipping",
    logo: <Truck className="h-5 w-5 text-green-700" />,
    rating: 4.3,
    specialties: ["Bulk Cargo", "Project Cargo", "Heavy Lift"],
    description: "Specialized in handling oversized and project cargo with decades of experience in complex logistics solutions and freight forwarding."
  },
  {
    name: "EcoFreight Solutions",
    logo: <Truck className="h-5 w-5 text-teal-700" />,
    rating: 4.8,
    specialties: ["Sustainable Shipping", "Carbon Neutral", "Green Logistics"],
    description: "Environmentally conscious logistics provider offering carbon-neutral shipping options and sustainable supply chain solutions globally."
  },
];

const recentShipments = [
  {
    reference: "SHP-20250421-001",
    status: "In Transit",
    statusColor: "warning",
    route: "Shanghai, China → Hamburg, Germany",
    progress: 60,
    milestones: [
      { label: "Picked Up", completed: true },
      { label: "Departed", completed: true },
      { label: "In Transit", completed: true },
      { label: "Customs", completed: false },
      { label: "Delivered", completed: false }
    ]
  },
  {
    reference: "SHP-20250415-002",
    status: "Customs Clearance",
    statusColor: "warning",
    route: "New York, USA → Rotterdam, Netherlands",
    progress: 75,
    milestones: [
      { label: "Picked Up", completed: true },
      { label: "Departed", completed: true },
      { label: "In Transit", completed: true },
      { label: "Customs", completed: true },
      { label: "Delivered", completed: false }
    ]
  }
];

const LogisticsPage: React.FC = () => {
  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Truck className="h-6 w-6 text-primary mr-2" />
        <h1 className="text-2xl font-bold">Logistics</h1>
      </div>
      
      <Tabs defaultValue="book">
        <TabsList className="mb-6">
          <TabsTrigger value="book">Find & Book</TabsTrigger>
          <TabsTrigger value="track">Track Shipment</TabsTrigger>
          <TabsTrigger value="providers">Logistics Providers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="book">
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <div className="flex items-center mb-4">
              <Truck className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Book a Shipment</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Find and book the best logistics services for your international trade needs. 
              Compare rates and services from trusted logistics providers.
            </p>
            <BookingForm />
          </div>
        </TabsContent>
        
        <TabsContent value="track">
          <TrackingSection />
        </TabsContent>
        
        <TabsContent value="providers">
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Trusted Logistics Providers</h2>
            </div>
            <p className="text-gray-600 mb-6">
              We partner with reliable logistics companies to ensure smooth, secure, and efficient shipping 
              for your international trade operations. All providers are thoroughly vetted and monitored for quality.
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              {logisticsProviders.map((provider, index) => (
                <LogisticsProviderCard
                  key={index}
                  name={provider.name}
                  logo={provider.logo}
                  rating={provider.rating}
                  specialties={provider.specialties}
                  description={provider.description}
                />
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <ThumbsUp className="h-6 w-6 text-blue-700 mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-blue-900">Provider Verification</h3>
                  <p className="text-sm text-blue-800 mt-1">
                    All logistics providers on our platform undergo thorough verification, including operational capabilities,
                    compliance checks, performance history, and customer feedback. This ensures you only work with the most reliable partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsPage;