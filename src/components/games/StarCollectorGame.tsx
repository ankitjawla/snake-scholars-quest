import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Home, Pause, Play, RotateCcw } from "lucide-react";

interface StarCollectorGameProps {
  onGameOver: (score: number) => void;
  onBack: () => void;
  highScore: number;
}

const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 20;

export const StarCollectorGame = ({ onGameOver, onBack, highScore }: StarCollectorGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const gameState = useRef({
    playerX: 150,
    stars: [] as { x: number; y: number; size: number; speed: number; type: string }[],
    bombs: [] as { x: number; y: number; speed: number }[],
    score: 0,
    lives: 3,
    frame: 0,
    level: 1,
  });

  const resetGame = useCallback(() => {
    gameState.current = {
      playerX: 150,
      stars: [],
      bombs: [],
      score: 0,
      lives: 3,
      frame: 0,
      level: 1,
    };
    setScore(0);
    setLives(3);
    setGameOver(false);
    setPaused(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let targetX = gameState.current.playerX;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === "ArrowLeft") targetX -= 30;
      if (e.key === "ArrowRight") targetX += 30;
      if (e.key === " ") setPaused(p => !p);
      
      targetX = Math.max(PLAYER_WIDTH / 2, Math.min(canvas.width - PLAYER_WIDTH / 2, targetX));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (gameOver || paused) return;
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetX = Math.max(PLAYER_WIDTH / 2, Math.min(canvas.width - PLAYER_WIDTH / 2, targetX));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gameOver || paused) return;
      const rect = canvas.getBoundingClientRect();
      targetX = e.touches[0].clientX - rect.left;
      targetX = Math.max(PLAYER_WIDTH / 2, Math.min(canvas.width - PLAYER_WIDTH / 2, targetX));
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove);

    let animationId: number;

    const gameLoop = () => {
      animationId = requestAnimationFrame(gameLoop);
      if (gameOver || paused) return;

      const state = gameState.current;
      state.frame++;

      // Smooth player movement
      state.playerX += (targetX - state.playerX) * 0.15;

      // Level progression
      state.level = 1 + Math.floor(state.score / 200);

      // Spawn stars
      if (state.frame % Math.max(20, 40 - state.level * 3) === 0) {
        const types = ["normal", "normal", "normal", "gold", "rainbow"];
        state.stars.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: -20,
          size: 15 + Math.random() * 10,
          speed: 2 + Math.random() * 2 + state.level * 0.3,
          type: types[Math.floor(Math.random() * types.length)],
        });
      }

      // Spawn bombs (danger!)
      if (state.frame % Math.max(60, 120 - state.level * 10) === 0) {
        state.bombs.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: -20,
          speed: 3 + state.level * 0.5,
        });
      }

      // Draw background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0f0c29");
      gradient.addColorStop(0.5, "#302b63");
      gradient.addColorStop(1, "#24243e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background stars
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      for (let i = 0; i < 50; i++) {
        const x = (i * 73 + state.frame * 0.1) % canvas.width;
        const y = (i * 47 + state.frame * 0.2) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw stars
      state.stars = state.stars.filter(star => {
        star.y += star.speed;

        // Check collision with player
        if (
          star.y > canvas.height - 50 &&
          star.y < canvas.height - 20 &&
          Math.abs(star.x - state.playerX) < PLAYER_WIDTH / 2 + star.size / 2
        ) {
          const points = star.type === "rainbow" ? 50 : star.type === "gold" ? 25 : 10;
          state.score += points;
          setScore(state.score);
          return false;
        }

        if (star.y > canvas.height) return false;

        // Draw star
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(state.frame * 0.05);

        if (star.type === "rainbow") {
          const rainbow = ctx.createLinearGradient(-star.size, 0, star.size, 0);
          rainbow.addColorStop(0, "#ff0000");
          rainbow.addColorStop(0.2, "#ff7f00");
          rainbow.addColorStop(0.4, "#ffff00");
          rainbow.addColorStop(0.6, "#00ff00");
          rainbow.addColorStop(0.8, "#0000ff");
          rainbow.addColorStop(1, "#8b00ff");
          ctx.fillStyle = rainbow;
        } else if (star.type === "gold") {
          ctx.fillStyle = "#FFD700";
        } else {
          ctx.fillStyle = "#FFEB3B";
        }

        // Draw star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const x = Math.cos(angle) * star.size;
          const y = Math.sin(angle) * star.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        return true;
      });

      // Update and draw bombs
      state.bombs = state.bombs.filter(bomb => {
        bomb.y += bomb.speed;

        // Check collision with player
        if (
          bomb.y > canvas.height - 50 &&
          bomb.y < canvas.height - 20 &&
          Math.abs(bomb.x - state.playerX) < PLAYER_WIDTH / 2 + 15
        ) {
          state.lives--;
          setLives(state.lives);
          if (state.lives <= 0) {
            setGameOver(true);
            onGameOver(state.score);
          }
          return false;
        }

        if (bomb.y > canvas.height) return false;

        // Draw bomb
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.arc(bomb.x, bomb.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Fuse
        ctx.strokeStyle = "#8B4513";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bomb.x, bomb.y - 15);
        ctx.quadraticCurveTo(bomb.x + 10, bomb.y - 25, bomb.x + 5, bomb.y - 30);
        ctx.stroke();

        // Spark
        if (state.frame % 10 < 5) {
          ctx.fillStyle = "#FF4500";
          ctx.beginPath();
          ctx.arc(bomb.x + 5, bomb.y - 32, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Skull
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("💀", bomb.x, bomb.y + 5);

        return true;
      });

      // Draw player (basket)
      const basketGradient = ctx.createLinearGradient(
        state.playerX - PLAYER_WIDTH / 2,
        canvas.height - 40,
        state.playerX + PLAYER_WIDTH / 2,
        canvas.height - 20
      );
      basketGradient.addColorStop(0, "#8B4513");
      basketGradient.addColorStop(0.5, "#D2691E");
      basketGradient.addColorStop(1, "#8B4513");
      
      ctx.fillStyle = basketGradient;
      ctx.beginPath();
      ctx.moveTo(state.playerX - PLAYER_WIDTH / 2, canvas.height - 40);
      ctx.lineTo(state.playerX - PLAYER_WIDTH / 2 + 10, canvas.height - 20);
      ctx.lineTo(state.playerX + PLAYER_WIDTH / 2 - 10, canvas.height - 20);
      ctx.lineTo(state.playerX + PLAYER_WIDTH / 2, canvas.height - 40);
      ctx.closePath();
      ctx.fill();
      
      // Basket pattern
      ctx.strokeStyle = "#654321";
      ctx.lineWidth = 2;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(state.playerX + i * 10, canvas.height - 38);
        ctx.lineTo(state.playerX + i * 8, canvas.height - 22);
        ctx.stroke();
      }

      // Draw UI
      ctx.fillStyle = "white";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`⭐ ${state.score}`, 20, 40);
      ctx.fillText(`Best: ${highScore}`, 20, 70);
      
      // Lives
      ctx.textAlign = "right";
      ctx.fillText("❤️".repeat(state.lives), canvas.width - 20, 40);
      
      // Level
      ctx.textAlign = "center";
      ctx.fillText(`Level ${state.level}`, canvas.width / 2, 40);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gameOver, paused, highScore, onGameOver]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col items-center p-4">
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white">
          <Home className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-bold text-white">⭐ Star Collector</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setPaused(p => !p)}
          className="text-white"
        >
          {paused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </Button>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={500}
          className="rounded-2xl shadow-2xl border-4 border-white/20"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold text-white mb-2">Game Over!</h3>
            <p className="text-xl text-yellow-400 mb-4">Score: {score}</p>
            {score > highScore && (
              <p className="text-lg text-green-400 mb-4">🎉 New High Score!</p>
            )}
            <div className="flex gap-4">
              <Button onClick={resetGame} className="bg-green-500 hover:bg-green-600">
                <RotateCcw className="w-4 h-4 mr-2" /> Play Again
              </Button>
              <Button variant="outline" onClick={onBack}>
                <Home className="w-4 h-4 mr-2" /> Home
              </Button>
            </div>
          </div>
        )}

        {paused && !gameOver && (
          <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-4">Paused</p>
              <Button onClick={() => setPaused(false)} className="bg-blue-500">
                <Play className="w-4 h-4 mr-2" /> Resume
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-white/70 text-center text-sm">
        <p>🖱️ Move mouse or touch to catch stars</p>
        <p>⬅️ ➡️ Arrow Keys also work</p>
        <p>💀 Avoid the bombs!</p>
      </div>
    </div>
  );
};
