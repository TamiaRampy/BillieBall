import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, Loader2 } from "lucide-react";
import { QUESTION_POINTS } from "@/lib/constants";
import type { GameWithDetails, Show } from "@shared/schema";

export default function Leaderboard() {
  const [selectedShowId, setSelectedShowId] = useState<string>("");

  const { data: shows } = useQuery({
    queryKey: ["/api/shows"],
  });

  const { data: games, isLoading } = useQuery({
    queryKey: ["/api/shows", selectedShowId, "games"],
    enabled: !!selectedShowId,
  });

  // Auto-select first show
  useEffect(() => {
    if (shows && (shows as Show[]).length > 0 && !selectedShowId) {
      setSelectedShowId((shows as Show[])[0].id);
    }
  }, [shows, selectedShowId]);

  // Poll for updates every 5 seconds
  useQuery({
    queryKey: ["/api/shows", selectedShowId, "games"],
    enabled: !!selectedShowId,
    refetchInterval: 5000,
  });

  if (isLoading && selectedShowId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-billie-pink" size={48} />
      </div>
    );
  }

  const getLeaderboardData = () => {
    if (!games) return [];
    
    const leaderboard: Array<{
      playerId: string;
      name: string;
      totalScore: number;
      correctPredictions: number;
      gameCount: number;
    }> = [];

    (games as GameWithDetails[]).forEach((game: GameWithDetails) => {
      game.predictions.forEach((prediction) => {
        const score = prediction.score || 0;
        const existingPlayer = leaderboard.find(p => p.playerId === prediction.playerId);
        if (existingPlayer) {
          existingPlayer.totalScore += score;
          existingPlayer.gameCount += 1;
          // Count correct predictions (assuming 7 total questions)
          existingPlayer.correctPredictions += Math.floor(score / 3); // Rough estimation
        } else {
          leaderboard.push({
            playerId: prediction.playerId,
            name: prediction.player.name,
            totalScore: score,
            correctPredictions: Math.floor(score / 3),
            gameCount: 1,
          });
        }
      });
    });

    return leaderboard.sort((a, b) => b.totalScore - a.totalScore);
  };

  const leaderboardData = getLeaderboardData();
  const topPlayer = leaderboardData[0];

  return (
    <div className="pt-20 pb-10 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 billie-gradient">
            Live Leaderboard
          </h2>
          <p className="text-gray-300">Real-time scores during the show</p>
          <div className="mt-4">
            <Badge className="bg-billie-green/20 text-billie-green border-billie-green">
              <div className="w-2 h-2 bg-billie-green rounded-full animate-pulse mr-2"></div>
              Live Updates
            </Badge>
          </div>
        </div>

        {/* Show Selection */}
        <div className="mb-8">
          <Select value={selectedShowId} onValueChange={setSelectedShowId}>
            <SelectTrigger className="w-full max-w-md mx-auto bg-billie-dark border-billie-gray text-white">
              <SelectValue placeholder="Select a show" />
            </SelectTrigger>
            <SelectContent className="bg-billie-dark border-billie-gray">
              {(shows as Show[])?.map((show: Show) => (
                <SelectItem key={show.id} value={show.id} className="text-white hover:bg-billie-gray">
                  {show.city} - {show.date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Leader */}
        {topPlayer && (
          <Card className="glass-effect neon-border mb-8 text-center animate-glow">
            <CardContent className="p-8">
              <div className="mb-4">
                <Crown className="mx-auto text-yellow-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">{topPlayer.name}</h3>
              <p className="text-4xl font-bold text-billie-pink">{topPlayer.totalScore}</p>
              <p className="text-gray-400 mt-2">Current Leader</p>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard */}
        <div className="space-y-4">
          {leaderboardData.map((player, index) => (
            <Card key={player.playerId} className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-400 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-billie-gray text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{player.name}</h4>
                      <p className="text-sm text-gray-400">
                        {player.gameCount} game{player.gameCount > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-billie-pink">{player.totalScore}</p>
                    <p className="text-sm text-gray-400">
                      ~{player.correctPredictions} correct
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {leaderboardData.length === 0 && (
          <Card className="glass-effect">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">No games found for this show yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Start a new game to see the leaderboard!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
