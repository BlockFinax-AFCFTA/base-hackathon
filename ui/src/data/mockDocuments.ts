export const mockDocuments = [
  {
    id: 1,
    name: "Commercial Invoice - Electronics",
    fileType: "pdf",
    fileSize: 1250000,
    url: "#",
    uploadedBy: 1,
    isVerified: true,
    createdAt: new Date("2025-04-15"),
    contractId: 1,
    invoiceId: 101,
    referenceNumber: "INV-2025-101",
    status: "approved",
    tags: ["invoice", "verified", "electronics"]
  },
  {
    id: 2,
    name: "Bill of Lading - Container MAEU1234567",
    fileType: "pdf",
    fileSize: 980000,
    url: "#",
    uploadedBy: 2,
    isVerified: true,
    createdAt: new Date("2025-04-16"),
    contractId: 1,
    invoiceId: null,
    referenceNumber: "BOL-MAEU-1234567",
    status: "approved",
    tags: ["transport", "verified", "shipping"]
  },
  {
    id: 3,
    name: "Letter of Credit - Bank of America",
    fileType: "pdf",
    fileSize: 1450000,
    url: "#",
    uploadedBy: 1,
    isVerified: true,
    createdAt: new Date("2025-04-14"),
    contractId: 1,
    invoiceId: null,
    referenceNumber: "LC-BOA-2025-045",
    status: "approved",
    tags: ["financial", "verified", "credit"]
  },
  {
    id: 4,
    name: "Certificate of Origin - Japan",
    fileType: "pdf",
    fileSize: 750000,
    url: "#",
    uploadedBy: 2,
    isVerified: true,
    createdAt: new Date("2025-04-17"),
    contractId: 1,
    invoiceId: null,
    referenceNumber: "COO-JP-2025-387",
    status: "approved",
    tags: ["regulatory", "verified", "origin"]
  },
  {
    id: 5,
    name: "Commercial Invoice - Coffee Beans",
    fileType: "pdf",
    fileSize: 1150000,
    url: "#",
    uploadedBy: 3,
    isVerified: true,
    createdAt: new Date("2025-04-22"),
    contractId: 2,
    invoiceId: 102,
    referenceNumber: "INV-2025-102",
    status: "approved",
    tags: ["invoice", "verified", "coffee"]
  },
  {
    id: 6,
    name: "Phytosanitary Certificate - Brazil Coffee",
    fileType: "pdf",
    fileSize: 850000,
    url: "#",
    uploadedBy: 3,
    isVerified: true,
    createdAt: new Date("2025-04-22"),
    contractId: 2,
    invoiceId: null,
    referenceNumber: "PHYTO-BR-2025-114",
    status: "approved",
    tags: ["regulatory", "verified", "agricultural"]
  },
  {
    id: 7,
    name: "Export Declaration - Brazil",
    fileType: "pdf",
    fileSize: 920000,
    url: "#",
    uploadedBy: 3,
    isVerified: false,
    createdAt: new Date("2025-04-23"),
    contractId: 2,
    invoiceId: null,
    referenceNumber: "EXP-BR-2025-056",
    status: "pending",
    tags: ["customs", "export", "declaration"]
  },
  {
    id: 8,
    name: "Draft Contract - Textile Import",
    fileType: "docx",
    fileSize: 450000,
    url: "#",
    uploadedBy: 1,
    isVerified: null,
    createdAt: new Date("2025-04-25"),
    contractId: 3,
    invoiceId: null,
    referenceNumber: "DRAFT-2025-003",
    status: "draft",
    tags: ["contract", "draft", "textile"]
  }
];

export function getDocumentIcon(fileType: string) {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return 'file-text';
    case 'docx':
    case 'doc':
      return 'file-text';
    case 'xlsx':
    case 'xls':
      return 'file-spreadsheet';
    case 'pptx':
    case 'ppt':
      return 'file-presentation';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image';
    default:
      return 'file';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}