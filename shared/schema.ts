import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").unique(),
  profileImage: text("profile_image"),
  kycStatus: text("kyc_status").default("PENDING"), // PENDING, VERIFIED, REJECTED
  riskScore: integer("risk_score").default(0),
  kycData: jsonb("kyc_data"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
  profileImage: true,
  kycStatus: true,
  riskScore: true,
  kycData: true,
});

// Wallet schema
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  walletType: text("wallet_type").notNull(), // MAIN, ESCROW
  contractId: integer("contract_id"),
  balance: decimal("balance", { precision: 18, scale: 8 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  fromWalletId: integer("from_wallet_id"),
  toWalletId: integer("to_wallet_id"),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  currency: text("currency").notNull(),
  txType: text("tx_type").notNull(), // DEPOSIT, WITHDRAWAL, TRANSFER, ESCROW_LOCK, ESCROW_RELEASE
  status: text("status").notNull().default("PENDING"), // PENDING, COMPLETED, FAILED
  contractId: integer("contract_id"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  metadata: jsonb("metadata"),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

// Invoice schema
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  contractId: integer("contract_id"),
  sellerId: integer("seller_id").notNull(),
  buyerId: integer("buyer_id").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  currency: text("currency").notNull(),
  issueDate: timestamp("issue_date").notNull().defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("UNPAID"), // UNPAID, PAID, OVERDUE, CANCELLED
  items: jsonb("items").notNull(),
  paymentTerms: text("payment_terms"),
  notes: text("notes"),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  issueDate: true,
});

// Trade Finance Application schema
export const tradeFinanceApplications = pgTable("trade_finance_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  contractId: integer("contract_id"),
  applicationType: text("application_type").notNull(), // LETTER_OF_CREDIT, BANK_GUARANTEE, FACTORING
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull().default("PENDING"), // PENDING, APPROVED, REJECTED, PROCESSING
  applicationDate: timestamp("application_date").notNull().defaultNow(),
  approvalDate: timestamp("approval_date"),
  expiryDate: timestamp("expiry_date"),
  terms: jsonb("terms"),
  supportingDocuments: jsonb("supporting_documents"),
});

export const insertTradeFinanceApplicationSchema = createInsertSchema(tradeFinanceApplications).omit({
  id: true,
  applicationDate: true,
  approvalDate: true,
});

// Contract schemas
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  contractAddress: text("contract_address"),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("DRAFT"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  parties: jsonb("parties").notNull(),
  tradeTerms: jsonb("trade_terms").notNull(),
  milestones: jsonb("milestones"),
  escrowWalletId: integer("escrow_wallet_id"),
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  escrowWalletId: true,
});

// Document schemas
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  hash: text("hash").notNull(),
  url: text("url").notNull(),
  contractId: integer("contract_id"),
  invoiceId: integer("invoice_id"),
  uploadedBy: text("uploaded_by").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  tags: jsonb("tags").default([]),
  access: jsonb("access").default([]), // Array of user IDs who can access
  isVerified: boolean("is_verified").default(false),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
  isVerified: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type TradeFinanceApplication = typeof tradeFinanceApplications.$inferSelect;
export type InsertTradeFinanceApplication = z.infer<typeof insertTradeFinanceApplicationSchema>;

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

// Enum-like values for contracts
export const CONTRACT_STATUS = {
  DRAFT: "DRAFT",
  AWAITING_FUNDS: "AWAITING_FUNDS",
  FUNDED: "FUNDED",
  GOODS_SHIPPED: "GOODS_SHIPPED",
  GOODS_RECEIVED: "GOODS_RECEIVED",
  COMPLETED: "COMPLETED",
  DISPUTED: "DISPUTED",
  CANCELLED: "CANCELLED"
} as const;

export const PARTY_ROLE = {
  IMPORTER: "IMPORTER",
  EXPORTER: "EXPORTER",
  MEDIATOR: "MEDIATOR"
} as const;

export const WALLET_TYPE = {
  MAIN: "MAIN",
  ESCROW: "ESCROW"
} as const;

export const TRANSACTION_TYPE = {
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
  TRANSFER: "TRANSFER",
  ESCROW_LOCK: "ESCROW_LOCK",
  ESCROW_RELEASE: "ESCROW_RELEASE"
} as const;

export const TRANSACTION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED" 
} as const;

export const INVOICE_STATUS = {
  UNPAID: "UNPAID",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  CANCELLED: "CANCELLED"
} as const;

export const KYC_STATUS = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED"
} as const;

export const TRADE_FINANCE_TYPE = {
  LETTER_OF_CREDIT: "LETTER_OF_CREDIT",
  BANK_GUARANTEE: "BANK_GUARANTEE",
  FACTORING: "FACTORING"
} as const;

export const TRADE_FINANCE_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PROCESSING: "PROCESSING"
} as const;

// Logistics schema
export type Logistics = typeof logistics.$inferSelect;
export type InsertLogistics = z.infer<typeof insertLogisticsSchema>;

export const logistics = pgTable("logistics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  contractId: integer("contract_id"),
  type: text("type").notNull(), // BOOKING, TRACKING
  status: text("status").notNull().default("PENDING"), // PENDING, CONFIRMED, IN_TRANSIT, DELIVERED, CANCELLED
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  shipmentDate: timestamp("shipment_date").notNull(),
  cargoType: text("cargo_type").notNull(),
  weight: decimal("weight", { precision: 10, scale: 2 }).notNull(),
  specialRequirements: text("special_requirements"),
  providerId: integer("provider_id"),
  trackingNumber: text("tracking_number"),
  milestones: jsonb("milestones"),
  estimatedDelivery: timestamp("estimated_delivery"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLogisticsSchema = createInsertSchema(logistics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type LogisticsProvider = typeof logisticsProviders.$inferSelect;
export type InsertLogisticsProvider = z.infer<typeof insertLogisticsProviderSchema>;

export const logisticsProviders = pgTable("logistics_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull(),
  specialties: jsonb("specialties").notNull(),
  description: text("description").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  estimatedDays: integer("estimated_days").notNull(),
  // Additional profile fields
  address: text("address"),
  website: text("website"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  yearEstablished: integer("year_established"),
  fleetSize: integer("fleet_size"),
  certificates: jsonb("certificates"),
  sustainabilityRating: decimal("sustainability_rating", { precision: 3, scale: 1 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLogisticsProviderSchema = createInsertSchema(logisticsProviders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const LOGISTICS_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  IN_TRANSIT: "IN_TRANSIT",
  CUSTOMS: "CUSTOMS",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
} as const;

export const LOGISTICS_TYPE = {
  BOOKING: "BOOKING",
  TRACKING: "TRACKING"
} as const;
