import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertShowSchema, insertPlayerSchema, insertGameSchema, insertPredictionSchema, insertCorrectAnswerSchema } from "@shared/schema";
import { z } from "zod";

const QUESTION_POINTS = {
  cap: 2,
  shirtName: 3,
  shirtColor: 7,
  songAfterSkinny: 5,
  lamourFirstPart: 3,
  surpriseGuest: 2,
  changeSetlist: 2,
};

function calculateScore(answers: Record<string, string>, correctAnswers: Record<string, string>): number {
  let score = 0;
  
  Object.entries(answers).forEach(([question, answer]) => {
    if (correctAnswers[question] === answer) {
      score += QUESTION_POINTS[question as keyof typeof QUESTION_POINTS] || 0;
    }
  });
  
  return score;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize shows if needed
  app.post("/api/init-shows", async (_req, res) => {
    try {
      const existingShows = await storage.getShows();
      if (existingShows.length === 0) {
        // Japan shows
        await storage.createShow({
          venue: "Saitama Super Arena",
          city: "Saitama",
          country: "Japan",
          date: "August 16, 2025"
        });
        
        await storage.createShow({
          venue: "Saitama Super Arena",
          city: "Saitama", 
          country: "Japan",
          date: "August 17, 2025"
        });

        // North America shows
        const northAmericaShows = [
          { city: "Miami", date: "October 15, 2025" },
          { city: "Orlando", date: "October 18, 2025" },
          { city: "Raleigh", date: "October 22, 2025" },
          { city: "Charlotte", date: "October 25, 2025" },
          { city: "Philadelphia", date: "October 28, 2025" },
          { city: "Elmont", date: "November 1, 2025" },
          { city: "New Orleans", date: "November 5, 2025" },
          { city: "Tulsa", date: "November 8, 2025" },
          { city: "Austin", date: "November 12, 2025" },
          { city: "Phoenix", date: "November 15, 2025" },
          { city: "San Francisco", date: "November 18, 2025" },
          { city: "Los Angeles", date: "November 22, 2025" },
        ];

        for (const show of northAmericaShows) {
          await storage.createShow({
            venue: "Arena",
            city: show.city,
            country: "USA",
            date: show.date
          });
        }
      }
      res.json({ message: "Shows initialized" });
    } catch (error) {
      res.status(500).json({ message: "Failed to initialize shows" });
    }
  });

  // Get all shows
  app.get("/api/shows", async (_req, res) => {
    try {
      const shows = await storage.getShows();
      res.json(shows);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shows" });
    }
  });

  // Create or get player
  app.post("/api/players", async (req, res) => {
    try {
      const data = insertPlayerSchema.parse(req.body);
      
      // Check if player already exists
      let player = await storage.getPlayerByName(data.name);
      if (!player) {
        player = await storage.createPlayer(data);
      }
      
      res.json(player);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid player data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create player" });
      }
    }
  });

  // Create game
  app.post("/api/games", async (req, res) => {
    try {
      const data = insertGameSchema.parse(req.body);
      const game = await storage.createGame(data);
      res.json(game);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid game data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create game" });
      }
    }
  });

  // Get game with details
  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGame(req.params.id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  // Submit predictions
  app.post("/api/predictions", async (req, res) => {
    try {
      const data = insertPredictionSchema.parse(req.body);
      const prediction = await storage.createPrediction(data);
      res.json(prediction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid prediction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to submit predictions" });
      }
    }
  });

  // Get active games for a show (leaderboard)
  app.get("/api/shows/:id/games", async (req, res) => {
    try {
      const games = await storage.getGamesByShow(req.params.id);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  // Admin: Set correct answers
  app.post("/api/admin/correct-answers", async (req, res) => {
    try {
      const data = insertCorrectAnswerSchema.parse(req.body);
      const correctAnswer = await storage.setCorrectAnswers(data);
      
      // Calculate scores for all predictions in games for this show
      const games = await storage.getGamesByShow(data.showId);
      
      for (const game of games) {
        for (const prediction of game.predictions) {
          const score = calculateScore(prediction.answers as Record<string, string>, data.answers as Record<string, string>);
          await storage.updatePredictionScore(prediction.id, score);
        }
        
        // Determine winner
        const player1Prediction = game.predictions.find(p => p.playerId === game.player1Id);
        const player2Prediction = game.predictions.find(p => p.playerId === game.player2Id);
        
        if (player1Prediction && player2Prediction) {
          const player1Score = player1Prediction.score || 0;
          const player2Score = player2Prediction.score || 0;
          const winnerId = player1Score > player2Score ? 
            game.player1Id : 
            player2Score > player1Score ? 
            game.player2Id : 
            undefined; // Tie
          
          await storage.updateGameCompletion(game.id, winnerId);
        }
      }
      
      res.json(correctAnswer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid answer data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to set correct answers" });
      }
    }
  });

  // Get completed games (history)
  app.get("/api/games/completed", async (_req, res) => {
    try {
      const games = await storage.getCompletedGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch completed games" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
