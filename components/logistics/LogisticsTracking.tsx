import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Truck, 
  Package, 
  MapPin, 
  CalendarClock, 
  Weight, 
  AlertCircle,
  FileText,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight
} from 'lucide-react';
import { useLogistics } from '../../hooks/useLogistics';
import { Skeleton } from '../ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import LogisticsForm from './LogisticsForm';

interface LogisticsTrackingProps {
  logisticsId?: number;
  contractId?: number;
}

const LogisticsTracking: React.FC<LogisticsTrackingProps> = ({ 
  logisticsId, 
  contractId 
}) => {
  const { 
    logisticsItem, 
    isLoadingLogisticsItem,
    refetchLogisticsItem
  } = useLogistics(logisticsId, contractId);
  
  const [editMode, setEditMode] = React.useState(false);

  if (isLoadingLogisticsItem) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-3/4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!logisticsItem) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Logistics Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <p className="text-center text-muted-foreground">
              No logistics information found.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_TRANSIT':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'IN_PROGRESS':
        return <Circle className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'PENDING':
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                <CardTitle className="text-lg">
                  {logisticsItem.type === 'BOOKING' ? 'Logistics Booking' : 'Shipment Tracking'}
                </CardTitle>
              </div>
              
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <span className="font-medium mr-2">ID:</span> 
                {logisticsItem.trackingNumber || `#${logisticsItem.id}`}
              </div>
            </div>
            
            <Badge className={`${getStatusColor(logisticsItem.status)}`}>
              {logisticsItem.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          {/* Shipment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">Origin</div>
                  <div className="text-sm">{logisticsItem.origin}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <CalendarClock className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">Shipment Date</div>
                  <div className="text-sm">
                    {new Date(logisticsItem.shipmentDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Package className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">Cargo Type</div>
                  <div className="text-sm">{logisticsItem.cargoType}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">Destination</div>
                  <div className="text-sm">{logisticsItem.destination}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <CalendarClock className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">Est. Delivery</div>
                  <div className="text-sm">
                    {logisticsItem.estimatedDelivery 
                      ? new Date(logisticsItem.estimatedDelivery).toLocaleDateString()
                      : 'Not available'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Weight className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">Weight</div>
                  <div className="text-sm">{logisticsItem.weight} kg</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Timeline */}
          {logisticsItem.milestones && Array.isArray(logisticsItem.milestones) && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-4">Shipment Progress</h4>
              
              <div className="relative ml-2">
                {/* Vertical line */}
                <div className="absolute left-2.5 top-2 h-full w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {logisticsItem.milestones.map((milestone, index) => (
                    <div key={index} className="relative flex items-start pt-2">
                      {/* Status icon */}
                      <div className="absolute left-0 mt-0.5 -ml-1 bg-white">
                        {getMilestoneStatusIcon(milestone.status)}
                      </div>
                      
                      {/* Milestone details */}
                      <div className="ml-8">
                        <div className="flex items-center">
                          <h5 className="text-sm font-medium">{milestone.name}</h5>
                          
                          {milestone.status === 'COMPLETED' && milestone.timestamp && (
                            <div className="ml-2 flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(milestone.timestamp).toLocaleString()}
                            </div>
                          )}
                        </div>
                        
                        {milestone.location && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {milestone.location}
                          </div>
                        )}
                        
                        {milestone.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{milestone.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Special Requirements */}
          {logisticsItem.specialRequirements && (
            <div className="mt-6 bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                Special Requirements
              </h4>
              <p className="text-sm text-gray-600">{logisticsItem.specialRequirements}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" size="sm" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center"
              onClick={() => setEditMode(true)}
            >
              Edit Details
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              className="flex items-center" 
              onClick={() => window.open(`/api/logistics/${logisticsItem.id}/verify`, '_blank')}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Verify on Blockchain
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Edit Logistics
            </DialogTitle>
          </DialogHeader>
          <LogisticsForm 
            logisticsId={logisticsItem.id} 
            contractId={logisticsItem.contractId ?? undefined} 
            onSuccess={() => {
              setEditMode(false);
              refetchLogisticsItem();
            }}
            onCancel={() => setEditMode(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogisticsTracking;