import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Edit, Loader2 } from "lucide-react";
import { PREDICTION_QUESTIONS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Show, PredictionAnswers } from "@shared/schema";

export default function Admin() {
  const [selectedShowId, setSelectedShowId] = useState("");
  const [answers, setAnswers] = useState<Partial<PredictionAnswers>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: shows } = useQuery({
    queryKey: ["/api/shows"],
  });

  const submitAnswersMutation = useMutation({
    mutationFn: async (data: { showId: string; answers: PredictionAnswers }) => {
      return await apiRequest("POST", "/api/admin/correct-answers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shows"] });
      toast({
        title: "Success!",
        description: "Correct answers have been updated and scores calculated.",
      });
    },
  });



  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitAnswers = async () => {
    if (!selectedShowId) {
      toast({
        title: "No show selected",
        description: "Please select a show first.",
        variant: "destructive",
      });
      return;
    }

    const isComplete = PREDICTION_QUESTIONS.every(q => 
      answers[q.id as keyof PredictionAnswers]
    );

    if (!isComplete) {
      toast({
        title: "Incomplete answers",
        description: "Please provide answers for all questions.",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitAnswersMutation.mutateAsync({
        showId: selectedShowId,
        answers: answers as PredictionAnswers,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update answers. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pt-20 pb-10 px-4 bg-billie-dark/50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-red-400">Admin Panel</h2>
          <p className="text-gray-300">Update correct answers and calculate scores during the show</p>
        </div>

        {/* Admin Controls */}
        <div className="space-y-6">
            {/* Show Selection */}
            <Card className="glass-effect">
              <CardContent className="p-6">
                <h4 className="text-lg font-bold mb-4">Select Show</h4>
                <Select value={selectedShowId} onValueChange={setSelectedShowId}>
                  <SelectTrigger className="bg-billie-gray border-billie-pink/30 text-white">
                    <SelectValue placeholder="Choose a show to update" />
                  </SelectTrigger>
                  <SelectContent className="bg-billie-dark border-billie-gray">
                    {(shows as Show[])?.map((show: Show) => (
                      <SelectItem key={show.id} value={show.id} className="text-white hover:bg-billie-gray">
                        {show.city} - {show.date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Answer Input */}
            <Card className="glass-effect">
              <CardContent className="p-6">
                <h4 className="text-lg font-bold mb-4 flex items-center">
                  <Edit className="text-billie-pink mr-2" />
                  Update Correct Answers
                </h4>
                <div className="grid gap-6">
                  {PREDICTION_QUESTIONS.map((question) => (
                    <div key={question.id}>
                      <Label className="block text-sm font-medium mb-2">
                        {question.text} ({question.points} pts)
                      </Label>
                      <Select
                        value={answers[question.id as keyof PredictionAnswers] || ""}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                      >
                        <SelectTrigger className="bg-billie-gray border-billie-pink/30 text-white">
                          <SelectValue placeholder="Select correct answer..." />
                        </SelectTrigger>
                        <SelectContent className="bg-billie-dark border-billie-gray">
                          {question.options.map((option) => (
                            <SelectItem key={option} value={option} className="text-white hover:bg-billie-gray">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleSubmitAnswers}
                  disabled={submitAnswersMutation.isPending}
                  className="mt-6 bg-billie-pink hover:bg-billie-pink/80 text-white font-bold"
                >
                  {submitAnswersMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Updating Scores...
                    </>
                  ) : (
                    "Update Scores"
                  )}
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
