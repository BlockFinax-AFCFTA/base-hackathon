import React, { useState } from 'react';
import { useLocalization } from '../../../hooks/useLocalization';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  ArrowDownToLine, 
  FileText, 
  Star, 
  ThumbsUp,
  BarChart4,
  Download,
  Printer,
  Wallet
} from 'lucide-react';

/**
 * The seventh step of the onboarding wizard
 * Demonstrates trade completion process
 */
const TradeCompletionStep: React.FC = () => {
  // Get localized translations
  const { t } = useLocalization('onboarding');
  
  // Local state for simulation
  const [stepStatus, setStepStatus] = useState({
    buyerConfirmation: true,
    fundsReleased: false,
    contractCompleted: false
  });
  
  // Simulate funds release
  const handleReleaseEscrow = () => {
    setStepStatus(prev => ({
      ...prev,
      fundsReleased: true
    }));
    
    // Simulate contract completion after funds release
    setTimeout(() => {
      setStepStatus(prev => ({
        ...prev,
        contractCompleted: true
      }));
    }, 1500);
  };
  
  // Calculate overall progress
  const completionProgress = 
    (stepStatus.buyerConfirmation ? 33 : 0) + 
    (stepStatus.fundsReleased ? 33 : 0) + 
    (stepStatus.contractCompleted ? 34 : 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{t('onboarding.step7.title')}</h1>
        <p className="text-gray-600 mt-2">{t('onboarding.step7.description')}</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Completion Progress</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Progress value={completionProgress} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Delivery Confirmed</span>
            <span>Funds Released</span>
            <span>Contract Completed</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade Completion Steps</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                {/* Step 1: Buyer Confirmation */}
                <div className="flex p-4 rounded-md border bg-white">
                  <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{t('onboarding.step7.buyerConfirmation')}</h3>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      European Coffee Imports Ltd. has confirmed receipt of the coffee 
                      beans and verified the quality matches the contract specifications.
                    </p>
                  </div>
                </div>
                
                {/* Step 2: Escrow Release */}
                <div className="flex p-4 rounded-md border bg-white">
                  <div className={`mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    stepStatus.fundsReleased ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <ArrowDownToLine className={`h-6 w-6 ${
                      stepStatus.fundsReleased ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{t('onboarding.step7.escrowRelease')}</h3>
                      {stepStatus.fundsReleased ? (
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {stepStatus.fundsReleased 
                        ? "The escrow funds have been successfully released to the seller's account."
                        : "The system is ready to release the funds from escrow to the seller."}
                    </p>
                    
                    {!stepStatus.fundsReleased && (
                      <Button 
                        onClick={handleReleaseEscrow} 
                        className="mt-2"
                        size="sm"
                      >
                        Release Funds
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Step 3: Contract Status */}
                <div className="flex p-4 rounded-md border bg-white">
                  <div className={`mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    stepStatus.contractCompleted ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <FileText className={`h-6 w-6 ${
                      stepStatus.contractCompleted ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{t('onboarding.step7.contractStatus')}</h3>
                      {stepStatus.contractCompleted ? (
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {stepStatus.contractCompleted 
                        ? "Contract has been successfully completed and closed."
                        : "Waiting for funds release to complete the contract."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={stepStatus.contractCompleted ? 'border-green-200' : 'border-gray-200'}>
            <CardHeader>
              <div className="flex items-center">
                <CardTitle>Trade Review</CardTitle>
                {stepStatus.contractCompleted && (
                  <Badge className="ml-2 bg-green-100 text-green-800">Available</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className={`pt-0 ${!stepStatus.contractCompleted ? 'opacity-50' : ''}`}>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star 
                        key={rating} 
                        className="h-8 w-8" 
                        fill={rating <= 4 ? "#FFD700" : "none"} 
                        stroke={rating <= 4 ? "#FFD700" : "#D1D5DB"} 
                      />
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    disabled={!stepStatus.contractCompleted}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Rate Buyer</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    disabled={!stepStatus.contractCompleted}
                  >
                    <BarChart4 className="h-4 w-4" />
                    <span>Leave Feedback</span>
                  </Button>
                </div>
                
                <p className="text-center text-sm text-gray-500">
                  {t('onboarding.step7.tip')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="h-5 w-5 mr-2 text-primary" />
                <span>Payment Confirmation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="p-4 rounded-md border bg-green-50 border-green-200">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Payment Successful</span>
                  </div>
                  <p className="mt-1 text-sm text-green-700">
                    USD 5,000.00 has been transferred to your account
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="font-mono">TXN2025050135792</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>May 1, 2025</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-semibold">USD 5,000.00</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fee:</span>
                    <span>USD 25.00 (0.5%)</span>
                  </div>
                  
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Net Amount:</span>
                    <span className="font-semibold">USD 4,975.00</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Save Receipt</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('onboarding.step7.generateReports')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-left">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Transaction Report</span>
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-left">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Trade Summary Report</span>
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-left">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Customs Documentation</span>
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-left">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Tax Invoice</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradeCompletionStep;