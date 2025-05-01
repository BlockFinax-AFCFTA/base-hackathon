import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button, ButtonProps } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface OnboardingButtonProps extends ButtonProps {
  showIcon?: boolean;
  buttonText?: string;
}

/**
 * A button component to trigger the onboarding wizard
 */
const OnboardingButton: React.FC<OnboardingButtonProps> = ({ 
  showIcon = true, 
  buttonText,
  ...props 
}) => {
  // Get localized translations
  const { t } = useLocalization('onboarding');
  
  // Get onboarding context
  const { startOnboarding, hasCompletedOnboarding } = useOnboarding();
  
  // Handle button click to start onboarding
  const handleStartOnboarding = () => {
    startOnboarding();
  };
  
  // Default button text
  const defaultText = hasCompletedOnboarding 
    ? t('onboarding.restartTutorial') || 'Restart Tutorial'
    : t('onboarding.startTutorial') || 'Start Tutorial';
  
  // Use provided button text or default
  const text = buttonText || defaultText;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleStartOnboarding}
      {...props}
    >
      {showIcon && <HelpCircle className="h-4 w-4 mr-2" />}
      {text}
    </Button>
  );
};

export default OnboardingButton;