import React, { useState } from 'react';
import { 
  Truck, 
  Package, 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { logistics } from '@/data/mockData';
import { formatDate } from '@/utils/helpers';

const LogisticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trackings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState<typeof logistics[0] | null>(null);

  // Filter logistics
  const filteredLogistics = logistics.filter(item => {
    const matchesSearch = 
      item.origin.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return (
          <span className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
            <Truck className="h-3 w-3 mr-1" />
            In Transit
          </span>
        );
      case 'PENDING':
        return (
          <span className="flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
            <Package className="h-3 w-3 mr-1" />
            Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="flex items-center text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-full">
            <AlertCircle className="h-3 w-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Logistics</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage your international shipments
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-md flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Logistics
        </button>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === 'trackings' 
              ? 'border-primary text-primary' 
              : 'border-transparent hover:border-muted-foreground/20'
          }`}
          onClick={() => setActiveTab('trackings')}
        >
          <div className="flex items-center">
            <Truck className="h-4 w-4 mr-2" />
            Trackings
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === 'providers' 
              ? 'border-primary text-primary' 
              : 'border-transparent hover:border-muted-foreground/20'
          }`}
          onClick={() => setActiveTab('providers')}
        >
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Providers
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === 'calendar' 
              ? 'border-primary text-primary' 
              : 'border-transparent hover:border-muted-foreground/20'
          }`}
          onClick={() => setActiveTab('calendar')}
        >
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </div>
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search by origin or destination..." 
            className="w-full rounded-md border border-input pl-9 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            className="rounded-md border border-input px-3 py-2 text-sm"
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {activeTab === 'trackings' && (
        <>
          {filteredLogistics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLogistics.map(logistic => (
                <div 
                  key={logistic.id} 
                  className="rounded-lg border bg-card p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTracking(logistic)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{logistic.type === 'BOOKING' ? 'Booking' : 'Tracking'} #{logistic.id}</h3>
                        <div className="text-xs text-muted-foreground">
                          {logistic.trackingNumber || 'No tracking number'}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(logistic.status)}
                  </div>
                  
                  <div className="flex items-center text-sm mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>{logistic.origin}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>{logistic.destination}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                    <div>
                      <span className="text-xs">Cargo:</span>
                      <div>{logistic.cargoType}</div>
                    </div>
                    <div>
                      <span className="text-xs">Weight:</span>
                      <div>{logistic.weight}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex justify-between border-t pt-2">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Shipment: {formatDate(logistic.shipmentDate)}</span>
                    </div>
                    <div>
                      {logistic.estimatedDelivery && (
                        <span>ETA: {formatDate(logistic.estimatedDelivery)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg flex flex-col items-center justify-center h-64 text-center">
              <Truck className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-1">No trackings found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || statusFilter 
                  ? "Try adjusting your search or filters"
                  : "Create your first logistics tracking"
                }
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-primary text-white rounded-md inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Logistics
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'providers' && (
        <div className="bg-muted/30 rounded-lg flex flex-col items-center justify-center h-64 text-center">
          <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-1">Logistics Providers</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This section would display logistics providers
          </p>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-muted/30 rounded-lg flex flex-col items-center justify-center h-64 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-1">Logistics Calendar</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This section would display a logistics calendar view
          </p>
        </div>
      )}

      {/* Tracking Details Modal */}
      {selectedTracking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold mb-1">
                  {selectedTracking.type === 'BOOKING' ? 'Booking' : 'Tracking'} #{selectedTracking.id}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center">
                  {selectedTracking.trackingNumber && (
                    <>
                      <span className="font-mono">{selectedTracking.trackingNumber}</span>
                      <span className="mx-2">•</span>
                    </>
                  )}
                  {getStatusBadge(selectedTracking.status)}
                </p>
              </div>
              <button 
                onClick={() => setSelectedTracking(null)}
                className="p-2 rounded-md border"
              >
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded-md p-4">
                <div className="text-sm text-muted-foreground mb-1">Origin</div>
                <div className="font-medium">{selectedTracking.origin}</div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="text-sm text-muted-foreground mb-1">Destination</div>
                <div className="font-medium">{selectedTracking.destination}</div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="text-sm text-muted-foreground mb-1">Shipment Date</div>
                <div className="font-medium">{formatDate(selectedTracking.shipmentDate)}</div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="text-sm text-muted-foreground mb-1">Estimated Delivery</div>
                <div className="font-medium">
                  {selectedTracking.estimatedDelivery 
                    ? formatDate(selectedTracking.estimatedDelivery)
                    : 'Not available'
                  }
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Milestones</h3>
              
              {selectedTracking.milestones ? (
                <div className="relative pl-6">
                  <div className="absolute left-2 top-2 bottom-0 w-px bg-muted-foreground/20"></div>
                  
                  {Object.entries(selectedTracking.milestones).map(([key, milestone]) => (
                    <div key={key} className="mb-6 relative">
                      <div className={`absolute left-[-18px] top-1 w-4 h-4 rounded-full ${
                        milestone.status === 'COMPLETED'
                          ? 'border-2 border-primary bg-background'
                          : milestone.status === 'IN_PROGRESS'
                            ? 'border-2 border-blue-500 bg-background'
                            : 'border-2 border-muted-foreground/20 bg-background'
                      }`}></div>
                      <h4 className="font-medium">{milestone.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {milestone.timestamp ? formatDate(milestone.timestamp) : 'Pending'}
                        {milestone.location && ` • ${milestone.location}`}
                      </p>
                      {milestone.notes && (
                        <p className="text-sm mt-1">{milestone.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 rounded-lg border-2 border-dashed">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <h4 className="text-lg font-medium mb-1">No milestones available</h4>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setSelectedTracking(null)}
                className="px-4 py-2 border rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Create New Logistics</h2>
            <p className="text-muted-foreground mb-4">
              Modal content would go here with logistics form
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsPage;