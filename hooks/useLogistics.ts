import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { queryClient } from '../lib/queryClient';
import { useToast } from './use-toast';

interface Milestone {
  name: string;
  status: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS';
  timestamp: Date | null;
  location?: string;
  notes?: string;
}

export interface Logistics {
  id: number;
  userId: number;
  contractId: number | null;
  type: 'BOOKING' | 'TRACKING';
  status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  origin: string;
  destination: string;
  shipmentDate: Date;
  cargoType: string;
  weight: string;
  specialRequirements: string | null;
  providerId: number | null;
  trackingNumber: string | null;
  milestones: Milestone[] | null;
  estimatedDelivery: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogisticsProvider {
  id: number;
  name: string;
  logo: string;
  rating: string;
  specialties: string[];
  description: string;
  basePrice: string;
  currency: string;
  estimatedDays: number;
  address?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  yearEstablished?: number;
  fleetSize?: number;
  certificates?: any[];
  sustainabilityRating?: string;
}

export const useLogistics = (logisticsId?: number, contractId?: number, userId?: number) => {
  const { toast } = useToast();

  // Get all logistics entries
  const { 
    data: logistics = [],
    isLoading: isLoadingLogistics,
    error: logisticsError,
    refetch: refetchLogistics
  } = useQuery({
    queryKey: ['/api/logistics'],
    enabled: !logisticsId && !contractId && !userId,
  });

  // Get logistics by ID
  const {
    data: logisticsItem,
    isLoading: isLoadingLogisticsItem,
    error: logisticsItemError,
    refetch: refetchLogisticsItem
  } = useQuery({
    queryKey: ['/api/logistics', logisticsId],
    enabled: !!logisticsId,
  });

  // Get logistics by contract ID
  const {
    data: contractLogistics = [],
    isLoading: isLoadingContractLogistics,
    error: contractLogisticsError,
    refetch: refetchContractLogistics
  } = useQuery({
    queryKey: ['/api/contracts', contractId, 'logistics'],
    enabled: !!contractId,
  });

  // Get logistics by user ID
  const {
    data: userLogistics = [],
    isLoading: isLoadingUserLogistics,
    error: userLogisticsError,
    refetch: refetchUserLogistics
  } = useQuery({
    queryKey: ['/api/users', userId, 'logistics'],
    enabled: !!userId,
  });

  // Get logistics providers
  const {
    data: logisticsProviders = [],
    isLoading: isLoadingProviders,
    error: providersError,
    refetch: refetchProviders
  } = useQuery({
    queryKey: ['/api/logistics/providers'],
  });

  // Create logistics
  const createLogisticsMutation = useMutation({
    mutationFn: async (logisticsData: Partial<Logistics>) => {
      const response = await apiRequest('POST', '/api/logistics', logisticsData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/logistics'] });
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/contracts', contractId, 'logistics'] });
      }
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'logistics'] });
      }
      toast({
        title: "Logistics Created",
        description: "Logistics entry has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create logistics entry",
        variant: "destructive",
      });
    },
  });

  // Update logistics
  const updateLogisticsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<Logistics> }) => {
      const response = await apiRequest('PATCH', `/api/logistics/${id}`, data);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/logistics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/logistics', variables.id] });
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/contracts', contractId, 'logistics'] });
      }
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'logistics'] });
      }
      toast({
        title: "Logistics Updated",
        description: "Logistics entry has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update logistics entry",
        variant: "destructive",
      });
    },
  });

  return {
    // All logistics
    logistics,
    isLoadingLogistics,
    logisticsError,
    refetchLogistics,
    
    // Single logistics item
    logisticsItem,
    isLoadingLogisticsItem,
    logisticsItemError,
    refetchLogisticsItem,
    
    // Contract logistics
    contractLogistics,
    isLoadingContractLogistics,
    contractLogisticsError,
    refetchContractLogistics,
    
    // User logistics
    userLogistics,
    isLoadingUserLogistics,
    userLogisticsError,
    refetchUserLogistics,
    
    // Providers
    logisticsProviders,
    isLoadingProviders,
    providersError,
    refetchProviders,
    
    // Mutations
    createLogistics: createLogisticsMutation.mutate,
    isCreatingLogistics: createLogisticsMutation.isPending,
    updateLogistics: updateLogisticsMutation.mutate,
    isUpdatingLogistics: updateLogisticsMutation.isPending,
  };
};