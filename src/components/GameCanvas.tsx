import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Target, Flame } from "lucide-react";
import { toast } from "sonner";

interface GameCanvasProps {
  level: number;
  difficulty: "easy" | "medium" | "hard";
  onBack: () => void;
  onLevelComplete: () => void;
}

interface Snake {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const DIFFICULTY_CONFIG = {
  easy: { snakes: 3, speed: 1, time: 45, target: 5 },
  medium: { snakes: 5, speed: 2, time: 35, target: 8 },
  hard: { snakes: 7, speed: 3.5, time: 25, target: 12 },
};

export const GameCanvas = ({ level, difficulty, onBack, onLevelComplete }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_CONFIG[difficulty].time);
  const [snakes, setSnakes] = useState<Snake[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [gameActive, setGameActive] = useState(true);
  const [combo, setCombo] = useState(0);
  const lastCatchTime = useRef(0);
  
  const config = DIFFICULTY_CONFIG[difficulty];
  const targetScore = config.target + (level - 1) * 2;

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

    // Initialize snakes
    const initSnakes = () => {
      const newSnakes: Snake[] = [];
      const snakeCount = config.snakes + level - 1;
      for (let i = 0; i < snakeCount; i++) {
        newSnakes.push({
          x: Math.random() * (canvas.width - 60) + 30,
          y: Math.random() * (canvas.height - 60) + 30,
          vx: (Math.random() - 0.5) * config.speed,
          vy: (Math.random() - 0.5) * config.speed,
          hue: Math.random() * 60 + 100, // Green to cyan
        });
      }
      setSnakes(newSnakes);
    };
    initSnakes();

    // Game loop
    let animationId: number;
    const gameLoop = () => {
      if (!gameActive) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.05)");
      gradient.addColorStop(1, "rgba(34, 197, 94, 0.05)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        particle.vy += 0.1; // Gravity

        if (particle.life <= 0) {
          particles.splice(index, 1);
        } else {
          ctx.globalAlpha = particle.life;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      // Update and draw snakes
      snakes.forEach((snake) => {
        // Update position
        snake.x += snake.vx;
        snake.y += snake.vy;

        // Bounce off walls with speed variation
        if (snake.x <= 20 || snake.x >= canvas.width - 20) {
          snake.vx *= -1;
          snake.x = Math.max(20, Math.min(canvas.width - 20, snake.x));
        }
        if (snake.y <= 20 || snake.y >= canvas.height - 20) {
          snake.vy *= -1;
          snake.y = Math.max(20, Math.min(canvas.height - 20, snake.y));
        }

        // Draw snake with gradient
        ctx.save();
        ctx.translate(snake.x, snake.y);
        
        const snakeGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
        snakeGradient.addColorStop(0, `hsl(${snake.hue}, 80%, 60%)`);
        snakeGradient.addColorStop(1, `hsl(${snake.hue}, 80%, 40%)`);
        
        // Snake body with shadow
        ctx.shadowColor = `hsl(${snake.hue}, 80%, 30%)`;
        ctx.shadowBlur = 10;
        ctx.fillStyle = snakeGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // Snake pattern (scales)
        ctx.strokeStyle = `hsl(${snake.hue}, 60%, 30%)`;
        ctx.lineWidth = 2;
        for (let i = -10; i <= 10; i += 5) {
          ctx.beginPath();
          ctx.arc(i, 0, 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Snake eyes
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-6, -6, 4, 0, Math.PI * 2);
        ctx.arc(6, -6, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(-6, -6, 2, 0, Math.PI * 2);
        ctx.arc(6, -6, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Smile
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        ctx.restore();
      });

      animationId = requestAnimationFrame(gameLoop);
    };
    gameLoop();

    // Handle clicks/touches
    const createParticles = (x: number, y: number, color: string) => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        newParticles.push({
          x,
          y,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          life: 1,
          color,
        });
      }
      setParticles((prev) => [...prev, ...newParticles]);
    };

    const handleInteraction = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      let caught = false;

      snakes.forEach((snake) => {
        const dx = x - snake.x;
        const dy = y - snake.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 18) {
          caught = true;
          
          // Create particles
          createParticles(snake.x, snake.y, `hsl(${snake.hue}, 80%, 60%)`);
          
          // Check combo
          const now = Date.now();
          if (now - lastCatchTime.current < 1500) {
            setCombo((prev) => {
              const newCombo = prev + 1;
              if (newCombo >= 3) {
                toast.success(`${newCombo}x Combo! 🔥`, { duration: 1000 });
              }
              return newCombo;
            });
          } else {
            setCombo(1);
          }
          lastCatchTime.current = now;
          
          setScore((prev) => {
            const newScore = prev + 1;
            if (newScore >= targetScore) {
              setGameActive(false);
              toast.success("Level Complete! 🎉");
              setTimeout(onLevelComplete, 1500);
            } else {
              toast.success("+1 Snake! 🐍", { duration: 800 });
            }
            return newScore;
          });
          
          // Respawn snake
          snake.x = Math.random() * (canvas.width - 60) + 30;
          snake.y = Math.random() * (canvas.height - 60) + 30;
          snake.vx = (Math.random() - 0.5) * config.speed;
          snake.vy = (Math.random() - 0.5) * config.speed;
        }
      });
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
  }, [snakes, particles, gameActive, level, difficulty, onLevelComplete, targetScore, config, combo]);

  // Timer
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          toast.error("Time's up! ⏰");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  // Reset combo after inactivity
  useEffect(() => {
    const resetCombo = setInterval(() => {
      if (Date.now() - lastCatchTime.current > 1500) {
        setCombo(0);
      }
    }, 500);

    return () => clearInterval(resetCombo);
  }, []);

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
          <div className="w-20" /> {/* Spacer */}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="p-3 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Score</div>
                <div className="text-lg font-bold text-foreground">{score}/{targetScore}</div>
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
              <Flame className="w-4 h-4 text-accent" />
              <div>
                <div className="text-xs text-muted-foreground">Combo</div>
                <div className="text-lg font-bold text-foreground">{combo}x</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-3 mb-4 bg-accent/5 border-accent/20">
          <p className="text-center text-sm text-foreground">
            🎯 Tap the snakes to catch them! Catch {targetScore} before time runs out!
          </p>
        </Card>

        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border-4 border-primary/30 rounded-2xl bg-background/50 cursor-pointer touch-none shadow-xl hover:border-primary/50 transition-colors"
            style={{ maxWidth: "100%" }}
          />
        </div>

        {!gameActive && (
          <Card className="mt-6 p-6 text-center bg-gradient-primary animate-slide-up">
            <h3 className="text-2xl font-bold text-background mb-2">
              {score >= targetScore ? "🎉 Level Complete!" : "⏰ Time's Up!"}
            </h3>
            <p className="text-background/90">
              {score >= targetScore
                ? `Amazing! You caught ${score} snakes!`
                : `You caught ${score}/${targetScore} snakes. Try again!`}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
