import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContractSchema, 
  insertDocumentSchema, 
  insertWalletSchema, 
  insertTransactionSchema, 
  insertInvoiceSchema, 
  insertTradeFinanceApplicationSchema,
  WALLET_TYPE,
  TRANSACTION_TYPE,
  INVOICE_STATUS,
  KYC_STATUS,
  TRADE_FINANCE_STATUS
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.get("/api/auth/session", async (req, res) => {
    try {
      // Check if user is logged in based on session
      if (req.session && req.session.userId) {
        const user = await storage.getUser(req.session.userId);
        if (user) {
          // Don't send the password back
          const { password, ...userData } = user;
          return res.json(userData);
        }
      }
      return res.status(200).json(null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get session" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      // Don't send the password back
      const { password: _, ...userData } = user;
      
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      // Create the user
      const newUser = await storage.createUser({
        username,
        password,
        walletAddress: null,
        profileImage: null,
        kycStatus: KYC_STATUS.PENDING,
        riskScore: 0,
        kycData: {}
      });
      
      // Create a main wallet for the user
      await storage.createWallet({
        userId: newUser.id,
        walletType: WALLET_TYPE.MAIN,
        balance: "1000", // Give some initial balance
        currency: "USD"
      });
      
      // Set user in session
      if (req.session) {
        req.session.userId = newUser.id;
      }
      
      // Don't send the password back
      const { password: _, ...userData } = newUser;
      
      res.status(201).json(userData);
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    try {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ message: "Logout failed" });
          }
          res.status(200).json({ message: "Logged out successfully" });
        });
      } else {
        res.status(200).json({ message: "No active session" });
      }
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const userData = req.body;
      const user = await storage.getUserByWalletAddress(userData.walletAddress);
      
      if (user) {
        return res.json(user);
      }
      
      const newUser = await storage.createUser({
        username: userData.username || `user_${Date.now()}`,
        password: userData.password || "ethereum_auth", // Not actually used for auth with web3
        walletAddress: userData.walletAddress,
        profileImage: userData.profileImage,
        kycStatus: KYC_STATUS.PENDING,
        riskScore: 0,
        kycData: {}
      });
      
      // Create a main wallet for the user
      await storage.createWallet({
        userId: newUser.id,
        walletType: WALLET_TYPE.MAIN,
        balance: "0",
        currency: "USD"
      });
      
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const address = req.params.address;
      const user = await storage.getUserByWalletAddress(address);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userData = req.body;
      const updatedUser = await storage.updateUser(id, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // KYC routes
  app.post("/api/users/:id/kyc", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const kycData = req.body;
      
      const updatedUser = await storage.updateUser(id, {
        kycData,
        kycStatus: KYC_STATUS.PENDING
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit KYC data" });
    }
  });
  
  app.patch("/api/users/:id/kyc/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, riskScore } = req.body;
      
      const updatedUser = await storage.updateUser(id, {
        kycStatus: status,
        riskScore: riskScore || 0
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update KYC status" });
    }
  });

  // Wallet routes
  app.get("/api/users/:userId/wallets", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const wallets = await storage.getWalletsByUserId(userId);
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });
  
  app.get("/api/wallets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const wallet = await storage.getWalletById(id);
      
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallet" });
    }
  });
  
  app.post("/api/wallets", async (req, res) => {
    try {
      const walletData = insertWalletSchema.parse(req.body);
      const newWallet = await storage.createWallet(walletData);
      res.status(201).json(newWallet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid wallet data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create wallet" });
    }
  });
  
  app.post("/api/wallets/:id/deposit", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { amount, currency = "USD" } = req.body;
      
      const wallet = await storage.getWalletById(id);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      // Create a transaction
      const transaction = await storage.createTransaction({
        toWalletId: id,
        amount,
        currency,
        txType: TRANSACTION_TYPE.DEPOSIT,
        status: "COMPLETED",
        description: "Deposit to wallet",
        metadata: {}
      });
      
      // Update wallet balance
      const updatedWallet = await storage.updateWalletBalance(id, amount, 'add');
      
      res.json({
        wallet: updatedWallet,
        transaction
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to deposit to wallet" });
    }
  });
  
  app.post("/api/wallets/:id/withdraw", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { amount, currency = "USD" } = req.body;
      
      const wallet = await storage.getWalletById(id);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      // Create a transaction
      const transaction = await storage.createTransaction({
        fromWalletId: id,
        amount,
        currency,
        txType: TRANSACTION_TYPE.WITHDRAWAL,
        status: "COMPLETED",
        description: "Withdrawal from wallet",
        metadata: {}
      });
      
      // Update wallet balance
      const updatedWallet = await storage.updateWalletBalance(id, amount, 'subtract');
      
      res.json({
        wallet: updatedWallet,
        transaction
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to withdraw from wallet" });
    }
  });
  
  app.post("/api/wallets/:fromId/transfer/:toId", async (req, res) => {
    try {
      const fromId = parseInt(req.params.fromId);
      const toId = parseInt(req.params.toId);
      const { amount, currency = "USD", description } = req.body;
      
      const fromWallet = await storage.getWalletById(fromId);
      if (!fromWallet) {
        return res.status(404).json({ message: "Source wallet not found" });
      }
      
      const toWallet = await storage.getWalletById(toId);
      if (!toWallet) {
        return res.status(404).json({ message: "Destination wallet not found" });
      }
      
      // Create a transaction
      const transaction = await storage.createTransaction({
        fromWalletId: fromId,
        toWalletId: toId,
        amount,
        currency,
        txType: TRANSACTION_TYPE.TRANSFER,
        status: "COMPLETED",
        description: description || "Transfer between wallets",
        metadata: {}
      });
      
      // Update wallet balances
      await storage.updateWalletBalance(fromId, amount, 'subtract');
      const toUpdatedWallet = await storage.updateWalletBalance(toId, amount, 'add');
      
      res.json({
        transaction,
        toWallet: toUpdatedWallet
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to transfer between wallets" });
    }
  });
  
  // Transaction routes
  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransactionById(id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });
  
  app.get("/api/wallets/:walletId/transactions", async (req, res) => {
    try {
      const walletId = parseInt(req.params.walletId);
      const transactions = await storage.getTransactionsByWalletId(walletId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  
  app.get("/api/users/:userId/transactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getTransactionsByUserId(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const newTransaction = await storage.createTransaction(transactionData);
      res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });
  
  app.patch("/api/transactions/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const updatedTransaction = await storage.updateTransactionStatus(id, status);
      
      if (!updatedTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to update transaction status" });
    }
  });
  
  // Invoice routes
  app.get("/api/invoices", async (req, res) => {
    try {
      const { userId, role } = req.query;
      
      if (userId) {
        const userIdNum = parseInt(userId as string);
        const roleStr = role ? role as 'buyer' | 'seller' : undefined;
        const invoices = await storage.getInvoicesByUserId(userIdNum, roleStr);
        return res.json(invoices);
      }
      
      // If no filters, return empty array (don't want to expose all invoices)
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  
  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const invoice = await storage.getInvoiceById(id);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });
  
  app.get("/api/contracts/:contractId/invoices", async (req, res) => {
    try {
      const contractId = parseInt(req.params.contractId);
      const invoices = await storage.getInvoicesByContractId(contractId);
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  
  app.post("/api/invoices", async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      const newInvoice = await storage.createInvoice(invoiceData);
      res.status(201).json(newInvoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });
  
  app.patch("/api/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const invoiceData = req.body;
      const updatedInvoice = await storage.updateInvoice(id, invoiceData);
      
      if (!updatedInvoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      res.json(updatedInvoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });
  
  app.post("/api/invoices/:id/pay", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { fromWalletId } = req.body;
      
      const invoice = await storage.getInvoiceById(id);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      if (invoice.status === INVOICE_STATUS.PAID) {
        return res.status(400).json({ message: "Invoice is already paid" });
      }
      
      // Get the seller's wallet
      const sellerWallets = await storage.getWalletsByUserId(invoice.sellerId);
      const sellerWallet = sellerWallets.find(w => w.walletType === WALLET_TYPE.MAIN);
      
      if (!sellerWallet) {
        return res.status(400).json({ message: "Seller has no wallet" });
      }
      
      // Create transaction
      const transaction = await storage.createTransaction({
        fromWalletId,
        toWalletId: sellerWallet.id,
        amount: invoice.amount.toString(),
        currency: invoice.currency,
        txType: TRANSACTION_TYPE.TRANSFER,
        status: "COMPLETED",
        description: `Payment for invoice #${invoice.invoiceNumber}`,
        metadata: { invoiceId: id }
      });
      
      // Update wallet balances
      await storage.updateWalletBalance(fromWalletId, invoice.amount.toString(), 'subtract');
      await storage.updateWalletBalance(sellerWallet.id, invoice.amount.toString(), 'add');
      
      // Update invoice status
      const updatedInvoice = await storage.updateInvoice(id, { status: INVOICE_STATUS.PAID });
      
      res.json({
        invoice: updatedInvoice,
        transaction
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to pay invoice" });
    }
  });
  
  // Trade Finance Application routes
  app.get("/api/trade-finance", async (req, res) => {
    try {
      const { userId, contractId } = req.query;
      
      if (userId) {
        const userIdNum = parseInt(userId as string);
        const applications = await storage.getTradeFinanceApplicationsByUserId(userIdNum);
        return res.json(applications);
      }
      
      if (contractId) {
        const contractIdNum = parseInt(contractId as string);
        const applications = await storage.getTradeFinanceApplicationsByContractId(contractIdNum);
        return res.json(applications);
      }
      
      // If no filters, return empty array
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trade finance applications" });
    }
  });
  
  app.get("/api/trade-finance/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getTradeFinanceApplicationById(id);
      
      if (!application) {
        return res.status(404).json({ message: "Trade finance application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trade finance application" });
    }
  });
  
  app.post("/api/trade-finance", async (req, res) => {
    try {
      const applicationData = insertTradeFinanceApplicationSchema.parse(req.body);
      const newApplication = await storage.createTradeFinanceApplication(applicationData);
      res.status(201).json(newApplication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create trade finance application" });
    }
  });
  
  app.patch("/api/trade-finance/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const applicationData = req.body;
      const updatedApplication = await storage.updateTradeFinanceApplication(id, applicationData);
      
      if (!updatedApplication) {
        return res.status(404).json({ message: "Trade finance application not found" });
      }
      
      res.json(updatedApplication);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trade finance application" });
    }
  });
  
  app.patch("/api/trade-finance/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const application = await storage.getTradeFinanceApplicationById(id);
      if (!application) {
        return res.status(404).json({ message: "Trade finance application not found" });
      }
      
      const updatedApplication = await storage.updateTradeFinanceApplication(id, { 
        status,
        approvalDate: status === TRADE_FINANCE_STATUS.APPROVED ? new Date() : undefined
      });
      
      res.json(updatedApplication);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trade finance application status" });
    }
  });

  // Contract routes
  app.get("/api/contracts", async (req, res) => {
    try {
      const contracts = await storage.getContracts();
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.get("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contract = await storage.getContractById(id);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  app.post("/api/contracts", async (req, res) => {
    try {
      const contractData = insertContractSchema.parse(req.body);
      const newContract = await storage.createContract(contractData);
      
      // Create an escrow wallet for the contract
      const escrowWallet = await storage.createWallet({
        userId: 0, // System wallet
        walletType: WALLET_TYPE.ESCROW,
        contractId: newContract.id,
        balance: "0",
        currency: (newContract.tradeTerms as any).currency || "USD"
      });
      
      // Update the contract with the escrow wallet ID
      const updatedContract = await storage.updateContract(newContract.id, {
        escrowWalletId: escrowWallet.id
      });
      
      res.status(201).json(updatedContract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contract data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contract" });
    }
  });

  app.patch("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contractData = req.body;
      const updatedContract = await storage.updateContract(id, contractData);
      
      if (!updatedContract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      res.json(updatedContract);
    } catch (error) {
      res.status(500).json({ message: "Failed to update contract" });
    }
  });
  
  app.post("/api/contracts/:id/fund", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { fromWalletId } = req.body;
      
      const contract = await storage.getContractById(id);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      if (!contract.escrowWalletId) {
        return res.status(400).json({ message: "Contract has no escrow wallet" });
      }
      
      const escrowWallet = await storage.getWalletById(contract.escrowWalletId);
      if (!escrowWallet) {
        return res.status(400).json({ message: "Escrow wallet not found" });
      }
      
      const tradeTerms = contract.tradeTerms as any;
      const amount = tradeTerms.amount.toString();
      const currency = tradeTerms.currency;
      
      // Create transaction
      const transaction = await storage.createTransaction({
        fromWalletId,
        toWalletId: contract.escrowWalletId,
        amount,
        currency,
        txType: TRANSACTION_TYPE.ESCROW_LOCK,
        status: "COMPLETED",
        contractId: id,
        description: `Funding escrow for contract ${contract.title}`,
        metadata: {}
      });
      
      // Update wallet balances
      await storage.updateWalletBalance(fromWalletId, amount, 'subtract');
      await storage.updateWalletBalance(contract.escrowWalletId, amount, 'add');
      
      // Update contract status and add milestone
      const milestones = contract.milestones ? { ...contract.milestones } : { created: contract.createdAt };
      milestones.funded = new Date();
      
      const updatedContract = await storage.updateContract(id, {
        status: 'FUNDED',
        milestones
      });
      
      res.json({
        contract: updatedContract,
        transaction
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to fund contract" });
    }
  });
  
  app.post("/api/contracts/:id/release", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { toWalletId, type } = req.body; // type can be 'seller' or 'buyer'
      
      const contract = await storage.getContractById(id);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      if (!contract.escrowWalletId) {
        return res.status(400).json({ message: "Contract has no escrow wallet" });
      }
      
      const escrowWallet = await storage.getWalletById(contract.escrowWalletId);
      if (!escrowWallet) {
        return res.status(400).json({ message: "Escrow wallet not found" });
      }
      
      if (parseFloat(escrowWallet.balance.toString()) <= 0) {
        return res.status(400).json({ message: "Escrow wallet has no funds" });
      }
      
      // Create transaction
      const transaction = await storage.createTransaction({
        fromWalletId: contract.escrowWalletId,
        toWalletId,
        amount: escrowWallet.balance.toString(),
        currency: escrowWallet.currency,
        txType: TRANSACTION_TYPE.ESCROW_RELEASE,
        status: "COMPLETED",
        contractId: id,
        description: `Release escrow funds for contract ${contract.title} to ${type}`,
        metadata: { releaseType: type }
      });
      
      // Update wallet balances
      await storage.updateWalletBalance(contract.escrowWalletId, escrowWallet.balance.toString(), 'subtract');
      await storage.updateWalletBalance(toWalletId, escrowWallet.balance.toString(), 'add');
      
      // Update contract status and add milestone
      const milestones = contract.milestones ? { ...contract.milestones } : { created: contract.createdAt };
      milestones.completed = new Date();
      
      const updatedContract = await storage.updateContract(id, {
        status: 'COMPLETED',
        milestones
      });
      
      res.json({
        contract: updatedContract,
        transaction
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to release escrow funds" });
    }
  });

  // Document routes
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocumentById(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  app.get("/api/contracts/:contractId/documents", async (req, res) => {
    try {
      const contractId = parseInt(req.params.contractId);
      const documents = await storage.getDocumentsByContractId(contractId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  
  app.get("/api/invoices/:invoiceId/documents", async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.invoiceId);
      const documents = await storage.getDocumentsByInvoiceId(invoiceId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  
  app.get("/api/users/:userId/documents", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const documents = await storage.getAccessibleDocuments(userId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const newDocument = await storage.createDocument(documentData);
      res.status(201).json(newDocument);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create document" });
    }
  });
  
  app.patch("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const documentData = req.body;
      const updatedDocument = await storage.updateDocument(id, documentData);
      
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ message: "Failed to update document" });
    }
  });
  
  app.post("/api/documents/:id/access", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { userIds } = req.body;
      
      const updatedDocument = await storage.grantDocumentAccess(id, userIds);
      
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ message: "Failed to grant document access" });
    }
  });
  
  app.delete("/api/documents/:id/access", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { userIds } = req.body;
      
      const updatedDocument = await storage.revokeDocumentAccess(id, userIds);
      
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ message: "Failed to revoke document access" });
    }
  });
  
  app.post("/api/documents/:id/verify", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { verified } = req.body;
      
      const updatedDocument = await storage.updateDocument(id, {
        isVerified: verified === true
      });
      
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDocument(id);
      
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
