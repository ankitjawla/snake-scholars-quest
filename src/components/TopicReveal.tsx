import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Lightbulb, BookOpen, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { educationalTopics, type EducationalTopic } from "@/data/educationalContent";
import { toast } from "sonner";

interface TopicRevealProps {
  topicId: number;
  score: number;
  onContinue: () => void;
}

export const TopicReveal = ({ topicId, score, onContinue }: TopicRevealProps) => {
  const topic: EducationalTopic = educationalTopics.find((t) => t.id === topicId) || educationalTopics[0];
  const [showQuestion, setShowQuestion] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  
  const subjectColors = {
    math: { bg: "from-primary/10 to-accent/10", border: "border-primary/20", icon: "text-primary" },
    science: { bg: "from-secondary/10 to-accent/10", border: "border-secondary/20", icon: "text-secondary" },
    programming: { bg: "from-accent/10 to-primary/10", border: "border-accent/20", icon: "text-accent" },
  };

  const colors = subjectColors[topic.subject];

  const handleAnswerSelect = (index: number) => {
    if (answered) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    
    if (index === topic.correctAnswer) {
      toast.success("🎉 Correct! Great job!", { duration: 2000 });
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
              <div className={`inline-block px-3 py-1 rounded-full bg-background/50 ${colors.icon} text-sm font-semibold uppercase mb-4`}>
                {topic.subject}
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
          <div className="flex items-center gap-3 mb-4">
            <div className={`inline-block px-3 py-1 rounded-full bg-background/50 ${colors.icon} text-sm font-semibold uppercase`}>
              {topic.subject}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-4">{topic.title}</h3>
          
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
