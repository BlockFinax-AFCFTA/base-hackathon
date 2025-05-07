import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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
  milestones: Record<string, Milestone> | null;
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

export const useLogistics = (contractId?: number, logisticsId?: number, userId?: number) => {
  const queryClient = useQueryClient();
  
  // Build query parameters for logistics
  const getLogisticsQueryParams = () => {
    const params = new URLSearchParams();
    if (contractId) params.append('contractId', contractId.toString());
    if (userId) params.append('userId', userId.toString());
    return params.toString() ? `?${params.toString()}` : '';
  };
  
  // Get logistics by contract ID or specific logistics ID
  const {
    data: logistics,
    isLoading: isLoadingLogistics,
    error: logisticsError,
    refetch: refetchLogistics
  } = useQuery({
    queryKey: ['/api/logistics', logisticsId || contractId],
    queryFn: async () => {
      if (logisticsId) {
        return apiRequest(`/api/logistics/${logisticsId}`);
      }
      // Get the first logistics associated with the contract
      const response = await apiRequest(`/api/logistics${getLogisticsQueryParams()}`);
      return Array.isArray(response) && response.length > 0 ? response[0] : {};
    },
    enabled: !!logisticsId || !!contractId,
  });
  
  // Get all logistics items for a user (for logistics dashboard)
  const {
    data: allLogistics,
    isLoading: isLoadingAllLogistics,
    error: allLogisticsError,
    refetch: refetchAllLogistics
  } = useQuery({
    queryKey: ['/api/logistics/all', userId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId.toString());
      const queryParams = params.toString() ? `?${params.toString()}` : '';
      return apiRequest(`/api/logistics${queryParams}`);
    },
    enabled: !logisticsId && !contractId && !!userId,
  });
  
  // Get logistics providers
  const {
    data: logisticsProviders,
    isLoading: isLoadingProviders
  } = useQuery({
    queryKey: ['/api/logistics/providers'],
    queryFn: async () => {
      return apiRequest('/api/logistics/providers');
    },
  });
  
  // Create logistics
  const { mutateAsync: createLogistics, isPending: isCreatingLogistics } = useMutation({
    mutationFn: async (data: Partial<Logistics>) => {
      return apiRequest('/api/logistics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/logistics'] });
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/logistics', contractId] });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/logistics/all'] });
    },
  });
  
  // Update logistics
  const { mutateAsync: updateLogistics, isPending: isUpdatingLogistics } = useMutation({
    mutationFn: async ({ id, ...data }: { id: number; [key: string]: any }) => {
      return apiRequest(`/api/logistics/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/logistics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/logistics', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/logistics/all'] });
    },
  });
  
  // Update milestone status
  const updateMilestone = async (milestoneKey: string, status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' = 'COMPLETED') => {
    if (!logistics || !logistics.id) {
      throw new Error('No logistics data found');
    }
    
    const updatedMilestones = {
      ...logistics.milestones,
      [milestoneKey]: {
        ...logistics.milestones?.[milestoneKey],
        status,
        timestamp: status === 'COMPLETED' ? new Date() : logistics.milestones?.[milestoneKey]?.timestamp,
      },
    };
    
    return updateLogistics({
      id: logistics.id,
      milestones: updatedMilestones,
    });
  };
  
  // Confirm delivery (final milestone)
  const confirmDelivery = async () => {
    if (!logistics || !logistics.id) {
      throw new Error('No logistics data found');
    }
    
    // Update all milestones to completed
    const updatedMilestones = { ...logistics.milestones };
    if (updatedMilestones) {
      Object.keys(updatedMilestones).forEach(key => {
        updatedMilestones[key] = {
          ...updatedMilestones[key],
          status: 'COMPLETED',
          timestamp: updatedMilestones[key].timestamp || new Date(),
        };
      });
    }
    
    // Update the logistics status to delivered
    return updateLogistics({
      id: logistics.id,
      status: 'DELIVERED',
      milestones: updatedMilestones,
    });
  };
  
  return {
    // Data and loading states
    logistics,
    allLogistics,
    logisticsProviders,
    isLoadingLogistics,
    isLoadingAllLogistics,
    isLoadingProviders,
    logisticsError,
    allLogisticsError,
    
    // CRUD operations
    createLogistics,
    updateLogistics,
    
    // Refetch methods
    refetchLogistics,
    refetchAllLogistics,
    
    // Logistics-specific actions
    updateMilestone,
    confirmDelivery,
    
    // Loading states for mutations
    isCreatingLogistics,
    isUpdatingLogistics,
    
    // Custom helpers for components
    isLoading: isLoadingLogistics,
    error: logisticsError,
  };
};