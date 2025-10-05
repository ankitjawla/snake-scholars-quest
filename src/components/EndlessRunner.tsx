import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pause, Play, Home } from "lucide-react";
import { toast } from "sonner";
import { educationalTopics } from "@/data/educationalContent";
import { HintCard } from "./HintCard";

type PowerUpId = "length-boost" | "angle-shield" | "fraction-freeze";

interface EndlessRunnerProps {
  onGameOver: (score: number, topicId: number) => void;
  onHome: () => void;
  topicId?: number;
  activePowerUps?: PowerUpId[];
  onPowerUpConsumed?: (powerUpId: PowerUpId) => void;
  onEarnStars?: (stars: number) => void;
  simpleMode: boolean;
  skin?: string;
}

interface GameObject {
  x: number;
  y: number;
  lane: number;
}

const LANES = 3;
const LANE_WIDTH = 120;
const GAME_SPEED = 4;

const skinStyles: Record<string, { primary: string; secondary: string }> = {
  classic: { primary: "#22c55e", secondary: "#15803d" },
  sunburst: { primary: "#f97316", secondary: "#facc15" },
  nebula: { primary: "#a855f7", secondary: "#6366f1" },
  geo: { primary: "#0ea5e9", secondary: "#14b8a6" },
};

export const EndlessRunner = ({
  onGameOver,
  onHome,
  topicId,
  activePowerUps = [],
  onPowerUpConsumed,
  onEarnStars,
  simpleMode,
  skin = "classic",
}: EndlessRunnerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gameActive, setGameActive] = useState(true);
  const [currentHint, setCurrentHint] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [doublePoints, setDoublePoints] = useState(false);
  const [shieldCharges, setShieldCharges] = useState(0);
  const [slowTime, setSlowTime] = useState(false);

  const snakeLane = useRef(1); // 0, 1, or 2
  const snakeY = useRef(0);
  const isJumping = useRef(false);
  const jumpVelocity = useRef(0);

  const insects = useRef<GameObject[]>([]);
  const obstacles = useRef<GameObject[]>([]);
  const roadOffset = useRef(0);
  const distance = useRef(0);
  const lastHintScore = useRef(0);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Generate hints based on selected topic
  const selectedTopic = topicId ? educationalTopics.find(t => t.id === topicId) : null;
  const hints = selectedTopic ? [
    `💡 ${selectedTopic.concept.slice(0, 80)}...`,
    `📚 Fun Fact: ${selectedTopic.funFact.slice(0, 80)}...`,
    `✨ Example: ${selectedTopic.example.slice(0, 80)}...`,
  ] : [
    "💡 Stay in your lane to avoid obstacles!",
    "📚 Collect insects for bonus points!",
    "✨ Jump to avoid rocks on the road!",
  ];

  useEffect(() => {
    if (activePowerUps.includes("length-boost")) {
      setDoublePoints(true);
      const timer = setTimeout(() => setDoublePoints(false), 30000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [activePowerUps]);

  useEffect(() => {
    if (activePowerUps.includes("angle-shield")) {
      setShieldCharges(prev => prev + 1);
    }
  }, [activePowerUps]);

  useEffect(() => {
    if (activePowerUps.includes("fraction-freeze")) {
      setSlowTime(true);
      const timer = setTimeout(() => setSlowTime(false), 10000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [activePowerUps]);

  useEffect(() => {
    activePowerUps.forEach(power => onPowerUpConsumed?.(power));
  }, [activePowerUps, onPowerUpConsumed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = Math.min(container.clientWidth - 32, 400);
        canvas.height = Math.min(window.innerHeight * 0.65, 600);
      }
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const centerX = canvas.width / 2;
    const groundY = canvas.height - 80;

    const spawnInsect = () => {
      const lane = Math.floor(Math.random() * LANES);
      insects.current.push({
        x: centerX + (lane - 1) * LANE_WIDTH,
        y: -50,
        lane,
      });
    };

    const spawnObstacle = () => {
      const lane = Math.floor(Math.random() * LANES);
      obstacles.current.push({
        x: centerX + (lane - 1) * LANE_WIDTH,
        y: -50,
        lane,
      });
    };

    for (let i = 0; i < 3; i++) {
      setTimeout(spawnInsect, i * 1000);
    }
    setTimeout(spawnObstacle, 2000);

    let lastSpawnInsect = Date.now();
    let lastSpawnObstacle = Date.now();
    let animationId: number;

    const gameLoop = () => {
      if (!gameActive || paused) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentSpeed = slowTime ? GAME_SPEED * 0.5 : GAME_SPEED;

      roadOffset.current += currentSpeed;
      if (roadOffset.current > 40) roadOffset.current = 0;

      const roadGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      roadGradient.addColorStop(0, "#1e293b");
      roadGradient.addColorStop(1, "#0f172a");
      ctx.fillStyle = roadGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 20]);
      for (let i = 0; i < LANES - 1; i++) {
        const x = centerX + (i - 0.5) * LANE_WIDTH;
        ctx.beginPath();
        ctx.moveTo(x, -roadOffset.current);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();

      distance.current += currentSpeed * 0.1;

      if (isJumping.current) {
        snakeY.current += jumpVelocity.current;
        jumpVelocity.current += 0.8;

        if (snakeY.current >= 0) {
          snakeY.current = 0;
          isJumping.current = false;
          jumpVelocity.current = 0;
        }
      }

      const snakeX = centerX + (snakeLane.current - 1) * LANE_WIDTH;
      const snakeDrawY = groundY - 40 + snakeY.current;
      const palette = skinStyles[skin] || skinStyles.classic;

      for (let i = 3; i >= 0; i--) {
        const segmentY = snakeDrawY + i * 8;
        const size = 12 - i * 1;

        const gradient = ctx.createRadialGradient(snakeX, segmentY, 0, snakeX, segmentY, size);
        gradient.addColorStop(0, palette.primary);
        gradient.addColorStop(1, palette.secondary);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(snakeX, segmentY, size, 0, Math.PI * 2);
        ctx.fill();

        if (i === 0) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(snakeX - 4, segmentY - 3, 3, 0, Math.PI * 2);
          ctx.arc(snakeX + 4, segmentY - 3, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(snakeX - 4, segmentY - 3, 1.5, 0, Math.PI * 2);
          ctx.arc(snakeX + 4, segmentY - 3, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      insects.current = insects.current.filter((insect) => {
        insect.y += currentSpeed;

        if (insect.y > canvas.height) return false;

        ctx.save();
        ctx.translate(insect.x, insect.y);
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
        ctx.beginPath();
        ctx.ellipse(-5, 0, 6, 3, -Math.PI / 4, 0, Math.PI * 2);
        ctx.ellipse(5, 0, 6, 3, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (
          insect.lane === snakeLane.current &&
          insect.y > groundY - 60 &&
          insect.y < groundY - 20 &&
          !isJumping.current
        ) {
          setScore((prev) => {
            const earned = doublePoints ? 20 : 10;
            const newScore = prev + earned;
            if (newScore % 100 === 0) {
              toast.success(`🎉 ${newScore} points!`, { duration: 1000 });
            }
            if (newScore - lastHintScore.current >= 50 && hints.length > 0) {
              const randomHint = hints[Math.floor(Math.random() * hints.length)];
              setCurrentHint(randomHint);
              setShowHint(true);
              lastHintScore.current = newScore;
              setTimeout(() => setShowHint(false), 4000);
            }
            if (onEarnStars && newScore % 120 === 0) {
              onEarnStars(doublePoints ? 6 : 3);
            }
            return newScore;
          });
          return false;
        }

        return true;
      });

      obstacles.current = obstacles.current.filter((obs) => {
        obs.y += currentSpeed;

        if (obs.y > canvas.height) return false;

        ctx.save();
        ctx.translate(obs.x, obs.y);
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(15, 10);
        ctx.lineTo(-15, 10);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#475569";
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(12, 5);
        ctx.lineTo(0, 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        if (
          obs.lane === snakeLane.current &&
          obs.y > groundY - 60 &&
          obs.y < groundY - 20 &&
          !isJumping.current
        ) {
          if (shieldCharges > 0) {
            setShieldCharges(shieldCharges - 1);
            toast.success("🛡️ Angle Shield saved you!", { duration: 1200 });
            return false;
          }
          setGameActive(false);
          toast.error("Game Over! Hit an obstacle!");
          const nextTopicId = Math.floor(distance.current / 100) % educationalTopics.length + 1;
          setTimeout(() => onGameOver(score, nextTopicId), 1000);
        }

        return true;
      });

      const now = Date.now();
      if (now - lastSpawnInsect > (slowTime ? 2000 : 1500)) {
        spawnInsect();
        lastSpawnInsect = now;
      }
      if (now - lastSpawnObstacle > (slowTime ? 3000 : 2500)) {
        spawnObstacle();
        lastSpawnObstacle = now;
      }

      animationId = requestAnimationFrame(gameLoop);
    };
    gameLoop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && snakeLane.current > 0) {
        snakeLane.current--;
        toast("◀️", { duration: 300 });
      } else if (e.key === "ArrowRight" && snakeLane.current < LANES - 1) {
        snakeLane.current++;
        toast("▶️", { duration: 300 });
      } else if (e.key === "ArrowUp" && !isJumping.current) {
        isJumping.current = true;
        jumpVelocity.current = -15;
        toast("⬆️ Jump!", { duration: 300 });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 30 && snakeLane.current < LANES - 1) {
          snakeLane.current++;
          toast("▶️", { duration: 300 });
        } else if (deltaX < -30 && snakeLane.current > 0) {
          snakeLane.current--;
          toast("◀️", { duration: 300 });
        }
      } else if (deltaY < -30 && !isJumping.current) {
        isJumping.current = true;
        jumpVelocity.current = -15;
        toast("⬆️ Jump!", { duration: 300 });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationId);
    };
  }, [gameActive, paused, slowTime, shieldCharges, doublePoints, hints, onGameOver, onEarnStars, score]);

  return (
    <div className="min-h-screen bg-background py-4 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onHome}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Card className="px-4 py-2 bg-primary/10 border-primary/20">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Score</div>
              <div className="text-2xl font-bold text-foreground">{score}</div>
            </div>
          </Card>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
        </div>

        <Card className="p-2 mb-3 bg-accent/5 border-accent/20">
          <p className="text-center text-xs text-foreground">
            {simpleMode
              ? "Swipe to move • Swipe up to jump • Bugs = points"
              : "⬅️ ➡️ Swipe to change lanes • ⬆️ Swipe up to jump • 🐛 Collect insects • 🪨 Avoid rocks"}
          </p>
        </Card>

        <div className="flex gap-2 mb-2 text-xs">
          {doublePoints && <span className="px-2 py-1 rounded-full bg-amber-200 text-amber-800">📏 Length Boost active</span>}
          {shieldCharges > 0 && <span className="px-2 py-1 rounded-full bg-sky-200 text-sky-900">🛡️ Shield x{shieldCharges}</span>}
          {slowTime && <span className="px-2 py-1 rounded-full bg-indigo-200 text-indigo-900">❄️ Fraction Freeze</span>}
        </div>

        <div className="flex justify-center relative">
          <HintCard hint={currentHint} visible={showHint} />
          <canvas
            ref={canvasRef}
            className="border-4 border-primary/30 rounded-2xl bg-slate-900 touch-none shadow-xl"
            style={{ maxWidth: "100%" }}
          />
        </div>

        {paused && (
          <Card className="mt-4 p-6 text-center bg-primary/10 border-primary/20 animate-slide-up">
            <h3 className="text-2xl font-bold text-foreground mb-2">⏸️ {simpleMode ? "Break time" : "Paused"}</h3>
            <p className="text-muted-foreground mb-4">{simpleMode ? "Tap play to keep running" : "Take a breather!"}</p>
            <Button onClick={() => setPaused(false)}>
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
          </Card>
        )}

        <div className="mt-4 text-center text-xs text-muted-foreground">
          {simpleMode ? "Run" : "Distance"}: {Math.floor(distance.current)}m
        </div>
      </div>
    </div>
  );
};
