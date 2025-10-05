import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";

interface AssessmentQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AssessmentGateProps {
  topicId: number;
  topicTitle: string;
  questions: AssessmentQuestion[];
  onPass: () => void;
  onRetry: () => void;
}

export const AssessmentGate = ({ topicTitle, questions, onPass, onRetry }: AssessmentGateProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const requiredCorrect = 2;
  const totalQuestions = 3;

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
      toast.success("Correct! 🎉", { duration: 1500 });
    } else {
      toast.error("Not quite right. Keep trying!", { duration: 1500 });
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Assessment complete
      const finalCorrect = correctCount + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0);
      setAssessmentComplete(true);
      
      if (finalCorrect >= requiredCorrect) {
        toast.success(`Amazing! You got ${finalCorrect}/${totalQuestions} correct! 🎮`, { duration: 3000 });
      } else {
        toast.error(`You got ${finalCorrect}/${totalQuestions}. You need ${requiredCorrect} to unlock the game. Try again!`, { duration: 3000 });
      }
    }
  };

  const finalScore = assessmentComplete ? correctCount + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0) : 0;
  const passed = finalScore >= requiredCorrect;

  if (assessmentComplete) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 flex items-center justify-center">
        <Card className="max-w-2xl w-full p-8 text-center animate-fade-in">
          {passed ? (
            <>
              <Trophy className="w-20 h-20 text-accent mx-auto mb-4 animate-bounce-soft" />
              <h2 className="text-3xl font-bold text-foreground mb-2">Assessment Passed! 🎉</h2>
              <p className="text-xl text-muted-foreground mb-6">
                You got {finalScore}/{totalQuestions} questions correct!
              </p>
              <p className="text-lg mb-8">
                You're ready to play the <span className="font-bold text-primary">{topicTitle}</span> game!
              </p>
              <Button size="lg" onClick={onPass} className="bg-gradient-primary text-background">
                <Zap className="mr-2 h-5 w-5" />
                Start Game!
              </Button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🤔</div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Keep Practicing!</h2>
              <p className="text-xl text-muted-foreground mb-6">
                You got {finalScore}/{totalQuestions} correct. You need {requiredCorrect} to unlock the game.
              </p>
              <p className="text-lg mb-8">
                Don't worry! Let's try again with different questions.
              </p>
              <Button size="lg" onClick={onRetry} variant="outline">
                Try Again 🔄
              </Button>
            </>
          )}
        </Card>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            🎯 Placement Assessment
          </h2>
          <p className="text-muted-foreground">
            Answer {requiredCorrect} out of {totalQuestions} questions correctly to unlock the game!
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {[...Array(totalQuestions)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < currentQuestionIndex
                    ? answers[i] === questions[i].correctAnswer
                      ? "bg-secondary"
                      : "bg-destructive"
                    : i === currentQuestionIndex
                    ? "bg-primary animate-pulse"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="p-6 animate-fade-in">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-sm font-bold text-secondary">
                {correctCount} ✓
              </span>
            </div>
            <div className="text-4xl mb-4 animate-bounce-soft">🤔</div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQuestion.correctAnswer;

              let buttonVariant: "outline" | "default" | "destructive" = "outline";
              let iconColor = "";

              if (showFeedback) {
                if (isCorrectAnswer) {
                  buttonVariant = "default";
                  iconColor = "text-secondary-foreground";
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
                  className="w-full justify-start text-left h-auto py-4 px-6 text-base hover:scale-102 transition-transform"
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
            <div className={`p-4 rounded-lg mb-6 animate-slide-up ${isCorrect ? "bg-secondary/10" : "bg-destructive/10"}`}>
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold mb-1 text-foreground">
                    {isCorrect ? "Excellent! 🎉" : "Not quite right 🤔"}
                  </p>
                  <p className="text-sm text-foreground/90">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            {!showFeedback ? (
              <Button onClick={handleSubmit} disabled={selectedAnswer === null} size="lg">
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext} size="lg" className="bg-gradient-primary">
                {currentQuestionIndex < questions.length - 1 ? "Next Question →" : "See Results"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
