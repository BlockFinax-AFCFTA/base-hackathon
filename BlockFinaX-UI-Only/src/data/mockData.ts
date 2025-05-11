import { User, Contract, ContractStatus, PartyRole, Document, Invoice, Logistics, TokenInfo, Transaction, EscrowItem } from '../types';

// Mock Current User
export const currentUser: User = {
  id: 1,
  username: 'user_demo',
  walletAddress: '0x8f532f9aE789DD4221BC9e15E050dfa7b3f47E8B',
  profileImage: null,
  email: 'demo@blockfinax.com',
  country: 'Singapore',
  role: 'Trader'
};

// Mock Documents
export const documents: Document[] = [
  {
    id: 1,
    name: 'Commercial Invoice #INV-2025-001',
    fileType: 'pdf',
    fileSize: 2456233,
    url: '#',
    uploadedBy: 1,
    isVerified: true,
    createdAt: new Date('2025-04-05'),
    contractId: 1,
    invoiceId: 1,
    description: 'Official commercial invoice for electronics shipment',
    status: 'approved',
    tags: ['invoice', 'commercial']
  },
  {
    id: 2,
    name: 'Bill of Lading #BOL-2025-001',
    fileType: 'pdf',
    fileSize: 1856478,
    url: '#',
    uploadedBy: 1,
    isVerified: true,
    createdAt: new Date('2025-04-06'),
    contractId: 1,
    invoiceId: null,
    description: 'Official bill of lading for container shipment',
    status: 'approved',
    tags: ['shipping', 'legal']
  },
  {
    id: 3,
    name: 'Certificate of Origin',
    fileType: 'pdf',
    fileSize: 945872,
    url: '#',
    uploadedBy: 1,
    isVerified: true,
    createdAt: new Date('2025-04-06'),
    contractId: 1,
    invoiceId: null,
    description: 'Certificate of origin for manufacturing country verification',
    status: 'approved',
    tags: ['certification', 'origin']
  },
  {
    id: 4,
    name: 'Letter of Credit',
    fileType: 'pdf',
    fileSize: 1256984,
    url: '#',
    uploadedBy: 1,
    isVerified: true,
    createdAt: new Date('2025-04-04'),
    contractId: 1,
    invoiceId: null,
    description: 'Bank letter of credit for transaction guarantee',
    status: 'approved',
    tags: ['banking', 'financial']
  },
  {
    id: 5,
    name: 'Shipping Insurance',
    fileType: 'pdf',
    fileSize: 1056324,
    url: '#',
    uploadedBy: 1,
    isVerified: true,
    createdAt: new Date('2025-04-07'),
    contractId: 1,
    invoiceId: null,
    description: 'Insurance document for goods in transit',
    status: 'approved',
    tags: ['insurance', 'shipping']
  },
];

