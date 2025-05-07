import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export const useContracts = (contractId?: number) => {
  const queryClient = useQueryClient();
  
  // For getting all contracts
  const {
    data: contracts,
    isLoading: isLoadingContracts,
    error: contractsError,
    refetch: refetchContracts
  } = useQuery({
    queryKey: ['/api/contracts'],
    enabled: contractId === undefined,
  });
  
  // For getting a specific contract
  const {
    data: contract,
    isLoading: isLoadingContract,
    error: contractError,
    refetch: refetchContract
  } = useQuery({
    queryKey: ['/api/contracts', contractId],
    enabled: contractId !== undefined,
  });
  
  // Create a new contract
  const { mutateAsync: createContract } = useMutation({
    mutationFn: async (contractData: Partial<any>) => {
      return apiRequest('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
    },
  });
  
  // Update an existing contract
  const { mutateAsync: updateContract } = useMutation({
    mutationFn: async ({ id, ...data }: { id: number; [key: string]: any }) => {
      return apiRequest(`/api/contracts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts', variables.id] });
    },
  });
  
  // Delete a contract
  const { mutateAsync: deleteContract } = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/contracts/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
    },
  });
  
  // Additional methods for contract actions
  const approve = async () => {
    if (!contractId) throw new Error('Contract ID is required');
    return updateContract({ 
      id: contractId, 
      status: 'PENDINGAPPROVAL' 
    });
  };
  
  const fund = async () => {
    if (!contractId) throw new Error('Contract ID is required');
    return updateContract({ 
      id: contractId, 
      status: 'FUNDED' 
    });
  };
  
  const release = async () => {
    if (!contractId) throw new Error('Contract ID is required');
    return updateContract({ 
      id: contractId, 
      status: 'COMPLETED' 
    });
  };
  
  return {
    // Data and loading states
    contracts,
    contract,
    isLoadingContracts,
    isLoadingContract,
    contractsError,
    contractError,
    
    // CRUD operations
    createContract,
    updateContract,
    deleteContract,
    
    // Refetch methods
    refetchContracts,
    refetchContract,
    
    // Contract actions
    approve,
    fund,
    release,
    
    // Custom helpers for the component
    isLoading: contractId ? isLoadingContract : isLoadingContracts,
    error: contractId ? contractError : contractsError,
  };
};