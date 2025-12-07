import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Home, Pause, Play, RotateCcw } from "lucide-react";

interface MarioJumpGameProps {
  onGameOver: (score: number) => void;
  onBack: () => void;
  highScore: number;
}

const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const PLAYER_SIZE = 30;

export const MarioJumpGame = ({ onGameOver, onBack, highScore }: MarioJumpGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const gameState = useRef({
    playerX: 150,
    playerY: 200,
    velocityY: 0,
    platforms: [] as { x: number; y: number; width: number; type: string }[],
    coins: [] as { x: number; y: number; collected: boolean }[],
    cameraY: 0,
    score: 0,
    maxHeight: 0,
    frame: 0,
  });

  const resetGame = useCallback(() => {
    const platforms: { x: number; y: number; width: number; type: string }[] = [];
    // Starting platform
    platforms.push({ x: 100, y: 350, width: 100, type: "normal" });
    
    // Generate initial platforms
    for (let i = 1; i < 20; i++) {
      platforms.push({
        x: Math.random() * 220 + 20,
        y: 350 - i * 60,
        width: 60 + Math.random() * 40,
        type: Math.random() > 0.8 ? "spring" : "normal",
      });
    }

    gameState.current = {
      playerX: 150,
      playerY: 300,
      velocityY: 0,
      platforms,
      coins: [],
      cameraY: 0,
      score: 0,
      maxHeight: 0,
      frame: 0,
    };
    setScore(0);
    setGameOver(false);
    setPaused(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      const state = gameState.current;
      if (e.key === "ArrowLeft") state.playerX -= 20;
      if (e.key === "ArrowRight") state.playerX += 20;
      if (e.key === " ") setPaused(p => !p);
      
      // Wrap around screen
      if (state.playerX < 0) state.playerX = canvas.width;
      if (state.playerX > canvas.width) state.playerX = 0;
    };

    const handleTouch = (e: TouchEvent) => {
      if (gameOver) return;
      const state = gameState.current;
      const touchX = e.touches[0].clientX;
      const rect = canvas.getBoundingClientRect();
      const canvasX = touchX - rect.left;
      
      if (canvasX < canvas.width / 2) {
        state.playerX -= 25;
      } else {
        state.playerX += 25;
      }
      
      if (state.playerX < 0) state.playerX = canvas.width;
      if (state.playerX > canvas.width) state.playerX = 0;
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("touchstart", handleTouch);

    let animationId: number;

    const gameLoop = () => {
      animationId = requestAnimationFrame(gameLoop);
      if (gameOver || paused) return;

      const state = gameState.current;
      state.frame++;

      // Apply gravity
      state.velocityY += GRAVITY;
      state.playerY += state.velocityY;

      // Update camera
      if (state.playerY < 200) {
        const diff = 200 - state.playerY;
        state.cameraY += diff;
        state.playerY = 200;
        
        // Move platforms down
        state.platforms.forEach(p => p.y += diff);
        state.coins.forEach(c => c.y += diff);
      }

      // Update score based on height
      const currentHeight = Math.floor(state.cameraY / 10);
      if (currentHeight > state.maxHeight) {
        state.maxHeight = currentHeight;
        state.score = state.maxHeight;
        setScore(state.score);
      }

      // Check platform collisions
      if (state.velocityY > 0) {
        state.platforms.forEach(platform => {
          if (
            state.playerY + PLAYER_SIZE > platform.y &&
            state.playerY + PLAYER_SIZE < platform.y + 20 &&
            state.playerX > platform.x - PLAYER_SIZE / 2 &&
            state.playerX < platform.x + platform.width + PLAYER_SIZE / 2
          ) {
            state.velocityY = platform.type === "spring" ? JUMP_FORCE * 1.5 : JUMP_FORCE;
            state.playerY = platform.y - PLAYER_SIZE;
          }
        });
      }

      // Generate new platforms
      while (state.platforms[state.platforms.length - 1].y > -100) {
        const lastPlatform = state.platforms[state.platforms.length - 1];
        state.platforms.push({
          x: Math.random() * 220 + 20,
          y: lastPlatform.y - (50 + Math.random() * 30),
          width: 50 + Math.random() * 40,
          type: Math.random() > 0.85 ? "spring" : "normal",
        });

        // Add coin on some platforms
        if (Math.random() > 0.6) {
          state.coins.push({
            x: state.platforms[state.platforms.length - 1].x + 25,
            y: state.platforms[state.platforms.length - 1].y - 30,
            collected: false,
          });
        }
      }

      // Remove old platforms
      state.platforms = state.platforms.filter(p => p.y < canvas.height + 50);
      state.coins = state.coins.filter(c => c.y < canvas.height + 50 && !c.collected);

      // Game over if player falls
      if (state.playerY > canvas.height) {
        setGameOver(true);
        onGameOver(state.score);
        return;
      }

      // Draw background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#E0F6FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw clouds
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      for (let i = 0; i < 5; i++) {
        const cloudY = ((state.cameraY * 0.1 + i * 120) % (canvas.height + 100)) - 50;
        ctx.beginPath();
        ctx.arc(50 + i * 60, cloudY, 25, 0, Math.PI * 2);
        ctx.arc(75 + i * 60, cloudY - 10, 20, 0, Math.PI * 2);
        ctx.arc(90 + i * 60, cloudY, 25, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw platforms
      state.platforms.forEach(platform => {
        if (platform.type === "spring") {
          ctx.fillStyle = "#FF6B6B";
        } else {
          ctx.fillStyle = "#8B4513";
        }
        ctx.fillRect(platform.x, platform.y, platform.width, 15);
        
        // Grass on top
        ctx.fillStyle = "#228B22";
        ctx.fillRect(platform.x, platform.y, platform.width, 5);
      });

      // Draw coins
      state.coins.forEach(coin => {
        if (coin.collected) return;

        // Collect coin
        const dx = state.playerX - coin.x;
        const dy = state.playerY - coin.y;
        if (Math.sqrt(dx * dx + dy * dy) < 25) {
          coin.collected = true;
          state.score += 50;
          setScore(state.score);
          return;
        }

        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFA500";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw player
      // Body
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(state.playerX - 12, state.playerY - 10, 24, 20);
      
      // Head
      ctx.fillStyle = "#FFE4B5";
      ctx.beginPath();
      ctx.arc(state.playerX, state.playerY - 20, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Hat
      ctx.fillStyle = "#FF0000";
      ctx.beginPath();
      ctx.arc(state.playerX, state.playerY - 28, 10, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(state.playerX - 14, state.playerY - 28, 28, 5);
      
      // Eyes
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(state.playerX - 4, state.playerY - 22, 2, 0, Math.PI * 2);
      ctx.arc(state.playerX + 4, state.playerY - 22, 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw score
      ctx.fillStyle = "#333";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Height: ${state.score}m`, 20, 40);
      ctx.fillText(`Best: ${highScore}m`, 20, 70);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("touchstart", handleTouch);
    };
  }, [gameOver, paused, highScore, onGameOver, resetGame]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 flex flex-col items-center p-4">
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-sky-900">
          <Home className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-bold text-sky-900">🦘 Super Jump</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setPaused(p => !p)}
          className="text-sky-900"
        >
          {paused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </Button>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={500}
          className="rounded-2xl shadow-2xl border-4 border-white/50"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold text-white mb-2">Game Over!</h3>
            <p className="text-xl text-yellow-400 mb-4">Height: {score}m</p>
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

      <div className="mt-4 text-sky-800 text-center text-sm">
        <p>⬅️ ➡️ Tap sides or Arrow Keys to Move</p>
        <p>🔴 Red platforms = Super Jump!</p>
      </div>
    </div>
  );
};
