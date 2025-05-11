// User Types
export interface User {
  id: number;
  username: string;
  walletAddress: string | null;
  profileImage: string | null;
  email?: string;
  country?: string;
  role?: string;
}

// Contract Types
export enum ContractStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  AWAITING_FUNDS = 'AWAITING_FUNDS',
  FUNDED = 'FUNDED',
  ACTIVE = 'ACTIVE',
  GOODS_SHIPPED = 'GOODS_SHIPPED',
  GOODS_RECEIVED = 'GOODS_RECEIVED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED'
}

export enum PartyRole {
  IMPORTER = 'IMPORTER',
  EXPORTER = 'EXPORTER',
  MEDIATOR = 'MEDIATOR'
}

export interface Party {
  address: string;
  role: PartyRole;
  name: string;
  country: string;
}

export interface TradeTerms {
  incoterm: string;
  paymentTerms: string;
  currency: string;
  value: string;
  deliveryDeadline: Date;
  inspectionPeriod: number;
  disputeResolutionMechanism: string;
}

export interface Contract {
  id: number;
  contractAddress?: string;
  title: string;
  description: string;
  status: ContractStatus;
  parties: Party[];
  tradeTerms: TradeTerms;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  milestones: {
    created: Date;
    funded?: Date;
    shipped?: Date;
    received?: Date;
    completed?: Date;
    disputed?: Date;
  };
}

// Document Types
export interface Document {
  id: number;
  name: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: number;
  isVerified: boolean | null;
  createdAt: Date;
  contractId: number | null;
  invoiceId: number | null;
  description?: string;
  status?: 'approved' | 'pending' | 'draft' | 'expired';
  tags?: string[];
}

// Invoice Types
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  customer: {
    name: string;
    wallet: string;
  };
  items: InvoiceItem[];
  total: number;
  currency: string;
  contractId: string | null;
  contractName: string | null;
  paymentLink: string;
  notes: string | null;
}

// Logistics Types
export interface Milestone {
  name: string;
  status: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS';
  timestamp: Date | null;
  location?: string;
  notes?: string;
}

export interface Logistics {
  id: number;
  userId: number;
  contractId: number | null;
  type: 'BOOKING' | 'TRACKING';
  status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  origin: string;
  destination: string;
  shipmentDate: Date;
  cargoType: string;
  weight: string;
  specialRequirements: string | null;
  providerId: number | null;
  trackingNumber: string | null;
  milestones: Record<string, Milestone> | null;
  estimatedDelivery: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Wallet Types
export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  address: string;
}

export interface Transaction {
  id: number;
  fromWalletId: number | null;
  toWalletId: number | null;
  amount: string;
  currency: string;
  txType: string;
  status: string;
  contractId: number | null;
  description: string | null;
  createdAt: Date;
  metadata: Record<string, any> | null;
  documents?: Document[];
}

export interface EscrowItem {
  id: number;
  contractId: number;
  contractTitle: string;
  escrowAddress: string;
  amount: string;
  currency: string;
  status: 'FUNDED' | 'RELEASED' | 'PENDING' | 'DISPUTED';
  createdAt: Date;
  updatedAt: Date;
  releaseConditions?: string;
  parties: {
    buyer: string;
    seller: string;
  };
  relatedDocs?: {
    id: number;
    name: string;
    url: string;
    fileType: string;
  }[];
  txHash?: string;
}