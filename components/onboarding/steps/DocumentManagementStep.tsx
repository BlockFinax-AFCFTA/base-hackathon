import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  FileCheck, 
  Shield, 
  Share2, 
  Download,
  FilePlus2,
  Check,
  ShieldCheck,
  XCircle,
  Pencil
} from 'lucide-react';

/**
 * The fifth step of the onboarding wizard
 * Demonstrates document management features
 */
const DocumentManagementStep: React.FC = () => {
  // Get localized translations
  const { t } = useLocalization('onboarding');
  
  // Local state for document upload demonstration
  const [documents, setDocuments] = useState<{
    id: string;
    name: string;
    status: 'uploading' | 'uploaded' | 'verified' | 'rejected' | 'pending';
    uploadProgress?: number;
  }[]>([
    { id: 'doc1', name: 'Commercial Invoice.pdf', status: 'verified' },
    { id: 'doc2', name: 'Bill of Lading.pdf', status: 'verified' },
  ]);
  
  // Handle document upload simulation
  const handleUploadDocument = () => {
    // Create a new document object with uploading status
    const newDoc = {
      id: `doc${documents.length + 1}`,
      name: Math.random() > 0.5 
        ? 'Certificate of Origin.pdf' 
        : 'Quality Inspection Report.pdf',
      status: 'uploading' as const,
      uploadProgress: 0
    };
    
    // Add the new document to the list
    setDocuments([...documents, newDoc]);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setDocuments(docs => {
        return docs.map(doc => {
          if (doc.id === newDoc.id) {
            const progress = (doc.uploadProgress || 0) + 20;
            
            if (progress >= 100) {
              clearInterval(interval);
              return { ...doc, status: 'uploaded', uploadProgress: 100 };
            }
            
            return { ...doc, uploadProgress: progress };
          }
          return doc;
        });
      });
    }, 500);
  };
  
  // Handle document verification simulation
  const handleVerifyDocument = (docId: string) => {
    setDocuments(docs => {
      return docs.map(doc => {
        if (doc.id === docId) {
          return { ...doc, status: 'pending' };
        }
        return doc;
      });
    });
    
    // Simulate verification process
    setTimeout(() => {
      setDocuments(docs => {
        return docs.map(doc => {
          if (doc.id === docId) {
            return { ...doc, status: 'verified' };
          }
          return doc;
        });
      });
    }, 2000);
  };
  
  // Get status component based on document status
  const getStatusComponent = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Verified</span>
          </Badge>
        );
      case 'uploading':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Uploading
          </Badge>
        );
      case 'uploaded':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Not Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-purple-100 text-purple-800">
            Verifying...
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{t('onboarding.step5.title')}</h1>
        <p className="text-gray-600 mt-2">{t('onboarding.step5.description')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('onboarding.step5.requiredDocs')}</CardTitle>
              <CardDescription>
                For this coffee export contract, the following documents are needed:
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center p-3 border rounded-md bg-white">
                    <div className="mr-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium">{doc.name}</p>
                      
                      {doc.status === 'uploading' && doc.uploadProgress !== undefined && (
                        <div className="w-full mt-1">
                          <Progress value={doc.uploadProgress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            Uploading: {doc.uploadProgress}%
                          </p>
                        </div>
                      )}
                      
                      {doc.status !== 'uploading' && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span className="mr-2">Added: May 1, 2025</span>
                          <span>•</span>
                          <span className="ml-2">Size: 2.4 MB</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex items-center space-x-2">
                      {getStatusComponent(doc.status)}
                      
                      {doc.status === 'uploaded' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => handleVerifyDocument(doc.id)}
                        >
                          <ShieldCheck className="h-3 w-3" />
                          <span>{t('onboarding.step5.verifyDoc')}</span>
                        </Button>
                      )}
                      
                      {doc.status === 'verified' && (
                        <div className="flex space-x-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button
                  onClick={handleUploadDocument}
                  variant="outline"
                  className="w-full py-8 border-dashed flex flex-col items-center justify-center"
                >
                  <Upload className="h-8 w-8 mb-2 text-gray-400" />
                  <span>{t('onboarding.step5.uploadDoc')}</span>
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-primary/5 rounded-md border border-primary/10 flex items-start">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm">
                  {t('onboarding.step5.blockchainVerification')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="space-y-4 sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Categories</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-blue-800">
                        <FileCheck className="h-4 w-4 mr-2" />
                        <span>Commercial Documents</span>
                      </span>
                      <Badge className="bg-blue-100 text-blue-800">2/3</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Commercial Invoice, Packing List, etc.</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-green-800">
                        <Shield className="h-4 w-4 mr-2" />
                        <span>Regulatory Documents</span>
                      </span>
                      <Badge className="bg-green-100 text-green-800">1/2</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Certificate of Origin, Export License, etc.</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-purple-800">
                        <FilePlus2 className="h-4 w-4 mr-2" />
                        <span>Quality Documents</span>
                      </span>
                      <Badge className="bg-purple-100 text-purple-800">0/2</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Inspection Reports, Quality Certificates, etc.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-green-800 mb-2">Verification Benefits</h4>
                <ul className="text-sm text-green-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-700 mt-0.5 flex-shrink-0" />
                    <span>Prevents document fraud and forgery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-700 mt-0.5 flex-shrink-0" />
                    <span>Builds trust between trading partners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-700 mt-0.5 flex-shrink-0" />
                    <span>Speeds up customs clearance process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-700 mt-0.5 flex-shrink-0" />
                    <span>Ensures regulatory compliance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagementStep;