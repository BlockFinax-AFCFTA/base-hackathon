import React from 'react';
import { File, CheckCircle, Clock, FileText, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getDocumentIcon } from '@/utils/documentUtils';

export interface DocumentCardProps {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
  status: 'approved' | 'pending' | 'draft' | 'expired';
  referenceNumber: string;
  onClick: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  name,
  fileType,
  fileSize,
  createdAt,
  status,
  referenceNumber,
  onClick
}) => {
  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get document icon based on file type
  const DocumentIcon = getDocumentIcon(fileType);

  // Format date
  const formattedDate = format(new Date(createdAt), 'MMM dd, yyyy');

  // Get status badge styling
  const getStatusBadge = () => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </div>
        );
      case 'draft':
        return (
          <div className="flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
            <File className="h-3 w-3 mr-1" />
            Draft
          </div>
        );
      case 'expired':
        return (
          <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Expired
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex">
        <div className="mr-4">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg text-primary">
            <DocumentIcon className="h-6 w-6" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-lg text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500">Reference Number: {referenceNumber}</p>
            </div>
            {getStatusBadge()}
          </div>
          
          <div className="mt-2 flex items-center text-xs text-gray-500 space-x-3">
            <span className="flex items-center">
              <FileText className="h-3.5 w-3.5 mr-1 text-gray-400" />
              {formatFileSize(fileSize)}
            </span>
            <span className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;