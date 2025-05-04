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
  insertLogisticsSchema,
  insertLogisticsProviderSchema,
  WALLET_TYPE,
  TRANSACTION_TYPE,
  INVOICE_STATUS,
  KYC_STATUS,
  TRADE_FINANCE_STATUS,
  LOGISTICS_STATUS,
  LOGISTICS_TYPE
} from "@shared/schema";
import { z } from "zod";
import { analyzeExportRequirements } from "./routes/regulatoryAI";

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
  
  // Multi-currency wallet endpoint
  app.get("/api/users/:userId/multicurrency-wallet", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Return multi-currency wallet with African currencies
      res.json({
        id: 999,
        userId,
        walletType: "MULTI_CURRENCY",
        walletProvider: "papss",
        primaryCurrency: "USD",
        balances: [
          { amount: "9850000.00", currency: "NGN", currencyType: "fiat" }, // Nigerian Naira
          { amount: "14750000.00", currency: "XOF", currencyType: "fiat" }, // West African CFA Franc
          { amount: "456250.00", currency: "GHS", currencyType: "fiat" }, // Ghanaian Cedi
          { amount: "3275000.00", currency: "KES", currencyType: "fiat" }, // Kenyan Shilling
          { amount: "430000.00", currency: "ZAR", currencyType: "fiat" } // South African Rand
        ],
        contractId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch multi-currency wallet" });
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
      
      // Check if multi-currency flag is present
      if (req.query.multiCurrency === 'true') {
        // Return specialized multi-currency transactions
        return res.json([
          {
            id: 1001,
            fromWalletId: null,
            toWalletId: 999,
            fromAddress: null,
            toAddress: null,
            amount: "2500000.00",
            currency: "NGN",
            currencyType: "fiat",
            txType: "DEPOSIT",
            status: "COMPLETED",
            description: "Initial NGN deposit",
            contractId: null,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            provider: "papss",
            papssReference: "PAPSS-24-58290",
            papssStatus: "SETTLED",
            sourceBank: "First Bank Nigeria",
            exchangeRate: "1520.40",
            metadata: null
          },
          {
            id: 1002,
            fromWalletId: 999,
            toWalletId: null,
            fromAddress: null, 
            toAddress: null,
            amount: "100000.00",
            currency: "GHS",
            currencyType: "fiat",
            txType: "CROSS_BORDER_PAYMENT",
            status: "COMPLETED",
            description: "Payment to Ghana supplier",
            contractId: null,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            provider: "papss",
            papssReference: "PAPSS-24-58392",
            papssStatus: "SETTLED",
            sourceBank: "First Bank Nigeria",
            destinationBank: "GCB Bank Ghana",
            exchangeRate: "0.078",
            metadata: {
              equivalentValue: "7800.00",
              equivalentCurrency: "NGN"
            }
          },
          {
            id: 1003,
            fromWalletId: null,
            toWalletId: 999,
            fromAddress: null,
            toAddress: null,
            amount: "1000000.00",
            currency: "XOF",
            currencyType: "fiat",
            txType: "DEPOSIT",
            status: "COMPLETED",
            description: "XOF deposit",
            contractId: null,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            provider: "papss",
            papssReference: "PAPSS-24-58434",
            papssStatus: "SETTLED",
            sourceBank: "Société Générale Sénégal",
            exchangeRate: "655.957",
            metadata: {
              equivalentValue: "1542290.00",
              equivalentCurrency: "NGN"
            }
          },
          {
            id: 1004,
            fromWalletId: 999,
            toWalletId: null,
            fromAddress: null,
            toAddress: null,
            amount: "1000000.00",
            currency: "NGN",
            currencyType: "fiat",
            txType: "WITHDRAWAL",
            status: "COMPLETED",
            description: "NGN withdrawal",
            contractId: null,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            provider: "papss",
            papssReference: "PAPSS-24-58501",
            papssStatus: "SETTLED",
            destinationBank: "First Bank Nigeria",
            exchangeRate: "1520.40",
            metadata: {
              equivalentValue: "229842.28",
              equivalentCurrency: "XOF"
            }
          }
        ]);
      }
      
      // Default behavior
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

  // Logistics routes
  app.get("/api/logistics", async (req, res) => {
    try {
      const { userId, contractId } = req.query;
      
      if (userId) {
        const userIdNum = parseInt(userId as string);
        const logisticsData = await storage.getLogisticsByUserId(userIdNum);
        return res.json(logisticsData);
      }
      
      if (contractId) {
        const contractIdNum = parseInt(contractId as string);
        const logisticsData = await storage.getLogisticsByContractId(contractIdNum);
        return res.json(logisticsData);
      }
      
      const allLogistics = await storage.getLogistics();
      res.json(allLogistics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch logistics data" });
    }
  });
  
  app.get("/api/logistics/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const logistics = await storage.getLogisticsById(id);
      
      if (!logistics) {
        return res.status(404).json({ message: "Logistics entry not found" });
      }
      
      res.json(logistics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch logistics data" });
    }
  });
  
  app.post("/api/logistics", async (req, res) => {
    try {
      const logisticsData = insertLogisticsSchema.parse(req.body);
      
      // Ensure we have default status if not provided
      if (!logisticsData.status) {
        logisticsData.status = LOGISTICS_STATUS.PENDING;
      }
      
      const newLogistics = await storage.createLogistics(logisticsData);
      res.status(201).json(newLogistics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid logistics data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create logistics entry" });
    }
  });
  
  app.patch("/api/logistics/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const logisticsData = req.body;
      
      const updatedLogistics = await storage.updateLogistics(id, logisticsData);
      
      if (!updatedLogistics) {
        return res.status(404).json({ message: "Logistics entry not found" });
      }
      
      res.json(updatedLogistics);
    } catch (error) {
      res.status(500).json({ message: "Failed to update logistics data" });
    }
  });
  
  // Logistics Providers routes
  app.get("/api/logistics-providers", async (req, res) => {
    try {
      let providers = await storage.getLogisticsProviders();
      
      // If no providers exist, seed some sample providers
      if (providers.length === 0) {
        const sampleProviders = [
          {
            name: "GlobalFreight Express",
            logo: "https://via.placeholder.com/50?text=GF",
            rating: "4.8",
            specialties: ["General Cargo", "Express Shipping", "International"],
            description: "Leading global logistics provider with an extensive network covering 120+ countries",
            basePrice: "1450",
            currency: "USD",
            estimatedDays: 6,
            address: "88 Shipping Plaza, Rotterdam, Netherlands",
            website: "globalfreightexpress.com",
            contactEmail: "info@globalfreightexpress.com",
            contactPhone: "+31 10 555 7890",
            yearEstablished: 1998,
            fleetSize: 120,
            certificates: ["ISO 9001", "ISO 14001", "C-TPAT"],
            sustainabilityRating: "4.5"
          },
          {
            name: "Arctic Refrigerated Logistics",
            logo: "https://via.placeholder.com/50?text=AR",
            rating: "4.6",
            specialties: ["Temperature Controlled", "Perishables", "Pharmaceutical"],
            description: "Specialized in temperature-controlled shipping for sensitive cargo worldwide",
            basePrice: "1800",
            currency: "USD",
            estimatedDays: 7,
            address: "45 Cold Chain Blvd, Hamburg, Germany",
            website: "arcticlogistics.com",
            contactEmail: "service@arcticlogistics.com",
            contactPhone: "+49 40 555 1234",
            yearEstablished: 2005,
            fleetSize: 85,
            certificates: ["ISO 9001", "HACCP", "GDP", "CEIV Pharma"],
            sustainabilityRating: "4.2"
          },
          {
            name: "OceanRoute Shipping",
            logo: "https://via.placeholder.com/50?text=OR",
            rating: "4.7",
            specialties: ["Sea Freight", "Container Shipping", "Bulk Cargo"],
            description: "Specialized marine logistics company with a fleet of cargo vessels for reliable ocean transport",
            basePrice: "1250",
            currency: "USD",
            estimatedDays: 12,
            address: "Port Complex 22, Singapore",
            website: "oceanroute.com",
            contactEmail: "bookings@oceanroute.com",
            contactPhone: "+65 6123 4567",
            yearEstablished: 1986,
            fleetSize: 42,
            certificates: ["ISO 9001", "ISO 14001", "ISPS Code"],
            sustainabilityRating: "3.8"
          },
          {
            name: "SilkRoad Express",
            logo: "https://via.placeholder.com/50?text=SR",
            rating: "4.5",
            specialties: ["Rail Freight", "Asia-Europe Routes", "High Value"],
            description: "Specializing in rail transport along the historic Silk Road economic belt",
            basePrice: "1350",
            currency: "USD",
            estimatedDays: 10,
            address: "88 Railway Square, Xi'an, China",
            website: "silkroadexpress.com",
            contactEmail: "info@silkroadexpress.com",
            contactPhone: "+86 29 8888 7777",
            yearEstablished: 2013,
            fleetSize: 75,
            certificates: ["ISO 9001", "AEO"],
            sustainabilityRating: "4.0"
          },
          {
            name: "AeroFast Cargo",
            logo: "https://via.placeholder.com/50?text=AF",
            rating: "4.9",
            specialties: ["Air Freight", "Express Delivery", "Time-Critical"],
            description: "Premium air freight services with guaranteed delivery times",
            basePrice: "2250",
            currency: "USD",
            estimatedDays: 3,
            address: "Terminal 5, Schiphol Airport, Amsterdam",
            website: "aerofastcargo.com",
            contactEmail: "express@aerofastcargo.com",
            contactPhone: "+31 20 123 4567",
            yearEstablished: 2001,
            fleetSize: 35,
            certificates: ["ISO 9001", "IATA CEIV"],
            sustainabilityRating: "3.5"
          }
        ];
        
        // Add providers to database
        for (const provider of sampleProviders) {
          await storage.createLogisticsProvider(provider);
        }
        
        // Fetch again to get the created providers with IDs
        providers = await storage.getLogisticsProviders();
      }
      
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch logistics providers" });
    }
  });
  
  app.get("/api/logistics-providers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const provider = await storage.getLogisticsProviderById(id);
      
      if (!provider) {
        return res.status(404).json({ message: "Logistics provider not found" });
      }
      
      res.json(provider);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch logistics provider" });
    }
  });
  
  app.post("/api/logistics-providers", async (req, res) => {
    try {
      const providerData = insertLogisticsProviderSchema.parse(req.body);
      
      // Ensure we have default currency if not provided
      if (!providerData.currency) {
        providerData.currency = "USD";
      }
      
      const newProvider = await storage.createLogisticsProvider(providerData);
      res.status(201).json(newProvider);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid logistics provider data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create logistics provider" });
    }
  });

  // Register the regulatory AI endpoint
  app.post('/api/regulatory-ai/analyze', analyzeExportRequirements);

  const httpServer = createServer(app);
  
  return httpServer;
}
