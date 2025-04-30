export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  hash: string;
  url: string;
  contractId?: string;
  invoiceId?: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
  referenceNumber: string;
  status: DocumentStatus;
  isVerified?: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  expiryDate?: Date;
  access: number[]; // Array of user IDs with access
  sharedLinks?: {
    id: string;
    url: string;
    createdAt: Date;
    expiresAt?: Date;
    accessCount: number;
    isPasswordProtected: boolean;
  }[];
  versions?: {
    id: string;
    versionNumber: number;
    createdAt: Date;
    createdBy: string;
    changes: string;
    url: string;
  }[];
  signatures?: {
    id: string;
    signedBy: string;
    signedAt: Date;
    signatureType: 'ELECTRONIC' | 'DIGITAL';
    position: { x: number, y: number, page: number };
  }[];
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getDocumentIcon = (type: string): string => {
  if (type.includes('pdf')) return 'file-pdf';
  if (type.includes('word') || type.includes('msword')) return 'file-word';
  if (type.includes('excel') || type.includes('spreadsheet')) return 'file-excel';
  if (type.includes('image')) return 'image';
  if (type.includes('zip') || type.includes('compressed')) return 'file-archive';
  if (type.includes('text')) return 'file-text';
  return 'file';
};
