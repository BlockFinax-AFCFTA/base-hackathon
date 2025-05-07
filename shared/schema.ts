import { pgTable, serial, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schema (for registration)
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  walletAddress: true,
  profileImage: true,
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Registration schema with password confirmation
export const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Wallet Table
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull(),
  walletType: text("wallet_type").notNull(), // MAIN, ESCROW
  balance: text("balance").notNull(),
  currency: text("currency").notNull(),
  contractId: serial("contract_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Transaction Table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  fromWalletId: serial("from_wallet_id"),
  toWalletId: serial("to_wallet_id"),
  amount: text("amount").notNull(),
  currency: text("currency").notNull(),
  txType: text("tx_type").notNull(), // DEPOSIT, WITHDRAWAL, TRANSFER, ESCROW_PAYMENT
  status: text("status").notNull(),
  description: text("description"),
  contractId: serial("contract_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Contract Table
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  contractAddress: text("contract_address"),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(), // DRAFT, ACTIVE, COMPLETED, CANCELLED
  createdBy: text("created_by").notNull(),
  parties: jsonb("parties"), // Array of {name, role, address}
  tradeTerms: jsonb("trade_terms"), // {value, currency, startDate, endDate, paymentTerms}
  milestones: jsonb("milestones"), // Array of {name, amount, status, dueDate}
  escrowWalletId: serial("escrow_wallet_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Document Table
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: text("file_size").notNull(),
  url: text("url").notNull(),
  uploadedBy: serial("uploaded_by").notNull(),
  isVerified: boolean("is_verified"),
  contractId: serial("contract_id"),
  invoiceId: serial("invoice_id"),
  accessList: jsonb("access_list"), // Array of user IDs who can access this doc
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isVerified: true,
  accessList: true
});

// Invoice Table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").unique().notNull(),
  sellerId: serial("seller_id").notNull(),
  buyerId: serial("buyer_id").notNull(),
  contractId: serial("contract_id"),
  amount: text("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // DRAFT, SENT, PAID, OVERDUE, CANCELLED
  dueDate: timestamp("due_date"),
  items: jsonb("items"), // Array of line items
  paymentDetails: jsonb("payment_details"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true, 
  updatedAt: true
});

// Logistics Table
export const logistics = pgTable("logistics", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull(),
  contractId: serial("contract_id").notNull(),
  type: text("type").notNull(), // TRACKING, ORDER, SHIPMENT
  status: text("status").notNull(), // PENDING, IN_TRANSIT, DELIVERED, CANCELLED
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  shipmentDate: timestamp("shipment_date"),
  cargoType: text("cargo_type"),
  weight: text("weight"),
  specialRequirements: text("special_requirements"),
  providerId: serial("provider_id"),
  trackingNumber: text("tracking_number"),
  milestones: jsonb("milestones"), // Array of logistics milestones with timestamps
  estimatedDelivery: timestamp("estimated_delivery"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLogisticsSchema = createInsertSchema(logistics).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Logistics Provider Table
export const logisticsProviders = pgTable("logistics_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  rating: text("rating"),
  specialties: jsonb("specialties"), // Array of specialties
  description: text("description"),
  basePrice: text("base_price"),
  currency: text("currency"),
  estimatedDays: serial("estimated_days"),
  address: text("address"),
  website: text("website"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  yearEstablished: serial("year_established"),
  fleetSize: serial("fleet_size"),
  certificates: jsonb("certificates"), // Array of certifications
  sustainabilityRating: text("sustainability_rating"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLogisticsProviderSchema = createInsertSchema(logisticsProviders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Trade Finance Application Table
export const tradeFinanceApplications = pgTable("trade_finance_applications", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull(),
  contractId: serial("contract_id").notNull(),
  type: text("type").notNull(), // LETTER_OF_CREDIT, EXPORT_CREDIT, SUPPLY_CHAIN_FINANCE
  amount: text("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // PENDING, APPROVED, REJECTED, COMPLETED
  applicationData: jsonb("application_data"), // Additional application details
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTradeFinanceApplicationSchema = createInsertSchema(tradeFinanceApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Type exports for frontend usage
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Contract = typeof contracts.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Logistics = typeof logistics.$inferSelect;
export type InsertLogistics = z.infer<typeof insertLogisticsSchema>;
export type LogisticsProvider = typeof logisticsProviders.$inferSelect;
export type InsertLogisticsProvider = z.infer<typeof insertLogisticsProviderSchema>;
export type TradeFinanceApplication = typeof tradeFinanceApplications.$inferSelect;
export type InsertTradeFinanceApplication = z.infer<typeof insertTradeFinanceApplicationSchema>;