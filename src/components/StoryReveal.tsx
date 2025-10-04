import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Lightbulb, Quote, ArrowRight } from "lucide-react";
import { founderStories, type FounderStory } from "@/data/founderStories";

interface StoryRevealProps {
  storyId: number;
  onContinue: () => void;
}

export const StoryReveal = ({ storyId, onContinue }: StoryRevealProps) => {
  const story: FounderStory = founderStories.find((s) => s.id === storyId) || founderStories[0];

  return (
    <div className="min-h-screen bg-background py-8 px-4 flex items-center">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4 animate-bounce-soft">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Story Unlocked!</h2>
          <div className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
            {story.city}, {story.country}
          </div>
        </div>

        <Card className="p-6 md:p-8 mb-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-background">
                {story.name.charAt(0)}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{story.name}</h3>
              <p className="text-muted-foreground">Age {story.age} • {story.company}</p>
              <div className="mt-2 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {story.achievement}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-background/50">
              <p className="text-foreground/90 leading-relaxed">{story.shortStory}</p>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6 bg-accent/10 border-accent/20 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start gap-3 mb-3">
              <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-foreground mb-2">Lesson Learned</h4>
                <p className="text-sm text-foreground/90">{story.lesson}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-secondary/10 border-secondary/20 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-start gap-3 mb-3">
              <Quote className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-foreground mb-2">Their Words</h4>
                <p className="text-sm italic text-foreground/90">"{story.quote}"</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Button 
            size="lg"
            onClick={onContinue}
            className="bg-gradient-primary text-background hover:opacity-90 shadow-lg group"
          >
            Continue Journey
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};
