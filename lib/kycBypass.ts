import { KYCStatus } from '../hooks/useKYC';

/**
 * Utility functions to bypass KYC checks in the UI but maintain the real verification status
 * for display purposes.
 */

/**
 * Checks if the user should be allowed to access a feature 
 * that normally requires KYC verification
 * 
 * @param kycStatus The user's actual KYC status
 * @returns Always returns true to allow access regardless of KYC status
 */
export function canAccessFeature(kycStatus: string | null): boolean {
  // Always allow access to all features regardless of KYC status
  return true;
}

/**
 * Checks if the user should be allowed to access a feature 
 * that normally requires advanced KYC verification
 * 
 * @param kycStatus The user's actual KYC status
 * @returns Always returns true to allow access regardless of KYC status
 */
export function canAccessAdvancedFeature(kycStatus: string | null): boolean {
  // Always allow access to advanced features regardless of KYC status
  return true;
}

/**
 * Gets the human-readable status of a KYC verification level
 * 
 * @param kycStatus The KYC status to get a label for
 * @returns The human-readable label for the KYC status
 */
export function getKYCStatusLabel(kycStatus: string | null): string {
  switch(kycStatus) {
    case KYCStatus.ADVANCED_VERIFIED:
      return 'Fully Verified';
    case KYCStatus.BASIC_COMPLETED:
      return 'Basic Verification';
    case KYCStatus.ADVANCED_PENDING:
      return 'Verification Pending';
    case KYCStatus.REJECTED:
      return 'Verification Rejected';
    default:
      return 'Unverified';
  }
}

/**
 * Gets the color for displaying a KYC status badge
 * 
 * @param kycStatus The KYC status to get a color for
 * @returns The CSS class for the badge color
 */
export function getKYCStatusColor(kycStatus: string | null): string {
  switch(kycStatus) {
    case KYCStatus.ADVANCED_VERIFIED:
      return 'bg-green-100 text-green-800';
    case KYCStatus.BASIC_COMPLETED:
      return 'bg-blue-100 text-blue-800';
    case KYCStatus.ADVANCED_PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case KYCStatus.REJECTED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Gets an appropriate icon based on KYC status
 * 
 * @param kycStatus The KYC status to get an icon for
 * @returns The name of the Lucide icon to use
 */
export function getKYCStatusIcon(kycStatus: string | null): string {
  switch(kycStatus) {
    case KYCStatus.ADVANCED_VERIFIED:
      return 'CheckCircle';
    case KYCStatus.BASIC_COMPLETED:
      return 'CheckCircle';
    case KYCStatus.ADVANCED_PENDING:
      return 'Clock';
    case KYCStatus.REJECTED:
      return 'AlertCircle';
    default:
      return 'User';
  }
}

/**
 * Determines if a user can submit a KYC update
 * Always returns true regardless of KYC status to allow resubmission
 * 
 * @param kycStatus The user's KYC status
 * @returns Always true to allow resubmission
 */
export function canSubmitKYC(kycStatus: string | null): boolean {
  return true;
}