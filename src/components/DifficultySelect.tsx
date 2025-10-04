import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target, Flame } from "lucide-react";

interface DifficultySelectProps {
  onSelect: (difficulty: "easy" | "medium" | "hard") => void;
  onBack: () => void;
}

export const DifficultySelect = ({ onSelect, onBack }: DifficultySelectProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Challenge
          </h1>
          <p className="text-xl text-muted-foreground">
            Select difficulty level to begin your learning adventure
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="p-8 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30 hover:border-secondary hover:shadow-xl transition-all cursor-pointer group animate-slide-up"
            onClick={() => onSelect("easy")}
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Easy</h3>
              <p className="text-muted-foreground mb-6">
                Perfect for beginners. Slow snakes, more time.
              </p>
              <div className="space-y-2 text-sm text-foreground/80">
                <div>🐍 3-4 slow snakes</div>
                <div>⏱️ 45 seconds per level</div>
                <div>🎯 Catch 5 snakes</div>
              </div>
            </div>
          </Card>

          <Card 
            className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 hover:border-primary hover:shadow-xl transition-all cursor-pointer group animate-slide-up"
            style={{ animationDelay: "0.1s" }}
            onClick={() => onSelect("medium")}
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Medium</h3>
              <p className="text-muted-foreground mb-6">
                Balanced challenge. Good for learners.
              </p>
              <div className="space-y-2 text-sm text-foreground/80">
                <div>🐍 5-6 medium snakes</div>
                <div>⏱️ 35 seconds per level</div>
                <div>🎯 Catch 8 snakes</div>
              </div>
            </div>
          </Card>

          <Card 
            className="p-8 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30 hover:border-destructive hover:shadow-xl transition-all cursor-pointer group animate-slide-up"
            style={{ animationDelay: "0.2s" }}
            onClick={() => onSelect("hard")}
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Hard</h3>
              <p className="text-muted-foreground mb-6">
                Expert level. Fast snakes, less time!
              </p>
              <div className="space-y-2 text-sm text-foreground/80">
                <div>🐍 7-8 fast snakes</div>
                <div>⏱️ 25 seconds per level</div>
                <div>🎯 Catch 12 snakes</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Button variant="ghost" onClick={onBack}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
