export interface Party {
  name: string;
  role: string;
  address: string;
}

export interface TradeTerms {
  value?: string;
  currency?: string;
  amount?: string;
  startDate?: Date;
  endDate?: Date | null;
  paymentTerms?: string;
  deliveryDeadline?: Date;
}

export interface Milestone {
  name: string;
  amount: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  dueDate: Date;
}

export interface EscrowContract {
  id: number;
  contractAddress: string | null;
  title: string;
  description: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'TERMINATED' | 'DISPUTED';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  parties: Party[];
  tradeTerms: TradeTerms;
  milestones?: Milestone[];
  escrowWalletId: number | null;
  documents?: any[];
}

// Helper functions for contract status
export const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    'DRAFT': 'yellow',
    'ACTIVE': 'green',
    'COMPLETED': 'blue',
    'TERMINATED': 'red',
    'DISPUTED': 'orange'
  };
  
  return statusMap[status] || 'gray';
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'DRAFT': 'Draft',
    'ACTIVE': 'Active',
    'COMPLETED': 'Completed',
    'TERMINATED': 'Terminated',
    'DISPUTED': 'Disputed'
  };
  
  return statusMap[status] || status;
};