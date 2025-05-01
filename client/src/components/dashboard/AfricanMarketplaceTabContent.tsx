import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Store, 
  TrendingUp, 
  Clock, 
  Tag, 
  Truck, 
  CreditCard, 
  Check, 
  Info,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Sample African country data
const AFRICAN_COUNTRIES = [
  { code: 'NG', name: 'Nigeria', region: 'West Africa' },
  { code: 'ZA', name: 'South Africa', region: 'Southern Africa' },
  { code: 'EG', name: 'Egypt', region: 'North Africa' },
  { code: 'KE', name: 'Kenya', region: 'East Africa' },
  { code: 'GH', name: 'Ghana', region: 'West Africa' },
  { code: 'ET', name: 'Ethiopia', region: 'East Africa' },
  { code: 'TZ', name: 'Tanzania', region: 'East Africa' },
  { code: 'CD', name: 'DR Congo', region: 'Central Africa' },
  { code: 'UG', name: 'Uganda', region: 'East Africa' },
  { code: 'MA', name: 'Morocco', region: 'North Africa' },
  { code: 'CM', name: 'Cameroon', region: 'Central Africa' },
  { code: 'CI', name: 'Côte d\'Ivoire', region: 'West Africa' },
  { code: 'SN', name: 'Senegal', region: 'West Africa' },
  { code: 'RW', name: 'Rwanda', region: 'East Africa' },
  { code: 'ZW', name: 'Zimbabwe', region: 'Southern Africa' },
];

// Product categories
const PRODUCT_CATEGORIES = [
  'Agriculture & Food',
  'Minerals & Metals',
  'Textiles & Clothing',
  'Handicrafts & Art',
  'Electronics & Technology',
  'Beauty & Wellness',
  'Industrial Equipment',
  'Jewelry & Accessories',
];

// Sample products data
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Arabica Coffee Beans',
    origin: 'Ethiopia',
    category: 'Agriculture & Food',
    price: 8.50,
    unit: 'kg',
    minOrder: 100,
    rating: 4.8,
    sellerName: 'Abyssinia Coffee Cooperative',
    sellerRating: 4.9,
    sellerVerified: true,
    sellerCountry: 'Ethiopia',
    inStock: true,
    description: 'Organic shade-grown Arabica coffee beans from the highlands of Ethiopia. These premium beans offer a complex flavor profile with notes of blueberry, dark chocolate, and citrus.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
    tags: ['Organic', 'Fair Trade', 'Award-winning'],
    shippingTime: '7-14 days',
    paymentOptions: ['Escrow', 'Letter of Credit', 'Advance Payment'],
    certifications: ['Organic', 'Fair Trade', 'Rainforest Alliance']
  },
  {
    id: 2,
    name: 'Handwoven Kente Cloth',
    origin: 'Ghana',
    category: 'Textiles & Clothing',
    price: 85.00,
    unit: 'piece',
    minOrder: 10,
    rating: 4.7,
    sellerName: 'Ashanti Artisans Collective',
    sellerRating: 4.6,
    sellerVerified: true,
    sellerCountry: 'Ghana',
    inStock: true,
    description: 'Traditional handwoven Kente cloth from Ghana. Each piece is carefully crafted using centuries-old techniques with vibrant colors and intricate patterns. Each cloth measures approximately 2 meters by 1.5 meters.',
    image: 'https://images.unsplash.com/photo-1590735033733-a1086831cfcc',
    tags: ['Handmade', 'Cultural Heritage', 'Premium Quality'],
    shippingTime: '10-15 days',
    paymentOptions: ['Escrow', 'Advance Payment'],
    certifications: ['Cultural Heritage Certification']
  },
  {
    id: 3,
    name: 'Shea Butter (Unrefined)',
    origin: 'Nigeria',
    category: 'Beauty & Wellness',
    price: 12.00,
    unit: 'kg',
    minOrder: 50,
    rating: 4.9,
    sellerName: 'Women\'s Shea Cooperative',
    sellerRating: 4.7,
    sellerVerified: true,
    sellerCountry: 'Nigeria',
    inStock: true,
    description: 'Pure, unrefined shea butter sustainably harvested and traditionally processed by women\'s cooperatives in Northern Nigeria. Rich in vitamins and fatty acids, this premium shea butter is ideal for cosmetic and skincare applications.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108',
    tags: ['Organic', 'Sustainable', 'Women-owned'],
    shippingTime: '7-12 days',
    paymentOptions: ['Escrow', 'Advance Payment'],
    certifications: ['Organic', 'Fair Trade']
  },
  {
    id: 4,
    name: 'Copper Ore (Grade A)',
    origin: 'DR Congo',
    category: 'Minerals & Metals',
    price: 6500.00,
    unit: 'metric ton',
    minOrder: 5,
    rating: 4.5,
    sellerName: 'Katanga Mining Ltd',
    sellerRating: 4.4,
    sellerVerified: true,
    sellerCountry: 'DR Congo',
    inStock: true,
    description: 'High-grade copper ore from sustainable mining operations in the Katanga region. 30-35% copper content with low impurities. Suitable for electrical applications, construction, transportation, and consumer products.',
    image: 'https://images.unsplash.com/photo-1546190181-635c92c4d9e6',
    tags: ['High Grade', 'Conflict-free', 'Certified'],
    shippingTime: '30-45 days',
    paymentOptions: ['Letter of Credit', 'Escrow'],
    certifications: ['ISO 9001', 'Responsible Mining Certified', 'Conflict-free']
  },
  {
    id: 5,
    name: 'Premium Cashew Nuts',
    origin: 'Tanzania',
    category: 'Agriculture & Food',
    price: 9.75,
    unit: 'kg',
    minOrder: 200,
    rating: 4.6,
    sellerName: 'Tanzanian Cashew Board',
    sellerRating: 4.5,
    sellerVerified: true,
    sellerCountry: 'Tanzania',
    inStock: true,
    description: 'High-quality whole cashew nuts grown in Tanzania. Large, uniform size with excellent flavor and crisp texture. Available raw, roasted, or custom processed to meet your specifications.',
    image: 'https://images.unsplash.com/photo-1574570073228-0ab799c22686',
    tags: ['Premium Quality', 'Export Grade', 'Direct from Source'],
    shippingTime: '14-21 days',
    paymentOptions: ['Escrow', 'Letter of Credit', 'Advance Payment'],
    certifications: ['HACCP', 'ISO 22000']
  },
  {
    id: 6,
    name: 'Solar Power Systems (Off-grid)',
    origin: 'Rwanda',
    category: 'Electronics & Technology',
    price: 450.00,
    unit: 'system',
    minOrder: 10,
    rating: 4.7,
    sellerName: 'Kigali Clean Energy',
    sellerRating: 4.8,
    sellerVerified: true,
    sellerCountry: 'Rwanda',
    inStock: false,
    description: 'Complete off-grid solar power systems designed and manufactured in Rwanda. Each system includes solar panels, battery storage, inverter, and all necessary components. Ideal for rural electrification, small businesses, and residential use.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276',
    tags: ['Renewable Energy', 'Made in Africa', 'Sustainable'],
    shippingTime: '14-28 days',
    paymentOptions: ['Escrow', 'Letter of Credit'],
    certifications: ['ISO 9001', 'IEC Standards']
  }
];

