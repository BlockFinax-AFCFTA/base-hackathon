import React, { useState } from 'react';
import { Book, BookOpen, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Link } from 'wouter';

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
  const [product, setProduct] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [productCategory, setProductCategory] = useState('');

  const handleViewMoreClick = () => {
    // Redirect to the full Regulatory AI page with the form values pre-filled
    // In a real implementation, you'd want to pass these values as query parameters
    // or use a state management solution
  };

  return (
    <Card className="col-span-full xl:col-span-4 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>Export Regulatory Assistant</CardTitle>
          </div>
          <Link href="/regulatory-ai">
            <Button variant="ghost" size="sm" className="text-xs">
              View Full Tool
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <CardDescription>
          Get quick regulatory guidance for exporting your products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="product" className="text-sm font-medium">
              Product
            </label>
            <Input
              id="product"
              placeholder="e.g. Medical Equipment, Coffee Beans"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="origin" className="text-sm font-medium">
                Origin
              </label>
              <Select
                value={originCountry}
                onValueChange={setOriginCountry}
              >
                <SelectTrigger id="origin" className="mt-1">
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
            </div>
            
            <div>
              <label htmlFor="destination" className="text-sm font-medium">
                Destination
              </label>
              <Select
                value={destinationCountry}
                onValueChange={setDestinationCountry}
              >
                <SelectTrigger id="destination" className="mt-1">
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
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={productCategory}
              onValueChange={setProductCategory}
            >
              <SelectTrigger id="category" className="mt-1">
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
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/regulatory-ai?product=${encodeURIComponent(product)}&origin=${originCountry}&destination=${destinationCountry}&category=${encodeURIComponent(productCategory)}`}>
          <Button className="w-full">
            <Globe className="mr-2 h-4 w-4" />
            Analyze Export Requirements
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RegulatoryAIWidget;