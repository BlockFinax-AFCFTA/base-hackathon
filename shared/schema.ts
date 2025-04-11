import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").unique(),
  profileImage: text("profile_image"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
  profileImage: true,
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
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
  uploadedBy: text("uploaded_by").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  tags: jsonb("tags").default([]),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

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
