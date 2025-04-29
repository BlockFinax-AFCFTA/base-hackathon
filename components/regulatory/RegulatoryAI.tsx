import React, { useState } from 'react';
import { toast } from "../../hooks/use-toast";
import { Loader2, Globe, FileSearch, AlertCircle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Create a schema for form validation
const formSchema = z.object({
  product: z.string().min(3, 'Product name must be at least 3 characters'),
  productCategory: z.string().optional(),
  originCountry: z.string().min(2, 'Origin country is required'),
  destinationCountry: z.string().min(2, 'Destination country is required'),
});

type FormValues = z.infer<typeof formSchema>;

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
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KR', name: 'South Korea' },
  { code: 'RU', name: 'Russia' },
  { code: 'SG', name: 'Singapore' },
];

const PRODUCT_CATEGORIES = [
  'Agriculture & Food',
  'Chemicals & Pharmaceuticals',
  'Consumer Goods',
  'Electronics & Technology',
  'Industrial Equipment',
  'Machinery',
  'Medical Devices',
  'Metals & Minerals',
  'Textiles & Clothing',
  'Vehicles & Transportation',
  'Other'
];

interface AnalysisResult {
  analysis: string;
  metadata: {
    product: string;
    originCountry: string;
    destinationCountry: string;
    productCategory?: string;
    timestamp: string;
  };
}

const RegulatoryAI: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: '',
      productCategory: '',
      originCountry: '',
      destinationCountry: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/regulatory/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze regulatory requirements');
      }
      
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Error analyzing regulatory requirements:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to analyze regulatory requirements',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format the analysis content with proper line breaks and sections
  const formatAnalysisContent = (content: string) => {
    // Replace headings with styled headings
    let formattedContent = content
      .replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, text) => {
        const level = hashes.length;
        const className = level <= 2 
          ? 'text-xl font-bold my-4' 
          : level === 3 
            ? 'text-lg font-semibold my-3' 
            : 'text-base font-medium my-2';
        return `<h${level} class="${className}">${text}</h${level}>`;
      })
      // Replace lists with styled lists
      .replace(/^(\d+\.\s+)(.+)$/gm, '<li class="ml-6 list-decimal my-1">$2</li>')
      .replace(/^(\*\s+)(.+)$/gm, '<li class="ml-6 list-disc my-1">$2</li>')
      // Replace paragraphs
      .replace(/^(?!(#|<h|<li))(.*?)$/gm, (match) => {
        if (match.trim() === '') return '<br/>';
        return `<p class="my-2">${match}</p>`;
      });
    
    return <div dangerouslySetInnerHTML={{ __html: formattedContent }} />;
  };

  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Regulatory AI Assistant</h1>
        <p className="text-muted-foreground">
          Get regulatory guidance for exporting your products internationally
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Export Regulatory Analysis</CardTitle>
            <CardDescription>
              Enter your product details to receive regulatory guidance for international exports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Medical Ventilator, Organic Coffee" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the specific product name you want to export
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRODUCT_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecting a category helps provide more accurate regulatory guidance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="originCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin Country</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COUNTRIES.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destinationCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Country</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COUNTRIES.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      Analyze Export Requirements
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Analysis Results
              {analysisResult && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {new Date(analysisResult.metadata.timestamp).toLocaleString()}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Regulatory requirements and export guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              {error && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                    <h3 className="text-lg font-semibold">Error Analyzing Requirements</h3>
                    <p className="text-muted-foreground">{error}</p>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center text-center">
                    <Loader2 className="h-12 w-12 animate-spin mb-4" />
                    <h3 className="text-lg font-semibold">Analyzing Requirements</h3>
                    <p className="text-muted-foreground">This may take a moment...</p>
                  </div>
                </div>
              )}

              {!isLoading && !error && !analysisResult && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center text-center">
                    <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No Analysis Yet</h3>
                    <p className="text-muted-foreground">
                      Fill out the form to receive export regulatory guidance
                    </p>
                  </div>
                </div>
              )}

              {!isLoading && !error && analysisResult && (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Product:</span>
                      <span>{analysisResult.metadata.product}</span>
                    </div>
                    
                    {analysisResult.metadata.productCategory && (
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">Category:</span>
                        <span>{analysisResult.metadata.productCategory}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Export Route:</span>
                      <span>
                        {COUNTRIES.find(c => c.code === analysisResult.metadata.originCountry)?.name || analysisResult.metadata.originCountry}
                        {' → '}
                        {COUNTRIES.find(c => c.code === analysisResult.metadata.destinationCountry)?.name || analysisResult.metadata.destinationCountry}
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="regulatory-analysis">
                    {formatAnalysisContent(analysisResult.analysis)}
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-4 bg-muted/40">
            <p className="text-xs text-muted-foreground w-full text-center">
              Powered by AI analysis of international trade regulations. Regulatory information should be verified with official sources.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegulatoryAI;