import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy, Map } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
  onViewStories: () => void;
  onViewMap: () => void;
}

export const StartScreen = ({ onStart, onViewStories, onViewMap }: StartScreenProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = Math.min(window.innerWidth, 600);
    canvas.height = 300;

    // Snake animation
    let snakeX = -50;
    let snakeY = canvas.height / 2;
    const orbPositions = [
      { x: 100, y: 80, phase: 0 },
      { x: 250, y: 120, phase: 1 },
      { x: 400, y: 90, phase: 2 },
      { x: 150, y: 200, phase: 3 },
      { x: 350, y: 220, phase: 4 },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw glowing orbs
      orbPositions.forEach((orb) => {
        const pulse = Math.sin(Date.now() * 0.003 + orb.phase) * 0.3 + 0.7;
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, 15 * pulse);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${pulse})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${pulse * 0.5})`);
        gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, 15 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Core orb
        ctx.fillStyle = "#8b5cf6";
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Animate snake
      snakeX += 1.5;
      snakeY = canvas.height / 2 + Math.sin(snakeX * 0.03) * 30;

      if (snakeX > canvas.width + 50) {
        snakeX = -50;
      }

      // Draw snake
      for (let i = 0; i < 5; i++) {
        const x = snakeX - i * 12;
        const y = snakeY + Math.sin((snakeX - i * 12) * 0.03) * 30;
        const size = 10 - i * 1;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, "#22c55e");
        gradient.addColorStop(1, "#15803d");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        if (i === 0) {
          // Eyes
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(x + 3, y - 3, 2, 0, Math.PI * 2);
          ctx.arc(x + 3, y + 3, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="mb-8 animate-slide-up">
          <canvas ref={canvasRef} className="mx-auto rounded-2xl" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-background mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Founder Quest
        </h1>
        
        <p className="text-xl md:text-2xl text-background/90 mb-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Learn from Young Innovators
        </p>
        
        <p className="text-lg text-background/80 mb-10 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
          Guide your snake to collect orbs and discover inspiring stories from founders under 25!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up mb-8" style={{ animationDelay: "0.4s" }}>
          <Button 
            size="lg" 
            variant="hero"
            onClick={onStart}
            className="group animate-pulse-glow"
          >
            <Sparkles className="mr-2 h-5 w-5 group-hover:animate-bounce-soft" />
            Start Adventure
          </Button>
          <Button 
            size="lg" 
            variant="heroOutline"
            onClick={onViewMap}
          >
            <Map className="mr-2 h-5 w-5" />
            View Progress Map
          </Button>
        </div>

        <Button 
          variant="ghost" 
          onClick={onViewStories}
          className="text-background/80 hover:text-background hover:bg-background/10 animate-slide-up"
          style={{ animationDelay: "0.5s" }}
        >
          <Trophy className="mr-2 h-4 w-4" />
          Meet the Founders
        </Button>

        <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <div className="bg-background/10 backdrop-blur-sm border border-background/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-background mb-1">50+</div>
            <div className="text-xs text-background/80">Founder Stories</div>
          </div>
          <div className="bg-background/10 backdrop-blur-sm border border-background/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-background mb-1">8</div>
            <div className="text-xs text-background/80">Innovation Cities</div>
          </div>
          <div className="bg-background/10 backdrop-blur-sm border border-background/20 rounded-xl p-4">
            <div className="text-2xl font-bold text-background mb-1">100%</div>
            <div className="text-xs text-background/80">Inspiring</div>
          </div>
        </div>
      </div>
    </div>
  );
};
