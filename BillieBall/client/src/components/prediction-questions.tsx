import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Music, Tv, Star, Mic, Loader2 } from "lucide-react";
import { PREDICTION_QUESTIONS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PredictionAnswers } from "@/lib/types";

interface PredictionQuestionsProps {
  gameId: string;
  playerId: string;
  playerName: string;
  onPredictionsSubmitted: () => void;
}

export default function PredictionQuestions({
  gameId,
  playerId,
  playerName,
  onPredictionsSubmitted,
}: PredictionQuestionsProps) {
  const [answers, setAnswers] = useState<Partial<PredictionAnswers>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitPredictionsMutation = useMutation({
    mutationFn: async (data: { playerId: string; answers: PredictionAnswers }) => {
      return await apiRequest("POST", "/api/predictions", {
        gameId,
        playerId: data.playerId,
        answers: data.answers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games", gameId] });
    },
  });

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const isAllAnswered = () => {
    return PREDICTION_QUESTIONS.every(q => answers[q.id as keyof PredictionAnswers]);
  };

  const handleSubmit = async () => {
    if (!isAllAnswered()) {
      toast({
        title: "Incomplete predictions",
        description: "Please answer all questions before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitPredictionsMutation.mutateAsync({
        playerId,
        answers: answers as PredictionAnswers,
      });

      toast({
        title: "Predictions submitted!",
        description: `${playerName}'s predictions have been saved.`,
      });

      onPredictionsSubmitted();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit predictions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getColorForOption = (questionId: string, option: string) => {
    switch (questionId) {
      case "shirtColor":
        switch (option.toLowerCase()) {
          case "pink": return "bg-pink-500";
          case "red": return "bg-red-500";
          case "green": return "bg-green-500";
          case "black": return "bg-black border border-white";
          case "blue": return "bg-blue-500";
          case "gray": return "bg-gray-500";
          case "white": return "bg-white";
          case "stripes": return "bg-gradient-to-r from-billie-pink to-billie-green";
          default: return "bg-billie-gray";
        }
      default:
        return "";
    }
  };

  const getIconForOption = (questionId: string, option: string) => {
    if (questionId === "songAfterSkinny") {
      switch (option) {
        case "Male Fantasy": return <Music className="text-billie-pink mr-2" size={16} />;
        case "TV": return <Tv className="text-billie-pink mr-2" size={16} />;
        case "Halley's Comet": return <Star className="text-billie-pink mr-2" size={16} />;
        case "Cover Song": return <Mic className="text-billie-pink mr-2" size={16} />;
      }
    }
    if (questionId === "cap" || questionId === "shirtName" || questionId === "lamourFirstPart" || questionId === "surpriseGuest" || questionId === "changeSetlist") {
      return option === "Yes" ? 
        <Check className="text-billie-green mr-2" size={16} /> : 
        <X className="text-red-400 mr-2" size={16} />;
    }
    return null;
  };

  return (
    <section className="py-20 px-4 bg-billie-dark/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Make Your Predictions</h2>
          <p className="text-gray-300">Answer all 7 questions before the show starts!</p>
          <div className="mt-4 flex justify-center">
            <div className="text-center p-4 rounded-lg bg-billie-pink/20 border border-billie-pink">
              <p className="text-billie-pink font-bold">{playerName}</p>
              <p className="text-sm">Making Predictions</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {PREDICTION_QUESTIONS.map((question) => (
            <Card key={question.id} className="glass-effect neon-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{question.text}</h3>
                  <Badge 
                    className={`px-3 py-1 text-sm font-bold ${
                      question.points === 7 ? 'bg-yellow-500 text-black' :
                      question.points >= 5 ? 'bg-billie-pink' : 'bg-billie-green'
                    }`}
                  >
                    {question.points} pts
                  </Badge>
                </div>
                
                {question.id === "shirtColor" ? (
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {question.options.map((option) => (
                      <Button
                        key={option}
                        variant="ghost"
                        className={`p-3 h-12 rounded-lg transition-all hover:scale-110 ${
                          getColorForOption(question.id, option)
                        } ${
                          answers[question.id as keyof PredictionAnswers] === option 
                            ? 'ring-2 ring-white scale-110' 
                            : ''
                        }`}
                        onClick={() => handleAnswerSelect(question.id, option)}
                        title={option}
                      >
                        <span className="sr-only">{option}</span>
                      </Button>
                    ))}
                  </div>
                ) : question.options.length === 4 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {question.options.map((option) => (
                      <Button
                        key={option}
                        variant="ghost"
                        className={`p-4 bg-billie-gray hover:bg-billie-pink/20 border border-transparent hover:border-billie-pink rounded-lg transition-all text-left ${
                          answers[question.id as keyof PredictionAnswers] === option 
                            ? 'bg-billie-pink/30 border-billie-pink' 
                            : ''
                        }`}
                        onClick={() => handleAnswerSelect(question.id, option)}
                      >
                        {getIconForOption(question.id, option)}
                        {option}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {question.options.map((option) => (
                      <Button
                        key={option}
                        variant="ghost"
                        className={`p-4 bg-billie-gray hover:bg-billie-green/20 border border-transparent hover:border-billie-green rounded-lg transition-all ${
                          answers[question.id as keyof PredictionAnswers] === option 
                            ? 'bg-billie-green/30 border-billie-green' 
                            : ''
                        }`}
                        onClick={() => handleAnswerSelect(question.id, option)}
                      >
                        {getIconForOption(question.id, option)}
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={handleSubmit}
            disabled={!isAllAnswered() || submitPredictionsMutation.isPending}
            className="px-8 py-4 bg-gradient-to-r from-billie-pink to-billie-green text-white font-bold text-xl rounded-xl hover:from-billie-pink/80 hover:to-billie-green/80 transition-all transform hover:scale-105 animate-glow disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitPredictionsMutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Submitting...
              </>
            ) : (
              "Submit Predictions"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
