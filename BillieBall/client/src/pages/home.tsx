import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PlayerSetup from "@/components/player-setup";
import TourSelection from "@/components/tour-selection";
import PredictionQuestions from "@/components/prediction-questions";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GameState } from "@/lib/types";
import type { Show, Player, Game } from "@shared/schema";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'setup',
    players: { player1: { name: '' }, player2: { name: '' } },
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPlayerMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/players", { name });
      return await response.json() as Player;
    },
  });

  const createGameMutation = useMutation({
    mutationFn: async (data: { showId: string; player1Id: string; player2Id: string }) => {
      const response = await apiRequest("POST", "/api/games", data);
      return await response.json() as Game;
    },
  });

  const handlePlayerReady = async (playerName: string) => {
    try {
      const player = await createPlayerMutation.mutateAsync(playerName);

      setGameState(prev => ({
        ...prev,
        phase: 'tour-selection',
        players: {
          player1: { id: player.id, name: player.name },
          player2: { name: '' }, // Not needed for single player
        },
      }));

      toast({
        title: "Welcome to Billieball!",
        description: "Now choose your show to start predicting.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register player. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShowSelected = async (show: Show) => {
    if (!gameState.players.player1.id) return;

    try {
      // For single player, create a dummy second player or use the same player twice
      const dummyPlayer = await createPlayerMutation.mutateAsync("System");
      
      const game = await createGameMutation.mutateAsync({
        showId: show.id,
        player1Id: gameState.players.player1.id,
        player2Id: dummyPlayer.id,
      });

      setGameState(prev => ({
        ...prev,
        phase: 'predictions',
        selectedShow: show,
        gameId: game.id,
        players: {
          ...prev.players,
          player2: { id: dummyPlayer.id, name: "System" },
        },
      }));

      toast({
        title: "Show selected!",
        description: `You're now making predictions for ${show.city} on ${show.date}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePredictionsSubmitted = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'completed',
    }));

    toast({
      title: "Predictions complete!",
      description: "Both players have submitted their predictions. Good luck!",
    });
  };

  // Auto-redirect to leaderboard after predictions
  useEffect(() => {
    if (gameState.phase === 'completed') {
      const timer = setTimeout(() => {
        window.location.href = '/leaderboard';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState.phase]);

  return (
    <div className="min-h-screen">
      {gameState.phase === 'setup' && (
        <PlayerSetup onPlayerReady={handlePlayerReady} />
      )}

      {gameState.phase === 'tour-selection' && (
        <TourSelection onShowSelected={handleShowSelected} />
      )}

      {gameState.phase === 'predictions' && gameState.gameId && gameState.players.player1.id && (
        <PredictionQuestions
          gameId={gameState.gameId}
          playerId={gameState.players.player1.id}
          playerName={gameState.players.player1.name}
          onPredictionsSubmitted={handlePredictionsSubmitted}
        />
      )}

      {gameState.phase === 'completed' && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold billie-gradient mb-4">
              Predictions Complete!
            </h2>
            <p className="text-gray-300 mb-4">
              Both players have submitted their predictions.
            </p>
            <p className="text-sm text-gray-400">
              Redirecting to leaderboard...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
