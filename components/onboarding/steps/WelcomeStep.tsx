import React from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Wallet, FileText, BookOpen, Globe } from 'lucide-react';

/**
 * The first step of the onboarding wizard
 * Welcomes the user and explains the platform
 */
const WelcomeStep: React.FC = () => {
  // Get localized translations
  const { t } = useLocalization('onboarding');
  
  // Get onboarding context
  const { goToNextStep } = useOnboarding();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{t('onboarding.step1.title')}</h1>
        <p className="text-gray-600 mt-2">{t('onboarding.step1.description')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <Shield className="h-10 w-10 text-primary mb-4" />
            <h2 className="text-lg font-semibold mb-2">{t('onboarding.step1.features')}</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{t('onboarding.step1.feature1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{t('onboarding.step1.feature2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{t('onboarding.step1.feature3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{t('onboarding.step1.feature4')}</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{t('onboarding.step1.feature5')}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-medium">Smart Contracts</h3>
                <p className="text-sm text-gray-600">Secure and transparent agreements</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex items-center">
              <Wallet className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-medium">Escrow Payments</h3>
                <p className="text-sm text-gray-600">Safe financial transactions</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 flex items-center">
              <BookOpen className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <h3 className="font-medium">Document Verification</h3>
                <p className="text-sm text-gray-600">Blockchain-based authenticity</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-center">
              <Globe className="h-8 w-8 text-amber-600 mr-4" />
              <div>
                <h3 className="font-medium">International Access</h3>
                <p className="text-sm text-gray-600">Support in multiple languages</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          size="lg"
          onClick={goToNextStep}
          className="flex items-center gap-2"
        >
          <span>{t('onboarding.step1.start')}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;