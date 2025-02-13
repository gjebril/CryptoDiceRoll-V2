import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { placeBetSchema } from "@shared/schema";
import { generateServerSeed, calculateServerSeedHash, calculateResult } from "./utils/crypto";
import { Decimal } from "decimal.js";
import { calculateMultiplier, calculatePayout } from "@shared/calculations";

export function registerRoutes(app: Express): Server {
  app.post("/api/bet", async (req, res) => {
    try {
      const { betAmount, targetValue, isOver, clientSeed } = placeBetSchema.parse(req.body);

      // For demo, use fixed user ID 1
      const userId = 1;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userBalance = new Decimal(user.balance);
      if (userBalance.lessThan(betAmount)) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const serverSeed = generateServerSeed();
      const serverSeedHash = calculateServerSeedHash(serverSeed);

      const { roll, won } = calculateResult(clientSeed, serverSeed, targetValue, isOver);

      const multiplier = new Decimal(calculateMultiplier(targetValue, isOver));
      const payout = won ? new Decimal(calculatePayout(betAmount, multiplier)) : new Decimal(0);

      const newBalance = userBalance.minus(betAmount).plus(payout);
      await storage.updateUserBalance(userId, newBalance.toString());

      const game = await storage.saveGame({
        userId,
        betAmount: betAmount.toString(),
        multiplier: multiplier.toString(),
        clientSeed,
        serverSeed,
        serverSeedHash,
        roll: roll.toString(),
        won,
        payout: payout.toString()
      });

      res.json({
        game,
        newBalance: newBalance.toString(),
        serverSeed: won ? serverSeed : undefined, // Only reveal server seed if player won
        serverSeedHash
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Invalid bet parameters" });
    }
  });

  app.get("/api/games/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const games = await storage.getUserGames(userId);
    res.json(games);
  });

  const httpServer = createServer(app);
  return httpServer;
}