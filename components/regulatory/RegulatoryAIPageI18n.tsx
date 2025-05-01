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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Globe,
  FileText,
  DollarSign,
  ClipboardCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

/**
 * RegulatoryAIPage component with internationalization
 * Uses the regulatory namespace for translations
 */
const RegulatoryAIPageI18n: React.FC = () => {
  // Use the 'regulatory' namespace for translations
  const { t } = useLocalization('regulatory');
  const [product, setProduct] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState('');
  
  // Mock country list for dropdown selectors
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CN', name: 'China' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'KE', name: 'Kenya' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'EG', name: 'Egypt' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'MA', name: 'Morocco' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'GH', name: 'Ghana' },
  ];
  
  // Product categories
  const categories = [
    { code: 'agriculture', name: t('regulatory.categories.agriculture') },
    { code: 'chemicals', name: t('regulatory.categories.chemicals') },
    { code: 'electronics', name: t('regulatory.categories.electronics') },
    { code: 'machinery', name: t('regulatory.categories.machinery') },
    { code: 'textiles', name: t('regulatory.categories.textiles') },
    { code: 'automotive', name: t('regulatory.categories.automotive') },
    { code: 'metals', name: t('regulatory.categories.metals') },
    { code: 'consumer', name: t('regulatory.categories.consumer') },
    { code: 'medical', name: t('regulatory.categories.medical') },
    { code: 'other', name: t('regulatory.categories.other') },
  ];
  
  const handleAnalyze = () => {
    // In a real application, this would make an API call to the AI service
    console.log('Analyzing export requirements', { product, origin, destination, category });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('regulatory.title')}</h1>
        <p className="text-gray-600">{t('regulatory.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('regulatory.quickGuidance')}</CardTitle>
            <CardDescription>{t('regulatory.accessFull')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('regulatory.product')}
                </label>
                <Input
                  placeholder={t('regulatory.productPlaceholder')}
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('regulatory.origin')}
                </label>
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('regulatory.selectCountry')} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('regulatory.destination')}
                </label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('regulatory.selectCountry')} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('regulatory.category')}
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('regulatory.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.code} value={cat.code}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleAnalyze} 
              className="w-full flex items-center justify-center gap-2"
              disabled={!product || !origin || !destination}
            >
              <Search className="h-4 w-4" />
              <span>{t('regulatory.analyze')}</span>
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                {t('regulatory.documentation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{t('regulatory.documentationDesc')}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-blue-600 w-full justify-start">
                <ArrowRight className="h-4 w-4 mr-1" />
                <span>{t('regulatory.viewTool')}</span>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-yellow-600" />
                {t('regulatory.tariffs')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{t('regulatory.tariffsDesc')}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-yellow-600 w-full justify-start">
                <ArrowRight className="h-4 w-4 mr-1" />
                <span>{t('regulatory.viewTool')}</span>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ClipboardCheck className="h-5 w-5 mr-2 text-green-600" />
                {t('regulatory.compliance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{t('regulatory.complianceDesc')}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-green-600 w-full justify-start">
                <ArrowRight className="h-4 w-4 mr-1" />
                <span>{t('regulatory.viewTool')}</span>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                {t('regulatory.restrictions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{t('regulatory.restrictionsDesc')}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="text-red-600 w-full justify-start">
                <ArrowRight className="h-4 w-4 mr-1" />
                <span>{t('regulatory.viewTool')}</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            {t('regulatory.countrySpecific')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Select origin and destination countries to see specific requirements</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegulatoryAIPageI18n;