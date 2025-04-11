import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContractSchema, insertDocumentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
      res.status(201).json(newContract);
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

  // Document routes
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
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

  // User routes
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
        profileImage: userData.profileImage
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

  const httpServer = createServer(app);
  
  return httpServer;
}
