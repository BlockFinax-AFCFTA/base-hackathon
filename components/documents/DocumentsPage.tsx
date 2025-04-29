import React from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import DocumentList from './DocumentList';
import DocumentUpload from './DocumentUpload';
import LogisticsPage from '../logistics/LogisticsPage';
import { Upload, Truck } from 'lucide-react';

const DocumentsPage = () => {
  const [location] = useLocation();
  
  if (location === '/documents/upload') {
    return <DocumentUpload />;
  } else {
    return (
      <div className="space-y-6">
        <Tabs defaultValue="documents">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Documents</span>
              </TabsTrigger>
              <TabsTrigger value="logistics" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Logistics</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="documents">
            <DocumentList />
          </TabsContent>
          
          <TabsContent value="logistics">
            <LogisticsPage />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
};

export default DocumentsPage;
