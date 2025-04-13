import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { 
  RiskDashboard, 
  RiskLevel, 
  RiskCategory, 
  RiskFactor, 
  CountryRisk, 
  PartnerRisk,
  RiskInsight,
  RiskTrend,
  RiskPrediction
} from '@/types/risk';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/hooks/useWeb3';
import OpenAI from 'openai';

// This hook provides risk assessment functionality including predictive insights
export const useRiskAssessment = (userId?: number) => {
  const { toast } = useToast();
  const { user } = useWeb3();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Fetch risk dashboard data
  const {
    data: riskDashboard,
    isLoading: isLoadingRiskDashboard,
    error: riskDashboardError,
    refetch: refetchRiskDashboard,
  } = useQuery({
    queryKey: ['/api/risk-assessment', userId || (user?.id)],
    enabled: !!userId || !!user?.id,
  });

  // Generate risk insights using AI
  const generateInsightsMutation = useMutation({
    mutationFn: async ({ contractId, categories }: { contractId?: string, categories?: RiskCategory[] }) => {
      setIsGeneratingInsights(true);
      const response = await apiRequest('POST', '/api/risk-assessment/generate-insights', {
        contractId,
        categories
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/risk-assessment'] });
      toast({
        title: "Risk Insights Generated",
        description: "New risk insights have been generated for your dashboard.",
      });
      setIsGeneratingInsights(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Generate Insights",
        description: error.message || "An error occurred while generating risk insights",
        variant: "destructive",
      });
      setIsGeneratingInsights(false);
    },
  });

  // Update risk mitigation preferences
  const updateMitigationPreferencesMutation = useMutation({
    mutationFn: async ({ riskFactorId, mitigationStrategies }: { riskFactorId: string, mitigationStrategies: string[] }) => {
      const response = await apiRequest('POST', '/api/risk-assessment/mitigation-preferences', {
        riskFactorId,
        mitigationStrategies
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/risk-assessment'] });
      toast({
        title: "Preferences Updated",
        description: "Your risk mitigation preferences have been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update risk mitigation preferences",
        variant: "destructive",
      });
    },
  });

  // Calculate country risk
  const calculateCountryRiskMutation = useMutation({
    mutationFn: async ({ country }: { country: string }) => {
      const response = await apiRequest('POST', '/api/risk-assessment/country-risk', { country });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/risk-assessment'] });
      toast({
        title: "Country Risk Updated",
        description: "Country risk assessment has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Risk Assessment Failed",
        description: error.message || "Failed to calculate country risk",
        variant: "destructive",
      });
    },
  });

  // Get risk insights for a specific contract
  const {
    data: contractRiskInsights,
    isLoading: isLoadingContractRiskInsights,
    error: contractRiskInsightsError,
    refetch: refetchContractRiskInsights,
  } = useQuery({
    queryKey: ['/api/risk-assessment/contract-insights', riskDashboard?.insights],
    enabled: !!riskDashboard?.insights,
    select: (data) => {
      if (!riskDashboard?.insights) return [];
      
      // Group insights by contract
      const contractInsights: Record<string, RiskInsight[]> = {};
      
      riskDashboard.insights.forEach(insight => {
        if (insight.relatedContracts && insight.relatedContracts.length > 0) {
          insight.relatedContracts.forEach(contractId => {
            if (!contractInsights[contractId]) {
              contractInsights[contractId] = [];
            }
            contractInsights[contractId].push(insight);
          });
        }
      });
      
      return contractInsights;
    }
  });

  // Calculate the overall risk score based on various factors
  const calculateRiskScore = (contract: any): { score: number, level: RiskLevel } => {
    if (!contract || !riskDashboard) return { score: 0, level: RiskLevel.LOW };
    
    let score = 0;
    let factorCount = 0;
    
    // Country risk (if available)
    const exporterParty = contract.parties?.find((p: any) => p.role === 'EXPORTER');
    if (exporterParty) {
      const countryRisk = riskDashboard.countryRisks.find(cr => cr.country === exporterParty.country);
      if (countryRisk) {
        score += countryRisk.overallRiskScore;
        factorCount++;
      }
    }
    
    // Partner risk
    const partnerIds = contract.parties?.map((p: any) => p.address) || [];
    const partnerRisks = riskDashboard.partnerRisks.filter(pr => 
      partnerIds.includes(pr.partnerId)
    );
    
    if (partnerRisks.length > 0) {
      const avgPartnerRisk = partnerRisks.reduce((sum, pr) => sum + pr.creditScore, 0) / partnerRisks.length;
      score += avgPartnerRisk;
      factorCount++;
    }
    
    // Contract specific risks
    const contractRisks = riskDashboard.riskFactors.filter(rf => 
      rf.relatedContracts?.includes(contract.id)
    );
    
    if (contractRisks.length > 0) {
      const avgContractRisk = contractRisks.reduce((sum, rf) => sum + rf.value, 0) / contractRisks.length;
      score += avgContractRisk;
      factorCount++;
    }
    
    // Normalize score
    const normalizedScore = factorCount > 0 ? score / factorCount : 0;
    
    // Determine risk level
    let level = RiskLevel.LOW;
    if (normalizedScore > 75) {
      level = RiskLevel.CRITICAL;
    } else if (normalizedScore > 50) {
      level = RiskLevel.HIGH;
    } else if (normalizedScore > 25) {
      level = RiskLevel.MEDIUM;
    }
    
    return { score: normalizedScore, level };
  };

  return {
    riskDashboard,
    isLoadingRiskDashboard,
    riskDashboardError,
    refetchRiskDashboard,
    generateInsights: generateInsightsMutation.mutate,
    isGeneratingInsights: isGeneratingInsights || generateInsightsMutation.isPending,
    updateMitigationPreferences: updateMitigationPreferencesMutation.mutate,
    isUpdatingMitigationPreferences: updateMitigationPreferencesMutation.isPending,
    calculateCountryRisk: calculateCountryRiskMutation.mutate,
    isCalculatingCountryRisk: calculateCountryRiskMutation.isPending,
    contractRiskInsights,
    isLoadingContractRiskInsights,
    calculateRiskScore
  };
};