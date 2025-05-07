import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface EnhancedDocument {
  id: number;
  name: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: number;
  isVerified: boolean | null;
  createdAt: Date;
  contractId: number | null;
  invoiceId: number | null;
}

export const useDocuments = (contractId?: number, invoiceId?: number, userId?: number) => {
  const queryClient = useQueryClient();
  
  // Build query parameters based on provided filters
  const getQueryParams = () => {
    const params = new URLSearchParams();
    if (contractId) params.append('contractId', contractId.toString());
    if (invoiceId) params.append('invoiceId', invoiceId.toString());
    if (userId) params.append('uploadedBy', userId.toString());
    return params.toString() ? `?${params.toString()}` : '';
  };
  
  // Get documents
  const { 
    data: documents, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['/api/documents', contractId, invoiceId, userId],
    queryFn: async () => {
      const response = await apiRequest(`/api/documents${getQueryParams()}`);
      return response as EnhancedDocument[];
    },
  });
  
  // Upload document
  const { mutateAsync: uploadDocument, isPending: isUploading } = useMutation({
    mutationFn: async ({ 
      file, 
      name, 
      contractId: cId, 
      invoiceId: iId 
    }: { 
      file: File, 
      name?: string, 
      contractId?: number, 
      invoiceId?: number 
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (name) formData.append('name', name);
      if (cId) formData.append('contractId', cId.toString());
      if (iId) formData.append('invoiceId', iId.toString());
      
      return apiRequest('/api/documents', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
    },
  });
  
  // Delete document
  const { mutateAsync: deleteDocument, isPending: isDeleting } = useMutation({
    mutationFn: async (documentId: number) => {
      return apiRequest(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
    },
  });
  
  // Verify document (update verification status)
  const { mutateAsync: verifyDocument, isPending: isVerifying } = useMutation({
    mutationFn: async ({ id, verified }: { id: number, verified: boolean }) => {
      return apiRequest(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: verified }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
    },
  });
  
  return {
    documents,
    isLoading,
    error,
    refetch,
    uploadDocument,
    deleteDocument,
    verifyDocument,
    isUploading,
    isDeleting,
    isVerifying,
  };
};