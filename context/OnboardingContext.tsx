import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Types for the onboarding steps to ensure proper flow
 */
export enum OnboardingStep {
  WELCOME = 'welcome',
  PROFILE_SETUP = 'profile_setup',
  CONTRACT_CREATION = 'contract_creation',
  ESCROW_PROCESS = 'escrow_process',
  DOCUMENT_MANAGEMENT = 'document_management',
  SHIPMENT_TRACKING = 'shipment_tracking',
  TRADE_COMPLETION = 'trade_completion',
  FINAL = 'final'
}

/**
 * Interface for the profile data collected during onboarding
 */
export interface OnboardingProfile {
  businessType?: 'exporter' | 'importer' | 'both';
  tradeRegions?: string[];
  products?: string[];
  businessSize?: 'small' | 'medium' | 'large';
}

/**
 * Interface for the sample contract created during onboarding
 */
export interface SampleContract {
  productName?: string;
  quantity?: number;
  unit?: string;
  pricePerUnit?: number;
  currency?: string;
  totalValue?: number;
  status?: string;
}

/**
 * Interface for the context type
 */
interface OnboardingContextType {
  isOnboarding: boolean;
  hasCompletedOnboarding: boolean;
  currentStep: OnboardingStep;
  totalSteps: number;
  currentStepIndex: number;
  profile: OnboardingProfile;
  sampleContract: SampleContract;
  
  // Methods
  startOnboarding: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  updateProfile: (data: Partial<OnboardingProfile>) => void;
  updateSampleContract: (data: Partial<SampleContract>) => void;
}

/**
 * Create the context with default values
 */
export const OnboardingContext = createContext<OnboardingContextType>({
  isOnboarding: false,
  hasCompletedOnboarding: false,
  currentStep: OnboardingStep.WELCOME,
  totalSteps: 8, // Total number of steps in the onboarding process
  currentStepIndex: 0,
  profile: {},
  sampleContract: {},
  
  startOnboarding: () => {},
  completeOnboarding: () => {},
  skipOnboarding: () => {},
  goToNextStep: () => {},
  goToPreviousStep: () => {},
  goToStep: () => {},
  updateProfile: () => {},
  updateSampleContract: () => {},
});

// The steps order for the onboarding process
const ONBOARDING_STEPS = [
  OnboardingStep.WELCOME,
  OnboardingStep.PROFILE_SETUP,
  OnboardingStep.CONTRACT_CREATION,
  OnboardingStep.ESCROW_PROCESS,
  OnboardingStep.DOCUMENT_MANAGEMENT,
  OnboardingStep.SHIPMENT_TRACKING,
  OnboardingStep.TRADE_COMPLETION,
  OnboardingStep.FINAL
];

/**
 * Provider component for the Onboarding context
 */
export const OnboardingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Check if the user has completed onboarding before
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasCompletedOnboarding') === 'true';
    }
    return false;
  });
  
  // State for tracking onboarding progress
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.WELCOME);
  const [profile, setProfile] = useState<OnboardingProfile>({});
  const [sampleContract, setSampleContract] = useState<SampleContract>({});

  // Get the current step index based on the currentStep
  const currentStepIndex = ONBOARDING_STEPS.indexOf(currentStep);
  const totalSteps = ONBOARDING_STEPS.length;

  // Start the onboarding process
  const startOnboarding = () => {
    setIsOnboarding(true);
    setCurrentStep(OnboardingStep.WELCOME);
  };

  // Complete the onboarding process
  const completeOnboarding = () => {
    setIsOnboarding(false);
    setHasCompletedOnboarding(true);
    
    // Store completion in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasCompletedOnboarding', 'true');
    }
  };

  // Skip the onboarding process
  const skipOnboarding = () => {
    setIsOnboarding(false);
    setHasCompletedOnboarding(true);
    
    // Store completion in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasCompletedOnboarding', 'true');
    }
  };

  // Go to the next step in the onboarding process
  const goToNextStep = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex + 1]);
    } else {
      completeOnboarding();
    }
  };

  // Go to the previous step in the onboarding process
  const goToPreviousStep = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex - 1]);
    }
  };

  // Go to a specific step in the onboarding process
  const goToStep = (step: OnboardingStep) => {
    if (ONBOARDING_STEPS.includes(step)) {
      setCurrentStep(step);
    }
  };

  // Update the profile information
  const updateProfile = (data: Partial<OnboardingProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  // Update the sample contract information
  const updateSampleContract = (data: Partial<SampleContract>) => {
    setSampleContract((prev) => ({ ...prev, ...data }));
  };

  // Value to be provided by the context
  const value = {
    isOnboarding,
    hasCompletedOnboarding,
    currentStep,
    totalSteps,
    currentStepIndex,
    profile,
    sampleContract,
    
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    updateProfile,
    updateSampleContract,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

/**
 * Custom hook for using the onboarding context
 */
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  
  return context;
};