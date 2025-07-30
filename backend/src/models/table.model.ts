import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  capacity: integer("capacity").notNull().default(4),
  floor: text("floor").default("Ground Floor"),
  section: text("section"),
  status: text("status").notNull().default("available"), // available, occupied, reserved, cleaning
  isActive: boolean("is_active").notNull().default(true),
  qrCodeUrl: text("qr_code_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Zod schemas
export const insertTableSchema = createInsertSchema(tables).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  capacity: z.number().min(1, "Capacity must be at least 1"),
  status: z.enum(["available", "occupied", "reserved", "cleaning"]),
});

export const selectTableSchema = createSelectSchema(tables);
export const updateTableSchema = insertTableSchema.partial();

// Types
export type Table = typeof tables.$inferSelect;
export type InsertTable = z.infer<typeof insertTableSchema>;
export type UpdateTable = z.infer<typeof updateTableSchema>;