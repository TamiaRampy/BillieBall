import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, PlayCircle, Loader2 } from "lucide-react";
import type { Show } from "@shared/schema";

interface TourSelectionProps {
  onShowSelected: (show: Show) => void;
}

export default function TourSelection({ onShowSelected }: TourSelectionProps) {
  const { data: shows, isLoading } = useQuery({
    queryKey: ["/api/shows"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-billie-pink" size={48} />
      </div>
    );
  }

  const japanShows = (shows as Show[])?.filter((show: Show) => show.country === "Japan") || [];
  const usaShows = (shows as Show[])?.filter((show: Show) => show.country === "USA") || [];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 billie-gradient">
            Choose Your Show
          </h2>
          <p className="text-xl text-gray-300">HIT ME HARD AND SOFT World Tour</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Japan Shows */}
          <Card className="glass-effect neon-border">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Flag className="text-billie-pink text-2xl mr-3" />
                <h3 className="text-2xl font-bold">Japan</h3>
              </div>
              <div className="space-y-3">
                {japanShows.map((show: Show) => (
                  <Button
                    key={show.id}
                    variant="ghost"
                    className="w-full p-4 bg-billie-gray hover:bg-billie-gray/70 border-none rounded-lg transition-colors text-left h-auto"
                    onClick={() => onShowSelected(show)}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <p className="font-semibold text-white">{show.venue}</p>
                        <p className="text-gray-400">{show.date}</p>
                      </div>
                      <PlayCircle className="text-billie-green" />
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* North America Shows */}
          <Card className="glass-effect neon-border">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Flag className="text-billie-green text-2xl mr-3" />
                <h3 className="text-2xl font-bold">North America</h3>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {usaShows.map((show: Show) => (
                  <Button
                    key={show.id}
                    variant="ghost"
                    className="w-full p-3 bg-billie-gray hover:bg-billie-gray/70 border-none rounded-lg transition-colors text-left h-auto text-sm"
                    onClick={() => onShowSelected(show)}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <p className="font-semibold text-white">{show.city}</p>
                        <p className="text-gray-400">{show.date}</p>
                      </div>
                      <PlayCircle className="text-billie-pink" />
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
