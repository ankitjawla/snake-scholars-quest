import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Target } from "lucide-react";

interface GameCanvasProps {
  level: number;
  onBack: () => void;
  onLevelComplete: () => void;
}

interface Snake {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const GameCanvas = ({ level, onBack, onLevelComplete }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [snakes, setSnakes] = useState<Snake[]>([]);
  const [gameActive, setGameActive] = useState(true);
  const targetScore = 5 + level * 2;

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
        canvas.height = Math.min(window.innerHeight * 0.6, 500);
      }
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Initialize snakes
    const initSnakes = () => {
      const newSnakes: Snake[] = [];
      const snakeCount = 3 + level;
      for (let i = 0; i < snakeCount; i++) {
        newSnakes.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: Math.random() * (canvas.height - 40) + 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
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

      // Update and draw snakes
      snakes.forEach((snake) => {
        // Update position
        snake.x += snake.vx;
        snake.y += snake.vy;

        // Bounce off walls
        if (snake.x <= 15 || snake.x >= canvas.width - 15) snake.vx *= -1;
        if (snake.y <= 15 || snake.y >= canvas.height - 15) snake.vy *= -1;

        // Draw snake
        ctx.save();
        ctx.translate(snake.x, snake.y);
        
        // Snake body
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Snake eyes
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-5, -5, 3, 0, Math.PI * 2);
        ctx.arc(5, -5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(-5, -5, 1.5, 0, Math.PI * 2);
        ctx.arc(5, -5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      animationId = requestAnimationFrame(gameLoop);
    };
    gameLoop();

    // Handle clicks/touches
    const handleInteraction = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      snakes.forEach((snake, index) => {
        const dx = x - snake.x;
        const dy = y - snake.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 15) {
          setScore((prev) => {
            const newScore = prev + 1;
            if (newScore >= targetScore) {
              setGameActive(false);
              setTimeout(onLevelComplete, 1000);
            }
            return newScore;
          });
          // Respawn snake at random position
          snake.x = Math.random() * (canvas.width - 40) + 20;
          snake.y = Math.random() * (canvas.height - 40) + 20;
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
  }, [snakes, gameActive, level, onLevelComplete, targetScore]);

  // Timer
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit Game
          </Button>
          <div className="text-2xl font-bold text-foreground">
            Level {level}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Score</div>
                <div className="text-2xl font-bold text-foreground">{score} / {targetScore}</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-secondary/5 border-secondary/20">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" />
              <div>
                <div className="text-sm text-muted-foreground">Time Left</div>
                <div className="text-2xl font-bold text-foreground">{timeLeft}s</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4 mb-4 bg-accent/5 border-accent/20">
          <p className="text-center text-foreground">
            <span className="font-semibold">Goal:</span> Tap or click the snakes to catch them! 
            Catch {targetScore} snakes before time runs out!
          </p>
        </Card>

        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border-4 border-primary/20 rounded-2xl bg-muted/20 cursor-pointer touch-none shadow-lg"
            style={{ maxWidth: "100%" }}
          />
        </div>

        {!gameActive && (
          <Card className="mt-6 p-6 text-center bg-gradient-primary">
            <h3 className="text-2xl font-bold text-background mb-2">
              {score >= targetScore ? "Level Complete! 🎉" : "Time's Up!"}
            </h3>
            <p className="text-background/90 mb-4">
              {score >= targetScore
                ? `Great job! You caught ${score} snakes!`
                : `You caught ${score} snakes. You needed ${targetScore}.`}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
