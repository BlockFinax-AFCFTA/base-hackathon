import { 
  User, InsertUser, Contract, InsertContract, Document, InsertDocument,
  Wallet, InsertWallet, Transaction, InsertTransaction, 
  Invoice, InsertInvoice, TradeFinanceApplication, InsertTradeFinanceApplication,
  Logistics, InsertLogistics, LogisticsProvider, InsertLogisticsProvider
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
// Use unknown type for Json data
type Json = unknown;

export interface IStorage {
  // Session storage
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(address: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Wallet methods
  getWalletById(id: number): Promise<Wallet | undefined>;
  getWalletsByUserId(userId: number): Promise<Wallet[]>;
  getWalletByContractId(contractId: number): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(id: number, amount: string, operation: 'add' | 'subtract'): Promise<Wallet | undefined>;
  
  // Transaction methods
  getTransactionById(id: number): Promise<Transaction | undefined>;
  getTransactionsByWalletId(walletId: number): Promise<Transaction[]>;
  getTransactionsByContractId(contractId: number): Promise<Transaction[]>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;
  
  // Invoice methods
  getInvoiceById(id: number): Promise<Invoice | undefined>;
  getInvoicesByUserId(userId: number, role?: 'buyer' | 'seller'): Promise<Invoice[]>;
  getInvoicesByContractId(contractId: number): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoiceData: Partial<Invoice>): Promise<Invoice | undefined>;
  
  // Trade Finance methods
  getTradeFinanceApplicationById(id: number): Promise<TradeFinanceApplication | undefined>;
  getTradeFinanceApplicationsByUserId(userId: number): Promise<TradeFinanceApplication[]>;
  getTradeFinanceApplicationsByContractId(contractId: number): Promise<TradeFinanceApplication[]>;
  createTradeFinanceApplication(application: InsertTradeFinanceApplication): Promise<TradeFinanceApplication>;
  updateTradeFinanceApplication(id: number, applicationData: Partial<TradeFinanceApplication>): Promise<TradeFinanceApplication | undefined>;
  
  // Contract methods
  getContracts(): Promise<Contract[]>;
  getContractById(id: number): Promise<Contract | undefined>;
  getContractsByUser(userId: number): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<Contract>): Promise<Contract | undefined>;
  
  // Document methods
  getDocuments(): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | undefined>;
  getDocumentsByContractId(contractId: number): Promise<Document[]>;
  getDocumentsByInvoiceId(invoiceId: number): Promise<Document[]>;
  getAccessibleDocuments(userId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, documentData: Partial<Document>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  grantDocumentAccess(id: number, userIds: number[]): Promise<Document | undefined>;
  revokeDocumentAccess(id: number, userIds: number[]): Promise<Document | undefined>;
  
  // Logistics methods
  getLogistics(): Promise<Logistics[]>;
  getLogisticsById(id: number): Promise<Logistics | undefined>;
  getLogisticsByUserId(userId: number): Promise<Logistics[]>;
  getLogisticsByContractId(contractId: number): Promise<Logistics[]>;
  createLogistics(logistics: InsertLogistics): Promise<Logistics>;
  updateLogistics(id: number, logisticsData: Partial<Logistics>): Promise<Logistics | undefined>;
  
  // Logistics Providers methods
  getLogisticsProviders(): Promise<LogisticsProvider[]>;
  getLogisticsProviderById(id: number): Promise<LogisticsProvider | undefined>;
  createLogisticsProvider(provider: InsertLogisticsProvider): Promise<LogisticsProvider>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contracts: Map<number, Contract>;
  private documents: Map<number, Document>;
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private invoices: Map<number, Invoice>;
  private tradeFinanceApplications: Map<number, TradeFinanceApplication>;
  private logistics: Map<number, Logistics>;
  private logisticsProviders: Map<number, LogisticsProvider>;
  
  private userId: number;
  private contractId: number;
  private documentId: number;
  private walletId: number;
  private transactionId: number;
  private invoiceId: number;
  private tradeFinanceApplicationId: number;
  private logisticsId: number;
  private logisticsProviderId: number;
  
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.contracts = new Map();
    this.documents = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.invoices = new Map();
    this.tradeFinanceApplications = new Map();
    this.logistics = new Map();
    this.logisticsProviders = new Map();
    
    this.userId = 1;
    this.contractId = 1;
    this.documentId = 1;
    this.walletId = 1;
    this.transactionId = 1;
    this.invoiceId = 1;
    this.tradeFinanceApplicationId = 1;
    this.logisticsId = 1;
    this.logisticsProviderId = 1;
    
    // Create memory store for sessions
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByWalletAddress(address: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === address,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id,
      walletAddress: insertUser.walletAddress || null,
      profileImage: insertUser.profileImage || null,
      kycStatus: insertUser.kycStatus || null,
      riskScore: insertUser.riskScore || null,
      kycData: insertUser.kycData || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Wallet methods
  async getWalletById(id: number): Promise<Wallet | undefined> {
    return this.wallets.get(id);
  }
  
  async getWalletsByUserId(userId: number): Promise<Wallet[]> {
    return Array.from(this.wallets.values()).filter(
      wallet => wallet.userId === userId
    );
  }
  
  async getWalletByContractId(contractId: number): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      wallet => wallet.contractId === contractId && wallet.walletType === "ESCROW"
    );
  }
  
  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = this.walletId++;
    const now = new Date();
    const wallet: Wallet = {
      ...insertWallet,
      id,
      contractId: insertWallet.contractId || null,
      balance: insertWallet.balance || "0",
      currency: insertWallet.currency || "USD",
      createdAt: now,
      updatedAt: now
    };
    this.wallets.set(id, wallet);
    return wallet;
  }
  
  async updateWalletBalance(id: number, amount: string, operation: 'add' | 'subtract'): Promise<Wallet | undefined> {
    const wallet = await this.getWalletById(id);
    if (!wallet) return undefined;
    
    const currentBalance = parseFloat(wallet.balance.toString());
    const amountValue = parseFloat(amount);
    
    let newBalance: number;
    if (operation === 'add') {
      newBalance = currentBalance + amountValue;
    } else {
      newBalance = currentBalance - amountValue;
      if (newBalance < 0) throw new Error('Insufficient funds');
    }
    
    const updatedWallet: Wallet = {
      ...wallet,
      balance: newBalance.toString(),
      updatedAt: new Date()
    };
    
    this.wallets.set(id, updatedWallet);
    return updatedWallet;
  }
  
  // Transaction methods
  async getTransactionById(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async getTransactionsByWalletId(walletId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      tx => tx.fromWalletId === walletId || tx.toWalletId === walletId
    );
  }
  
  async getTransactionsByContractId(contractId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      tx => tx.contractId === contractId
    );
  }
  
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    const userWallets = await this.getWalletsByUserId(userId);
    const walletIds = userWallets.map(w => w.id);
    
    return Array.from(this.transactions.values()).filter(
      tx => walletIds.includes(tx.fromWalletId || -1) || walletIds.includes(tx.toWalletId || -1)
    );
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const now = new Date();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      status: insertTransaction.status || "PENDING",
      contractId: insertTransaction.contractId || null,
      fromWalletId: insertTransaction.fromWalletId || null,
      toWalletId: insertTransaction.toWalletId || null,
      description: insertTransaction.description || null,
      metadata: insertTransaction.metadata || null,
      createdAt: now
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
  
  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const transaction = await this.getTransactionById(id);
    if (!transaction) return undefined;
    
    const updatedTransaction: Transaction = {
      ...transaction,
      status
    };
    
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  // Invoice methods
  async getInvoiceById(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }
  
  async getInvoicesByUserId(userId: number, role?: 'buyer' | 'seller'): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(invoice => {
      if (role === 'buyer') return invoice.buyerId === userId;
      if (role === 'seller') return invoice.sellerId === userId;
      return invoice.buyerId === userId || invoice.sellerId === userId;
    });
  }
  
  async getInvoicesByContractId(contractId: number): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(
      invoice => invoice.contractId === contractId
    );
  }
  
  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = this.invoiceId++;
    const now = new Date();
    const invoice: Invoice = {
      ...insertInvoice,
      id,
      status: insertInvoice.status || "DRAFT",
      contractId: insertInvoice.contractId || null,
      paymentTerms: insertInvoice.paymentTerms || null,
      notes: insertInvoice.notes || null,
      issueDate: now
    };
    this.invoices.set(id, invoice);
    return invoice;
  }
  
  async updateInvoice(id: number, invoiceData: Partial<Invoice>): Promise<Invoice | undefined> {
    const invoice = await this.getInvoiceById(id);
    if (!invoice) return undefined;
    
    const updatedInvoice = { ...invoice, ...invoiceData };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }
  
  // Trade Finance methods
  async getTradeFinanceApplicationById(id: number): Promise<TradeFinanceApplication | undefined> {
    return this.tradeFinanceApplications.get(id);
  }
  
  async getTradeFinanceApplicationsByUserId(userId: number): Promise<TradeFinanceApplication[]> {
    return Array.from(this.tradeFinanceApplications.values()).filter(
      app => app.userId === userId
    );
  }
  
  async getTradeFinanceApplicationsByContractId(contractId: number): Promise<TradeFinanceApplication[]> {
    return Array.from(this.tradeFinanceApplications.values()).filter(
      app => app.contractId === contractId
    );
  }
  
  async createTradeFinanceApplication(insertApplication: InsertTradeFinanceApplication): Promise<TradeFinanceApplication> {
    const id = this.tradeFinanceApplicationId++;
    const now = new Date();
    const application: TradeFinanceApplication = {
      ...insertApplication,
      id,
      status: insertApplication.status || "PENDING",
      contractId: insertApplication.contractId || null,
      approvalDate: null,
      expiryDate: insertApplication.expiryDate || null,
      terms: insertApplication.terms || null,
      supportingDocuments: insertApplication.supportingDocuments || null,
      applicationDate: now
    };
    this.tradeFinanceApplications.set(id, application);
    return application;
  }
  
  async updateTradeFinanceApplication(id: number, applicationData: Partial<TradeFinanceApplication>): Promise<TradeFinanceApplication | undefined> {
    const application = await this.getTradeFinanceApplicationById(id);
    if (!application) return undefined;
    
    const updatedApplication = { ...application, ...applicationData };
    this.tradeFinanceApplications.set(id, updatedApplication);
    return updatedApplication;
  }

  // Contract methods
  async getContracts(): Promise<Contract[]> {
    return Array.from(this.contracts.values());
  }

  async getContractById(id: number): Promise<Contract | undefined> {
    return this.contracts.get(id);
  }

  async getContractsByUser(userId: number): Promise<Contract[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    return Array.from(this.contracts.values()).filter(contract => {
      // Check if user is creator or a party to the contract
      if (contract.createdBy === user.walletAddress) return true;
      
      const parties = contract.parties as any[];
      return parties.some(party => party.address === user.walletAddress);
    });
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    const id = this.contractId++;
    const now = new Date();
    const contract: Contract = { 
      ...insertContract, 
      id,
      status: insertContract.status || "DRAFT",
      description: insertContract.description || null,
      contractAddress: insertContract.contractAddress || null,
      escrowWalletId: insertContract.escrowWalletId || null, 
      createdAt: now, 
      updatedAt: now 
    };
    this.contracts.set(id, contract);
    return contract;
  }

  async updateContract(id: number, updateData: Partial<Contract>): Promise<Contract | undefined> {
    const contract = this.contracts.get(id);
    if (!contract) return undefined;

    const updatedContract = { 
      ...contract, 
      ...updateData,
      updatedAt: new Date()
    };
    
    this.contracts.set(id, updatedContract);
    return updatedContract;
  }

  // Document methods
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocumentById(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByContractId(contractId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      doc => doc.contractId === contractId
    );
  }
  
  async getDocumentsByInvoiceId(invoiceId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      doc => doc.invoiceId === invoiceId
    );
  }
  
  async getAccessibleDocuments(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => {
      if (!doc.access || (doc.access as any[]).length === 0) return true; // Public document
      return (doc.access as any[]).includes(userId);
    });
  }
  
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const now = new Date();
    const document: Document = { 
      ...insertDocument,
      id,
      contractId: insertDocument.contractId || null,
      invoiceId: insertDocument.invoiceId || null,
      tags: insertDocument.tags || [],
      access: insertDocument.access || [],
      isVerified: false,
      uploadedAt: now
    };
    this.documents.set(id, document);
    return document;
  }
  
  async updateDocument(id: number, documentData: Partial<Document>): Promise<Document | undefined> {
    const document = await this.getDocumentById(id);
    if (!document) return undefined;
    
    const updatedDocument = { ...document, ...documentData };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    const exists = this.documents.has(id);
    if (exists) {
      this.documents.delete(id);
      return true;
    }
    return false;
  }
  
  async grantDocumentAccess(id: number, userIds: number[]): Promise<Document | undefined> {
    const document = await this.getDocumentById(id);
    if (!document) return undefined;
    
    const currentAccess = document.access as number[] || [];
    const newAccess = [...new Set([...currentAccess, ...userIds])];
    
    return this.updateDocument(id, { access: newAccess });
  }
  
  async revokeDocumentAccess(id: number, userIds: number[]): Promise<Document | undefined> {
    const document = await this.getDocumentById(id);
    if (!document) return undefined;
    
    const currentAccess = document.access as number[] || [];
    const newAccess = currentAccess.filter(id => !userIds.includes(id));
    
    return this.updateDocument(id, { access: newAccess });
  }

  // Logistics methods
  async getLogistics(): Promise<Logistics[]> {
    return Array.from(this.logistics.values());
  }

  async getLogisticsById(id: number): Promise<Logistics | undefined> {
    return this.logistics.get(id);
  }

  async getLogisticsByUserId(userId: number): Promise<Logistics[]> {
    return Array.from(this.logistics.values()).filter(
      logistics => logistics.userId === userId
    );
  }

  async getLogisticsByContractId(contractId: number): Promise<Logistics[]> {
    return Array.from(this.logistics.values()).filter(
      logistics => logistics.contractId === contractId
    );
  }

  async createLogistics(insertLogistics: InsertLogistics): Promise<Logistics> {
    const id = this.logisticsId++;
    const now = new Date();
    const logistics: Logistics = {
      ...insertLogistics,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.logistics.set(id, logistics);
    return logistics;
  }

  async updateLogistics(id: number, logisticsData: Partial<Logistics>): Promise<Logistics | undefined> {
    const logistics = await this.getLogisticsById(id);
    if (!logistics) return undefined;
    
    const updatedLogistics = { 
      ...logistics, 
      ...logisticsData,
      updatedAt: new Date()
    };
    
    this.logistics.set(id, updatedLogistics);
    return updatedLogistics;
  }

  // Logistics Providers methods
  async getLogisticsProviders(): Promise<LogisticsProvider[]> {
    return Array.from(this.logisticsProviders.values());
  }

  async getLogisticsProviderById(id: number): Promise<LogisticsProvider | undefined> {
    return this.logisticsProviders.get(id);
  }

  async createLogisticsProvider(insertProvider: InsertLogisticsProvider): Promise<LogisticsProvider> {
    const id = this.logisticsProviderId++;
    const now = new Date();
    const provider: LogisticsProvider = {
      ...insertProvider,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.logisticsProviders.set(id, provider);
    return provider;
  }
}

export const storage = new MemStorage();