export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum RiskCategory {
  CREDIT = 'CREDIT',
  COUNTRY = 'COUNTRY',
  CURRENCY = 'CURRENCY',
  DELIVERY = 'DELIVERY',
  PAYMENT = 'PAYMENT',
  DOCUMENTATION = 'DOCUMENTATION',
  REGULATORY = 'REGULATORY',
  FRAUD = 'FRAUD'
}

export interface RiskFactor {
  id: string;
  category: RiskCategory;
  description: string;
  level: RiskLevel;
  value: number; // 0-100 score
  trend: 'increasing' | 'stable' | 'decreasing';
  impactDescription: string;
  mitigationSuggestions: string[];
  relatedContracts?: string[];
}

export interface CountryRisk {
  country: string;
  iso: string;
  politicalStabilityScore: number; // 0-100
  economicStabilityScore: number; // 0-100
  regulatoryQualityScore: number; // 0-100
  overallRiskScore: number; // 0-100
  riskLevel: RiskLevel;
  tradeRestrictions: string[];
  tradingPartnerCount: number;
}

export interface PartnerRisk {
  partnerId: string;
  partnerName: string;
  country: string;
  creditScore: number; // 0-100
  paymentHistory: {
    onTimePayments: number;
    latePayments: number;
    missedPayments: number;
  };
  totalTradeVolume: number;
  avgTransactionSize: number;
  relationshipYears: number;
  riskLevel: RiskLevel;
  recentFlags: string[];
}

export interface RiskInsight {
  id: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  impact: string;
  recommendation: string;
  expiresAt: Date;
  source: string;
  relatedCategory: RiskCategory;
  relatedContracts?: string[];
}

export interface RiskTrend {
  category: RiskCategory;
  values: {
    date: string;
    value: number;
  }[];
  forecast: {
    date: string;
    value: number;
    confidence: number;
  }[];
}

export interface RiskPrediction {
  category: RiskCategory;
  probability: number; // 0-1
  impact: number; // 0-10 
  riskScore: number; // probability * impact
  potentialLoss: number;
  timeframe: 'short' | 'medium' | 'long';
  confidence: number; // 0-1
  factors: string[];
  mitigationOptions: {
    strategy: string;
    costToImplement: number;
    effectivenessScore: number; // 0-10
    timeToImplement: string;
  }[];
}

export interface RiskDashboard {
  overallRiskScore: number; // 0-100
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  countryRisks: CountryRisk[];
  partnerRisks: PartnerRisk[];
  insights: RiskInsight[];
  trends: RiskTrend[];
  predictions: RiskPrediction[];
  lastUpdated: Date;
}

export const getRiskLevelColor = (level: RiskLevel): string => {
  switch (level) {
    case RiskLevel.LOW:
      return 'green';
    case RiskLevel.MEDIUM:
      return 'yellow';
    case RiskLevel.HIGH:
      return 'orange';
    case RiskLevel.CRITICAL:
      return 'red';
    default:
      return 'gray';
  }
};

export const getRiskCategoryIcon = (category: RiskCategory): string => {
  switch (category) {
    case RiskCategory.CREDIT:
      return 'credit-card';
    case RiskCategory.COUNTRY:
      return 'globe';
    case RiskCategory.CURRENCY:
      return 'dollar-sign';
    case RiskCategory.DELIVERY:
      return 'truck';
    case RiskCategory.PAYMENT:
      return 'landmark';
    case RiskCategory.DOCUMENTATION:
      return 'file-text';
    case RiskCategory.REGULATORY:
      return 'shield';
    case RiskCategory.FRAUD:
      return 'alert-triangle';
    default:
      return 'alert-circle';
  }
};