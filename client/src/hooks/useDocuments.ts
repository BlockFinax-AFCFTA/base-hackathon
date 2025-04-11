import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Document } from '../types/document';
import { useToast } from '@/hooks/use-toast';

export const useDocuments = (contractId?: number) => {
  const { toast } = useToast();
  
  // Get all documents or documents for a specific contract
  const {
    data: documents = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: contractId ? ['/api/contracts', contractId, 'documents'] : ['/api/documents'],
  });
  
  // Upload document
  const uploadDocumentMutation = useMutation({
    mutationFn: async ({ file, contractId, tags = [] }: { file: File, contractId?: number, tags?: string[] }) => {
      // In a real app, you'd upload to a file storage service and get back a URL and hash
      // For this demo, we're creating a simulated document record
      const simulatedHash = `hash_${Math.random().toString(36).substring(2, 15)}`;
      const simulatedUrl = `https://example.com/documents/${simulatedHash}`;
      
      const documentData = {
        name: file.name,
        type: file.type,
        size: file.size,
        hash: simulatedHash,
        url: simulatedUrl,
        contractId,
        uploadedBy: "current_user_wallet_address", // This should come from context
        tags,
      };
      
      const response = await apiRequest('POST', '/api/documents', documentData);
      return response.json();
    },
    onSuccess: (_, variables) => {
      if (variables.contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/contracts', variables.contractId, 'documents'] });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Document Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });
  
  // Delete document
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: number) => {
      await apiRequest('DELETE', `/api/documents/${documentId}`);
      return documentId;
    },
    onSuccess: (documentId, _, context) => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      // If we know the contract ID, invalidate that specific query too
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ['/api/contracts', contractId, 'documents'] });
      }
      toast({
        title: "Document Deleted",
        description: "The document has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Document Deletion Failed",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });
  
  return {
    documents,
    isLoading,
    error,
    refetch,
    uploadDocument: uploadDocumentMutation.mutate,
    isUploading: uploadDocumentMutation.isPending,
    deleteDocument: deleteDocumentMutation.mutate,
    isDeleting: deleteDocumentMutation.isPending,
  };
};