// Mock Contracts
export const contracts: Contract[] = [
  {
    id: 1,
    contractAddress: '0x9a1fc8c0369d2f03e516ab9f0a62b3ae2341b2ca',
    title: 'Electronics Import Contract',
    description: 'International contract for the purchase and import of electronic components from Taiwan to the United States.',
    status: ContractStatus.FUNDED,
    parties: [
      {
        address: '0x8f532f9aE789DD4221BC9e15E050dfa7b3f47E8B',
        role: PartyRole.IMPORTER,
        name: 'Acme Electronics Inc.',
        country: 'United States'
      },
      {
        address: '0x2eD29d982B0120d49899a7cC7AfE7f5d5435BdBb',
        role: PartyRole.EXPORTER,
        name: 'Taiwan Semiconductor Co.',
        country: 'Taiwan'
      }
    ],
    tradeTerms: {
      incoterm: 'FOB',
      paymentTerms: 'Letter of Credit',
      currency: 'USDC',
      value: '125000',
      deliveryDeadline: new Date('2025-06-15'),
      inspectionPeriod: 5,
      disputeResolutionMechanism: 'Arbitration'
    },
    documents: documents.filter(doc => doc.contractId === 1),
    createdAt: new Date('2025-04-01'),
    updatedAt: new Date('2025-04-05'),
    createdBy: 'user_demo',
    milestones: {
      created: new Date('2025-04-01'),
      funded: new Date('2025-04-05')
    }
  },
  {
    id: 2,
    contractAddress: '0x7b12fbe4a441a78a64ec394b51b591c4b57c8859',
    title: 'Agricultural Commodities Contract',
    description: 'Trade agreement for organic soybeans export from Brazil to Japan.',
    status: ContractStatus.AWAITING_FUNDS,
    parties: [
      {
        address: '0x8f532f9aE789DD4221BC9e15E050dfa7b3f47E8B',
        role: PartyRole.IMPORTER,
        name: 'Tokyo Food Supply Co.',
        country: 'Japan'
      },
      {
        address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        role: PartyRole.EXPORTER,
        name: 'Brazilian Organic Farms',
        country: 'Brazil'
      }
    ],
    tradeTerms: {
      incoterm: 'CIF',
      paymentTerms: 'Advance Payment',
      currency: 'USDT',
      value: '250000',
      deliveryDeadline: new Date('2025-07-30'),
      inspectionPeriod: 7,
      disputeResolutionMechanism: 'Mediation'
    },
    documents: [],
    createdAt: new Date('2025-04-10'),
    updatedAt: new Date('2025-04-12'),
    createdBy: 'user_demo',
    milestones: {
      created: new Date('2025-04-10')
    }
  },
  {
    id: 3,
    title: 'Textile Manufacturing Agreement',
    description: 'Contract for the manufacturing and export of textile products from India to Germany.',
    status: ContractStatus.DRAFT,
    parties: [
      {
        address: '0x8f532f9aE789DD4221BC9e15E050dfa7b3f47E8B',
        role: PartyRole.IMPORTER,
        name: 'Berlin Fashion House',
        country: 'Germany'
      },
      {
        address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        role: PartyRole.EXPORTER,
        name: 'Mumbai Textile Mills',
        country: 'India'
      }
    ],
    tradeTerms: {
      incoterm: 'DAP',
      paymentTerms: 'Open Account',
      currency: 'USDC',
      value: '75000',
      deliveryDeadline: new Date('2025-08-15'),
      inspectionPeriod: 10,
      disputeResolutionMechanism: 'ICC Arbitration'
    },
    documents: [],
    createdAt: new Date('2025-04-15'),
    updatedAt: new Date('2025-04-15'),
    createdBy: 'user_demo',
    milestones: {
      created: new Date('2025-04-15')
    }
  }
];

// Mock Invoices
export const invoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001',
    status: 'paid',
    issueDate: new Date('2025-04-05'),
    dueDate: new Date('2025-05-05'),
    customer: {
      name: 'Taiwan Semiconductor Co.',
      wallet: '0x2eD29d982B0120d49899a7cC7AfE7f5d5435BdBb'
    },
    items: [
      {
        id: '1-1',
        description: 'High-performance microprocessors',
        quantity: 500,
        unitPrice: 200,
        totalPrice: 100000
      },
      {
        id: '1-2',
        description: 'Cooling systems',
        quantity: 500,
        unitPrice: 50,
        totalPrice: 25000
      }
    ],
    total: 125000,
    currency: 'USDC',
    contractId: '1',
    contractName: 'Electronics Import Contract',
    paymentLink: '#',
    notes: 'Payment received on time. Thank you for your business.'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-002',
    status: 'sent',
    issueDate: new Date('2025-04-12'),
    dueDate: new Date('2025-05-12'),
    customer: {
      name: 'Brazilian Organic Farms',
      wallet: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
    },
    items: [
      {
        id: '2-1',
        description: 'Organic soybeans (metric tons)',
        quantity: 50,
        unitPrice: 5000,
        totalPrice: 250000
      }
    ],
    total: 250000,
    currency: 'USDT',
    contractId: '2',
    contractName: 'Agricultural Commodities Contract',
    paymentLink: '#',
    notes: 'Please make payment by the due date.'
  }
];

// Mock Logistics Data
export const logistics: Logistics[] = [
  {
    id: 1,
    userId: 1,
    contractId: 1,
    type: 'TRACKING',
    status: 'IN_TRANSIT',
    origin: 'Taipei, Taiwan',
    destination: 'Los Angeles, USA',
    shipmentDate: new Date('2025-04-20'),
    cargoType: 'Electronics',
    weight: '2500 kg',
    specialRequirements: 'Fragile items, handle with care',
    providerId: 1,
    trackingNumber: 'TRACK123456789',
    milestones: {
      'order_received': {
        name: 'Order Received',
        status: 'COMPLETED',
        timestamp: new Date('2025-04-05'),
        location: 'Taipei, Taiwan'
      },
      'processing': {
        name: 'Processing',
        status: 'COMPLETED',
        timestamp: new Date('2025-04-10'),
        location: 'Taipei, Taiwan'
      },
      'pickup': {
        name: 'Pickup',
        status: 'COMPLETED',
        timestamp: new Date('2025-04-15'),
        location: 'Taipei, Taiwan'
      },
      'shipping': {
        name: 'Shipping',
        status: 'IN_PROGRESS',
        timestamp: new Date('2025-04-20'),
        location: 'Pacific Ocean'
      },
      'customs': {
        name: 'Customs Clearance',
        status: 'PENDING',
        timestamp: null,
        location: null
      },
      'delivery': {
        name: 'Delivery',
        status: 'PENDING',
        timestamp: null,
        location: null
      }
    },
    estimatedDelivery: new Date('2025-05-15'),
    createdAt: new Date('2025-04-05'),
    updatedAt: new Date('2025-04-20')
  }
];

// Mock Wallet Data
export const tokens: TokenInfo[] = [
  {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    balance: '150000.25',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    balance: '75500.50',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
  },
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    balance: '32750.75',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f'
  }
];

// Mock Transactions
export const transactions: Transaction[] = [
  {
    id: 1,
    fromWalletId: 1,
    toWalletId: null,
    amount: '125000',
    currency: 'USDC',
    txType: 'ESCROW_DEPOSIT',
    status: 'COMPLETED',
    contractId: 1,
    description: 'Escrow funding for Electronics Import Contract',
    createdAt: new Date('2025-04-05'),
    metadata: {
      txHash: '0x5d53558c27e0afd4a9037c5f0c6717d52055286c928bcdd0432c8e6c796ca23f',
      escrowAddress: '0x9a1fc8c0369d2f03e516ab9f0a62b3ae2341b2ca'
    },
    documents: documents.filter(doc => doc.contractId === 1)
  },
  {
    id: 2,
    fromWalletId: null,
    toWalletId: 1,
    amount: '50000',
    currency: 'USDT',
    txType: 'DEPOSIT',
    status: 'COMPLETED',
    contractId: null,
    description: 'Deposit from exchange',
    createdAt: new Date('2025-04-02'),
    metadata: {
      txHash: '0x3b7fe8bf5afe65b15357b56765b3db8b68e3a12c4b24c4d98087ade7f2997d84'
    }
  }
];

// Mock Escrow Wallet Items
export const escrowItems: EscrowItem[] = [
  {
    id: 1,
    contractId: 1,
    contractTitle: 'Electronics Import Contract',
    escrowAddress: '0x9a1fc8c0369d2f03e516ab9f0a62b3ae2341b2ca',
    amount: '125000',
    currency: 'USDC',
    status: 'FUNDED',
    createdAt: new Date('2025-04-05'),
    updatedAt: new Date('2025-04-05'),
    releaseConditions: 'Funds will be released when proof of delivery is verified on blockchain.',
    parties: {
      buyer: '0x8f532f9aE789DD4221BC9e15E050dfa7b3f47E8B',
      seller: '0x2eD29d982B0120d49899a7cC7AfE7f5d5435BdBb'
    },
    txHash: '0x5d53558c27e0afd4a9037c5f0c6717d52055286c928bcdd0432c8e6c796ca23f',
    relatedDocs: [
      {
        id: 1,
        name: 'Commercial Invoice #INV-2025-001',
        fileType: 'pdf',
        url: '#',
      },
      {
        id: 2,
        name: 'Bill of Lading #BOL-2025-001',
        fileType: 'pdf',
        url: '#',
      }
    ]
  },
  {
    id: 2,
    contractId: 2,
    contractTitle: 'Agricultural Commodities Contract',
    escrowAddress: '0x7b12fbe4a441a78a64ec394b51b591c4b57c8859',
    amount: '250000',
    currency: 'USDT',
    status: 'PENDING',
    createdAt: new Date('2025-04-12'),
    updatedAt: new Date('2025-04-12'),
    releaseConditions: 'Funds will be released when Certificate of Origin is verified and goods are delivered.',
    parties: {
      buyer: '0x8f532f9aE789DD4221BC9e15E050dfa7b3f47E8B',
      seller: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
    }
  }
];