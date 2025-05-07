import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Truck, Package, Plus, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import LogisticsTracking from './LogisticsTracking';
import LogisticsForm from './LogisticsForm';
import { useLogistics } from '../../hooks/useLogistics';

interface LogisticsWidgetProps {
  contractId: number;
}

const LogisticsWidget: React.FC<LogisticsWidgetProps> = ({ contractId }) => {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const { 
    contractLogistics, 
    isLoadingContractLogistics, 
    refetchContractLogistics 
  } = useLogistics(undefined, contractId);

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    refetchContractLogistics();
  };

  if (isLoadingContractLogistics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Logistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-6">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading logistics information...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!contractLogistics || contractLogistics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Logistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6">
            <Package className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <p className="text-center text-muted-foreground mb-6">
              No logistics information is available for this contract.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Set Up Logistics
          </Button>
        </CardFooter>
        
        {/* Create Logistics Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Set Up Logistics
              </DialogTitle>
            </DialogHeader>
            <LogisticsForm 
              contractId={contractId} 
              onSuccess={handleCreateSuccess} 
              onCancel={() => setIsCreateOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </Card>
    );
  }

  // If logistics exists for this contract
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Logistics
            </div>
            {contractLogistics.length > 1 && (
              <span className="text-sm font-normal text-muted-foreground">
                {contractLogistics.length} shipments
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <LogisticsTracking contractId={contractId} logisticsId={contractLogistics[0].id} />
        </CardContent>
        {contractLogistics.length > 1 && (
          <CardFooter className="flex justify-center pt-0 pb-4">
            <Button variant="link" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              View All Shipments ({contractLogistics.length})
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {/* Create New Logistics Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" />
              Add New Logistics
            </DialogTitle>
          </DialogHeader>
          <LogisticsForm 
            contractId={contractId} 
            onSuccess={handleCreateSuccess} 
            onCancel={() => setIsCreateOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogisticsWidget;