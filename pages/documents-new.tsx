import React from 'react';
import { Card } from '@/components/ui/card';
import DocumentGrid from '@/components/documents/DocumentGrid';
import Layout from '@/components/layout/Layout';

const DocumentsNewPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <DocumentGrid />
      </div>
    </Layout>
  );
};

export default DocumentsNewPage;