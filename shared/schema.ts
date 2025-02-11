import { pgTable, text, serial, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  balance: text("balance").notNull().default("1000"),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  betAmount: text("bet_amount").notNull(),
  multiplier: text("multiplier").notNull(),
  clientSeed: text("client_seed").notNull(),
  serverSeed: text("server_seed").notNull(),
  serverSeedHash: text("server_seed_hash").notNull(),
  roll: text("roll").notNull(),
  won: boolean("won").notNull(),
  payout: text("payout").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const placeBetSchema = z.object({
  betAmount: z.number().positive(),
  targetValue: z.number().min(1).max(98),
  isOver: z.boolean(),
  clientSeed: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Game = typeof games.$inferSelect;
export type PlaceBet = z.infer<typeof placeBetSchema>;