import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { 
  Truck, 
  PackageCheck, 
  MapPin, 
  Calendar, 
  BarChart3, 
  Clock, 
  AlertCircle,
  ArrowRight,
  FileText,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useLogistics, Logistics } from '../../hooks/useLogistics';
import { format } from 'date-fns';

interface LogisticsTrackingProps {
  contractId?: number;
  logisticsId?: number;
}

const LogisticsTracking: React.FC<LogisticsTrackingProps> = ({ contractId, logisticsId }) => {
  const { 
    logisticsItem, 
    contractLogistics, 
    isLoadingLogisticsItem, 
    isLoadingContractLogistics 
  } = useLogistics(logisticsId, contractId);

  const logistics = logisticsItem || (contractLogistics && contractLogistics[0]) || null;
  const isLoading = isLoadingLogisticsItem || isLoadingContractLogistics;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Logistics Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading logistics information...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!logistics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Logistics Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <p className="text-lg font-medium mb-2">No Logistics Information</p>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              There is no logistics tracking available for this contract.
            </p>
            <Button variant="outline">
              Setup Logistics
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': 'yellow',
      'CONFIRMED': 'blue',
      'IN_TRANSIT': 'orange',
      'DELIVERED': 'green',
      'CANCELLED': 'red',
    };
    return statusMap[status] || 'gray';
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'PPP');
  };

  const getProgressPercentage = (status: string) => {
    const statusProgress: Record<string, number> = {
      'PENDING': 10,
      'CONFIRMED': 30,
      'IN_TRANSIT': 70,
      'DELIVERED': 100,
      'CANCELLED': 0,
    };
    return statusProgress[status] || 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Logistics Tracking
          </CardTitle>
          <Badge 
            variant={logistics.status === 'CANCELLED' ? 'destructive' : 'default'} 
            className={`bg-${getStatusColor(logistics.status)}-100 text-${getStatusColor(logistics.status)}-800`}
          >
            {logistics.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Tracking Progress */}
        <div className="mb-6">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${getProgressPercentage(logistics.status)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Order Placed</span>
            <span className="text-xs text-gray-500">In Transit</span>
            <span className="text-xs text-gray-500">Delivered</span>
          </div>
        </div>
        
        {/* Shipment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Origin
            </h3>
            <p className="text-sm text-gray-700">{logistics.origin}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Destination
            </h3>
            <p className="text-sm text-gray-700">{logistics.destination}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Shipment Date
            </h3>
            <p className="text-sm text-gray-700">{formatDate(logistics.shipmentDate)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Estimated Delivery
            </h3>
            <p className="text-sm text-gray-700">{formatDate(logistics.estimatedDelivery)}</p>
          </div>
        </div>
        
        {/* Cargo Details */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <PackageCheck className="h-4 w-4 mr-1" />
            Cargo Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
            <div>
              <span className="text-xs text-gray-500">Type</span>
              <p className="text-sm">{logistics.cargoType}</p>
            </div>
            
            <div>
              <span className="text-xs text-gray-500">Weight</span>
              <p className="text-sm">{logistics.weight} kg</p>
            </div>
            
            {logistics.trackingNumber && (
              <div className="col-span-2">
                <span className="text-xs text-gray-500">Tracking Number</span>
                <p className="text-sm font-mono">{logistics.trackingNumber}</p>
              </div>
            )}
            
            {logistics.specialRequirements && (
              <div className="col-span-2">
                <span className="text-xs text-gray-500">Special Requirements</span>
                <p className="text-sm">{logistics.specialRequirements}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Milestones */}
        {logistics.milestones && logistics.milestones.length > 0 && (
          <div className="mb-2">
            <h3 className="text-sm font-medium mb-4 flex items-center">
              <BarChart3 className="h-4 w-4 mr-1" />
              Shipment Milestones
            </h3>
            
            <div className="space-y-4">
              {logistics.milestones.map((milestone, index) => (
                <div key={index} className="relative pl-6 pb-4">
                  {index !== logistics.milestones!.length - 1 && (
                    <div className="absolute top-0 left-[9px] h-full w-[2px] bg-gray-200"></div>
                  )}
                  <div className={`absolute top-0 left-0 h-[18px] w-[18px] rounded-full 
                    ${milestone.status === 'COMPLETED' 
                      ? 'bg-green-500 ring-2 ring-green-100' 
                      : milestone.status === 'IN_PROGRESS' 
                        ? 'bg-blue-500 ring-2 ring-blue-100 animate-pulse' 
                        : 'bg-gray-200'
                    } flex items-center justify-center`
                  }>
                    {milestone.status === 'COMPLETED' && (
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex flex-col ml-2">
                    <h4 className={`text-sm font-medium ${
                      milestone.status === 'COMPLETED' 
                        ? 'text-gray-900' 
                        : milestone.status === 'IN_PROGRESS' 
                          ? 'text-blue-700' 
                          : 'text-gray-400'
                    }`}>
                      {milestone.name}
                    </h4>
                    {milestone.timestamp && (
                      <span className="text-xs text-gray-500">
                        {format(new Date(milestone.timestamp), 'PPP p')}
                      </span>
                    )}
                    {milestone.location && (
                      <span className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> {milestone.location}
                      </span>
                    )}
                    {milestone.notes && (
                      <p className="text-xs text-gray-600 mt-1">{milestone.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Separator className="my-6" />
        
        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-end">
          <Button variant="outline" size="sm" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            View Documents
          </Button>
          
          <Button variant="default" size="sm" className="flex items-center">
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogisticsTracking;