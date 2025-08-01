import { 
  shows, 
  players, 
  games, 
  predictions, 
  correctAnswers,
  type Show, 
  type InsertShow,
  type Player, 
  type InsertPlayer,
  type Game,
  type InsertGame,
  type Prediction,
  type InsertPrediction,
  type CorrectAnswer,
  type InsertCorrectAnswer,
  type GameWithDetails
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Shows
  getShows(): Promise<Show[]>;
  getShow(id: string): Promise<Show | undefined>;
  createShow(show: InsertShow): Promise<Show>;
  updateShowStatus(id: string, isActive: boolean): Promise<void>;

  // Players
  getPlayer(id: string): Promise<Player | undefined>;
  getPlayerByName(name: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;

  // Games
  getGame(id: string): Promise<GameWithDetails | undefined>;
  getGamesByShow(showId: string): Promise<GameWithDetails[]>;
  getCompletedGames(): Promise<GameWithDetails[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGameCompletion(id: string, winnerId?: string): Promise<void>;

  // Predictions
  getPrediction(gameId: string, playerId: string): Promise<Prediction | undefined>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  updatePredictionScore(id: string, score: number): Promise<void>;

  // Correct Answers
  getCorrectAnswers(showId: string): Promise<CorrectAnswer | undefined>;
  setCorrectAnswers(correctAnswer: InsertCorrectAnswer): Promise<CorrectAnswer>;
}

export class DatabaseStorage implements IStorage {
  async getShows(): Promise<Show[]> {
    return await db.select().from(shows).orderBy(shows.date);
  }

  async getShow(id: string): Promise<Show | undefined> {
    const [show] = await db.select().from(shows).where(eq(shows.id, id));
    return show || undefined;
  }

  async createShow(insertShow: InsertShow): Promise<Show> {
    const [show] = await db.insert(shows).values(insertShow).returning();
    return show;
  }

  async updateShowStatus(id: string, isActive: boolean): Promise<void> {
    await db.update(shows).set({ isActive }).where(eq(shows.id, id));
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player || undefined;
  }

  async getPlayerByName(name: string): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.name, name));
    return player || undefined;
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const [player] = await db.insert(players).values(insertPlayer).returning();
    return player;
  }

  async getGame(id: string): Promise<GameWithDetails | undefined> {
    const result = await db.query.games.findFirst({
      where: eq(games.id, id),
      with: {
        show: true,
        player1: true,
        player2: true,
        winner: true,
        predictions: {
          with: {
            player: true,
          },
        },
      },
    });
    return result || undefined;
  }

  async getGamesByShow(showId: string): Promise<GameWithDetails[]> {
    return await db.query.games.findMany({
      where: eq(games.showId, showId),
      with: {
        show: true,
        player1: true,
        player2: true,
        winner: true,
        predictions: {
          with: {
            player: true,
          },
        },
      },
      orderBy: [desc(games.createdAt)],
    });
  }

  async getCompletedGames(): Promise<GameWithDetails[]> {
    return await db.query.games.findMany({
      where: eq(games.isCompleted, true),
      with: {
        show: true,
        player1: true,
        player2: true,
        winner: true,
        predictions: {
          with: {
            player: true,
          },
        },
      },
      orderBy: [desc(games.createdAt)],
    });
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db.insert(games).values(insertGame).returning();
    return game;
  }

  async updateGameCompletion(id: string, winnerId?: string): Promise<void> {
    await db.update(games).set({ 
      isCompleted: true,
      winnerId 
    }).where(eq(games.id, id));
  }

  async getPrediction(gameId: string, playerId: string): Promise<Prediction | undefined> {
    const [prediction] = await db.select().from(predictions)
      .where(and(eq(predictions.gameId, gameId), eq(predictions.playerId, playerId)));
    return prediction || undefined;
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const [prediction] = await db.insert(predictions).values(insertPrediction).returning();
    return prediction;
  }

  async updatePredictionScore(id: string, score: number): Promise<void> {
    await db.update(predictions).set({ score }).where(eq(predictions.id, id));
  }

  async getCorrectAnswers(showId: string): Promise<CorrectAnswer | undefined> {
    const [answer] = await db.select().from(correctAnswers).where(eq(correctAnswers.showId, showId));
    return answer || undefined;
  }

  async setCorrectAnswers(insertCorrectAnswer: InsertCorrectAnswer): Promise<CorrectAnswer> {
    // Check if correct answers already exist for this show
    const existing = await this.getCorrectAnswers(insertCorrectAnswer.showId);
    
    if (existing) {
      // Update existing
      const [updated] = await db.update(correctAnswers)
        .set({ 
          answers: insertCorrectAnswer.answers,
          updatedAt: new Date()
        })
        .where(eq(correctAnswers.showId, insertCorrectAnswer.showId))
        .returning();
      return updated;
    } else {
      // Create new
      const [created] = await db.insert(correctAnswers).values(insertCorrectAnswer).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
