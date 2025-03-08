import { User, InsertUser, PeriodEntry, InsertPeriodEntry } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;

  getPeriodEntries(userId: number): Promise<PeriodEntry[]>;
  createPeriodEntry(entry: InsertPeriodEntry): Promise<PeriodEntry>;
  getPeriodEntry(id: number): Promise<PeriodEntry | undefined>;
  updatePeriodEntry(id: number, data: Partial<PeriodEntry>): Promise<PeriodEntry>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private periodEntries: Map<number, PeriodEntry>;
  private userId: number;
  private entryId: number;

  constructor() {
    this.users = new Map();
    this.periodEntries = new Map();
    this.userId = 1;
    this.entryId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      cycleLength: insertUser.cycleLength ?? 28,
      periodLength: insertUser.periodLength ?? 5,
      lastPeriod: insertUser.lastPeriod ?? null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");

    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async getPeriodEntries(userId: number): Promise<PeriodEntry[]> {
    return Array.from(this.periodEntries.values()).filter(
      entry => entry.userId === userId
    );
  }

  async createPeriodEntry(entry: InsertPeriodEntry): Promise<PeriodEntry> {
    const id = this.entryId++;
    const newEntry: PeriodEntry = {
      id,
      userId: entry.userId,
      date: entry.date,
      flow: entry.flow,
      symptoms: entry.symptoms ?? [],
      notes: entry.notes ?? null
    };
    this.periodEntries.set(id, newEntry);
    return newEntry;
  }

  async getPeriodEntry(id: number): Promise<PeriodEntry | undefined> {
    return this.periodEntries.get(id);
  }

  async updatePeriodEntry(id: number, data: Partial<PeriodEntry>): Promise<PeriodEntry> {
    const entry = await this.getPeriodEntry(id);
    if (!entry) throw new Error("Entry not found");

    const updated = { ...entry, ...data };
    this.periodEntries.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();