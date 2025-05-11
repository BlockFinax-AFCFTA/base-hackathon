export interface Wallet {
  id: number;
  userId: number;
  walletType: string;
  contractId: number | null;
  balance: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
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

export const mockWallets: Wallet[] = [
  {
    id: 1,
    userId: 1,
    walletType: 'MAIN',
    contractId: null,
    balance: '15000.00',
    currency: 'USDC',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-04-23')
  },
  {
    id: 2,
    userId: 1,
    walletType: 'MAIN',
    contractId: null,
    balance: '7500.00',
    currency: 'USDT',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-04-20')
  },
  {
    id: 3,
    userId: 1,
    walletType: 'MAIN',
    contractId: null,
    balance: '10000.00',
    currency: 'DAI',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-04-18')
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    fromWalletId: 1,
    toWalletId: 101,
    amount: '50000.00',
    currency: 'USDC',
    txType: 'ESCROW_FUND',
    status: 'COMPLETED',
    contractId: 1,
    description: 'Fund escrow for Electronics Import contract',
    createdAt: new Date('2025-04-13'),
    metadata: {
      txHash: '0x7a9fe22691c811ea339c979c3e7d2a484cad057cd9f79384cb0e4bbe9b4c82a9'
    }
  },
  {
    id: 2,
    fromWalletId: 2,
    toWalletId: 102,
    amount: '35000.00',
    currency: 'USDT',
    txType: 'ESCROW_FUND',
    status: 'COMPLETED',
    contractId: 2,
    description: 'Fund escrow for Coffee Beans Import contract',
    createdAt: new Date('2025-04-21'),
    metadata: {
      txHash: '0x8a9fe22691c811ea339c979c3e7d2a484cad057cd9f79384cb0e4bbe9b4c82b8'
    }
  },
  {
    id: 3,
    fromWalletId: null,
    toWalletId: 1,
    amount: '25000.00',
    currency: 'USDC',
    txType: 'DEPOSIT',
    status: 'COMPLETED',
    contractId: null,
    description: 'Deposit from external wallet',
    createdAt: new Date('2025-04-10'),
    metadata: {
      txHash: '0x5d53558c27e0afd4a9037c5f0c6717d52055286c928bcdd0432c8e6c796ca23f'
    }
  },
  {
    id: 4,
    fromWalletId: null,
    toWalletId: 2,
    amount: '15000.00',
    currency: 'USDT',
    txType: 'DEPOSIT',
    status: 'COMPLETED',
    contractId: null,
    description: 'Deposit from external wallet',
    createdAt: new Date('2025-04-08'),
    metadata: {
      txHash: '0x6d53558c27e0afd4a9037c5f0c6717d52055286c928bcdd0432c8e6c796ca34g'
    }
  },
  {
    id: 5,
    fromWalletId: null,
    toWalletId: 3,
    amount: '10000.00',
    currency: 'DAI',
    txType: 'DEPOSIT',
    status: 'COMPLETED',
    contractId: null,
    description: 'Deposit from external wallet',
    createdAt: new Date('2025-04-05'),
    metadata: {
      txHash: '0xd03e653d5d3b134d3a6c9689231a8992e5878a67af8daa7b016f2c3c34527336'
    }
  }
];

export const mockEscrows: EscrowItem[] = [
  {
    id: 1,
    contractId: 1,
    contractTitle: 'Electronics Import from Japan',
    escrowAddress: '0x8f532f9aE789DD4221BC9e15E050dfa7b3f47E8B',
    amount: '50000.00',
    currency: 'USDC',
    status: 'FUNDED',
    createdAt: new Date('2025-04-13'),
    updatedAt: new Date('2025-04-13'),
    releaseConditions: 'Funds will be released when proof of delivery is verified on blockchain.',
    parties: {
      buyer: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      seller: '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'
    },
    txHash: '0x7a9fe22691c811ea339c979c3e7d2a484cad057cd9f79384cb0e4bbe9b4c82a9',
    relatedDocs: [
      {
        id: 1,
        name: 'Commercial Invoice - Electronics',
        fileType: 'pdf',
        url: '#'
      },
      {
        id: 2,
        name: 'Bill of Lading - Container MAEU1234567',
        fileType: 'pdf',
        url: '#'
      },
      {
        id: 3,
        name: 'Letter of Credit - Bank of America',
        fileType: 'pdf',
        url: '#'
      }
    ]
  },
  {
    id: 2,
    contractId: 2,
    contractTitle: 'Coffee Beans Import from Brazil',
    escrowAddress: '0x2eD29d982B0120d49899a7cC7AfE7f5d5435BdBb',
    amount: '35000.00',
    currency: 'USDT',
    status: 'FUNDED',
    createdAt: new Date('2025-04-21'),
    updatedAt: new Date('2025-04-21'),
    releaseConditions: 'Funds will be released when Certificate of Origin is verified and goods are delivered.',
    parties: {
      buyer: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      seller: '0x9246f6940e2eb28930efb4cef49b2d1f2c9c5678'
    },
    txHash: '0x8a9fe22691c811ea339c979c3e7d2a484cad057cd9f79384cb0e4bbe9b4c82b8',
    relatedDocs: [
      {
        id: 5,
        name: 'Commercial Invoice - Coffee Beans',
        fileType: 'pdf',
        url: '#'
      },
      {
        id: 6,
        name: 'Phytosanitary Certificate - Brazil Coffee',
        fileType: 'pdf',
        url: '#'
      }
    ]
  },
  {
    id: 3,
    contractId: 3,
    contractTitle: 'Textile Import from India',
    escrowAddress: '0x0000000000000000000000000000000000000000',
    amount: '27500.00',
    currency: 'DAI',
    status: 'PENDING',
    createdAt: new Date('2025-04-25'),
    updatedAt: new Date('2025-04-25'),
    releaseConditions: 'Standard contract conditions apply.',
    parties: {
      buyer: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      seller: '0x5826f6940e2eb28930efb4cef49b2d1f2c9c7890'
    },
    relatedDocs: [
      {
        id: 8,
        name: 'Draft Contract - Textile Import',
        fileType: 'docx',
        url: '#'
      }
    ]
  }
];