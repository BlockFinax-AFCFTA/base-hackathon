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
  
  // Mock data for our prototype
  const getMockAnalysisData = () => {
    // Generate different responses based on product and countries
    const restrictionLevel = 
      (productCategory === 'Chemicals & Pharmaceuticals' || destinationCountry === 'CN') 
        ? 'HIGH' 
        : (productCategory === 'Electronics & Technology' || destinationCountry === 'RU') 
          ? 'MEDIUM' 
          : 'LOW';
    
    return {
      summary: `Analysis of ${product} export from ${COUNTRIES.find(c => c.code === originCountry)?.name} to ${COUNTRIES.find(c => c.code === destinationCountry)?.name}. This ${productCategory.toLowerCase()} product faces ${restrictionLevel.toLowerCase()} level trade restrictions based on current regulations and trade agreements.`,
      restrictionLevel: restrictionLevel,
      keyRequirements: [
        `Product Classification: Assign the correct tariff code for ${product}`,
        "Certificate of Origin: Document showing where goods were manufactured",
        "Commercial Invoice: Detailed description of the goods, including values and quantities",
        "Packing List: Itemized list of package contents",
        restrictionLevel === 'HIGH' ? "Special Export License: Required for controlled items in this category" : "Standard Export Declaration: Form submitted to customs authorities"
      ],
      restrictions: restrictionLevel === 'HIGH' 
        ? ["Export license required before shipment", "End-user verification may be required", "Specific technical standards compliance needed"] 
        : restrictionLevel === 'MEDIUM'
          ? ["Pre-shipment inspection may be required", "Compliance with packaging and labeling regulations"]
          : [],
      requiredDocuments: [
        {
          name: "Certificate of Origin",
          description: "Official document that certifies goods were obtained, produced, manufactured, or processed in the stated country",
          mandatory: true,
          notes: "Must be stamped by the local chamber of commerce"
        },
        {
          name: "Commercial Invoice",
          description: "Document that contains information about the sale of goods",
          mandatory: true,
          notes: "Must include detailed product description, quantity, and value"
        },
        {
          name: "Packing List",
          description: "Document detailing the contents of a shipment",
          mandatory: true,
          notes: "Should match the commercial invoice details"
        },
        {
          name: "Bill of Lading",
          description: "Receipt given by a carrier for goods accepted for transportation",
          mandatory: true,
          notes: "Serves as a contract between the shipper and carrier"
        },
        restrictionLevel === 'HIGH' ? {
          name: "Export License",
          description: "Government-issued document authorizing the export of specific goods",
          mandatory: true,
          notes: "Apply through the Department of Commerce at least 30 days before shipping"
        } : {
          name: "Quality Certificate",
          description: "Document certifying the product meets quality standards",
          mandatory: false,
          notes: "Recommended for consumer goods to avoid customs delays"
        },
        productCategory === 'Agriculture & Food' ? {
          name: "Phytosanitary Certificate",
          description: "Certificate stating plants or plant products are free from pests and diseases",
          mandatory: true,
          notes: "Must be obtained from agricultural authorities in the origin country"
        } : {
          name: "Insurance Certificate",
          description: "Document confirming insurance coverage for goods during transportation",
          mandatory: false,
          notes: "Recommended for high-value shipments"
        }
      ],
      tariffs: {
        overview: `The tariff regime between ${COUNTRIES.find(c => c.code === originCountry)?.name} and ${COUNTRIES.find(c => c.code === destinationCountry)?.name} for ${productCategory.toLowerCase()} products includes import duties, value-added tax, and possibly special assessments.`,
        estimatedRates: [
          {
            category: "Import Duty",
            rate: restrictionLevel === 'HIGH' ? "15-25%" : restrictionLevel === 'MEDIUM' ? "5-15%" : "0-5%",
            notes: "Based on harmonized tariff schedule classification"
          },
          {
            category: "Value Added Tax",
            rate: destinationCountry === 'GB' ? "20%" : destinationCountry === 'DE' || destinationCountry === 'FR' ? "19%" : "10-17%",
            notes: "Applied to the customs value plus import duty"
          },
          restrictionLevel === 'HIGH' ? {
            category: "Special Assessment",
            rate: "3-8%",
            notes: "Additional tax on sensitive or controlled products"
          } : {
            category: "Preferential Rate",
            rate: "Reduced rates may apply",
            notes: "Check if free trade agreements exist between countries"
          }
        ]
      },
      regulations: [
        {
          name: `${destinationCountry === 'US' ? 'Export Administration Regulations (EAR)' : 'Export Control Law'}`,
          description: `Governs the export of dual-use items from ${COUNTRIES.find(c => c.code === originCountry)?.name}`,
          authority: destinationCountry === 'US' ? "Bureau of Industry and Security" : "Department of Commerce",
          link: "#"
        },
        {
          name: `${destinationCountry === 'GB' ? 'UK Trade Tariff' : destinationCountry === 'CN' ? 'Import and Export Tariff of China' : 'Customs Code'}`,
          description: `Comprehensive system of import duties for ${COUNTRIES.find(c => c.code === destinationCountry)?.name}`,
          authority: "Customs Administration",
          link: "#"
        },
        productCategory === 'Chemicals & Pharmaceuticals' ? {
          name: "Chemical Registration Requirements",
          description: "Framework for registration and assessment of chemicals",
          authority: "Environmental Protection Agency",
          link: "#"
        } : productCategory === 'Electronics & Technology' ? {
          name: "Technical Standards Compliance",
          description: "Regulations governing electronic equipment safety and compatibility",
          authority: "Standards and Technology Bureau",
          link: "#"
        } : {
          name: "Consumer Protection Regulations",
          description: "Rules ensuring consumer goods meet safety standards",
          authority: "Consumer Safety Commission",
          link: "#"
        }
      ]
    };
  };

  // Handle form submission with mock data
  const handleAnalyzeClick = () => {
    if (!product || !originCountry || !destinationCountry || !productCategory) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      try {
        const mockResult = getMockAnalysisData();
        setAnalysisResult(mockResult);
      } catch (error) {
        toast({
          title: 'Analysis failed',
          description: 'An error occurred during the analysis',
          variant: 'destructive',
        });
      } finally {
        setIsAnalyzing(false);
      }
    }, 2000); // 2 second delay to simulate processing
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