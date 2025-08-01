import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export default function Game() {
  const [, setLocation] = useLocation();

  // Redirect to home page where the main game flow is handled
  useEffect(() => {
    setLocation("/");
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="glass-effect neon-border animate-float max-w-md w-full">
        <CardContent className="pt-6 p-8 text-center">
          <div className="mb-8">
            <PlayCircle className="mx-auto text-6xl text-billie-pink mb-4" size={64} />
            <h2 className="text-3xl font-bold mb-2 billie-gradient">Starting Game...</h2>
            <p className="text-gray-300">Redirecting to the main game interface</p>
          </div>
          
          <Button
            onClick={() => setLocation("/")}
            className="w-full py-4 bg-gradient-to-r from-billie-pink to-billie-green hover:from-billie-pink/80 hover:to-billie-green/80 text-white font-bold transform hover:scale-105 transition-all"
          >
            Go to Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
