import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Target, Zap } from "lucide-react";
import { toast } from "sonner";

interface GameCanvasProps {
  level: number;
  difficulty: "easy" | "medium" | "hard";
  onBack: () => void;
  onLevelComplete: () => void;
}

interface Snake {
  segments: { x: number; y: number }[];
  vx: number;
  vy: number;
  targetInsect: number | null;
}

interface Insect {
  x: number;
  y: number;
  eaten: boolean;
}

interface Trap {
  x: number;
  y: number;
  armed: boolean;
}

const DIFFICULTY_CONFIG = {
  easy: { insects: 5, traps: 8, speed: 1.5, time: 60 },
  medium: { insects: 8, traps: 5, speed: 2.5, time: 45 },
  hard: { insects: 12, traps: 3, speed: 3.5, time: 35 },
};

export const GameCanvas = ({ level, difficulty, onBack, onLevelComplete }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_CONFIG[difficulty].time);
  const [gameActive, setGameActive] = useState(true);
  const [trapsLeft, setTrapsLeft] = useState(DIFFICULTY_CONFIG[difficulty].traps);
  const [traps, setTraps] = useState<Trap[]>([]);
  const [insects, setInsects] = useState<Insect[]>([]);
  const [snake, setSnake] = useState<Snake | null>(null);
  const [insectsEaten, setInsectsEaten] = useState(0);
  const [caught, setCaught] = useState(false);
  
  const config = DIFFICULTY_CONFIG[difficulty];
  const totalInsects = config.insects + (level - 1) * 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = Math.min(container.clientWidth - 32, 600);
        canvas.height = Math.min(window.innerHeight * 0.5, 450);
      }
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Initialize game
    if (!snake) {
      const newInsects: Insect[] = [];
      for (let i = 0; i < totalInsects; i++) {
        newInsects.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: Math.random() * (canvas.height - 40) + 20,
          eaten: false,
        });
      }
      setInsects(newInsects);

      setSnake({
        segments: [
          { x: canvas.width / 2, y: canvas.height / 2 },
          { x: canvas.width / 2 - 10, y: canvas.height / 2 },
          { x: canvas.width / 2 - 20, y: canvas.height / 2 },
        ],
        vx: config.speed,
        vy: 0,
        targetInsect: null,
      });
    }

    // Game loop
    let animationId: number;
    const gameLoop = () => {
      if (!gameActive || !snake || caught) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.05)");
      gradient.addColorStop(1, "rgba(34, 197, 94, 0.05)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw insects
      insects.forEach((insect) => {
        if (!insect.eaten) {
          ctx.save();
          ctx.translate(insect.x, insect.y);
          
          // Insect body
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Insect wings
          ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
          ctx.beginPath();
          ctx.ellipse(-3, 0, 4, 2, -Math.PI / 4, 0, Math.PI * 2);
          ctx.ellipse(3, 0, 4, 2, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      });

      // Draw traps
      traps.forEach((trap) => {
        ctx.save();
        ctx.translate(trap.x, trap.y);
        
        // Trap circle
        ctx.strokeStyle = trap.armed ? "#f59e0b" : "#10b981";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // Trap cross
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 10);
        ctx.stroke();
        
        if (trap.armed) {
          // Pulsing effect for armed trap
          ctx.fillStyle = "rgba(245, 158, 11, 0.2)";
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      });

      // Find nearest uneaten insect
      const head = snake.segments[0];
      let nearestInsect = -1;
      let nearestDist = Infinity;
      
      insects.forEach((insect, idx) => {
        if (!insect.eaten) {
          const dx = insect.x - head.x;
          const dy = insect.y - head.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestInsect = idx;
          }
        }
      });

      // Move snake toward nearest insect
      if (nearestInsect >= 0) {
        const target = insects[nearestInsect];
        const dx = target.x - head.x;
        const dy = target.y - head.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
          snake.vx = (dx / dist) * config.speed;
          snake.vy = (dy / dist) * config.speed;
        }

        // Check if snake ate insect
        if (dist < 12) {
          insects[nearestInsect].eaten = true;
          setInsectsEaten((prev) => prev + 1);
          toast.success("🐛 Snake ate an insect!", { duration: 800 });
          
          // Grow snake
          const tail = snake.segments[snake.segments.length - 1];
          snake.segments.push({ ...tail });
        }
      }

      // Update snake position
      const newHead = {
        x: head.x + snake.vx,
        y: head.y + snake.vy,
      };

      // Bounce off walls
      if (newHead.x <= 15 || newHead.x >= canvas.width - 15) {
        snake.vx *= -1;
        newHead.x = Math.max(15, Math.min(canvas.width - 15, newHead.x));
      }
      if (newHead.y <= 15 || newHead.y >= canvas.height - 15) {
        snake.vy *= -1;
        newHead.y = Math.max(15, Math.min(canvas.height - 15, newHead.y));
      }

      // Check trap collision
      traps.forEach((trap) => {
        const dx = newHead.x - trap.x;
        const dy = newHead.y - trap.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 20 && trap.armed) {
          setCaught(true);
          setGameActive(false);
          toast.success("🎉 Snake Caught!", { duration: 2000 });
          setTimeout(onLevelComplete, 1500);
          trap.armed = false;
        }
      });

      // Move snake segments
      for (let i = snake.segments.length - 1; i > 0; i--) {
        snake.segments[i] = { ...snake.segments[i - 1] };
      }
      snake.segments[0] = newHead;

      // Draw snake
      snake.segments.forEach((segment, idx) => {
        ctx.save();
        ctx.translate(segment.x, segment.y);
        
        const isHead = idx === 0;
        const size = isHead ? 12 : 10 - idx * 0.5;
        
        // Snake segment gradient
        const segmentGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        segmentGradient.addColorStop(0, "#22c55e");
        segmentGradient.addColorStop(1, "#15803d");
        
        ctx.fillStyle = segmentGradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        
        if (isHead) {
          // Snake eyes
          const angle = Math.atan2(snake.vy, snake.vx);
          ctx.rotate(angle);
          
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(3, -4, 3, 0, Math.PI * 2);
          ctx.arc(3, 4, 3, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(3, -4, 1.5, 0, Math.PI * 2);
          ctx.arc(3, 4, 1.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Tongue
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(8, 0);
          ctx.lineTo(12, -2);
          ctx.moveTo(8, 0);
          ctx.lineTo(12, 2);
          ctx.stroke();
        }
        
        ctx.restore();
      });

      animationId = requestAnimationFrame(gameLoop);
    };
    gameLoop();

    // Handle clicks/touches for trap placement
    const handleInteraction = (clientX: number, clientY: number) => {
      if (trapsLeft <= 0 || !gameActive || caught) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Check if click is too close to existing traps
      const tooClose = traps.some((trap) => {
        const dx = trap.x - x;
        const dy = trap.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 40;
      });

      if (tooClose) {
        toast.error("Too close to another trap!", { duration: 1000 });
        return;
      }

      setTraps((prev) => [...prev, { x, y, armed: true }]);
      setTrapsLeft((prev) => prev - 1);
      toast.success("🪤 Trap placed!", { duration: 800 });
    };

    const handleClick = (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY);
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleInteraction(touch.clientX, touch.clientY);
      }
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", handleTouch);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchstart", handleTouch);
      cancelAnimationFrame(animationId);
    };
  }, [snake, insects, traps, gameActive, config, totalInsects, difficulty, level, onLevelComplete, trapsLeft, caught]);

  // Timer
  useEffect(() => {
    if (!gameActive || caught) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          toast.error("Time's up! Snake escaped! 🐍", { duration: 2000 });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, caught]);

  const difficultyColor = {
    easy: "text-secondary",
    medium: "text-primary",
    hard: "text-destructive",
  }[difficulty];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit
          </Button>
          <div className="text-center">
            <div className={`text-sm font-semibold ${difficultyColor} uppercase`}>
              {difficulty} Mode
            </div>
            <div className="text-xl font-bold text-foreground">Level {level}</div>
          </div>
          <div className="w-20" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="p-3 bg-destructive/5 border-destructive/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-destructive" />
              <div>
                <div className="text-xs text-muted-foreground">Eaten</div>
                <div className="text-lg font-bold text-foreground">{insectsEaten}/{totalInsects}</div>
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-secondary/5 border-secondary/20">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-secondary" />
              <div>
                <div className="text-xs text-muted-foreground">Time</div>
                <div className="text-lg font-bold text-foreground">{timeLeft}s</div>
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-accent/5 border-accent/20">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <div>
                <div className="text-xs text-muted-foreground">Traps</div>
                <div className="text-lg font-bold text-foreground">{trapsLeft}</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-3 mb-4 bg-accent/5 border-accent/20">
          <p className="text-center text-sm text-foreground">
            🪤 Click to place traps! Catch the snake before it eats all {totalInsects} insects!
          </p>
        </Card>

        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border-4 border-primary/30 rounded-2xl bg-background/50 cursor-crosshair touch-none shadow-xl hover:border-primary/50 transition-colors"
            style={{ maxWidth: "100%" }}
          />
        </div>

        {!gameActive && (
          <Card className="mt-6 p-6 text-center bg-gradient-primary animate-slide-up">
            <h3 className="text-2xl font-bold text-background mb-2">
              {caught ? "🎉 Snake Caught!" : "⏰ Snake Escaped!"}
            </h3>
            <p className="text-background/90">
              {caught
                ? `Great strategy! The snake ate ${insectsEaten} insects before you caught it!`
                : `The snake ate ${insectsEaten} insects and escaped. Try faster trap placement!`}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
