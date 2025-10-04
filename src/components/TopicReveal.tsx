import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Lightbulb, BookOpen, ArrowRight } from "lucide-react";
import { educationalTopics, type EducationalTopic } from "@/data/educationalContent";

interface TopicRevealProps {
  topicId: number;
  score: number;
  onContinue: () => void;
}

export const TopicReveal = ({ topicId, score, onContinue }: TopicRevealProps) => {
  const topic: EducationalTopic = educationalTopics.find((t) => t.id === topicId) || educationalTopics[0];
  
  const subjectColors = {
    math: { bg: "from-primary/10 to-accent/10", border: "border-primary/20", icon: "text-primary" },
    science: { bg: "from-secondary/10 to-accent/10", border: "border-secondary/20", icon: "text-secondary" },
    programming: { bg: "from-accent/10 to-primary/10", border: "border-accent/20", icon: "text-accent" },
  };

  const colors = subjectColors[topic.subject];

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
