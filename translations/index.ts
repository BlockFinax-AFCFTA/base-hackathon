/**
 * Central export of all translation namespaces
 * This file combines all translation resources in one place
 */
import { contractsTranslations } from './contracts';
import { documentsTranslations } from './documents';
import { invoicesTranslations } from './invoices';
import { walletTranslations } from './wallet';
import { logisticsTranslations } from './logistics';
import { kycTranslations } from './kyc';
import { regulatoryTranslations } from './regulatory';
import { onboardingTranslations } from './onboarding';

/**
 * Combined translation resources for all namespaces
 * Organized by language code and then by namespace
 */
export const translationResources = {
  en: {
    contracts: contractsTranslations.en,
    documents: documentsTranslations.en,
    invoices: invoicesTranslations.en,
    wallet: walletTranslations.en,
    logistics: logisticsTranslations.en,
    kyc: kycTranslations.en,
    regulatory: regulatoryTranslations.en,
    onboarding: onboardingTranslations.en,
  },
  es: {
    contracts: contractsTranslations.es,
    documents: documentsTranslations.es,
    invoices: invoicesTranslations.es,
    wallet: walletTranslations.es,
    logistics: logisticsTranslations.es,
    kyc: kycTranslations.es,
    regulatory: regulatoryTranslations.es,
    onboarding: onboardingTranslations.es,
  },
  fr: {
    contracts: contractsTranslations.fr,
    documents: documentsTranslations.fr,
    invoices: invoicesTranslations.fr,
    wallet: walletTranslations.fr,
    logistics: logisticsTranslations.fr,
    kyc: kycTranslations.fr,
    regulatory: regulatoryTranslations.fr,
    onboarding: onboardingTranslations.fr,
  },
  pt: {
    contracts: contractsTranslations.pt,
    documents: documentsTranslations.pt,
    invoices: invoicesTranslations.pt,
    wallet: walletTranslations.pt,
    logistics: logisticsTranslations.pt,
    kyc: kycTranslations.pt,
    regulatory: regulatoryTranslations.pt,
    onboarding: onboardingTranslations.pt,
  },
  ar: {
    contracts: contractsTranslations.ar,
    documents: documentsTranslations.ar,
    invoices: invoicesTranslations.ar,
    wallet: walletTranslations.ar,
    logistics: logisticsTranslations.ar,
    kyc: kycTranslations.ar,
    regulatory: regulatoryTranslations.ar,
    onboarding: onboardingTranslations.ar,
  },
};

/**
 * Valid page namespaces for translations
 */
export type TranslationNamespace = 'contracts' | 'documents' | 'invoices' | 'wallet' | 'logistics' | 'kyc' | 'regulatory' | 'onboarding';

/**
 * Valid language codes
 */
export type LanguageCode = 'en' | 'es' | 'fr' | 'pt' | 'ar';

/**
 * Get translations for a specific page
 * @param page The page namespace to get translations for
 * @returns Object with translations for the specified page in all languages
 */
export function getPageTranslations(page: TranslationNamespace) {
  return {
    en: translationResources.en[page] || {},
    es: translationResources.es[page] || {},
    fr: translationResources.fr[page] || {},
    pt: translationResources.pt[page] || {},
    ar: translationResources.ar[page] || {},
  };
}

/**
 * Get all translations for a specific language
 * @param language The language code
 * @returns All translations for the specified language across all namespaces
 */
export function getLanguageTranslations(language: LanguageCode) {
  return translationResources[language] || translationResources.en;
}