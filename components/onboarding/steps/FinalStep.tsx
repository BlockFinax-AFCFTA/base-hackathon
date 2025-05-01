import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  ExternalLink, 
  MessageSquareText, 
  ShieldCheck, 
  Users, 
  Layout, 
  FileText,
  Home
} from 'lucide-react';

/**
 * The final step of the onboarding wizard
 * Wraps up the tutorial and directs the user to the dashboard
 */
const FinalStep: React.FC = () => {
  // Get localized translations
  const { t } = useLocalization('onboarding');
  
  // Get onboarding context
  const { completeOnboarding } = useOnboarding();
  
  // Handle go to dashboard button click
  const handleGoToDashboard = () => {
    completeOnboarding();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-4">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">{t('onboarding.final.title')}</h1>
        <p className="text-gray-600 mt-2 max-w-lg mx-auto">
          {t('onboarding.final.description')}
        </p>
      </div>
      
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">{t('onboarding.final.nextSteps')}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-md border bg-white">
              <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium">{t('onboarding.final.step1')}</p>
                <p className="text-sm text-gray-500">
                  Verify your identity and business details to unlock all features
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-md border bg-white">
              <Layout className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium">{t('onboarding.final.step2')}</p>
                <p className="text-sm text-gray-500">
                  Browse available products or list your own in the marketplace
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-md border bg-white">
              <FileText className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium">{t('onboarding.final.step3')}</p>
                <p className="text-sm text-gray-500">
                  Create an actual trade contract with your business partner
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-md border bg-white">
              <Users className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium">{t('onboarding.final.step4')}</p>
                <p className="text-sm text-gray-500">
                  Grow your network by inviting partners to join the platform
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        <Button 
          size="lg" 
          onClick={handleGoToDashboard}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          <span>{t('onboarding.final.dashboard')}</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="flex items-center gap-2"
        >
          <MessageSquareText className="h-4 w-4" />
          <span>{t('onboarding.final.support')}</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          <span>{t('onboarding.final.community')}</span>
        </Button>
      </div>
      
      <div className="flex justify-center pt-6">
        <div className="flex flex-wrap justify-center gap-2">
          <img 
            src="https://flagcdn.com/w40/ke.png" 
            alt="Kenya" 
            className="h-6 rounded shadow-sm" 
          />
          <img 
            src="https://flagcdn.com/w40/za.png" 
            alt="South Africa" 
            className="h-6 rounded shadow-sm" 
          />
          <img 
            src="https://flagcdn.com/w40/ng.png" 
            alt="Nigeria" 
            className="h-6 rounded shadow-sm" 
          />
          <img 
            src="https://flagcdn.com/w40/eg.png" 
            alt="Egypt" 
            className="h-6 rounded shadow-sm" 
          />
          <img 
            src="https://flagcdn.com/w40/ma.png" 
            alt="Morocco" 
            className="h-6 rounded shadow-sm" 
          />
          <img 
            src="https://flagcdn.com/w40/et.png" 
            alt="Ethiopia" 
            className="h-6 rounded shadow-sm" 
          />
        </div>
      </div>
    </div>
  );
};

export default FinalStep;