import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Trophy } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
  onViewTopics: () => void;
  highScore: number;
}

export const StartScreen = ({ onStart, onViewTopics, highScore }: StartScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="mb-6 animate-slide-up">
          <div className="text-8xl mb-4 animate-bounce-soft">🐍</div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-background mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Snake Runner
        </h1>
        
        <p className="text-xl md:text-2xl text-background/90 mb-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Learn Math & Science While You Run!
        </p>
        
        <p className="text-lg text-background/80 mb-10 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
          Swipe to move lanes, collect insects, avoid obstacles, and discover amazing science & math concepts!
        </p>

        {highScore > 0 && (
          <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background/10 backdrop-blur-sm border border-background/20">
              <Trophy className="w-5 h-5 text-secondary" />
              <span className="text-background font-bold">High Score: {highScore}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up mb-8" style={{ animationDelay: "0.5s" }}>
          <Button 
            size="lg" 
            variant="hero"
            onClick={onStart}
            className="group animate-pulse-glow text-lg"
          >
            <Sparkles className="mr-2 h-5 w-5 group-hover:animate-bounce-soft" />
            Start Running
          </Button>
          <Button 
            size="lg" 
            variant="heroOutline"
            onClick={onViewTopics}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            View Topics
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <div className="bg-background/10 backdrop-blur-sm border border-background/20 rounded-xl p-4">
            <div className="text-3xl mb-1">➕</div>
            <div className="text-sm text-background/80">Math</div>
          </div>
          <div className="bg-background/10 backdrop-blur-sm border border-background/20 rounded-xl p-4">
            <div className="text-3xl mb-1">🔬</div>
            <div className="text-sm text-background/80">Science</div>
          </div>
          <div className="bg-background/10 backdrop-blur-sm border border-background/20 rounded-xl p-4">
            <div className="text-3xl mb-1">💻</div>
            <div className="text-sm text-background/80">Code</div>
          </div>
        </div>

        <div className="mt-8 text-background/70 text-sm animate-slide-up" style={{ animationDelay: "0.7s" }}>
          👆 Swipe Left/Right • 👆 Swipe Up to Jump
        </div>
      </div>
    </div>
  );
};
