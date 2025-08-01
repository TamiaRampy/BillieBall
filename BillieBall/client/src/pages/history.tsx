import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Loader2 } from "lucide-react";
import type { GameWithDetails } from "@shared/schema";

export default function History() {
  const { data: completedGames, isLoading } = useQuery({
    queryKey: ["/api/games/completed"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-billie-pink" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-10 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 billie-gradient">
            Game History
          </h2>
          <p className="text-gray-300">Past shows and final scores</p>
        </div>

        {/* History Cards */}
        <div className="space-y-6">
          {(completedGames as GameWithDetails[])?.map((game: GameWithDetails) => {
            const player1Prediction = game.predictions.find(p => p.playerId === game.player1Id);
            const player2Prediction = game.predictions.find(p => p.playerId === game.player2Id);
            
            return (
              <Card key={game.id} className="glass-effect neon-border">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{game.show.venue}</h3>
                      <p className="text-gray-400">{game.show.city}, {game.show.country} - {game.show.date}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      {game.winner ? (
                        <Badge className="bg-yellow-400 text-black">
                          <Trophy className="mr-1" size={16} />
                          {game.winner.name} Won!
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-500 text-white">
                          Tie Game
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-billie-gray/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold">{game.player1.name}</h4>
                        <span className="text-2xl font-bold text-billie-pink">
                          {player1Prediction?.score || 0}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Final score:</span>
                          <span className="text-billie-green">{player1Prediction?.score || 0} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span>{game.winnerId === game.player1Id ? 'Winner' : 'Lost'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-billie-gray/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold">{game.player2.name}</h4>
                        <span className="text-2xl font-bold text-billie-green">
                          {player2Prediction?.score || 0}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Final score:</span>
                          <span className="text-billie-green">{player2Prediction?.score || 0} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span>{game.winnerId === game.player2Id ? 'Winner' : 'Lost'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {(!completedGames || (completedGames as GameWithDetails[]).length === 0) && (
          <Card className="glass-effect">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">No completed games yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Games will appear here once they are finished and scored.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
