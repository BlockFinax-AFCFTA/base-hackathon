import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useOnboarding, OnboardingProfile } from '../../../context/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building, Building2, LayoutGrid as Buildings, Users } from 'lucide-react';

/**
 * The second step of the onboarding wizard
 * Collects user preferences and profile information
 */
const ProfileSetupStep: React.FC = () => {
  // Get localized translations
  const { t } = useLocalization('onboarding');
  
  // Get onboarding context
  const { profile, updateProfile } = useOnboarding();
  
  // Handle business type selection
  const handleBusinessTypeChange = (value: string) => {
    updateProfile({ businessType: value as OnboardingProfile['businessType'] });
  };
  
  // Handle trade regions selection
  const handleRegionChange = (region: string, checked: boolean) => {
    const currentRegions = profile.tradeRegions || [];
    let newRegions;
    
    if (checked) {
      newRegions = [...currentRegions, region];
    } else {
      newRegions = currentRegions.filter(r => r !== region);
    }
    
    updateProfile({ tradeRegions: newRegions });
  };
  
  // Handle products selection
  const handleProductChange = (product: string, checked: boolean) => {
    const currentProducts = profile.products || [];
    let newProducts;
    
    if (checked) {
      newProducts = [...currentProducts, product];
    } else {
      newProducts = currentProducts.filter(p => p !== product);
    }
    
    updateProfile({ products: newProducts });
  };
  
  // Handle business size selection
  const handleBusinessSizeChange = (value: string) => {
    updateProfile({ businessSize: value as OnboardingProfile['businessSize'] });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{t('onboarding.step2.title')}</h1>
        <p className="text-gray-600 mt-2">{t('onboarding.step2.description')}</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Business Type */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">{t('onboarding.step2.businessType')}</h3>
              
              <RadioGroup 
                value={profile.businessType || ''} 
                onValueChange={handleBusinessTypeChange}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div>
                  <Label
                    htmlFor="exporter"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="exporter" id="exporter" className="sr-only" />
                    <Building2 className="mb-3 h-6 w-6" />
                    <span className="text-center">{t('onboarding.step2.businessType.exporter')}</span>
                  </Label>
                </div>
                
                <div>
                  <Label
                    htmlFor="importer"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="importer" id="importer" className="sr-only" />
                    <Building className="mb-3 h-6 w-6" />
                    <span className="text-center">{t('onboarding.step2.businessType.importer')}</span>
                  </Label>
                </div>
                
                <div>
                  <Label
                    htmlFor="both"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="both" id="both" className="sr-only" />
                    <Buildings className="mb-3 h-6 w-6" />
                    <span className="text-center">{t('onboarding.step2.businessType.both')}</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Trade Regions */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">{t('onboarding.step2.tradeRegions')}</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="region-africa" 
                    checked={(profile.tradeRegions || []).includes('africa')}
                    onCheckedChange={(checked) => 
                      handleRegionChange('africa', checked === true)
                    }
                  />
                  <label
                    htmlFor="region-africa"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.tradeRegions.africa')}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="region-asia" 
                    checked={(profile.tradeRegions || []).includes('asia')}
                    onCheckedChange={(checked) => 
                      handleRegionChange('asia', checked === true)
                    }
                  />
                  <label
                    htmlFor="region-asia"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.tradeRegions.asia')}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="region-europe" 
                    checked={(profile.tradeRegions || []).includes('europe')}
                    onCheckedChange={(checked) => 
                      handleRegionChange('europe', checked === true)
                    }
                  />
                  <label
                    htmlFor="region-europe"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.tradeRegions.europe')}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="region-north-america" 
                    checked={(profile.tradeRegions || []).includes('northAmerica')}
                    onCheckedChange={(checked) => 
                      handleRegionChange('northAmerica', checked === true)
                    }
                  />
                  <label
                    htmlFor="region-north-america"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.tradeRegions.northAmerica')}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="region-south-america" 
                    checked={(profile.tradeRegions || []).includes('southAmerica')}
                    onCheckedChange={(checked) => 
                      handleRegionChange('southAmerica', checked === true)
                    }
                  />
                  <label
                    htmlFor="region-south-america"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.tradeRegions.southAmerica')}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="region-oceania" 
                    checked={(profile.tradeRegions || []).includes('oceania')}
                    onCheckedChange={(checked) => 
                      handleRegionChange('oceania', checked === true)
                    }
                  />
                  <label
                    htmlFor="region-oceania"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.tradeRegions.oceania')}
                  </label>
                </div>
              </div>
            </div>
            
            {/* Products */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">{t('onboarding.step2.products')}</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="product-agriculture" 
                    checked={(profile.products || []).includes('agriculture')}
                    onCheckedChange={(checked) => 
                      handleProductChange('agriculture', checked === true)
                    }
                  />
                  <label
                    htmlFor="product-agriculture"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.products.agriculture')}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="product-textile" 
                    checked={(profile.products || []).includes('textile')}
                    onCheckedChange={(checked) => 
                      handleProductChange('textile', checked === true)
                    }
                  />
                  <label
                    htmlFor="product-textile"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.products.textile')}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="product-minerals" 
                    checked={(profile.products || []).includes('minerals')}
                    onCheckedChange={(checked) => 
                      handleProductChange('minerals', checked === true)
                    }
                  />
                  <label
                    htmlFor="product-minerals"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.products.minerals')}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="product-electronics" 
                    checked={(profile.products || []).includes('electronics')}
                    onCheckedChange={(checked) => 
                      handleProductChange('electronics', checked === true)
                    }
                  />
                  <label
                    htmlFor="product-electronics"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.products.electronics')}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="product-machinery" 
                    checked={(profile.products || []).includes('machinery')}
                    onCheckedChange={(checked) => 
                      handleProductChange('machinery', checked === true)
                    }
                  />
                  <label
                    htmlFor="product-machinery"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.products.machinery')}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="product-chemicals" 
                    checked={(profile.products || []).includes('chemicals')}
                    onCheckedChange={(checked) => 
                      handleProductChange('chemicals', checked === true)
                    }
                  />
                  <label
                    htmlFor="product-chemicals"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.products.chemicals')}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="product-other" 
                    checked={(profile.products || []).includes('other')}
                    onCheckedChange={(checked) => 
                      handleProductChange('other', checked === true)
                    }
                  />
                  <label
                    htmlFor="product-other"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('onboarding.step2.products.other')}
                  </label>
                </div>
              </div>
            </div>
            
            {/* Business Size */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">{t('onboarding.step2.businessSize')}</h3>
              
              <RadioGroup 
                value={profile.businessSize || ''} 
                onValueChange={handleBusinessSizeChange}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div>
                  <Label
                    htmlFor="small"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="small" id="small" className="sr-only" />
                    <Users className="mb-3 h-6 w-6" />
                    <span className="text-center font-medium">{t('onboarding.step2.businessSize.small')}</span>
                  </Label>
                </div>
                
                <div>
                  <Label
                    htmlFor="medium"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="medium" id="medium" className="sr-only" />
                    <Users className="mb-3 h-6 w-6" />
                    <span className="text-center font-medium">{t('onboarding.step2.businessSize.medium')}</span>
                  </Label>
                </div>
                
                <div>
                  <Label
                    htmlFor="large"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="large" id="large" className="sr-only" />
                    <Users className="mb-3 h-6 w-6" />
                    <span className="text-center font-medium">{t('onboarding.step2.businessSize.large')}</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetupStep;