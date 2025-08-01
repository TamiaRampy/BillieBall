import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlayerSetupProps {
  onPlayerReady: (playerName: string) => void;
}

export default function PlayerSetup({ onPlayerReady }: PlayerSetupProps) {
  const [playerName, setPlayerName] = useState("");
  const { toast } = useToast();

  const handleStartGame = () => {
    if (!playerName.trim()) {
      toast({
        title: "Missing player name",
        description: "Please enter your name to continue",
        variant: "destructive",
      });
      return;
    }

    onPlayerReady(playerName.trim());
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-billie-black/40 via-billie-black/60 to-billie-black/90"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top section with more space for background */}
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-6xl md:text-8xl font-bold billie-gradient mb-6 animate-glow">
              Billieball
            </h1>
            <p className="text-xl md:text-2xl text-white mb-4">
              Let's play the ultimate Billie Eilish concert prediction game!
            </p>
            <p className="text-gray-300 text-lg mb-8">
              Predict what happens during her "HIT ME HARD AND SOFT" World Tour
            </p>
          </div>
        </div>
        
        {/* Bottom section with player entry */}
        <div className="flex items-center justify-center pb-20">
          <div className="max-w-md w-full px-4">
            <Card className="glass-effect neon-border animate-float">
              <CardContent className="pt-6 p-8 text-center">
                <div className="mb-6">
                  <User className="mx-auto text-5xl text-billie-pink mb-4" size={48} />
                  <h2 className="text-2xl font-bold mb-2">Enter Your Name</h2>
                  <p className="text-gray-300">Join the prediction game!</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label className="block text-sm font-medium text-billie-pink mb-2">
                      Your Name
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter your nickname..."
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
                      className="bg-billie-gray border-billie-pink/30 focus:border-billie-pink text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  <Button
                    onClick={handleStartGame}
                    className="w-full py-4 bg-gradient-to-r from-billie-pink to-billie-green hover:from-billie-pink/80 hover:to-billie-green/80 text-white font-bold transform hover:scale-105 transition-all"
                  >
                    Start Playing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
