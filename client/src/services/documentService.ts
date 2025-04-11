import { apiRequest } from '@/lib/queryClient';
import { Document } from '../types/document';

export class DocumentService {
  async getDocuments(): Promise<Document[]> {
    const response = await apiRequest('GET', '/api/documents');
    return response.json();
  }
  
  async getDocumentsByContractId(contractId: string): Promise<Document[]> {
    const response = await apiRequest('GET', `/api/contracts/${contractId}/documents`);
    return response.json();
  }
  
  async uploadDocument(file: File, contractId?: string, tags: string[] = []): Promise<Document> {
    // In a real app, this would involve uploading the file to a storage service
    // and then storing metadata in the backend. For this demo, we're simulating this.
    
    // Simulate hash and URL generation
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
  }
  
  async deleteDocument(id: string): Promise<boolean> {
    try {
      await apiRequest('DELETE', `/api/documents/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error);
      return false;
    }
  }
  
  async verifyDocumentHash(hash: string, expectedHash: string): Promise<boolean> {
    // In a real app, this would check if the hash of the uploaded document
    // matches the hash stored on the blockchain
    return hash === expectedHash;
  }
}

export default DocumentService;
