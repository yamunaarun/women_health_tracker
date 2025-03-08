import { pgTable, text, serial, date, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  cycleLength: integer("cycle_length").default(28),
  periodLength: integer("period_length").default(5),
  lastPeriod: date("last_period"),
});

export const periodEntries = pgTable("period_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  flow: text("flow").notNull(),
  symptoms: jsonb("symptoms").$type<string[]>().default([]),
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  cycleLength: true,
  periodLength: true,
  lastPeriod: true,
});

export const insertPeriodEntrySchema = createInsertSchema(periodEntries).pick({
  userId: true,
  date: true,
  flow: true,
  symptoms: true,
  notes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PeriodEntry = typeof periodEntries.$inferSelect;
export type InsertPeriodEntry = z.infer<typeof insertPeriodEntrySchema>;
