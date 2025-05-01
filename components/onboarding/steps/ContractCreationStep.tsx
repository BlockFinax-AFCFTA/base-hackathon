import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useOnboarding, SampleContract } from '../../../context/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoIcon, Coffee, Hash, Truck, DollarSign, Calendar, FileText } from 'lucide-react';

/**
 * The third step of the onboarding wizard
 * Demonstrates contract creation with a sample scenario
 */
const ContractCreationStep: React.FC = () => {
  // Get localized translations
  const { t } = useLocalization('onboarding');
  
  // Get onboarding context
  const { sampleContract, updateSampleContract, profile } = useOnboarding();
  
  // Local state to track form inputs
  const [productName, setProductName] = useState(sampleContract.productName || '');
  const [quantity, setQuantity] = useState(sampleContract.quantity?.toString() || '');
  const [unit, setUnit] = useState(sampleContract.unit || '');
  const [pricePerUnit, setPricePerUnit] = useState(sampleContract.pricePerUnit?.toString() || '');
  const [currency, setCurrency] = useState(sampleContract.currency || 'USD');
  
  // Derive total value
  const totalValue = Number(quantity) * Number(pricePerUnit) || 0;
  
  // Currencies for select dropdown
  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'CNY', name: 'Chinese Yuan (¥)' },
    { code: 'ZAR', name: 'South African Rand (R)' },
    { code: 'NGN', name: 'Nigerian Naira (₦)' },
    { code: 'KES', name: 'Kenyan Shilling (KSh)' },
    { code: 'EGP', name: 'Egyptian Pound (E£)' },
    { code: 'MAD', name: 'Moroccan Dirham (DH)' }
  ];
  
  // Units for select dropdown
  const units = [
    { code: 'kg', name: 'Kilograms (kg)' },
    { code: 'ton', name: 'Metric Tons' },
    { code: 'pcs', name: 'Pieces' },
    { code: 'box', name: 'Boxes' },
    { code: 'carton', name: 'Cartons' },
    { code: 'pallet', name: 'Pallets' },
    { code: 'container', name: 'Containers' },
    { code: 'liter', name: 'Liters' },
    { code: 'gallon', name: 'Gallons' },
    { code: 'barrel', name: 'Barrels' }
  ];
  
  // Handle contract creation
  const handleCreateContract = () => {
    updateSampleContract({
      productName,
      quantity: Number(quantity),
      unit,
      pricePerUnit: Number(pricePerUnit),
      currency,
      totalValue,
      status: 'draft'
    });
  };
  
  // Update the sample contract when form inputs change
  useEffect(() => {
    if (productName && quantity && unit && pricePerUnit && currency) {
      updateSampleContract({
        productName,
        quantity: Number(quantity),
        unit,
        pricePerUnit: Number(pricePerUnit),
        currency,
        totalValue
      });
    }
  }, [productName, quantity, unit, pricePerUnit, currency, totalValue]);

  // Set coffee beans as the default product if profile indicates agriculture
  useEffect(() => {
    if (!productName && profile.products?.includes('agriculture')) {
      setProductName('Arabica Coffee Beans');
    }
  }, [profile, productName]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{t('onboarding.step3.title')}</h1>
        <p className="text-gray-600 mt-2">{t('onboarding.step3.description')}</p>
      </div>
      
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4 flex items-start">
          <InfoIcon className="h-6 w-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-700">{t('onboarding.step3.scenario')}</p>
            <p className="text-sm text-blue-600 mt-1">{t('onboarding.step3.tip')}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">{t('onboarding.step3.contractForm')}</h3>
              
              <div className="space-y-4">
                {/* Product Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">{t('onboarding.step3.productName')}</Label>
                    <div className="relative">
                      <Coffee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="productName"
                        placeholder={t('onboarding.step3.productNamePlaceholder')}
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">{t('onboarding.step3.currency')}</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency" className="pl-10">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Quantity and Price */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">{t('onboarding.step3.quantity')}</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="quantity"
                        type="number"
                        placeholder={t('onboarding.step3.quantityPlaceholder')}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit">{t('onboarding.step3.unit')}</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger id="unit" className="pl-10">
                        <Truck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <SelectValue placeholder={t('onboarding.step3.unitPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((u) => (
                          <SelectItem key={u.code} value={u.code}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pricePerUnit">{t('onboarding.step3.pricePerUnit')}</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="pricePerUnit"
                        type="number"
                        placeholder={t('onboarding.step3.pricePerUnitPlaceholder')}
                        value={pricePerUnit}
                        onChange={(e) => setPricePerUnit(e.target.value)}
                        min="0.01"
                        step="0.01"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Total Value */}
                <div className="p-4 bg-gray-50 rounded-md border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t('onboarding.step3.totalValue')}</span>
                    <span className="text-xl font-bold">
                      {currency} {totalValue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleCreateContract}
                  className="w-full"
                  disabled={!productName || !quantity || !unit || !pricePerUnit}
                >
                  {t('onboarding.step3.createContract')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Contract Preview</h3>
                {sampleContract.status && (
                  <Badge className="bg-gray-200 text-gray-800">
                    Draft
                  </Badge>
                )}
              </div>
              
              <ScrollArea className="h-[300px] border rounded-md p-4">
                {sampleContract.productName ? (
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h4 className="text-lg font-bold mb-1">Coffee Export Contract</h4>
                      <p className="text-sm text-gray-500">Contract #BFX-2025-2345</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="text-gray-500">Seller:</div>
                      <div>Kenya Coffee Cooperative</div>
                      
                      <div className="text-gray-500">Buyer:</div>
                      <div>European Coffee Imports Ltd.</div>
                      
                      <div className="text-gray-500">Product:</div>
                      <div>{sampleContract.productName}</div>
                      
                      <div className="text-gray-500">Quantity:</div>
                      <div>{sampleContract.quantity} {sampleContract.unit}</div>
                      
                      <div className="text-gray-500">Price:</div>
                      <div>{sampleContract.currency} {sampleContract.pricePerUnit} per {sampleContract.unit}</div>
                      
                      <div className="text-gray-500">Total Value:</div>
                      <div className="font-semibold">{sampleContract.currency} {sampleContract.totalValue?.toFixed(2)}</div>
                      
                      <div className="text-gray-500">Issue Date:</div>
                      <div>May 1, 2025</div>
                      
                      <div className="text-gray-500">Delivery Term:</div>
                      <div>FOB Mombasa</div>
                      
                      <div className="text-gray-500">Payment Term:</div>
                      <div>Letter of Credit at Sight</div>
                      
                      <div className="text-gray-500">Shipment Date:</div>
                      <div>Within 30 days of contract signing</div>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t">
                      <p className="text-sm text-gray-600">
                        This contract is secured and verified on the BlockFinaX platform.
                        All parties will receive notifications as the contract progresses.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <FileText className="h-12 w-12 mb-2 text-gray-300" />
                    <p>Fill in the contract details to see a preview</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractCreationStep;