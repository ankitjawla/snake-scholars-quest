import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { educationalTopics } from "@/data/educationalContent";
import { CheckCircle, XCircle, Sparkles, Lightbulb, BookOpen, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { scheduleReview, analyzeCommonMistakes } from "@/utils/adaptiveLearning";
import { updateMasteryLevel, getStoredProgress, saveProgress } from "@/utils/progressStorage";
import { VisualLearningTool } from "./VisualLearningTool";

interface TopicRevealProps {
  topicId: number;
  score: number;
  onContinue: () => void;
}

export const TopicReveal = ({ topicId, score, onContinue }: TopicRevealProps) => {
  const topic = educationalTopics.find((t) => t.id === topicId) || educationalTopics[0];
  const [showQuestion, setShowQuestion] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  
  const subjectColors: Record<string, { bg: string; border: string; icon: string; label: string }> = {
    math: { bg: "from-blue-500/10 to-blue-600/10", border: "border-blue-500/20", icon: "text-blue-500", label: "Mathematics" },
    science: { bg: "from-green-500/10 to-green-600/10", border: "border-green-500/20", icon: "text-green-500", label: "Science" },
    evs: { bg: "from-teal-500/10 to-teal-600/10", border: "border-teal-500/20", icon: "text-teal-500", label: "EVS" },
    english: { bg: "from-orange-500/10 to-orange-600/10", border: "border-orange-500/20", icon: "text-orange-500", label: "English" },
    hindi: { bg: "from-red-500/10 to-red-600/10", border: "border-red-500/20", icon: "text-red-500", label: "हिंदी" },
    "social-science": { bg: "from-purple-500/10 to-purple-600/10", border: "border-purple-500/20", icon: "text-purple-500", label: "Social Science" },
    programming: { bg: "from-indigo-500/10 to-indigo-600/10", border: "border-indigo-500/20", icon: "text-indigo-500", label: "Programming" },
  };

  const colors = subjectColors[topic.subject] || subjectColors.math;

  const handleAnswerSelect = (index: number) => {
    if (answered) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    const isCorrect = index === topic.correctAnswer;
    
    // Track quiz attempt
    const progress = getStoredProgress();
    const quizScore = isCorrect ? 100 : 0;
    progress.quizAttempts.push({
      topicId,
      score: quizScore,
      timeToAnswer: 0,
      mistakes: isCorrect ? [] : [topic.options[index]],
    });
    saveProgress(progress);

    // Schedule review and update mastery
    scheduleReview(topicId, quizScore);
    
    if (isCorrect) {
      toast.success("🎉 Correct! Great job!", { duration: 2000 });
      // Update mastery level based on performance
      const topicAttempts = progress.quizAttempts.filter(q => q.topicId === topicId);
      const avgScore = topicAttempts.reduce((sum, q) => sum + q.score, 0) / topicAttempts.length;
      
      if (avgScore >= 90 && topicAttempts.length >= 3) {
        updateMasteryLevel(topicId, "mastered");
      } else if (avgScore >= 70) {
        updateMasteryLevel(topicId, "advanced");
      } else if (avgScore >= 50) {
        updateMasteryLevel(topicId, "intermediate");
      } else {
        updateMasteryLevel(topicId, "beginner");
      }
    } else {
      toast.error("Not quite right, but keep learning!", { duration: 2000 });
    }
  };

  const handleContinueToTopic = () => {
    setShowQuestion(false);
  };

  if (showQuestion) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 flex items-center">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8 animate-slide-up">
            <div className="text-6xl mb-4 animate-bounce-soft">
              {topic.emoji}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Quick Quiz!</h2>
            <p className="text-muted-foreground mb-4">Test what you learned</p>
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-lg">
              Score: {score}
            </div>
          </div>

          <Card className={`p-6 md:p-8 mb-6 bg-gradient-to-br ${colors.bg} ${colors.border} animate-slide-up`} style={{ animationDelay: "0.1s" }}>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className={`inline-block px-3 py-1 rounded-full bg-background/50 ${colors.icon} text-sm font-semibold`}>
                  {colors.label}
                </div>
                {topic.subCategory && (
                  <div className="text-xs px-2 py-1 rounded-full bg-background/30 text-foreground">
                    {topic.subCategory}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-6">{topic.question}</h3>
            </div>

            <div className="space-y-3">
              {topic.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === topic.correctAnswer;
                const showResult = answered;

                let buttonStyle = "bg-background/50 hover:bg-background/70 border-2 border-transparent";
                
                if (showResult) {
                  if (isCorrect) {
                    buttonStyle = "bg-secondary/20 border-2 border-secondary text-secondary-foreground";
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = "bg-destructive/20 border-2 border-destructive text-destructive-foreground";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={answered}
                    className={`w-full p-4 rounded-xl text-left font-medium transition-all ${buttonStyle} ${
                      !answered && "hover:scale-102 active:scale-98"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-secondary" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-6 p-4 rounded-xl bg-background/70 animate-slide-up">
                <div className="flex items-start gap-2">
                  <Lightbulb className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                  <div>
                    <div className="font-semibold text-foreground mb-1">Explanation</div>
                    <p className="text-sm text-foreground/90">{topic.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {answered && (
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button 
                size="lg"
                onClick={handleContinueToTopic}
                className="bg-gradient-primary text-background hover:opacity-90 shadow-lg group"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 flex items-center">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8 animate-slide-up">
          <div className="text-6xl mb-4 animate-bounce-soft">
            {topic.emoji}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Topic Unlocked!</h2>
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-lg">
            Score: {score}
          </div>
        </div>

        <Card className={`p-6 md:p-8 mb-6 bg-gradient-to-br ${colors.bg} ${colors.border} animate-slide-up`} style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className={`inline-block px-3 py-1 rounded-full bg-background/50 ${colors.icon} text-sm font-semibold`}>
              {colors.label}
            </div>
            {topic.subCategory && (
              <div className="text-xs px-2 py-1 rounded-full bg-background/30 text-foreground">
                {topic.subCategory}
              </div>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-2">{topic.title}</h3>
          <p className="text-sm text-muted-foreground italic mb-4">📚 {topic.learningOutcome}</p>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-background/50">
              <div className="flex items-start gap-2 mb-2">
                <BookOpen className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                <div className="font-semibold text-foreground">What is it?</div>
              </div>
              <p className="text-foreground/90 leading-relaxed pl-7">{topic.concept}</p>
            </div>

            <div className="p-4 rounded-xl bg-background/50">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                <div className="font-semibold text-foreground">Example</div>
              </div>
              <p className="text-foreground/90 leading-relaxed pl-7 font-mono text-sm">{topic.example}</p>
            </div>

            <div className="p-4 rounded-xl bg-background/50">
              <div className="flex items-start gap-2 mb-2">
                <Lightbulb className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                <div className="font-semibold text-foreground">Fun Fact!</div>
              </div>
              <p className="text-foreground/90 leading-relaxed pl-7">{topic.funFact}</p>
            </div>
          </div>
        </Card>

        {/* Show visual learning tool for math topics */}
        {topic.subject === "math" && (
          <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <VisualLearningTool type="fraction-bar" topic={topic.title} />
          </div>
        )}

        <div className="text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button 
            size="lg"
            onClick={onContinue}
            className="bg-gradient-primary text-background hover:opacity-90 shadow-lg group"
          >
            Play Again
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};
