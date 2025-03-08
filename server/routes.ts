import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPeriodEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(Number(req.params.id));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(Number(req.params.id), req.body);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Period entry routes
  app.post("/api/entries", async (req, res) => {
    try {
      const entryData = insertPeriodEntrySchema.parse(req.body);
      const entry = await storage.createPeriodEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: "Invalid entry data" });
    }
  });

  app.get("/api/users/:userId/entries", async (req, res) => {
    const entries = await storage.getPeriodEntries(Number(req.params.userId));
    res.json(entries);
  });

  app.patch("/api/entries/:id", async (req, res) => {
    try {
      const entry = await storage.updatePeriodEntry(Number(req.params.id), req.body);
      res.json(entry);
    } catch (error) {
      res.status(404).json({ error: "Entry not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
