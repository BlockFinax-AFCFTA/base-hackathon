import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Ship, 
  MapPin, 
  Calendar, 
  Truck, 
  PackageCheck,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

/**
 * The sixth step of the onboarding wizard
 * Demonstrates shipment tracking features
 */
const ShipmentTrackingStep: React.FC = () => {
  // Get localized translations
  const { t } = useLocalization('onboarding');

  // Timeline events
  const events = [
    { 
      id: 1, 
      title: t('onboarding.step6.event1'),
      date: '2025-03-20',
      status: 'completed' 
    },
    { 
      id: 2, 
      title: t('onboarding.step6.event2'),
      date: '2025-03-25',
      status: 'completed' 
    },
    { 
      id: 3, 
      title: t('onboarding.step6.event3'),
      date: '2025-04-01',
      status: 'completed' 
    },
    { 
      id: 4, 
      title: t('onboarding.step6.event4'),
      date: null,
      status: 'in_progress' 
    },
    { 
      id: 5, 
      title: t('onboarding.step6.event5'),
      date: null,
      status: 'pending' 
    },
    { 
      id: 6, 
      title: t('onboarding.step6.event6'),
      date: null,
      status: 'pending' 
    },
    { 
      id: 7, 
      title: t('onboarding.step6.event7'),
      date: null,
      status: 'pending' 
    }
  ];
  
  // Helper function to get icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-6 w-6 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-6 w-6 text-gray-300" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{t('onboarding.step6.title')}</h1>
        <p className="text-gray-600 mt-2">{t('onboarding.step6.description')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('onboarding.step6.trackingNumber')}</CardTitle>
                <Badge className="bg-blue-100 text-blue-800">
                  {t('onboarding.step6.currentStatus')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">{t('onboarding.step6.origin')}</p>
                    <p className="font-medium">Mombasa, Kenya</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">{t('onboarding.step6.destination')}</p>
                    <p className="font-medium">Rotterdam, Netherlands</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">{t('onboarding.step6.departureDate')}</p>
                    <p className="font-medium">01 Apr 2025</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">{t('onboarding.step6.estimatedArrival')}</p>
                    <p className="font-medium">25 Apr 2025</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-lg mb-4">{t('onboarding.step6.timeline')}</h3>
                
                <div className="relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-3.5 top-3 h-full w-px bg-gray-200"></div>
                  
                  <div className="space-y-8">
                    {events.map((event, index) => (
                      <div key={event.id} className="relative flex items-start ml-0">
                        <div className="absolute left-0 mt-1">
                          {getStatusIcon(event.status)}
                        </div>
                        
                        <div className="ml-10 pb-1">
                          <div className="flex items-center flex-wrap">
                            <span className="font-medium">{event.title}</span>
                            
                            {event.date && (
                              <span className="ml-2 text-sm text-gray-500">
                                {event.date.replace(/^\d{4}-/, '')}
                              </span>
                            )}
                            
                            {event.status === 'in_progress' && (
                              <Badge className="ml-2 bg-blue-100 text-blue-800 h-5">Active</Badge>
                            )}
                          </div>
                          
                          {event.status === 'in_progress' && (
                            <p className="text-sm text-gray-600 mt-1">
                              Currently in transit via sea freight. Estimated 15 days until arrival.
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-xs text-gray-500 p-3 bg-gray-50 rounded-md border border-gray-200">
                {t('onboarding.step6.tip')}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 mb-4 flex items-center justify-center bg-white rounded-full shadow-sm">
                  <Ship className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Ocean Freight</h3>
                <p className="text-sm text-gray-700">
                  Mombasa to Rotterdam
                  <br />
                  Carrier: MSC Shipping
                </p>
                <div className="w-full mt-4 pt-4 border-t border-blue-200">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-left">
                      <p className="text-gray-500">Distance:</p>
                      <p>7,800 nautical miles</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Transit time:</p>
                      <p>~24 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Services</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-md border">
                  <Truck className="h-8 w-8 text-orange-500 mr-3" />
                  <div>
                    <p className="font-medium">Inland Transport</p>
                    <p className="text-sm text-gray-600">
                      Nairobi to Mombasa Port
                    </p>
                  </div>
                  <Badge className="ml-auto bg-green-100 text-green-800">Completed</Badge>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-md border">
                  <PackageCheck className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <p className="font-medium">Customs Clearance</p>
                    <p className="text-sm text-gray-600">
                      Export documentation
                    </p>
                  </div>
                  <Badge className="ml-auto bg-green-100 text-green-800">Completed</Badge>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-md border">
                  <Ship className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium">Marine Insurance</p>
                    <p className="text-sm text-gray-600">
                      All-risk coverage
                    </p>
                  </div>
                  <Badge className="ml-auto bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTrackingStep;