import React, { useState } from 'react';
import { Link } from 'wouter';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const RegulatoryAIWidget: React.FC = () => {
  const { toast } = useToast();
  
  const [product, setProduct] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [productCategory, setProductCategory] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Handle quick analyze button
  const handleQuickAnalyze = () => {
    if (!product || !originCountry || !destinationCountry || !productCategory) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields to proceed with analysis',
        variant: 'destructive',
      });
      return;
    }
    
    // Set loading state for visual feedback
    setIsAnalyzing(true);
    
    // Navigate to the full regulatory AI page with query parameters
    const queryParams = new URLSearchParams({
      product,
      origin: originCountry,
      destination: destinationCountry,
      category: productCategory
    }).toString();
    
    // Use a timeout to show loading state briefly
    setTimeout(() => {
      window.location.href = `/regulatory-ai?${queryParams}`;
    }, 1000);
  };
  
  return (
    <Card className="md:col-span-4 xl:col-span-4">
      <CardHeader className="pb-2">
        <CardTitle>Quick Export Check</CardTitle>
        <CardDescription>Verify regulatory requirements for your exports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="product-quick" className="text-sm font-medium block mb-1">
              Product Name
            </label>
            <Input
              id="product-quick"
              placeholder="e.g. Coffee Beans"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="origin-quick" className="text-sm font-medium block mb-1">
                Origin
              </label>
              <Select
                value={originCountry}
                onValueChange={setOriginCountry}
              >
                <SelectTrigger id="origin-quick">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="destination-quick" className="text-sm font-medium block mb-1">
                Destination
              </label>
              <Select
                value={destinationCountry}
                onValueChange={setDestinationCountry}
              >
                <SelectTrigger id="destination-quick">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label htmlFor="category-quick" className="text-sm font-medium block mb-1">
              Category
            </label>
            <Select
              value={productCategory}
              onValueChange={setProductCategory}
            >
              <SelectTrigger id="category-quick">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full justify-between" 
          onClick={handleQuickAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze Export Requirements
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RegulatoryAIWidget;