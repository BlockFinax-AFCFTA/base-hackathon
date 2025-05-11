export const mockContracts = [
  {
    id: 1,
    contractAddress: "0x9a1fc8c0369d2f03e60e891b88b36a19860e25d7",
    title: "Electronics Import from Japan",
    description: "Import of smartphone components from Tokyo supplier",
    status: "ACTIVE",
    parties: [
      {
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        role: "IMPORTER",
        name: "Global Tech Inc.",
        country: "United States"
      },
      {
        address: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
        role: "EXPORTER",
        name: "Tokyo Electronics Ltd.",
        country: "Japan"
      }
    ],
    tradeTerms: {
      incoterm: "FOB",
      paymentTerms: "Letter of Credit",
      currency: "USDC",
      value: "50000",
      deliveryDeadline: new Date("2025-05-30"),
      inspectionPeriod: 7,
      disputeResolutionMechanism: "Arbitration"
    },
    documents: [
      {
        id: "doc-101",
        name: "Commercial Invoice",
        documentType: "Invoice",
        hash: "0x7a9fe22691c811ea339c979c3e7d2a484cad057cd9f79384cb0e4bbe9b4c82a9",
        uploadedBy: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        uploadedAt: new Date("2025-04-15"),
        url: "#"
      },
      {
        id: "doc-102",
        name: "Bill of Lading",
        documentType: "Transport",
        hash: "0x5d53558c27e0afd4a9037c5f0c6717d52055286c928bcdd0432c8e6c796ca23f",
        uploadedBy: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
        uploadedAt: new Date("2025-04-16"),
        url: "#"
      },
      {
        id: "doc-103",
        name: "Letter of Credit",
        documentType: "Financial",
        hash: "0xd03e653d5d3b134d3a6c9689231a8992e5878a67af8daa7b016f2c3c34527336",
        uploadedBy: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        uploadedAt: new Date("2025-04-14"),
        url: "#"
      }
    ],
    createdAt: new Date("2025-04-10"),
    updatedAt: new Date("2025-04-16"),
    createdBy: "John Doe",
    milestones: {
      created: new Date("2025-04-10"),
      approved: new Date("2025-04-12"),
      funded: new Date("2025-04-13"),
      shipped: new Date("2025-04-20"),
      received: null,
      completed: null,
      disputed: null
    }
  },
  {
    id: 2,
    contractAddress: "0x3c5c53f7f4e96c51a5c52b8d1a7e4b3c9d3e7b8a",
    title: "Coffee Beans Import from Brazil",
    description: "Specialty coffee imports from São Paulo region",
    status: "FUNDED",
    parties: [
      {
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        role: "IMPORTER",
        name: "Premium Coffee Co.",
        country: "United States"
      },
      {
        address: "0x9246f6940e2eb28930efb4cef49b2d1f2c9c5678",
        role: "EXPORTER",
        name: "Brazil Coffee Exports S.A.",
        country: "Brazil"
      }
    ],
    tradeTerms: {
      incoterm: "CIF",
      paymentTerms: "Cash Against Documents",
      currency: "USDT",
      value: "35000",
      deliveryDeadline: new Date("2025-06-15"),
      inspectionPeriod: 5,
      disputeResolutionMechanism: "Mediation"
    },
    documents: [
      {
        id: "doc-201",
        name: "Commercial Invoice - Coffee",
        documentType: "Invoice",
        hash: "0x8a9fe22691c811ea339c979c3e7d2a484cad057cd9f79384cb0e4bbe9b4c82b8",
        uploadedBy: "0x9246f6940e2eb28930efb4cef49b2d1f2c9c5678",
        uploadedAt: new Date("2025-04-22"),
        url: "#"
      },
      {
        id: "doc-202",
        name: "Phytosanitary Certificate",
        documentType: "Regulatory",
        hash: "0x6d53558c27e0afd4a9037c5f0c6717d52055286c928bcdd0432c8e6c796ca34g",
        uploadedBy: "0x9246f6940e2eb28930efb4cef49b2d1f2c9c5678",
        uploadedAt: new Date("2025-04-22"),
        url: "#"
      }
    ],
    createdAt: new Date("2025-04-18"),
    updatedAt: new Date("2025-04-22"),
    createdBy: "John Doe",
    milestones: {
      created: new Date("2025-04-18"),
      approved: new Date("2025-04-20"),
      funded: new Date("2025-04-21"),
      shipped: null,
      received: null,
      completed: null,
      disputed: null
    }
  },
  {
    id: 3,
    contractAddress: null,
    title: "Textile Import from India",
    description: "Cotton and silk textiles from Mumbai supplier",
    status: "DRAFT",
    parties: [
      {
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        role: "IMPORTER",
        name: "Fashion Fabrics Inc.",
        country: "United States"
      },
      {
        address: "0x5826f6940e2eb28930efb4cef49b2d1f2c9c7890",
        role: "EXPORTER",
        name: "Mumbai Textiles Ltd.",
        country: "India"
      }
    ],
    tradeTerms: {
      incoterm: "EXW",
      paymentTerms: "Open Account",
      currency: "DAI",
      value: "27500",
      deliveryDeadline: new Date("2025-07-10"),
      inspectionPeriod: 3,
      disputeResolutionMechanism: "Negotiation"
    },
    documents: [],
    createdAt: new Date("2025-04-25"),
    updatedAt: new Date("2025-04-25"),
    createdBy: "John Doe",
    milestones: {
      created: new Date("2025-04-25"),
      approved: null,
      funded: null,
      shipped: null,
      received: null,
      completed: null,
      disputed: null
    }
  }
];

export const contractStatuses = [
  { value: 'DRAFT', label: 'Draft', color: 'gray' },
  { value: 'PENDINGAPPROVAL', label: 'Pending Approval', color: 'yellow' },
  { value: 'AWAITINGFUNDS', label: 'Awaiting Funds', color: 'orange' },
  { value: 'FUNDED', label: 'Funded', color: 'blue' },
  { value: 'ACTIVE', label: 'Active', color: 'green' },
  { value: 'GOODSSHIPPED', label: 'Goods Shipped', color: 'indigo' },
  { value: 'GOODSRECEIVED', label: 'Goods Received', color: 'violet' },
  { value: 'COMPLETED', label: 'Completed', color: 'green' },
  { value: 'DISPUTED', label: 'Disputed', color: 'red' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
];

export function getStatusColor(status: string) {
  const statusObj = contractStatuses.find(s => s.value === status.toUpperCase());
  return statusObj?.color || 'gray';
}

export function getStatusText(status: string) {
  const statusObj = contractStatuses.find(s => s.value === status.toUpperCase());
  return statusObj?.label || status;
}