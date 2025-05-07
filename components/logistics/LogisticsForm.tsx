import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  CardDescription 
} from '../ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { useLogistics, Logistics, LogisticsProvider } from '../../hooks/useLogistics';
import { Truck, Calendar, Loader2 } from 'lucide-react';

// Form validation schema
const logisticsFormSchema = z.object({
  type: z.enum(['BOOKING', 'TRACKING']),
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  shipmentDate: z.string().min(1, 'Shipment date is required'),
  cargoType: z.string().min(1, 'Cargo type is required'),
  weight: z.string().min(1, 'Weight is required'),
  specialRequirements: z.string().optional(),
  providerId: z.string().optional(),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().optional(),
});

type LogisticsFormValues = z.infer<typeof logisticsFormSchema>;

interface LogisticsFormProps {
  contractId?: number;
  logisticsId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LogisticsForm: React.FC<LogisticsFormProps> = ({ 
  contractId, 
  logisticsId,
  onSuccess, 
  onCancel 
}) => {
  const { toast } = useToast();
  const { 
    logisticsItem,
    logisticsProviders = [],
    isLoadingLogisticsItem,
    isLoadingProviders,
    createLogistics,
    updateLogistics,
    isCreatingLogistics,
    isUpdatingLogistics
  } = useLogistics(logisticsId, contractId);

  const form = useForm<LogisticsFormValues>({
    resolver: zodResolver(logisticsFormSchema),
    defaultValues: {
      type: 'BOOKING',
      origin: '',
      destination: '',
      shipmentDate: new Date().toISOString().split('T')[0],
      cargoType: '',
      weight: '',
      specialRequirements: '',
      providerId: '',
      trackingNumber: '',
      estimatedDelivery: ''
    }
  });

  // Populate form with existing data if editing
  React.useEffect(() => {
    if (logisticsItem) {
      form.reset({
        type: logisticsItem.type,
        origin: logisticsItem.origin,
        destination: logisticsItem.destination,
        shipmentDate: new Date(logisticsItem.shipmentDate).toISOString().split('T')[0],
        cargoType: logisticsItem.cargoType,
        weight: logisticsItem.weight,
        specialRequirements: logisticsItem.specialRequirements || '',
        providerId: logisticsItem.providerId ? String(logisticsItem.providerId) : '',
        trackingNumber: logisticsItem.trackingNumber || '',
        estimatedDelivery: logisticsItem.estimatedDelivery 
          ? new Date(logisticsItem.estimatedDelivery).toISOString().split('T')[0]
          : ''
      });
    }
  }, [logisticsItem, form]);

  const onSubmit = (data: LogisticsFormValues) => {
    const logisticsData: Partial<Logistics> = {
      type: data.type,
      origin: data.origin,
      destination: data.destination,
      shipmentDate: new Date(data.shipmentDate),
      cargoType: data.cargoType,
      weight: data.weight,
      specialRequirements: data.specialRequirements || null,
      providerId: data.providerId ? parseInt(data.providerId) : null,
      trackingNumber: data.trackingNumber || null,
      estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : null,
      contractId,
      userId: 1, // In a real app, this would be the current user's ID
      status: 'PENDING'
    };

    if (logisticsId) {
      // Update existing
      updateLogistics({ 
        id: logisticsId, 
        data: logisticsData 
      }, {
        onSuccess: () => {
          toast({
            title: "Logistics Updated",
            description: "Logistics information has been updated successfully.",
          });
          onSuccess && onSuccess();
        }
      });
    } else {
      // Create new
      createLogistics(logisticsData, {
        onSuccess: () => {
          toast({
            title: "Logistics Created",
            description: "Logistics has been created successfully.",
          });
          onSuccess && onSuccess();
        }
      });
    }
  };

  const isLoading = isLoadingLogisticsItem || isLoadingProviders;
  const isSubmitting = isCreatingLogistics || isUpdatingLogistics;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            {logisticsId ? 'Update Logistics' : 'Create Logistics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading...</p>
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
          {logisticsId ? 'Update Logistics' : 'Create Logistics'}
        </CardTitle>
        <CardDescription>
          {logisticsId 
            ? 'Update logistics information for this shipment'
            : 'Set up logistics for your shipment'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logistics Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BOOKING">Booking</SelectItem>
                        <SelectItem value="TRACKING">Tracking</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select whether you are booking a new shipment or tracking an existing one
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Provider */}
              <FormField
                control={form.control}
                name="providerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logistics Provider</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">No provider selected</SelectItem>
                        {logisticsProviders.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id.toString()}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the logistics provider for this shipment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Origin */}
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lagos, Nigeria" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the shipment origin location
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Destination */}
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Accra, Ghana" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the shipment destination location
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shipment Date */}
              <FormField
                control={form.control}
                name="shipmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipment Date</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      When is the shipment scheduled
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estimated Delivery */}
              <FormField
                control={form.control}
                name="estimatedDelivery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Delivery</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      When is the shipment estimated to arrive
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cargo Type */}
              <FormField
                control={form.control}
                name="cargoType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Electronics, Coffee Beans" {...field} />
                    </FormControl>
                    <FormDescription>
                      Type of goods being shipped
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Weight */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., 500" {...field} />
                    </FormControl>
                    <FormDescription>
                      Weight of the cargo in kilograms
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tracking Number */}
              <FormField
                control={form.control}
                name="trackingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracking Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TRK1234567890" {...field} />
                    </FormControl>
                    <FormDescription>
                      Tracking number for this shipment (if available)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Special Requirements */}
            <FormField
              control={form.control}
              name="specialRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requirements</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special handling requirements or additional information"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Any special handling or shipping instructions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {logisticsId ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{logisticsId ? 'Update Logistics' : 'Create Logistics'}</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LogisticsForm;