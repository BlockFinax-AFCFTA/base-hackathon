import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Book, 
  BookOpen, 
  Globe, 
  Loader2, 
  Check, 
  ArrowLeft,
  Download,
  Share2,
  Printer,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

// Sample data
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AU', name: 'Australia' },
];

const PRODUCT_CATEGORIES = [
  'Agriculture & Food',
  'Chemicals & Pharmaceuticals',
  'Consumer Goods',
  'Electronics & Technology',
  'Industrial Equipment',
  'Medical Devices',
];

// Helper function to parse query parameters
const parseQueryParams = () => {
  if (typeof window === 'undefined') return {};
  
  const search = window.location.search;
  if (!search) return {};
  
  const params = new URLSearchParams(search);
  return {
    product: params.get('product') || '',
    origin: params.get('origin') || '',
    destination: params.get('destination') || '',
    category: params.get('category') || ''
  };
};

const RegulatoryAIPage: React.FC = () => {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  
  // Extract query parameters if available
  const queryParams = parseQueryParams();
  
  const [product, setProduct] = useState(queryParams.product || '');
  const [originCountry, setOriginCountry] = useState(queryParams.origin || '');
  const [destinationCountry, setDestinationCountry] = useState(queryParams.destination || '');
  const [productCategory, setProductCategory] = useState(queryParams.category || '');
  const [additionalDetails, setAdditionalDetails] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState('requirements');
  
  // Handle form submission
  const handleAnalyzeClick = async () => {
    if (!product || !originCountry || !destinationCountry || !productCategory) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/regulatory-ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product,
          originCountry,
          destinationCountry,
          productCategory,
          additionalDetails
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze export requirements');
      }
      
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: error.message || 'An error occurred during the analysis',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Handle reset/new analysis
  const handleReset = () => {
    setAnalysisResult(null);
    // Keep the form fields populated
  };
  
  // Render the export requirements form
  const renderExportForm = () => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-2xl">Export Regulatory Assistant</CardTitle>
            <CardDescription>
              Get AI-powered guidance on export regulations, documentation, and compliance requirements
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="product" className="text-sm font-medium block mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="product"
              placeholder="e.g. Medical Equipment, Coffee Beans"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">Enter the specific product you want to export</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="origin" className="text-sm font-medium block mb-1">
                Origin Country <span className="text-red-500">*</span>
              </label>
              <Select
                value={originCountry}
                onValueChange={setOriginCountry}
              >
                <SelectTrigger id="origin">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">Country where goods are manufactured</p>
            </div>
            
            <div>
              <label htmlFor="destination" className="text-sm font-medium block mb-1">
                Destination Country <span className="text-red-500">*</span>
              </label>
              <Select
                value={destinationCountry}
                onValueChange={setDestinationCountry}
              >
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">Country where goods will be imported</p>
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="text-sm font-medium block mb-1">
              Product Category <span className="text-red-500">*</span>
            </label>
            <Select
              value={productCategory}
              onValueChange={setProductCategory}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">Category helps determine applicable regulations</p>
          </div>
          
          <div>
            <label htmlFor="details" className="text-sm font-medium block mb-1">
              Additional Details (Optional)
            </label>
            <Textarea
              id="details"
              placeholder="Add any specific details about your product (specifications, intended use, etc.)"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              rows={4}
            />
            <p className="text-sm text-gray-500 mt-1">More details enable more accurate guidance</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Button onClick={handleAnalyzeClick} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Export Requirements...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Analyze Export Requirements
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
  
  // Render the analysis results
  const renderAnalysisResults = () => {
    if (!analysisResult) return null;
    
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
            <Badge variant="outline" className="ml-2 text-sm">
              Analysis ID: REG-{Date.now().toString().slice(-6)}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Export Compliance Analysis</CardTitle>
                <CardDescription className="mt-1">
                  {product} from {COUNTRIES.find(c => c.code === originCountry)?.name} to {COUNTRIES.find(c => c.code === destinationCountry)?.name}
                </CardDescription>
              </div>
              {analysisResult.restrictionLevel && (
                <Badge className={`
                  ${analysisResult.restrictionLevel === 'HIGH' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                  ${analysisResult.restrictionLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                  ${analysisResult.restrictionLevel === 'LOW' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                  px-3 py-1 text-sm font-medium
                `}>
                  {analysisResult.restrictionLevel === 'HIGH' ? 'High Restrictions' : ''}
                  {analysisResult.restrictionLevel === 'MEDIUM' ? 'Medium Restrictions' : ''}
                  {analysisResult.restrictionLevel === 'LOW' ? 'Low Restrictions' : ''}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="tariffs">Tariffs & Duties</TabsTrigger>
                <TabsTrigger value="regulations">Regulations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="requirements" className="mt-6">
                <div className="space-y-6">
                  {analysisResult.summary && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Summary</h3>
                      <p className="text-gray-700">{analysisResult.summary}</p>
                    </div>
                  )}
                  
                  {analysisResult.keyRequirements && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Key Requirements</h3>
                      <ul className="space-y-2">
                        {analysisResult.keyRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysisResult.restrictions && analysisResult.restrictions.length > 0 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important Restrictions</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          {analysisResult.restrictions.map((restriction, idx) => (
                            <li key={idx}>{restriction}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="documentation" className="mt-6">
                <div className="space-y-6">
                  {analysisResult.requiredDocuments && (
                    <Accordion type="single" collapsible className="w-full">
                      {analysisResult.requiredDocuments.map((doc, idx) => (
                        <AccordionItem key={idx} value={`doc-${idx}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center">
                              <Book className="h-5 w-5 mr-2 text-primary" />
                              <span>{doc.name}</span>
                              {doc.mandatory && (
                                <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">Required</Badge>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-2 pb-4 px-1">
                              <p className="text-gray-700 mb-3">{doc.description}</p>
                              {doc.notes && (
                                <div className="bg-gray-50 p-3 rounded-md mt-2">
                                  <p className="text-sm text-gray-600">{doc.notes}</p>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="tariffs" className="mt-6">
                <div className="space-y-6">
                  {analysisResult.tariffs && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Tariff Information</h3>
                      <p className="text-gray-700 mb-4">{analysisResult.tariffs.overview}</p>
                      
                      {analysisResult.tariffs.estimatedRates && (
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-200 rounded-md">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="py-2 px-4 border-b text-left">Category</th>
                                <th className="py-2 px-4 border-b text-left">Rate</th>
                                <th className="py-2 px-4 border-b text-left">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analysisResult.tariffs.estimatedRates.map((rate, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="py-2 px-4 border-b">{rate.category}</td>
                                  <td className="py-2 px-4 border-b font-medium">{rate.rate}</td>
                                  <td className="py-2 px-4 border-b text-gray-600 text-sm">{rate.notes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="regulations" className="mt-6">
                <div className="space-y-6">
                  {analysisResult.regulations && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Relevant Regulations</h3>
                      
                      <Accordion type="single" collapsible className="w-full">
                        {analysisResult.regulations.map((reg, idx) => (
                          <AccordionItem key={idx} value={`reg-${idx}`}>
                            <AccordionTrigger className="text-left">
                              {reg.name}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pt-2 pb-4 px-1 space-y-3">
                                <p className="text-gray-700">{reg.description}</p>
                                {reg.authority && (
                                  <div>
                                    <span className="text-sm font-medium">Governing Authority:</span>
                                    <span className="text-sm text-gray-600 ml-2">{reg.authority}</span>
                                  </div>
                                )}
                                {reg.link && (
                                  <div>
                                    <a href={reg.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                      View Official Regulation
                                    </a>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-start">
            <Alert className="w-full bg-blue-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription className="text-sm">
                This analysis is provided for informational purposes only and should not be considered legal advice.
                Regulations change frequently, so always consult with customs and export authorities for the most up-to-date requirements.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      {!analysisResult ? renderExportForm() : renderAnalysisResults()}
    </div>
  );
};

export default RegulatoryAIPage;