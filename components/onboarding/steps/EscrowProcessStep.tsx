import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowDownToLine, 
  LockIcon, 
  CreditCard, 
  Check, 
  PackageCheck, 
  Store,
  CheckCircle2, 
  Wallet
} from 'lucide-react';

/**
 * The fourth step of the onboarding wizard
 * Demonstrates the escrow payment process
 */
const EscrowProcessStep: React.FC = () => {
  // Get localized translations
  const { t } = useLocalization('onboarding');
  
  // Get onboarding context
  const { sampleContract } = useOnboarding();
  
  // Local state for the demonstration
  const [escrowStatus, setEscrowStatus] = useState<'awaiting_funds' | 'funded'>('awaiting_funds');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Handle the escrow funding demonstration
  const handleFundEscrow = () => {
    setEscrowStatus('funded');
    setShowSuccess(true);
    
    // Hide the success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Calculate contract total value
  const totalValue = sampleContract.totalValue || 5000;
  const currencySymbol = sampleContract.currency || 'USD';
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{t('onboarding.step4.title')}</h1>
        <p className="text-gray-600 mt-2">{t('onboarding.step4.description')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">{t('onboarding.step4.explainer')}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-md border bg-white">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{t('onboarding.step4.step1')}</p>
                      <p className="text-sm text-gray-500">
                        The buyer secures the transaction by transferring funds to the escrow account.
                      </p>
                    </div>
                    {escrowStatus === 'funded' && (
                      <CheckCircle2 className="ml-auto h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-md border bg-white">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{t('onboarding.step4.step2')}</p>
                      <p className="text-sm text-gray-500">
                        The seller is notified that the escrow is funded and prepares the shipment.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-md border bg-white">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <PackageCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{t('onboarding.step4.step3')}</p>
                      <p className="text-sm text-gray-500">
                        The buyer receives the goods and has time to inspect for quality and quantity.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-md border bg-white">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{t('onboarding.step4.step4')}</p>
                      <p className="text-sm text-gray-500">
                        If satisfied, the buyer confirms receipt and acknowledges quality.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-md border bg-white">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <ArrowDownToLine className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{t('onboarding.step4.step5')}</p>
                      <p className="text-sm text-gray-500">
                        The system releases funds from escrow to the seller's account.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md border mt-4">
                  <p className="text-sm text-gray-600">{t('onboarding.step4.tip')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="space-y-4 sticky top-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center flex-col">
                    <LockIcon className="h-12 w-12 text-primary mb-3" />
                    <h3 className="text-lg font-medium">Escrow Account</h3>
                    
                    <div className="w-full flex items-center justify-between mt-4">
                      <span className="text-gray-500">Status:</span>
                      <Badge className={escrowStatus === 'funded' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}>
                        {escrowStatus === 'funded' ? 'Funded' : 'Awaiting Funds'}
                      </Badge>
                    </div>
                    
                    <div className="w-full flex items-center justify-between mt-2">
                      <span className="text-gray-500">Contract ID:</span>
                      <span>BFX-2025-2345</span>
                    </div>
                    
                    <div className="w-full flex items-center justify-between mt-2">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-bold">
                        {currencySymbol} {totalValue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {showSuccess && (
                    <div className="p-3 bg-green-50 text-green-800 rounded-md border border-green-200 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span>{t('onboarding.step4.escrowFunded')}</span>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full flex items-center gap-2 mt-4"
                    onClick={handleFundEscrow}
                    disabled={escrowStatus === 'funded'}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>{t('onboarding.step4.fundEscrow')}</span>
                  </Button>
                  
                  <p className="text-sm text-center text-gray-500">
                    {t('onboarding.step4.fundAmount')}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-800 mb-2">Secure Payment</h4>
                <p className="text-sm text-blue-700">
                  Escrow funds are held securely on the blockchain with multi-signature requirements.
                  This ensures that money is only transferred when conditions are met.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowProcessStep;