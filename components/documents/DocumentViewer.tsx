import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  EyeIcon, 
  FileCode, 
  FileSpreadsheet, 
  X, 
  ExternalLink,
  Share2,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { formatFileSize, isViewableInBrowser, getDocumentIcon } from '../../utils/documentUtils';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import DocumentViewerContent from './DocumentViewerContent';

export interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    name: string;
    fileType: string;
    fileSize: number;
    referenceNumber: string;
    createdAt: Date;
    url: string;
    status: 'approved' | 'pending' | 'draft' | 'expired';
    tags?: string[];
  } | null;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  open,
  onOpenChange,
  document
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [downloading, setDownloading] = useState(false);

  if (!document) return null;

  const DocumentIcon = getDocumentIcon(document.fileType);
  const canPreview = isViewableInBrowser(document.fileType);
  const formattedDate = format(new Date(document.createdAt), 'MMM dd, yyyy');

  const handleDownload = async () => {
    if (!document?.url) return;
    
    try {
      setDownloading(true);
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = document.url;
      link.setAttribute('download', document.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your document is being downloaded",
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the document",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };

  const copyLinkToClipboard = () => {
    if (!document?.url) return;
    
    navigator.clipboard.writeText(document.url)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Document link copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        toast({
          title: "Copy Failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive"
        });
      });
  };

  const getStatusBadge = () => {
    switch (document.status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-300">
            Pending Review
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-300">
            Draft
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-300">
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-md mr-3">
              <DocumentIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-left">{document.name}</DialogTitle>
              <DialogDescription className="text-left">
                {document.referenceNumber}
              </DialogDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center border-b">
            <TabsList>
              <TabsTrigger value="preview" className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2 p-2">
              <Button
                size="sm"
                variant="outline"
                onClick={copyLinkToClipboard}
                className="text-xs"
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Copy Link
              </Button>
              <Button
                size="sm"
                onClick={handleDownload}
                disabled={downloading}
                className="text-xs"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download
              </Button>
            </div>
          </div>

          <TabsContent value="preview" className="flex-1 overflow-auto">
            {canPreview ? (
              document.fileType.match(/^(image|png|jpg|jpeg|gif|svg|webp)$/) ? (
                <div className="flex items-center justify-center h-full">
                  <img 
                    src={document.url} 
                    alt={document.name}
                    className="max-w-full max-h-full object-contain" 
                    onError={(e) => {
                      // If image load fails, show error message
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const container = target.parentElement;
                      if (container) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'flex flex-col items-center justify-center p-8 text-center';
                        
                        const iconDiv = document.createElement('div');
                        iconDiv.className = 'bg-gray-100 p-6 rounded-full mb-4';
                        iconDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
                        
                        const title = document.createElement('h3');
                        title.className = 'text-lg font-medium mb-2';
                        title.textContent = 'Image preview failed';
                        
                        const desc = document.createElement('p');
                        desc.className = 'text-gray-500 mb-6 max-w-md';
                        desc.textContent = 'Unable to load image preview. The image may be unavailable or in an unsupported format.';
                        
                        errorDiv.appendChild(iconDiv);
                        errorDiv.appendChild(title);
                        errorDiv.appendChild(desc);
                        container.appendChild(errorDiv);
                      }
                    }}
                  />
                </div>
              ) : document.fileType === 'pdf' ? (
                <div className="w-full">
                  <iframe 
                    src={`${document.url}#toolbar=0`} 
                    className="w-full h-[600px]" 
                    title={document.name}
                    onError={() => {
                      // We'd handle PDF loading errors here
                      console.error('PDF failed to load');
                    }}
                  />
                </div>
              ) : document.fileType.match(/^(txt|text)$/) ? (
                // Text preview using our DocumentViewerContent
                <div className="bg-white min-h-[300px] max-h-[600px] overflow-auto">
                  <DocumentViewerContent url={document.url} fileType={document.fileType} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <a 
                    href={document.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in new tab
                  </a>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <DocumentIcon className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Preview not available</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  This document format can't be previewed directly in the browser. 
                  You can download it to view on your device.
                </p>
                <Button onClick={handleDownload} disabled={downloading}>
                  <Download className="h-4 w-4 mr-2" />
                  {downloading ? 'Downloading...' : 'Download Document'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="p-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">Document Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-gray-500">{document.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reference Number</p>
                    <p className="text-sm text-gray-500">{document.referenceNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">File Type</p>
                    <p className="text-sm text-gray-500">{document.fileType.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Size</p>
                    <p className="text-sm text-gray-500">{formatFileSize(document.fileSize)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created Date</p>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <div className="mt-1">
                      {getStatusBadge()}
                    </div>
                  </div>
                </div>
              </div>
              
              {document.tags && document.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;