import { users, type User, type InsertUser, type Game } from "@shared/schema";
import { createHash } from "crypto";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, newBalance: number): Promise<User>;
  saveGame(game: Omit<Game, "id" | "createdAt">): Promise<Game>;
  getUserGames(userId: number): Promise<Game[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  currentId: number;
  currentGameId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.currentId = 1;
    this.currentGameId = 1;
    
    // Add test user
    this.users.set(1, {
      id: 1,
      username: "test",
      password: createHash("sha256").update("test").digest("hex"),
      balance: 1000
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, balance: 1000 };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(userId: number, newBalance: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, balance: newBalance };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async saveGame(game: Omit<Game, "id" | "createdAt">): Promise<Game> {
    const id = this.currentGameId++;
    const fullGame: Game = {
      ...game,
      id,
      createdAt: new Date()
    };
    this.games.set(id, fullGame);
    return fullGame;
  }

  async getUserGames(userId: number): Promise<Game[]> {
    return Array.from(this.games.values())
      .filter(game => game.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
