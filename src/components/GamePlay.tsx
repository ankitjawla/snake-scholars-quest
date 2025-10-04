import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Heart } from "lucide-react";
import { toast } from "sonner";
import { founderStories } from "@/data/founderStories";

interface GamePlayProps {
  level: number;
  onBack: () => void;
  onLevelComplete: (storyId: number) => void;
}

interface Snake {
  segments: { x: number; y: number }[];
  targetX: number;
  targetY: number;
}

interface Orb {
  x: number;
  y: number;
  collected: boolean;
  pulse: number;
}

interface Obstacle {
  x: number;
  y: number;
  type: "doubt" | "burnout";
  width: number;
  height: number;
}

export const GamePlay = ({ level, onBack, onLevelComplete }: GamePlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [orbsCollected, setOrbsCollected] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameActive, setGameActive] = useState(true);
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [snake, setSnake] = useState<Snake | null>(null);
  const touchPos = useRef({ x: 0, y: 0 });
  
  const targetOrbs = 5;
  const story = founderStories[(level - 1) % founderStories.length];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = Math.min(container.clientWidth - 32, 600);
        canvas.height = Math.min(window.innerHeight * 0.55, 500);
      }
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Initialize game elements
    if (!snake) {
      const newOrbs: Orb[] = [];
      for (let i = 0; i < targetOrbs; i++) {
        newOrbs.push({
          x: Math.random() * (canvas.width - 60) + 30,
          y: Math.random() * (canvas.height - 60) + 30,
          collected: false,
          pulse: Math.random() * Math.PI * 2,
        });
      }
      setOrbs(newOrbs);

      const newObstacles: Obstacle[] = [];
      const obstacleCount = Math.min(level + 1, 5);
      for (let i = 0; i < obstacleCount; i++) {
        newObstacles.push({
          x: Math.random() * (canvas.width - 100) + 50,
          y: Math.random() * (canvas.height - 100) + 50,
          type: Math.random() > 0.5 ? "doubt" : "burnout",
          width: 60,
          height: 40,
        });
      }
      setObstacles(newObstacles);

      setSnake({
        segments: [
          { x: canvas.width / 2, y: canvas.height / 2 },
          { x: canvas.width / 2 - 12, y: canvas.height / 2 },
          { x: canvas.width / 2 - 24, y: canvas.height / 2 },
        ],
        targetX: canvas.width / 2,
        targetY: canvas.height / 2,
      });

      touchPos.current = { x: canvas.width / 2, y: canvas.height / 2 };
    }

    // Game loop
    let animationId: number;
    const gameLoop = () => {
      if (!gameActive || !snake) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.05)");
      gradient.addColorStop(1, "rgba(34, 197, 94, 0.05)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw orbs
      orbs.forEach((orb) => {
        if (!orb.collected) {
          orb.pulse += 0.05;
          const pulse = Math.sin(orb.pulse) * 0.3 + 1;
          
          const orbGradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, 12 * pulse);
          orbGradient.addColorStop(0, "rgba(139, 92, 246, 1)");
          orbGradient.addColorStop(0.7, "rgba(139, 92, 246, 0.5)");
          orbGradient.addColorStop(1, "rgba(139, 92, 246, 0)");
          
          ctx.fillStyle = orbGradient;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, 12 * pulse, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#8b5cf6";
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw obstacles
      obstacles.forEach((obs) => {
        ctx.save();
        ctx.translate(obs.x, obs.y);
        
        if (obs.type === "doubt") {
          // Doubt cloud
          ctx.fillStyle = "rgba(100, 116, 139, 0.6)";
          ctx.beginPath();
          ctx.arc(-15, 0, 15, 0, Math.PI * 2);
          ctx.arc(0, -5, 18, 0, Math.PI * 2);
          ctx.arc(15, 0, 15, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = "#fff";
          ctx.font = "bold 20px Poppins";
          ctx.textAlign = "center";
          ctx.fillText("?", 0, 5);
        } else {
          // Burnout barrier
          ctx.fillStyle = "rgba(239, 68, 68, 0.6)";
          ctx.fillRect(-30, -20, 60, 40);
          
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 3;
          for (let i = -20; i <= 20; i += 10) {
            ctx.beginPath();
            ctx.moveTo(-25 + i, -15);
            ctx.lineTo(-15 + i, 15);
            ctx.stroke();
          }
        }
        
        ctx.restore();
      });

      // Move snake toward touch/mouse position
      const head = snake.segments[0];
      const dx = touchPos.current.x - head.x;
      const dy = touchPos.current.y - head.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 5) {
        const speed = 3;
        const newHeadX = head.x + (dx / dist) * speed;
        const newHeadY = head.y + (dy / dist) * speed;

        // Check boundaries
        const boundedX = Math.max(15, Math.min(canvas.width - 15, newHeadX));
        const boundedY = Math.max(15, Math.min(canvas.height - 15, newHeadY));

        // Check obstacle collisions
        let hitObstacle = false;
        obstacles.forEach((obs) => {
          const obsLeft = obs.x - obs.width / 2;
          const obsRight = obs.x + obs.width / 2;
          const obsTop = obs.y - obs.height / 2;
          const obsBottom = obs.y + obs.height / 2;

          if (boundedX >= obsLeft && boundedX <= obsRight &&
              boundedY >= obsTop && boundedY <= obsBottom) {
            hitObstacle = true;
          }
        });

        if (hitObstacle) {
          setLives((prev) => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameActive(false);
              toast.error("Game Over! Try again!");
            } else {
              toast.error(`Hit obstacle! ${newLives} lives left`, { duration: 1000 });
            }
            return newLives;
          });
          // Reset snake position
          snake.segments[0] = { x: canvas.width / 2, y: canvas.height / 2 };
        } else {
          // Check orb collection
          orbs.forEach((orb, idx) => {
            if (!orb.collected) {
              const orbDx = orb.x - boundedX;
              const orbDy = orb.y - boundedY;
              const orbDist = Math.sqrt(orbDx * orbDx + orbDy * orbDy);

              if (orbDist < 18) {
                orbs[idx].collected = true;
                setOrbsCollected((prev) => {
                  const newCount = prev + 1;
                  toast.success(`Story orb collected! (${newCount}/${targetOrbs})`, { duration: 1000 });
                  if (newCount >= targetOrbs) {
                    setGameActive(false);
                    setTimeout(() => onLevelComplete(story.id), 1000);
                  }
                  return newCount;
                });
                
                // Grow snake
                snake.segments.push({ ...snake.segments[snake.segments.length - 1] });
              }
            }
          });

          // Update snake position
          for (let i = snake.segments.length - 1; i > 0; i--) {
            snake.segments[i] = { ...snake.segments[i - 1] };
          }
          snake.segments[0] = { x: boundedX, y: boundedY };
        }
      }

      // Draw snake
      snake.segments.forEach((segment, idx) => {
        const isHead = idx === 0;
        const size = isHead ? 12 : 10 - idx * 0.3;

        const segmentGradient = ctx.createRadialGradient(segment.x, segment.y, 0, segment.x, segment.y, size);
        segmentGradient.addColorStop(0, "#22c55e");
        segmentGradient.addColorStop(1, "#15803d");

        ctx.fillStyle = segmentGradient;
        ctx.beginPath();
        ctx.arc(segment.x, segment.y, size, 0, Math.PI * 2);
        ctx.fill();

        if (isHead && idx < snake.segments.length - 1) {
          const next = snake.segments[idx + 1];
          const angle = Math.atan2(segment.y - next.y, segment.x - next.x);

          ctx.save();
          ctx.translate(segment.x, segment.y);
          ctx.rotate(angle);

          // Eyes
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

          ctx.restore();
        }
      });

      animationId = requestAnimationFrame(gameLoop);
    };
    gameLoop();

    // Touch/Mouse controls
    const handleInteraction = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      touchPos.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const handleMouseMove = (e: MouseEvent) => handleInteraction(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) handleInteraction(touch.clientX, touch.clientY);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, [snake, orbs, obstacles, gameActive, level, onLevelComplete, story.id]);

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit
          </Button>
          <div className="text-center">
            <div className="text-sm font-semibold text-primary">Level {level}</div>
            <div className="text-xs text-muted-foreground">{story.name}'s Story</div>
          </div>
          <div className="w-16" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-3 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Orbs</div>
                <div className="text-lg font-bold text-foreground">{orbsCollected}/{targetOrbs}</div>
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-destructive/5 border-destructive/20">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-destructive" />
              <div>
                <div className="text-xs text-muted-foreground">Lives</div>
                <div className="text-lg font-bold text-foreground">{"❤️".repeat(lives)}</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-2 mb-3 bg-accent/5 border-accent/20">
          <p className="text-center text-xs text-foreground">
            Move your finger/mouse to guide the snake! Collect {targetOrbs} orbs, avoid obstacles
          </p>
        </Card>

        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border-4 border-primary/30 rounded-2xl bg-background/50 touch-none shadow-xl"
            style={{ maxWidth: "100%" }}
          />
        </div>

        {!gameActive && orbsCollected >= targetOrbs && (
          <Card className="mt-4 p-4 text-center bg-gradient-primary animate-slide-up">
            <h3 className="text-xl font-bold text-background mb-1">
              🎉 Level Complete!
            </h3>
            <p className="text-sm text-background/90">
              Get ready to learn {story.name}'s inspiring story!
            </p>
          </Card>
        )}

        {!gameActive && lives <= 0 && (
          <Card className="mt-4 p-4 text-center bg-destructive/10 border-destructive/20 animate-slide-up">
            <h3 className="text-xl font-bold text-foreground mb-1">
              Game Over!
            </h3>
            <p className="text-sm text-muted-foreground">
              You collected {orbsCollected}/{targetOrbs} orbs. Try again!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
