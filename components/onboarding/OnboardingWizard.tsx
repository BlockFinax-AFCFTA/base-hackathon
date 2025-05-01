import React, { useEffect } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useOnboarding, OnboardingStep } from '../../context/OnboardingContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

// Import all step components
import WelcomeStep from './steps/WelcomeStep';
import ProfileSetupStep from './steps/ProfileSetupStep';
import ContractCreationStep from './steps/ContractCreationStep';
import EscrowProcessStep from './steps/EscrowProcessStep';
import DocumentManagementStep from './steps/DocumentManagementStep';
import ShipmentTrackingStep from './steps/ShipmentTrackingStep';
import TradeCompletionStep from './steps/TradeCompletionStep';
import FinalStep from './steps/FinalStep';

/**
 * The main component for the onboarding wizard
 */
const OnboardingWizard: React.FC = () => {
  // Get localized translations from the onboarding namespace
  const { t } = useLocalization('onboarding');
  
  // Get onboarding context
  const {
    isOnboarding,
    currentStep,
    totalSteps,
    currentStepIndex,
    goToNextStep,
    goToPreviousStep,
    skipOnboarding
  } = useOnboarding();
  
  // Function to render the current step component
  const renderStepContent = () => {
    switch (currentStep) {
      case OnboardingStep.WELCOME:
        return <WelcomeStep />;
      case OnboardingStep.PROFILE_SETUP:
        return <ProfileSetupStep />;
      case OnboardingStep.CONTRACT_CREATION:
        return <ContractCreationStep />;
      case OnboardingStep.ESCROW_PROCESS:
        return <EscrowProcessStep />;
      case OnboardingStep.DOCUMENT_MANAGEMENT:
        return <DocumentManagementStep />;
      case OnboardingStep.SHIPMENT_TRACKING:
        return <ShipmentTrackingStep />;
      case OnboardingStep.TRADE_COMPLETION:
        return <TradeCompletionStep />;
      case OnboardingStep.FINAL:
        return <FinalStep />;
      default:
        return <WelcomeStep />;
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  // If not in onboarding mode, don't render the wizard
  if (!isOnboarding) {
    return null;
  }

  return (
    <Dialog open={isOnboarding} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-background z-10">
          {/* Progress bar */}
          <div className="p-4 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {t('onboarding.progress', { current: currentStepIndex + 1, total: totalSteps })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={skipOnboarding}
                title={t('onboarding.skip')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
        
        {/* Step content */}
        <div className="p-6">
          {renderStepContent()}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between p-4 border-t">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('onboarding.back')}</span>
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={skipOnboarding}
              className="hidden sm:flex items-center gap-2"
            >
              {t('onboarding.skip')}
            </Button>
            
            <Button
              onClick={goToNextStep}
              className="flex items-center gap-2"
            >
              <span>
                {currentStepIndex === totalSteps - 1
                  ? t('onboarding.finish')
                  : t('onboarding.next')
                }
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;