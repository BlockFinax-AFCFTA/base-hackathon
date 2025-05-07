import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Truck, Star, Clock, DollarSign, Globe, Phone, Mail, CalendarRange } from 'lucide-react';
import { useLogistics, LogisticsProvider } from '../../hooks/useLogistics';

interface LogisticsProvidersProps {
  onSelectProvider?: (provider: LogisticsProvider) => void;
}

const LogisticsProviders: React.FC<LogisticsProvidersProps> = ({ onSelectProvider }) => {
  const { logisticsProviders, isLoadingProviders } = useLogistics();

  if (isLoadingProviders) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Logistics Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading providers...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="h-5 w-5 mr-2" />
          Logistics Providers
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logisticsProviders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No logistics providers available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logisticsProviders.map((provider) => (
              <div 
                key={provider.id} 
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Logo/Image */}
                  <div className="w-full sm:w-24 h-24 bg-gray-100 flex items-center justify-center p-2">
                    {provider.logo ? (
                      <img 
                        src={provider.logo} 
                        alt={provider.name} 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Truck className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Provider Details */}
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{provider.name}</h3>
                        <div className="flex items-center text-sm mt-1">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{provider.rating}/5.0</span>
                          
                          {provider.sustainabilityRating && (
                            <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">
                              Eco {provider.sustainabilityRating}/5.0
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center text-sm font-medium">
                          <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                          {provider.basePrice} {provider.currency}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Est. {provider.estimatedDays} days
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2">{provider.description}</p>
                    
                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {Array.isArray(provider.specialties) && provider.specialties.map((specialty, index) => (
                        <Badge variant="outline" key={index}>
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Contact Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 text-xs text-gray-500">
                      {provider.website && (
                        <div className="flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          <a href={provider.website} target="_blank" rel="noopener noreferrer" className="truncate hover:text-primary">
                            {provider.website.replace(/(^\w+:|^)\/\//, '')}
                          </a>
                        </div>
                      )}
                      
                      {provider.contactPhone && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{provider.contactPhone}</span>
                        </div>
                      )}
                      
                      {provider.contactEmail && (
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="truncate">{provider.contactEmail}</span>
                        </div>
                      )}
                      
                      {provider.yearEstablished && (
                        <div className="flex items-center">
                          <CalendarRange className="h-3 w-3 mr-1" />
                          <span>Est. {provider.yearEstablished}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Footer / Actions */}
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                  <div>
                    {provider.certificates && Array.isArray(provider.certificates) && provider.certificates.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {provider.certificates.length} Certificates
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`/logistics/providers/${provider.id}`, '_blank')}
                    >
                      View Profile
                    </Button>
                    
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => onSelectProvider && onSelectProvider(provider)}
                    >
                      Select Provider
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LogisticsProviders;