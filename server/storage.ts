import { 
  User, InsertUser, Contract, InsertContract, Document, InsertDocument,
  Wallet, InsertWallet, Transaction, InsertTransaction, 
  Invoice, InsertInvoice, TradeFinanceApplication, InsertTradeFinanceApplication
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contracts: Map<number, Contract>;
  private documents: Map<number, Document>;
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private invoices: Map<number, Invoice>;
  private tradeFinanceApplications: Map<number, TradeFinanceApplication>;
  
  private userId: number;
  private contractId: number;
  private documentId: number;
  private walletId: number;
  private transactionId: number;
  private invoiceId: number;
  private tradeFinanceApplicationId: number;
  
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.contracts = new Map();
    this.documents = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.invoices = new Map();
    this.tradeFinanceApplications = new Map();
    
    this.userId = 1;
    this.contractId = 1;
    this.documentId = 1;
    this.walletId = 1;
    this.transactionId = 1;
    this.invoiceId = 1;
    this.tradeFinanceApplicationId = 1;
    
    // Create memory store for sessions
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });
  }
  
  // Document Access methods
  getDocumentsByInvoiceId(invoiceId: number): Promise<Document[]> {
    return Promise.resolve(Array.from(this.documents.values()).filter(
      doc => doc.invoiceId === invoiceId
    ));
  }
  
  getAccessibleDocuments(userId: number): Promise<Document[]> {
    return Promise.resolve(Array.from(this.documents.values()).filter(doc => {
      if (!doc.access || (doc.access as any[]).length === 0) return true; // Public document
      return (doc.access as any[]).includes(userId);
    }));
  }
  
  updateDocument(id: number, documentData: Partial<Document>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return Promise.resolve(undefined);
    
    const updatedDocument = { ...document, ...documentData };
    this.documents.set(id, updatedDocument);
    return Promise.resolve(updatedDocument);
  }
  
  grantDocumentAccess(id: number, userIds: number[]): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return Promise.resolve(undefined);
    
    const currentAccess = document.access as number[] || [];
    const newAccess = [...new Set([...currentAccess, ...userIds])];
    
    return this.updateDocument(id, { access: newAccess });
  }
  
  revokeDocumentAccess(id: number, userIds: number[]): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return Promise.resolve(undefined);
    
    const currentAccess = document.access as number[] || [];
    const newAccess = currentAccess.filter(id => !userIds.includes(id));
    
    return this.updateDocument(id, { access: newAccess });
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
    const user: User = { ...insertUser, id };
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
      uploadedAt: now,
      isVerified: false
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
    return this.documents.delete(id);
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
}

export const storage = new MemStorage();
