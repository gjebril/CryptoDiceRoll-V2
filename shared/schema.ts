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

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const placeBetSchema = z.object({
  betAmount: z.number().positive(),
  targetValue: z.number().min(1).max(98),
  isOver: z.boolean(),
  clientSeed: z.string(),
});

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
  baseBet: z.number().positive(),
  maxBet: z.number().positive(),
  stopOnProfit: z.number().optional(),
  stopOnLoss: z.number().optional(),
  numberOfBets: z.number().int().positive().optional(),
  multiplier: z.number().positive().optional(),
  delayBetweenBets: z.number().int().min(500).max(10000),
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