// Product Card Component
const ProductCard = ({ product, onViewDetails }: { product: any, onViewDetails: (product: any) => void }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        <div className="absolute top-2 right-2 z-10">
          {product.sellerVerified && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge className="bg-green-600 hover:bg-green-700">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This seller has been verified by BlockFinaX</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="flex-grow flex flex-col py-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Badge className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 mb-2">
              {product.category}
            </Badge>
            <h3 className="font-medium text-lg line-clamp-2">{product.name}</h3>
          </div>
        </div>
        <div className="mt-1 mb-2">
          <div className="flex items-center text-amber-500 mb-1">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{product.rating}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {product.origin}
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
        <div className="mt-auto pt-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-lg font-bold">${product.price.toFixed(2)}<span className="text-sm font-normal text-gray-600">/{product.unit}</span></div>
            <div className="text-xs text-gray-600">Min: {product.minOrder} {product.unit}s</div>
          </div>
          <Button 
            variant="default" 
            className="w-full" 
            onClick={() => onViewDetails(product)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Marketplace Component
const AfricanMarketplaceTabContent: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  
  // Handle product detail view
  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setQuantity(product.minOrder); // Set initial quantity to minimum order
  };
  
  // Handle product purchase
  const handlePurchase = () => {
    // In a real app, this would connect to Stripe, handle payment, etc.
    setIsCheckoutOpen(false);
    setShowPurchaseSuccess(true);
    
    setTimeout(() => {
      setShowPurchaseSuccess(false);
      setSelectedProduct(null);
    }, 5000);
    
    toast({
      title: "Purchase initiated",
      description: `Your order for ${quantity} ${selectedProduct.unit}s of ${selectedProduct.name} is being processed.`,
    });
  };
  
  // Filter products based on search and filters
  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.origin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    const matchesCountry = countryFilter === '' || product.origin === AFRICAN_COUNTRIES.find(c => c.code === countryFilter)?.name;
    const matchesVerified = !isVerifiedOnly || product.sellerVerified;
    
    return matchesSearch && matchesCategory && matchesCountry && matchesVerified;
  });
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">African Trade Marketplace</h2>
          <p className="text-muted-foreground mt-1">
            Connect with verified African businesses and trade securely with escrow protection
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
            href="/marketplace/sellers"
          >
            <Store className="h-4 w-4 mr-1" />
            Become a Seller
          </Link>
          <Link 
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
            href="/marketplace/watchlist"
          >
            <Star className="h-4 w-4 mr-1" />
            Watchlist
          </Link>
        </div>
      </div>
      
      {/* Featured Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Intra-African Trade Made Simple</h3>
                <p className="opacity-90 mb-4">
                  BlockFinaX helps you securely trade across borders with verified businesses, 
                  escrow protection, and seamless payments in local currencies.
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <Badge className="bg-white/20 hover:bg-white/30">
                    <Check className="h-3 w-3 mr-1" />
                    Verified Sellers
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30">
                    <Check className="h-3 w-3 mr-1" />
                    Secure Escrow
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30">
                    <Check className="h-3 w-3 mr-1" />
                    Trade Finance
                  </Badge>
                </div>
              </div>
              <Button 
                className="whitespace-nowrap bg-white text-indigo-700 hover:bg-white/90 hover:text-indigo-800"
                size="lg"
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Market Trends</CardTitle>
            <CardDescription>Top growing products in African trade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  <span>Shea Butter & Cosmetics</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">+24%</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  <span>Solar Energy Equipment</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">+18%</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  <span>Specialty Coffee</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">+15%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filter Section */}
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search products, materials, or suppliers..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {PRODUCT_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Countries</SelectItem>
                  {AFRICAN_COUNTRIES.map(country => (
                    <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="verified-only" 
                  checked={isVerifiedOnly}
                  onCheckedChange={(checked) => setIsVerifiedOnly(checked as boolean)}
                />
                <label
                  htmlFor="verified-only"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap"
                >
                  Verified Sellers Only
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Success Message */}
      {showPurchaseSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Purchase Successful!</AlertTitle>
          <AlertDescription>
            Your order has been placed successfully. Track your order in the Trade Contracts section.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onViewDetails={handleViewDetails}
            />
          ))
        ) : (
          <div className="col-span-3 py-12 flex justify-center items-center flex-col">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setCountryFilter('');
                setIsVerifiedOnly(false);
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        )}
      </div>
      
      {/* Product Detail Dialog */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>
                From {selectedProduct.sellerName}, {selectedProduct.sellerCountry}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div>
                <div className="rounded-md overflow-hidden h-60 bg-gray-100">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Product Tags</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedProduct.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Certifications</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedProduct.certifications.map((cert: string) => (
                        <Badge key={cert} variant="outline" className="border-green-300 text-green-700">
                          <Check className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">About the Seller</h4>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="ml-1 text-sm font-medium">{selectedProduct.sellerRating}</span>
                      <span className="mx-2 text-gray-300">|</span>
                      {selectedProduct.sellerVerified ? (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          <Check className="h-3 w-3 mr-1" />
                          Verified Seller
                        </Badge>
                      ) : (
                        <Badge variant="outline">New Seller</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedProduct.sellerName} is a reputable supplier from {selectedProduct.sellerCountry} specializing in {selectedProduct.category.toLowerCase()} products.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="mb-1 text-2xl font-bold">${selectedProduct.price.toFixed(2)}<span className="text-sm font-normal text-gray-600">/{selectedProduct.unit}</span></div>
                  <div className="text-sm text-gray-600 mb-3">
                    Minimum order: {selectedProduct.minOrder} {selectedProduct.unit}s
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600 mb-1">
                    <Truck className="h-4 w-4" />
                    <span>Shipping: {selectedProduct.shippingTime}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 mb-1">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment: {selectedProduct.paymentOptions.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Origin: {selectedProduct.origin}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700 text-sm">{selectedProduct.description}</p>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button 
                    className="flex-1" 
                    onClick={() => setIsCheckoutOpen(true)}
                  >
                    Purchase Now
                  </Button>
                  <Button variant="outline">
                    Contact Seller
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Checkout Sheet */}
      {selectedProduct && (
        <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Checkout</SheetTitle>
              <SheetDescription>
                Complete your purchase with secure escrow payment
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">{selectedProduct.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Store className="h-4 w-4 mr-1" />
                  {selectedProduct.sellerName}, {selectedProduct.sellerCountry}
                </div>
              </div>
              
              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-medium">Quantity ({selectedProduct.unit}s)</div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setQuantity(Math.max(selectedProduct.minOrder, quantity - 1))}
                    >
                      -
                    </Button>
                    <Input 
                      className="w-16 h-8 text-center" 
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= selectedProduct.minOrder) {
                          setQuantity(val);
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Unit Price:</span>
                    <span>${selectedProduct.price.toFixed(2)} per {selectedProduct.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${(selectedProduct.price * quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated Shipping:</span>
                    <span>${(quantity * 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Escrow Service Fee:</span>
                    <span>${(selectedProduct.price * quantity * 0.02).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span>${(
                  selectedProduct.price * quantity + // Subtotal
                  quantity * 2 + // Shipping
                  selectedProduct.price * quantity * 0.02 // Escrow fee
                ).toFixed(2)}</span>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm space-y-2">
                <div className="flex">
                  <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <div>
                    <strong>Escrow Protection:</strong> Your payment will be held securely until you confirm receipt and satisfactory quality of the goods.
                  </div>
                </div>
                <div className="pl-7">
                  <strong>Trade Contract:</strong> By completing this purchase, a legally binding smart contract will be created between you and the seller.
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePurchase}>
                  Complete Purchase
                </Button>
              </DialogFooter>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

// Helper Link Component to avoid routing errors in this component
const Link = ({ href, className, children }: { href: string, className?: string, children: React.ReactNode }) => {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};

export default AfricanMarketplaceTabContent;