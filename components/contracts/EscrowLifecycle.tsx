import React from 'react';
import { 
  CheckCircle2, 
  Wallet, 
  Package, 
  Landmark, 
  CircleAlert
} from 'lucide-react';

interface EscrowLifecycleProps {
  status?: 'draft' | 'pendingapproval' | 'awaitingfunds' | 'funded' | 'active' | 'goodsshipped' | 'goodsreceived' | 'completed' | string;
  contractDate?: Date;
  escrowAmount?: string;
  escrowCurrency?: string;
}

export const EscrowLifecycle: React.FC<EscrowLifecycleProps> = ({
  status = 'draft',
  contractDate,
  escrowAmount = '0',
  escrowCurrency = 'USDC'
}) => {
  // Function to check if current status is at or past a given status
  const isStatusActive = (checkStatus: string | string[]) => {
    const statusOrder = [
      'draft', 
      'pendingapproval', 
      'awaitingfunds', 
      'funded', 
      'active', 
      'goodsshipped', 
      'goodsreceived', 
      'completed'
    ];
    
    const currentIndex = statusOrder.indexOf(status);
    
    if (Array.isArray(checkStatus)) {
      return checkStatus.some(s => {
        const checkIndex = statusOrder.indexOf(s);
        return checkIndex >= 0 && currentIndex >= checkIndex;
      });
    } else {
      const checkIndex = statusOrder.indexOf(checkStatus);
      return checkIndex >= 0 && currentIndex >= checkIndex;
    }
  };
  
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-6">Escrow Lifecycle</h3>
      
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-3.5 top-0 h-full w-px bg-muted-foreground/20"></div>
        
        {/* Contract Created */}
        <div className="relative mb-6">
          <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="ml-10">
            <div className="font-medium text-base">Contract Created</div>
            <div className="text-muted-foreground text-sm mt-1">
              {contractDate ? new Date(contractDate).toLocaleDateString() : 'Not specified'}
            </div>
          </div>
        </div>
        
        {/* Parties Approved */}
        <div className={`relative mb-6 ${isStatusActive(['pendingapproval', 'awaitingfunds', 'funded', 'active', 'goodsshipped', 'goodsreceived', 'completed']) ? 'opacity-100' : 'opacity-60'}`}>
          <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
            isStatusActive(['pendingapproval', 'awaitingfunds', 'funded', 'active', 'goodsshipped', 'goodsreceived', 'completed']) 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted-foreground/20 text-muted-foreground'
          }`}>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="ml-10">
            <div className="font-medium text-base">Parties Approved</div>
            <div className="text-muted-foreground text-sm mt-1">
              Contract terms approved by all participants
            </div>
          </div>
        </div>
        
        {/* Escrow Funded */}
        <div className={`relative mb-6 ${isStatusActive(['funded', 'active', 'goodsshipped', 'goodsreceived', 'completed']) ? 'opacity-100' : 'opacity-60'}`}>
          <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
            isStatusActive(['funded', 'active', 'goodsshipped', 'goodsreceived', 'completed']) 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted-foreground/20 text-muted-foreground'
          }`}>
            <Wallet className="h-4 w-4" />
          </div>
          <div className="ml-10">
            <div className="font-medium text-base">Escrow Funded</div>
            <div className="text-muted-foreground text-sm mt-1">
              {escrowAmount} {escrowCurrency} locked in escrow
            </div>
          </div>
        </div>
        
        {/* Goods Received */}
        <div className={`relative mb-6 ${isStatusActive(['goodsreceived', 'completed']) ? 'opacity-100' : 'opacity-60'}`}>
          <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
            isStatusActive(['goodsreceived', 'completed']) 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted-foreground/20 text-muted-foreground'
          }`}>
            <Package className="h-4 w-4" />
          </div>
          <div className="ml-10">
            <div className="font-medium text-base">Goods Received</div>
            <div className="text-muted-foreground text-sm mt-1">
              Buyer confirmed receipt of goods
            </div>
          </div>
        </div>
        
        {/* Funds Released */}
        <div className={`relative ${isStatusActive('completed') ? 'opacity-100' : 'opacity-60'}`}>
          <div className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full ${
            isStatusActive('completed') 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted-foreground/20 text-muted-foreground'
          }`}>
            <Landmark className="h-4 w-4" />
          </div>
          <div className="ml-10">
            <div className="font-medium text-base">Funds Released</div>
            <div className="text-muted-foreground text-sm mt-1">
              {isStatusActive('completed') 
                ? `Payment of ${escrowAmount} ${escrowCurrency} sent to seller` 
                : "Awaiting confirmation to release funds"
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowLifecycle;