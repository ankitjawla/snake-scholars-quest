import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PracticeProblem {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface PracticeProblemsProps {
  problems: PracticeProblem[];
  onComplete: (score: number) => void;
}

export const PracticeProblems = ({ problems, onComplete }: PracticeProblemsProps) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentProblem = problems[currentProblemIndex];
  const progress = ((currentProblemIndex + (showFeedback ? 1 : 0)) / problems.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowFeedback(true);
    if (selectedAnswer === currentProblem.correctAnswer) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleNext = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      const score = (correctCount + (selectedAnswer === currentProblem.correctAnswer ? 1 : 0)) / problems.length * 100;
      onComplete(score);
    }
  };

  const isCorrect = selectedAnswer === currentProblem.correctAnswer;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Question {currentProblemIndex + 1} of {problems.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {correctCount} correct
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-6 animate-fade-in">
        <div className="mb-6">
          <div className="text-4xl mb-4 animate-bounce-soft">🤔</div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground leading-relaxed">
            {currentProblem.question}
          </h3>
        </div>

        <div className="space-y-3 mb-6">
          {currentProblem.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === currentProblem.correctAnswer;
            
            let buttonVariant: "outline" | "default" | "destructive" = "outline";
            let iconColor = "";
            
            if (showFeedback) {
              if (isCorrectAnswer) {
                buttonVariant = "default";
                iconColor = "text-secondary";
              } else if (isSelected && !isCorrect) {
                buttonVariant = "destructive";
                iconColor = "text-destructive-foreground";
              }
            } else if (isSelected) {
              buttonVariant = "default";
            }

            return (
              <Button
                key={index}
                variant={buttonVariant}
                className="w-full justify-start text-left h-auto py-4 px-6"
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
              >
                <span className="flex-1">{option}</span>
                {showFeedback && isCorrectAnswer && (
                  <CheckCircle2 className={`ml-2 h-5 w-5 ${iconColor}`} />
                )}
                {showFeedback && isSelected && !isCorrect && (
                  <XCircle className={`ml-2 h-5 w-5 ${iconColor}`} />
                )}
              </Button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`p-4 rounded-lg ${isCorrect ? "bg-secondary/10" : "bg-destructive/10"}`}>
            <div className="flex items-start gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive mt-0.5" />
              )}
              <div>
                <p className="font-bold mb-1">
                  {isCorrect ? "Correct!" : "Not quite right"}
                </p>
                <p className="text-sm">{currentProblem.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          {!showFeedback ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentProblemIndex < problems.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Complete Practice"
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
