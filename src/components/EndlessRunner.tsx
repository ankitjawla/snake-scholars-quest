import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pause, Play, Home } from "lucide-react";
import { toast } from "sonner";
import { educationalTopics } from "@/data/educationalContent";
import { HintCard } from "./HintCard";
import type { PowerUpId } from "@/types/powerUps";

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

interface Insect extends GameObject {
  type: "normal" | "firefly" | "knowledge";
}

interface Obstacle extends GameObject {
  wobble: number;
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
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  const snakeLane = useRef(1); // 0, 1, or 2
  const snakeY = useRef(0);
  const isJumping = useRef(false);
  const jumpVelocity = useRef(0);

  const insects = useRef<Insect[]>([]);
  const obstacles = useRef<Obstacle[]>([]);
  const roadOffset = useRef(0);
  const distance = useRef(0);
  const lastHintScore = useRef(0);
  const comboRef = useRef(0);
  const bestComboRef = useRef(0);
  const lastCatchTime = useRef<number | null>(null);
  const starField = useRef<{ x: number; y: number; size: number; speed: number }[]>([]);
  const scoreRef = useRef(0);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Generate hints based on selected topic
  const selectedTopic = topicId ? educationalTopics.find(t => t.id === topicId) : null;
  const hints = useMemo(() => {
    if (selectedTopic) {
      return [
        `💡 ${selectedTopic.concept.slice(0, 80)}...`,
        `📚 Fun Fact: ${selectedTopic.funFact.slice(0, 80)}...`,
        `✨ Example: ${selectedTopic.example.slice(0, 80)}...`,
      ];
    }
    return [
      "💡 Stay in your lane to avoid obstacles!",
      "📚 Collect insects for bonus points!",
      "✨ Jump to avoid rocks on the road!",
    ];
  }, [selectedTopic]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    if (!gameActive) {
      comboRef.current = 0;
      setCombo(0);
    }
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    const timer = window.setInterval(() => {
      if (paused) return;
      if (comboRef.current > 0 && lastCatchTime.current && performance.now() - lastCatchTime.current > 3000) {
        comboRef.current = 0;
        setCombo(0);
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [gameActive, paused]);

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
      if (starField.current.length > 0) {
        starField.current.forEach((star) => {
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        });
      }
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    if (starField.current.length === 0) {
      for (let i = 0; i < 40; i++) {
        starField.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.6 + 0.4,
          speed: Math.random() * 0.6 + 0.2,
        });
      }
    }

    const spawnInsect = () => {
      const lane = Math.floor(Math.random() * LANES);
      const centerX = canvas.width / 2;
      const spawnTypeRoll = Math.random();
      let type: Insect["type"] = "normal";
      if (spawnTypeRoll > 0.85) {
        type = "knowledge";
      } else if (spawnTypeRoll > 0.6) {
        type = "firefly";
      }
      insects.current.push({
        x: centerX + (lane - 1) * LANE_WIDTH,
        y: -50,
        lane,
        type,
      });
    };

    const spawnObstacle = () => {
      const lane = Math.floor(Math.random() * LANES);
      const centerX = canvas.width / 2;
      obstacles.current.push({
        x: centerX + (lane - 1) * LANE_WIDTH,
        y: -50,
        lane,
        wobble: Math.random() * 0.4 + 0.2,
      });
    };

    for (let i = 0; i < 3; i++) {
      window.setTimeout(spawnInsect, i * 800);
    }
    window.setTimeout(spawnObstacle, 1800);

    let lastSpawnInsect = performance.now();
    let lastSpawnObstacle = performance.now();
    let animationId: number;

    const gameLoop = () => {
      animationId = requestAnimationFrame(gameLoop);
      if (!gameActive || paused) {
        return;
      }

      const now = performance.now();
      const centerX = canvas.width / 2;
      const groundY = canvas.height - 80;
      const difficulty = 1 + Math.min(distance.current / 600, 1.5);
      const baseSpeed = GAME_SPEED * difficulty;
      const currentSpeed = slowTime ? baseSpeed * 0.6 : baseSpeed;
      const roadWidth = LANE_WIDTH * LANES + 80;
      const roadLeft = centerX - roadWidth / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      roadOffset.current += currentSpeed * 0.6;
      if (roadOffset.current > 40) roadOffset.current = 0;

      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, "#0f172a");
      skyGradient.addColorStop(1, "#020617");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starField.current.forEach((star) => {
        star.y += currentSpeed * 0.15 * star.speed;
        if (star.y > canvas.height) {
          star.y = -5;
          star.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.save();
      ctx.beginPath();
      ctx.rect(roadLeft, 0, roadWidth, canvas.height);
      ctx.clip();

      const roadGradient = ctx.createLinearGradient(roadLeft, 0, roadLeft, canvas.height);
      roadGradient.addColorStop(0, "#1f2937");
      roadGradient.addColorStop(1, "#0f172a");
      ctx.fillStyle = roadGradient;
      ctx.fillRect(roadLeft, 0, roadWidth, canvas.height);

      for (let laneIndex = 0; laneIndex < LANES; laneIndex++) {
        const laneCenter = centerX + (laneIndex - 1) * LANE_WIDTH;
        const laneLeft = laneCenter - LANE_WIDTH / 2;
        ctx.fillStyle =
          laneIndex === snakeLane.current ? "rgba(56, 189, 248, 0.14)" : "rgba(148, 163, 184, 0.08)";
        ctx.fillRect(laneLeft, 0, LANE_WIDTH, canvas.height);
      }

      ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
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
      ctx.restore();

      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(roadLeft, groundY);
      ctx.lineTo(roadLeft + roadWidth, groundY);
      ctx.stroke();

      distance.current += currentSpeed * 0.12;

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

      ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
      ctx.beginPath();
      ctx.ellipse(snakeX, groundY - 6, 24, 6, 0, 0, Math.PI * 2);
      ctx.fill();

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

      const timeFactor = now / 240;

      insects.current = insects.current.filter((insect) => {
        const speedFactor = insect.type === "firefly" ? 1.15 : insect.type === "knowledge" ? 0.9 : 1;
        insect.y += currentSpeed * speedFactor;

        if (insect.y > canvas.height + 20) {
          if (comboRef.current > 0) {
            comboRef.current = 0;
            setCombo(0);
          }
          return false;
        }

        const bob = Math.sin(timeFactor + insect.y / 45) * 3;
        ctx.save();
        ctx.translate(insect.x + bob, insect.y);

        if (insect.type === "firefly") {
          const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 14);
          glow.addColorStop(0, "rgba(250, 204, 21, 0.9)");
          glow.addColorStop(1, "rgba(250, 204, 21, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#facc15";
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (insect.type === "knowledge") {
          ctx.fillStyle = "#0ea5e9";
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#e0f2fe";
          ctx.fillRect(-6, -4, 12, 8);
          ctx.strokeStyle = "#0284c7";
          ctx.lineWidth = 1;
          ctx.strokeRect(-6, -4, 12, 8);
          ctx.beginPath();
          ctx.moveTo(-3, -1);
          ctx.lineTo(0, 1);
          ctx.lineTo(3, -1);
          ctx.stroke();
        } else {
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
          ctx.beginPath();
          ctx.ellipse(-5, 0, 6, 3, -Math.PI / 4, 0, Math.PI * 2);
          ctx.ellipse(5, 0, 6, 3, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        if (
          insect.lane === snakeLane.current &&
          insect.y > groundY - 60 &&
          insect.y < groundY - 20 &&
          !isJumping.current
        ) {
          const nextCombo =
            lastCatchTime.current && now - lastCatchTime.current < 2500
              ? comboRef.current + 1
              : 1;

          comboRef.current = nextCombo;
          setCombo(nextCombo);
          lastCatchTime.current = now;

          if (nextCombo > bestComboRef.current) {
            bestComboRef.current = nextCombo;
            setBestCombo(nextCombo);
            toast.success(`🏆 Combo x${nextCombo}!`, { duration: 900 });
          } else if (nextCombo > 1 && insect.type !== "knowledge") {
            toast(`🔥 Combo x${nextCombo}`, { duration: 600 });
          }

          const basePoints = insect.type === "firefly" ? 20 : insect.type === "knowledge" ? 15 : 10;
          const comboBonus = nextCombo > 1 ? nextCombo * 2 : 0;
          const earned = (basePoints + comboBonus) * (doublePoints ? 2 : 1);
          const projectedScore = scoreRef.current + earned;

          setScore((prev) => {
            const newScore = prev + earned;
            if (newScore % 100 === 0) {
              toast.success(`🎉 ${newScore} points!`, { duration: 1000 });
            }
            if (newScore - lastHintScore.current >= 50 && hints.length > 0 && insect.type !== "knowledge") {
              const randomHint = hints[Math.floor(Math.random() * hints.length)];
              setCurrentHint(randomHint);
              setShowHint(true);
              lastHintScore.current = newScore;
              window.setTimeout(() => setShowHint(false), 4000);
            }
            if (onEarnStars && newScore % 120 === 0) {
              onEarnStars(doublePoints ? 6 : 3);
            }
            return newScore;
          });

          if (insect.type === "knowledge") {
            if (hints.length > 0) {
              const randomHint = hints[Math.floor(Math.random() * hints.length)];
              setCurrentHint(`🧠 ${randomHint}`);
              setShowHint(true);
              lastHintScore.current = projectedScore;
              window.setTimeout(() => setShowHint(false), 5000);
            }
            onEarnStars?.(2);
            toast.info("🧠 Knowledge orb unlocked a hint!", { duration: 1200 });
          } else if (insect.type === "firefly") {
            onEarnStars?.(1);
          }

          return false;
        }

        return true;
      });

      obstacles.current = obstacles.current.filter((obs) => {
        obs.y += currentSpeed * 1.05;

        if (obs.y > canvas.height + 30) return false;

        const sway = Math.sin(timeFactor * obs.wobble + obs.y / 60) * 5;

        ctx.save();
        ctx.translate(obs.x + sway, obs.y);
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.lineTo(18, 12);
        ctx.lineTo(-18, 12);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#475569";
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.lineTo(14, 6);
        ctx.lineTo(0, 10);
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
            setShieldCharges((prev) => prev - 1);
            toast.success("🛡️ Angle Shield saved you!", { duration: 1200 });
            return false;
          }
          comboRef.current = 0;
          setCombo(0);
          setGameActive(false);
          toast.error("Game Over! Hit an obstacle!");
          const nextTopicId = Math.floor(distance.current / 100) % educationalTopics.length + 1;
          setTimeout(() => onGameOver(scoreRef.current, nextTopicId), 1000);
        }

        return true;
      });

      const insectInterval = slowTime ? 2000 : Math.max(900, 1700 / difficulty);
      const obstacleInterval = slowTime ? 3200 : Math.max(1500, 2600 / difficulty);

      if (now - lastSpawnInsect > insectInterval) {
        spawnInsect();
        lastSpawnInsect = now;
      }
      if (now - lastSpawnObstacle > obstacleInterval) {
        spawnObstacle();
        lastSpawnObstacle = now;
      }
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
  }, [gameActive, paused, slowTime, shieldCharges, doublePoints, hints, onGameOver, onEarnStars, skin]);

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
              ? "Swipe to move • Swipe up to jump • Catch bugs quickly for combos"
              : "⬅️ ➡️ Swipe to change lanes • ⬆️ Swipe up to jump • 🐛 Chain catches for combo multipliers • 🪨 Avoid rocks"}
          </p>
        </Card>

        <div className="flex gap-2 mb-2 text-xs">
          {doublePoints && <span className="px-2 py-1 rounded-full bg-amber-200 text-amber-800">📏 Length Boost active</span>}
          {shieldCharges > 0 && <span className="px-2 py-1 rounded-full bg-sky-200 text-sky-900">🛡️ Shield x{shieldCharges}</span>}
          {slowTime && <span className="px-2 py-1 rounded-full bg-indigo-200 text-indigo-900">❄️ Fraction Freeze</span>}
          {combo > 1 && <span className="px-2 py-1 rounded-full bg-rose-200 text-rose-900">🔥 Combo x{combo}</span>}
          {bestCombo > 1 && <span className="px-2 py-1 rounded-full bg-emerald-200 text-emerald-900">🏆 Best x{bestCombo}</span>}
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
