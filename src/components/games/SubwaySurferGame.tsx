import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Home, Pause, Play, RotateCcw } from "lucide-react";

interface SubwaySurferGameProps {
  onGameOver: (score: number) => void;
  onBack: () => void;
  highScore: number;
}

const LANES = 3;
const LANE_WIDTH = 80;
const PLAYER_SIZE = 40;
const OBSTACLE_SIZE = 50;

export const SubwaySurferGame = ({ onGameOver, onBack, highScore }: SubwaySurferGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  
  const gameState = useRef({
    lane: 1,
    obstacles: [] as { lane: number; y: number; type: string }[],
    coins: [] as { lane: number; y: number }[],
    speed: 5,
    frame: 0,
    score: 0,
    isJumping: false,
    jumpY: 0,
  });

  const touchStart = useRef({ x: 0, y: 0 });

  const resetGame = useCallback(() => {
    gameState.current = {
      lane: 1,
      obstacles: [],
      coins: [],
      speed: 5,
      frame: 0,
      score: 0,
      isJumping: false,
      jumpY: 0,
    };
    setScore(0);
    setGameOver(false);
    setPaused(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      const state = gameState.current;
      if (e.key === "ArrowLeft" && state.lane > 0) state.lane--;
      if (e.key === "ArrowRight" && state.lane < 2) state.lane++;
      if (e.key === "ArrowUp" && !state.isJumping) {
        state.isJumping = true;
        state.jumpY = 0;
      }
      if (e.key === " ") setPaused(p => !p);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (gameOver) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      const state = gameState.current;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30 && state.lane < 2) state.lane++;
        if (dx < -30 && state.lane > 0) state.lane--;
      } else if (dy < -30 && !state.isJumping) {
        state.isJumping = true;
        state.jumpY = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    let animationId: number;
    
    const gameLoop = () => {
      animationId = requestAnimationFrame(gameLoop);
      if (gameOver || paused) return;

      const state = gameState.current;
      state.frame++;
      
      // Increase speed over time
      state.speed = 5 + Math.floor(state.frame / 500);

      // Clear canvas
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road lanes
      const centerX = canvas.width / 2;
      for (let i = 0; i < LANES; i++) {
        const laneX = centerX + (i - 1) * LANE_WIDTH - LANE_WIDTH / 2;
        ctx.fillStyle = i === state.lane ? "#3b3b5c" : "#2a2a4a";
        ctx.fillRect(laneX, 0, LANE_WIDTH - 4, canvas.height);
        
        // Lane markers
        ctx.fillStyle = "#4a4a6a";
        for (let y = (state.frame * state.speed) % 40; y < canvas.height; y += 40) {
          ctx.fillRect(laneX + LANE_WIDTH / 2 - 2, y, 4, 20);
        }
      }

      // Handle jumping
      if (state.isJumping) {
        state.jumpY += 8;
        if (state.jumpY >= 100) {
          state.isJumping = false;
          state.jumpY = 0;
        }
      }
      const jumpOffset = state.isJumping ? Math.sin(state.jumpY * Math.PI / 100) * 60 : 0;

      // Draw player
      const playerX = centerX + (state.lane - 1) * LANE_WIDTH;
      const playerY = canvas.height - 100 - jumpOffset;
      
      // Player shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(playerX, canvas.height - 80, 20, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Player body (cute character)
      const gradient = ctx.createRadialGradient(playerX, playerY, 0, playerX, playerY, PLAYER_SIZE);
      gradient.addColorStop(0, "#ff6b6b");
      gradient.addColorStop(1, "#ee5a5a");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(playerX, playerY, PLAYER_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(playerX - 8, playerY - 5, 8, 0, Math.PI * 2);
      ctx.arc(playerX + 8, playerY - 5, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(playerX - 6, playerY - 5, 4, 0, Math.PI * 2);
      ctx.arc(playerX + 10, playerY - 5, 4, 0, Math.PI * 2);
      ctx.fill();

      // Spawn obstacles
      if (state.frame % 60 === 0) {
        const lane = Math.floor(Math.random() * LANES);
        const types = ["🚗", "🚌", "🚧", "📦"];
        state.obstacles.push({
          lane,
          y: -OBSTACLE_SIZE,
          type: types[Math.floor(Math.random() * types.length)],
        });
      }

      // Spawn coins
      if (state.frame % 30 === 0) {
        state.coins.push({
          lane: Math.floor(Math.random() * LANES),
          y: -30,
        });
      }

      // Update and draw obstacles
      state.obstacles = state.obstacles.filter(obs => {
        obs.y += state.speed;
        
        const obsX = centerX + (obs.lane - 1) * LANE_WIDTH;
        ctx.font = `${OBSTACLE_SIZE}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(obs.type, obsX, obs.y + OBSTACLE_SIZE / 2);

        // Collision detection
        if (
          obs.lane === state.lane &&
          obs.y > playerY - PLAYER_SIZE &&
          obs.y < playerY + PLAYER_SIZE &&
          !state.isJumping
        ) {
          setGameOver(true);
          onGameOver(state.score);
          return false;
        }

        return obs.y < canvas.height + OBSTACLE_SIZE;
      });

      // Update and draw coins
      state.coins = state.coins.filter(coin => {
        coin.y += state.speed * 0.8;
        
        const coinX = centerX + (coin.lane - 1) * LANE_WIDTH;
        
        // Draw coin
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(coinX, coin.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffaa00";
        ctx.beginPath();
        ctx.arc(coinX, coin.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Collect coin
        if (
          coin.lane === state.lane &&
          Math.abs(coin.y - playerY) < PLAYER_SIZE
        ) {
          state.score += 10;
          setScore(state.score);
          return false;
        }

        return coin.y < canvas.height + 30;
      });

      // Update score by distance
      if (state.frame % 10 === 0) {
        state.score++;
        setScore(state.score);
      }

      // Draw score
      ctx.fillStyle = "white";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${state.score}`, 20, 40);
      ctx.fillText(`Best: ${highScore}`, 20, 70);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameOver, paused, highScore, onGameOver]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col items-center p-4">
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white">
          <Home className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-bold text-white">🏃 Street Runner</h2>
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
        <p>⬅️ ➡️ Swipe or Arrow Keys to Move</p>
        <p>⬆️ Swipe Up or Arrow Up to Jump</p>
      </div>
    </div>
  );
};
