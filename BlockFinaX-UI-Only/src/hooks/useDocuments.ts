import { useState } from 'react';
import { Document } from '@/types';
import { documents } from '@/data/mockData';
import { delay } from '@/utils/helpers';

export interface EnhancedDocument extends Document {
  // Additional properties needed for UI
}

export const useDocuments = (contractId?: number, invoiceId?: number, userId?: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter documents based on provided parameters
  const getFilteredDocuments = () => {
    let filtered = [...documents];
    
    if (contractId) {
      filtered = filtered.filter(doc => doc.contractId === contractId);
    }
    
    if (invoiceId) {
      filtered = filtered.filter(doc => doc.invoiceId === invoiceId);
    }
    
    if (userId) {
      filtered = filtered.filter(doc => doc.uploadedBy === userId);
    }
    
    return filtered;
  };
  
  const [allDocuments, setAllDocuments] = useState<Document[]>(getFilteredDocuments());
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Get all documents
  const getDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await delay(800);
      
      const filtered = getFilteredDocuments();
      setAllDocuments(filtered);
      return filtered;
    } catch (err) {
      setError('Failed to fetch documents');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get a document by ID
  const getDocument = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await delay(500);
      
      const document = documents.find(doc => doc.id === id);
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      setSelectedDocument(document);
      return document;
    } catch (err) {
      setError('Failed to fetch document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Upload a new document (mock)
  const uploadDocument = async (data: {
    name: string,
    fileType: string,
    contractId?: number | null,
    invoiceId?: number | null,
    description?: string,
    tags?: string[]
  }, file: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with delay for file upload
      await delay(1500);
      
      // Create new document (mock)
      const newDocument: Document = {
        id: allDocuments.length + 1,
        name: data.name,
        fileType: data.fileType,
        fileSize: Math.floor(Math.random() * 10000000), // Random file size
        url: '#',
        uploadedBy: 1, // Current user ID
        isVerified: null,
        createdAt: new Date(),
        contractId: data.contractId || null,
        invoiceId: data.invoiceId || null,
        description: data.description,
        status: 'pending',
        tags: data.tags
      };
      
      // Update state
      setAllDocuments(prev => [...prev, newDocument]);
      
      return newDocument;
    } catch (err) {
      setError('Failed to upload document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Verify a document (mock)
  const verifyDocument = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await delay(1000);
      
      // Find document
      const docIndex = allDocuments.findIndex(doc => doc.id === id);
      
      if (docIndex === -1) {
        throw new Error('Document not found');
      }
      
      // Update document (mock)
      const updatedDocument: Document = {
        ...allDocuments[docIndex],
        isVerified: true,
        status: 'approved'
      };
      
      // Update state
      const updatedDocuments = [...allDocuments];
      updatedDocuments[docIndex] = updatedDocument;
      
      setAllDocuments(updatedDocuments);
      if (selectedDocument?.id === id) {
        setSelectedDocument(updatedDocument);
      }
      
      return updatedDocument;
    } catch (err) {
      setError('Failed to verify document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a document (mock)
  const deleteDocument = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await delay(800);
      
      // Filter out the document
      const filteredDocuments = allDocuments.filter(doc => doc.id !== id);
      
      // Update state
      setAllDocuments(filteredDocuments);
      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
      }
      
      return true;
    } catch (err) {
      setError('Failed to delete document');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    documents: allDocuments,
    selectedDocument,
    getDocuments,
    getDocument,
    uploadDocument,
    verifyDocument,
    deleteDocument
  };
};