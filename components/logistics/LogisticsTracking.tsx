import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Badge
} from '../../components/ui/badge';
import {
  Button
} from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';

import { 
  Truck, 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileBox,
  UploadCloud,
  ExternalLink,
  ClipboardCheck,
  CircleDashed
} from 'lucide-react';

import { useLogistics } from '../../hooks/useLogistics';
import { useToast } from '../../hooks/use-toast';

interface LogisticsTrackingProps {
  contractId: number;
}

const LogisticsTracking: React.FC<LogisticsTrackingProps> = ({ contractId }) => {
  const [activeTab, setActiveTab] = useState('tracking');
  const { toast } = useToast();
  const { 
    logistics, 
    isLoading, 
    error, 
    createLogistics, 
    updateLogistics,
    updateMilestone,
    confirmDelivery
  } = useLogistics(contractId);
  
  // For new logistics dialog
  const [newLogisticsDialogOpen, setNewLogisticsDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  
  const handleCreateLogistics = () => {
    if (trackingNumber && selectedProvider) {
      // In a real implementation, this would call createLogistics
      toast({
        title: "Logistics Information Added",
        description: "Tracking information has been added to this contract.",
      });
      setNewLogisticsDialogOpen(false);
      setTrackingNumber('');
      setSelectedProvider('');
    }
  };
  
  const handleUpdateMilestone = (milestoneKey: string) => {
    // In a real implementation, this would call updateMilestone
    toast({
      title: "Milestone Updated",
      description: `${milestoneKey} milestone has been marked as completed.`,
    });
  };
  
  const handleConfirmDelivery = () => {
    // In a real implementation, this would call confirmDelivery
    toast({
      title: "Delivery Confirmed",
      description: "You have confirmed successful delivery of the goods.",
    });
  };
  
  // Helper to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return "bg-yellow-100 text-yellow-800";
      case 'confirmed': return "bg-green-100 text-green-800";
      case 'in_transit': 
      case 'intransit': return "bg-blue-100 text-blue-800";
      case 'delivered': return "bg-green-100 text-green-800";
      case 'cancelled': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Helper to format date
  const formatDate = (dateStr: string | Date | null) => {
    if (!dateStr) return 'Not specified';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If there's no logistics data yet for this contract
  if (!logistics || Object.keys(logistics).length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">No Logistics Information</h3>
            <p className="text-muted-foreground">
              No shipment or logistics information has been added to this contract yet.
            </p>
          </div>
          
          <Dialog open={newLogisticsDialogOpen} onOpenChange={setNewLogisticsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Truck className="mr-2 h-4 w-4" /> Add Tracking Info
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Logistics Information</DialogTitle>
                <DialogDescription>
                  Add tracking information for physical goods related to this contract.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="tracking">Tracking Number</Label>
                  <Input 
                    id="tracking" 
                    placeholder="Enter tracking number" 
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="provider">Logistics Provider</Label>
                  <select 
                    id="provider"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                  >
                    <option value="">Select provider</option>
                    <option value="dhl">DHL</option>
                    <option value="fedex">FedEx</option>
                    <option value="maersk">Maersk</option>
                    <option value="one">Ocean Network Express</option>
                    <option value="msc">MSC</option>
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewLogisticsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateLogistics} disabled={!trackingNumber || !selectedProvider}>
                  Add Tracking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Truck className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">No Shipping Information</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Add logistics and shipping information to track the physical goods associated with this contract.
              This helps verify trade completion for escrow release.
            </p>
            <Button onClick={() => setNewLogisticsDialogOpen(true)}>
              <Truck className="mr-2 h-4 w-4" /> Set Up Logistics
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If we have logistics data for this contract
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="tracking">Shipment Tracking</TabsTrigger>
          <TabsTrigger value="documents">Shipping Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracking" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(logistics.status || "pending")}>
                  {logistics.status ? logistics.status.toUpperCase().replace('_', ' ') : 'PENDING'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ID: {logistics.id} • Tracking: {logistics.trackingNumber || 'Not available'}
                </span>
              </div>
              <h3 className="text-lg font-semibold mt-1">
                {logistics.type === 'BOOKING' ? 'Freight Booking' : 'Shipment Tracking'}
              </h3>
            </div>
            
            {logistics.status === 'IN_TRANSIT' && (
              <Button onClick={handleConfirmDelivery}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm Delivery
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Shipment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Origin</div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">{logistics.origin}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Ship Date</div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">{formatDate(logistics.shipmentDate)}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Cargo Type</div>
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">{logistics.cargoType}</div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Destination</div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">{logistics.destination}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Estimated Delivery</div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">{formatDate(logistics.estimatedDelivery)}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Weight</div>
                  <div className="flex items-start gap-2">
                    <FileBox className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">{logistics.weight}</div>
                  </div>
                </div>
                
                {logistics.milestones && Object.keys(logistics.milestones).length > 0 && (
                  <>
                    <Separator />
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Milestones</div>
                      <div className="space-y-3">
                        {Object.entries(logistics.milestones).map(([key, milestone], index) => {
                          const completed = milestone.status === 'COMPLETED';
                          return (
                            <div key={index} className="flex items-start gap-2">
                              {completed ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                              ) : (
                                <CircleDashed className="h-4 w-4 text-muted-foreground mt-0.5" />
                              )}
                              <div>
                                <div className="text-sm font-medium">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {completed
                                    ? `Completed ${formatDate(milestone.timestamp)}`
                                    : 'Pending'}
                                </div>
                                {milestone.location && (
                                  <div className="text-xs flex items-center mt-0.5">
                                    <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                                    {milestone.location}
                                  </div>
                                )}
                              </div>
                              {!completed && logistics.status !== 'DELIVERED' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="ml-auto h-7"
                                  onClick={() => handleUpdateMilestone(key)}
                                >
                                  Update
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
                
                {logistics.specialRequirements && (
                  <>
                    <Separator />
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Special Requirements</div>
                      <div className="text-sm">{logistics.specialRequirements}</div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Shipment Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <div className="absolute left-3.5 top-0 h-full w-px bg-muted-foreground/20"></div>
                  
                  <div className="relative pl-10 pb-8">
                    <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Shipment Created</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(logistics.createdAt)}
                    </div>
                  </div>
                  
                  <div className={`relative pl-10 pb-8 ${
                    logistics.status !== 'PENDING' ? 'opacity-100' : 'opacity-50'
                  }`}>
                    <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
                      logistics.status !== 'PENDING' ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                    }`}>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Booking Confirmed</div>
                    <div className="text-sm text-muted-foreground">
                      {logistics.status !== 'PENDING' 
                        ? formatDate(new Date(new Date(logistics.createdAt).getTime() + 86400000)) 
                        : 'Pending confirmation'}
                    </div>
                  </div>
                  
                  <div className={`relative pl-10 pb-8 ${
                    logistics.status === 'IN_TRANSIT' || logistics.status === 'DELIVERED' ? 'opacity-100' : 'opacity-50'
                  }`}>
                    <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
                      logistics.status === 'IN_TRANSIT' || logistics.status === 'DELIVERED' ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                    }`}>
                      <Truck className="h-4 w-4" />
                    </div>
                    <div className="font-medium">In Transit</div>
                    <div className="text-sm text-muted-foreground">
                      {logistics.status === 'IN_TRANSIT' || logistics.status === 'DELIVERED'
                        ? formatDate(new Date(new Date(logistics.shipmentDate).getTime()))
                        : 'Awaiting shipment'}
                    </div>
                  </div>
                  
                  <div className={`relative pl-10 ${
                    logistics.status === 'DELIVERED' ? 'opacity-100' : 'opacity-50'
                  }`}>
                    <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
                      logistics.status === 'DELIVERED' ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                    }`}>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="font-medium">Delivered</div>
                    <div className="text-sm text-muted-foreground">
                      {logistics.status === 'DELIVERED'
                        ? formatDate(new Date())
                        : 'Pending delivery'}
                    </div>
                  </div>
                </div>
                
                {logistics.trackingNumber && (
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={`https://example.com/track?number=${logistics.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Track Shipment Externally
                      </a>
                    </Button>
                  </div>
                )}
                
                {logistics.status === 'IN_TRANSIT' && (
                  <div className="mt-2">
                    <Button className="w-full" onClick={handleConfirmDelivery}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirm Delivery Received
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {(logistics.status === 'PENDING' || !logistics.trackingNumber) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Update Tracking Information</CardTitle>
                <CardDescription>
                  Add or update tracking details for this shipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tracking_number">Tracking Number</Label>
                    <Input 
                      id="tracking_number" 
                      placeholder="Enter tracking number" 
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="provider">Logistics Provider</Label>
                    <select 
                      id="provider"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                    >
                      <option value="">Select provider</option>
                      <option value="dhl">DHL</option>
                      <option value="fedex">FedEx</option>
                      <option value="maersk">Maersk</option>
                      <option value="one">Ocean Network Express</option>
                      <option value="msc">MSC</option>
                    </select>
                  </div>
                </div>
                
                <Button className="mt-4" disabled={!trackingNumber || !selectedProvider}>
                  Update Tracking
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Shipping Documents</h3>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Shipping Document</DialogTitle>
                  <DialogDescription>
                    Add documentation related to this shipment such as bill of lading, packing list, or inspection certificate.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="doc_file">Document File</Label>
                    <Input id="doc_file" type="file" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="doc_type">Document Type</Label>
                    <select 
                      id="doc_type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select document type</option>
                      <option value="bill_of_lading">Bill of Lading</option>
                      <option value="commercial_invoice">Commercial Invoice</option>
                      <option value="packing_list">Packing List</option>
                      <option value="inspection_certificate">Inspection Certificate</option>
                      <option value="certificate_of_origin">Certificate of Origin</option>
                      <option value="insurance_certificate">Insurance Certificate</option>
                      <option value="phytosanitary_certificate">Phytosanitary Certificate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="doc_description">Description</Label>
                    <Input id="doc_description" placeholder="Enter document description" />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileBox className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">No Documents Uploaded</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Upload shipping documents such as bill of lading, packing list, or certificate of origin to verify the physical goods.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Required documents for international trade:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                  <li>Bill of Lading or Airway Bill</li>
                  <li>Commercial Invoice</li>
                  <li>Packing List</li>
                  <li>Certificate of Origin</li>
                  <li>Inspection Certificate</li>
                  <li>Insurance Certificate</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogisticsTracking;