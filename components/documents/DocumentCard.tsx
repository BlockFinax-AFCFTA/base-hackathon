import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  Download,
  Calendar
} from 'lucide-react';
import { formatFileSize, getDocumentIcon } from '../../utils/documentUtils';
import { format } from 'date-fns';

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
  const DocumentIcon = getDocumentIcon(fileType);
  
  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'draft':
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'draft':
        return 'Draft';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };
  
  const getStatusBadgeVariant = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100 border-green-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300';
      case 'draft':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-300';
      case 'expired':
        return 'bg-red-100 text-red-800 hover:bg-red-100 border-red-300';
      default:
        return '';
    }
  };
  
  return (
    <Card 
      className="overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="bg-primary/5 p-4 flex justify-between items-start border-b">
        <div className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-md">
            <DocumentIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {referenceNumber}
            </p>
          </div>
        </div>
        <Badge className={`${getStatusBadgeVariant()} flex items-center gap-1`}>
          {getStatusIcon()}
          <span className="text-[10px] font-medium">{getStatusText()}</span>
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-muted-foreground text-xs">File Size</span>
          <span className="font-medium text-xs">{formatFileSize(fileSize)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Calendar className="h-3.5 w-3.5" />
          <span>{format(new Date(createdAt), 'MMM dd, yyyy')}</span>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs group-hover:border-primary group-hover:text-primary transition-colors"
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          View Document
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;