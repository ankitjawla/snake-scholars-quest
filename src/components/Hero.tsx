import { Button } from "@/components/ui/button";
import { Gamepad2, Sparkles } from "lucide-react";

interface HeroProps {
  onStartGame: () => void;
  onLearnMore: () => void;
}

export const Hero = ({ onStartGame, onLearnMore }: HeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 mb-6 animate-slide-up">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium text-background">Created by Young Innovators</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Catch the Snake
        </h1>
        
        <p className="text-xl md:text-2xl text-background/90 mb-4 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Learn Programming, Math & Science Through Play
        </p>
        
        <p className="text-lg text-background/80 mb-12 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
          An educational adventure created by two amazing sisters who believe learning should be fun!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Button 
            size="lg" 
            variant="hero"
            onClick={onStartGame}
            className="group"
          >
            <Gamepad2 className="mr-2 h-5 w-5 group-hover:animate-bounce-soft" />
            Start Playing
          </Button>
          <Button 
            size="lg" 
            variant="heroOutline"
            onClick={onLearnMore}
          >
            Meet the Founders
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <div className="bg-background/10 backdrop-blur-sm border border-background/20 rounded-2xl p-6 hover:bg-background/15 transition-all">
            <div className="text-3xl font-bold text-secondary mb-2">5+</div>
            <div className="text-background/90">Learning Levels</div>
          </div>
          <div className="bg-background/10 backdrop-blur-sm border border-background/20 rounded-2xl p-6 hover:bg-background/15 transition-all">
            <div className="text-3xl font-bold text-secondary mb-2">3</div>
            <div className="text-background/90">Subject Areas</div>
          </div>
          <div className="bg-background/10 backdrop-blur-sm border border-background/20 rounded-2xl p-6 hover:bg-background/15 transition-all">
            <div className="text-3xl font-bold text-secondary mb-2">100%</div>
            <div className="text-background/90">Fun Guaranteed</div>
          </div>
        </div>
      </div>
    </div>
  );
};
