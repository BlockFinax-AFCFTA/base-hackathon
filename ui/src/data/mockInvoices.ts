export const mockInvoices = [
  {
    id: "101",
    invoiceNumber: "INV-2025-101",
    status: 'paid',
    issueDate: new Date("2025-04-15"),
    dueDate: new Date("2025-05-15"),
    customer: {
      name: "Tokyo Electronics Ltd.",
      wallet: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199"
    },
    items: [
      {
        id: "item-101-1",
        description: "Smartphone Display Panels",
        quantity: 500,
        unitPrice: 85
      },
      {
        id: "item-101-2",
        description: "Smartphone Battery Units",
        quantity: 500,
        unitPrice: 15
      }
    ],
    total: 50000,
    currency: "USDC",
    contractId: "1",
    contractName: "Electronics Import from Japan",
    paymentLink: "#",
    notes: "Payment received on time via USDC transfer"
  },
  {
    id: "102",
    invoiceNumber: "INV-2025-102",
    status: 'sent',
    issueDate: new Date("2025-04-22"),
    dueDate: new Date("2025-05-22"),
    customer: {
      name: "Brazil Coffee Exports S.A.",
      wallet: "0x9246f6940e2eb28930efb4cef49b2d1f2c9c5678"
    },
    items: [
      {
        id: "item-102-1",
        description: "Premium Arabica Coffee Beans",
        quantity: 2000,
        unitPrice: 15
      },
      {
        id: "item-102-2",
        description: "Specialty Robusta Coffee Beans",
        quantity: 1000,
        unitPrice: 5
      }
    ],
    total: 35000,
    currency: "USDT",
    contractId: "2",
    contractName: "Coffee Beans Import from Brazil",
    paymentLink: "#",
    notes: "Payment due within 30 days of receipt"
  },
  {
    id: "103",
    invoiceNumber: "INV-2025-103",
    status: 'draft',
    issueDate: new Date("2025-04-25"),
    dueDate: new Date("2025-05-25"),
    customer: {
      name: "Mumbai Textiles Ltd.",
      wallet: "0x5826f6940e2eb28930efb4cef49b2d1f2c9c7890"
    },
    items: [
      {
        id: "item-103-1",
        description: "Premium Cotton Fabrics",
        quantity: 1000,
        unitPrice: 20
      },
      {
        id: "item-103-2",
        description: "Silk Fabrics",
        quantity: 500,
        unitPrice: 15
      }
    ],
    total: 27500,
    currency: "DAI",
    contractId: "3",
    contractName: "Textile Import from India",
    paymentLink: "",
    notes: "Draft invoice pending final order confirmation"
  },
  {
    id: "104",
    invoiceNumber: "INV-2025-104",
    status: 'overdue',
    issueDate: new Date("2025-03-15"),
    dueDate: new Date("2025-04-15"),
    customer: {
      name: "German Machinery GmbH",
      wallet: "0x4a26f6940e2eb28930efb4cef49b2d1f2c9c4567"
    },
    items: [
      {
        id: "item-104-1",
        description: "Industrial Equipment Parts",
        quantity: 100,
        unitPrice: 250
      },
      {
        id: "item-104-2",
        description: "Technical Documentation",
        quantity: 1,
        unitPrice: 2500
      }
    ],
    total: 27500,
    currency: "USDC",
    contractId: null,
    contractName: null,
    paymentLink: "#",
    notes: "Payment is now 15 days overdue. Please remit payment immediately."
  }
];