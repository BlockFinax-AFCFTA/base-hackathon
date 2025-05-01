import React, { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  PlusCircle,
  Search,
  Filter,
  SortDesc,
  Download,
  Share,
  Check,
  X,
  FileText,
  File,
  FileImage,
  FilePdf
} from 'lucide-react';

/**
 * DocumentsPage component with internationalization 
 * Uses the documents namespace for translations
 */
const DocumentsPageI18n: React.FC = () => {
  // Use the 'documents' namespace for translations
  const { t } = useLocalization('documents');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock documents data - in real implementation, this would come from an API
  const documents = [
    /* This would be fetched from an API in a real implementation */
  ];

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return <FilePdf className="h-8 w-8 text-red-500" />;
      case 'jpg':
      case 'png':
      case 'jpeg': return <FileImage className="h-8 w-8 text-blue-500" />;
      case 'doc':
      case 'docx': return <FileText className="h-8 w-8 text-blue-700" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-200 text-green-800';
      case 'expired': return 'bg-red-200 text-red-800';
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'verified': return 'bg-blue-200 text-blue-800';
      case 'unverified': return 'bg-gray-200 text-gray-800';
      case 'rejected': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('documents.title')}</h1>
          <p className="text-gray-600">{t('documents.subtitle')}</p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>{t('documents.upload')}</span>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row mb-6">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder={t('documents.searchDocuments')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>{t('actions.filter')}</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <SortDesc className="h-4 w-4" />
            <span>{t('actions.sort')}</span>
          </Button>
        </div>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <Card key={document.id} className="border rounded-lg hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {getFileIcon(document.fileType)}
                    <div>
                      <CardTitle className="text-lg">{document.name}</CardTitle>
                      <CardDescription>
                        {`${document.fileType.toUpperCase()} • ${(document.fileSize / 1024 / 1024).toFixed(2)} MB`}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(document.status)}>
                    {t(`documents.status.${document.status}`)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">{t('documents.details.uploaded')}</p>
                    <p>{new Date(document.uploaded).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t('documents.details.uploader')}</p>
                    <p>{document.uploader}</p>
                  </div>
                  {document.referenceNumber && (
                    <div className="col-span-2">
                      <p className="text-gray-500">{t('documents.details.referenceNumber')}</p>
                      <p className="font-mono">{document.referenceNumber}</p>
                    </div>
                  )}
                  <div className="col-span-2 flex items-center mt-1">
                    <p className="text-gray-500 mr-2">{t('documents.details.verified')}:</p>
                    {document.isVerified ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{t('documents.download')}</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Share className="h-3 w-3" />
                  <span>{t('documents.share')}</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-lg font-medium mb-2">{t('documents.noDocuments')}</p>
            <p className="text-gray-500 mb-6">{t('documents.uploadNew')}</p>
            <Button className="mx-auto flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>{t('documents.upload')}</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentsPageI18n;