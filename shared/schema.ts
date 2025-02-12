import { z } from "zod";

// Type definitions for User
export interface User {
  id: number;
  username: string;
  password: string;
  balance: string;
}

// Type definitions for Game
export interface Game {
  id: number;
  userId: number;
  betAmount: string;
  multiplier: string;
  clientSeed: string;
  serverSeed: string;
  serverSeedHash: string;
  roll: string;
  won: boolean;
  payout: string;
  createdAt: Date;
}

// Validation schemas
export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const placeBetSchema = z.object({
  betAmount: z.number().positive("Bet amount must be positive"),
  targetValue: z.number().min(1, "Target value must be between 1 and 98").max(98, "Target value must be between 1 and 98"),
  isOver: z.boolean(),
  clientSeed: z.string().min(1, "Client seed is required"),
});

// Auto-betting strategy types and schemas
export const autoBetStrategySchema = z.enum([
  "martingale",
  "reverseMartingale",
  "dAlembert",
  "fibonacci",
  "oscarsGrind",
  "custom"
]);

export const autoBetSettingsSchema = z.object({
  enabled: z.boolean(),
  strategy: autoBetStrategySchema,
  baseBet: z.number().positive("Base bet must be positive"),
  maxBet: z.number().positive("Max bet must be positive"),
  stopOnProfit: z.number().optional(),
  stopOnLoss: z.number().optional(),
  numberOfBets: z.number().int().positive().optional(),
  multiplier: z.number().positive().optional(),
  delayBetweenBets: z.number().int().min(500, "Delay must be between 500ms and 10000ms").max(10000, "Delay must be between 500ms and 10000ms"),
  strategyState: z.object({
    sequence: z.array(z.number()).optional(),
    stage: z.number().optional(),
    winStreak: z.number().optional(),
    lossStreak: z.number().optional()
  }).optional()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type PlaceBet = z.infer<typeof placeBetSchema>;
export type AutoBetStrategy = z.infer<typeof autoBetStrategySchema>;
export type AutoBetSettings = z.infer<typeof autoBetSettingsSchema>;
