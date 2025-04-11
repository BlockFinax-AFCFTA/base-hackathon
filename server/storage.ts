import { 
  User, InsertUser, Contract, InsertContract, Document, InsertDocument 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(address: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contracts: Map<number, Contract>;
  private documents: Map<number, Document>;
  private userId: number;
  private contractId: number;
  private documentId: number;

  constructor() {
    this.users = new Map();
    this.contracts = new Map();
    this.documents = new Map();
    this.userId = 1;
    this.contractId = 1;
    this.documentId = 1;
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

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const now = new Date();
    const document: Document = { 
      ...insertDocument, 
      id, 
      uploadedAt: now
    };
    this.documents.set(id, document);
    return document;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }
}

export const storage = new MemStorage();
