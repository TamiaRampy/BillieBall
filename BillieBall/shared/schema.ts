import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const shows = pgTable("shows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  date: text("date").notNull(),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  showId: varchar("show_id").references(() => shows.id).notNull(),
  player1Id: varchar("player1_id").references(() => players.id).notNull(),
  player2Id: varchar("player2_id").references(() => players.id).notNull(),
  isCompleted: boolean("is_completed").default(false),
  winnerId: varchar("winner_id").references(() => players.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const predictions = pgTable("predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id").references(() => games.id).notNull(),
  playerId: varchar("player_id").references(() => players.id).notNull(),
  answers: jsonb("answers").notNull(), // Store all 7 answers as JSON
  score: integer("score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const correctAnswers = pgTable("correct_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  showId: varchar("show_id").references(() => shows.id).notNull(),
  answers: jsonb("answers"), // Store correct answers as JSON
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const showsRelations = relations(shows, ({ many }) => ({
  games: many(games),
  correctAnswers: many(correctAnswers),
}));

export const playersRelations = relations(players, ({ many }) => ({
  gamesAsPlayer1: many(games, { relationName: "player1" }),
  gamesAsPlayer2: many(games, { relationName: "player2" }),
  gamesWon: many(games, { relationName: "winner" }),
  predictions: many(predictions),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  show: one(shows, {
    fields: [games.showId],
    references: [shows.id],
  }),
  player1: one(players, {
    fields: [games.player1Id],
    references: [players.id],
    relationName: "player1",
  }),
  player2: one(players, {
    fields: [games.player2Id],
    references: [players.id],
    relationName: "player2",
  }),
  winner: one(players, {
    fields: [games.winnerId],
    references: [players.id],
    relationName: "winner",
  }),
  predictions: many(predictions),
}));

export const predictionsRelations = relations(predictions, ({ one }) => ({
  game: one(games, {
    fields: [predictions.gameId],
    references: [games.id],
  }),
  player: one(players, {
    fields: [predictions.playerId],
    references: [players.id],
  }),
}));

export const correctAnswersRelations = relations(correctAnswers, ({ one }) => ({
  show: one(shows, {
    fields: [correctAnswers.showId],
    references: [shows.id],
  }),
}));

// Schemas
export const insertShowSchema = createInsertSchema(shows).omit({
  id: true,
  createdAt: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
  isCompleted: true,
  winnerId: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
  score: true,
});

export const insertCorrectAnswerSchema = createInsertSchema(correctAnswers).omit({
  id: true,
  updatedAt: true,
});

// Types
export type Show = typeof shows.$inferSelect;
export type InsertShow = z.infer<typeof insertShowSchema>;
export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type CorrectAnswer = typeof correctAnswers.$inferSelect;
export type InsertCorrectAnswer = z.infer<typeof insertCorrectAnswerSchema>;

// Extended types with relations
export type GameWithDetails = Game & {
  show: Show;
  player1: Player;
  player2: Player;
  winner?: Player | null;
  predictions: (Prediction & { player: Player })[];
};

// Prediction answers type for frontend
export type PredictionAnswers = {
  cap: string;
  shirtName: string;
  shirtColor: string;
  songAfterSkinny: string;
  lamourFirstPart: string;
  surpriseGuest: string;
  changeSetlist: string;
};
