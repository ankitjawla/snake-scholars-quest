import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Home, Pause, Play, RotateCcw } from "lucide-react";

interface MarioJumpGameProps {
  onGameOver: (score: number) => void;
  onBack: () => void;
  highScore: number;
}

const GRAVITY = 0.5;
const JUMP_FORCE = -13;
const PLAYER_SIZE = 30;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export const MarioJumpGame = ({ onGameOver, onBack, highScore }: MarioJumpGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const gameState = useRef({
    playerX: 150,
    playerY: 200,
    velocityY: 0,
    velocityX: 0,
    platforms: [] as { x: number; y: number; width: number; type: string; moving?: boolean; direction?: number }[],
    coins: [] as { x: number; y: number; collected: boolean }[],
    enemies: [] as { x: number; y: number; direction: number }[],
    particles: [] as Particle[],
    cameraY: 0,
    score: 0,
    maxHeight: 0,
    frame: 0,
    facingRight: true,
    lastPlatformY: 350,
  });

  const createParticles = (x: number, y: number, color: string, count: number = 5) => {
    for (let i = 0; i < count; i++) {
      gameState.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        life: 25,
        color,
        size: 2 + Math.random() * 4,
      });
    }
  };

  const resetGame = useCallback(() => {
    const platforms: { x: number; y: number; width: number; type: string; moving?: boolean; direction?: number }[] = [];
    platforms.push({ x: 100, y: 350, width: 100, type: "normal" });
    
    for (let i = 1; i < 25; i++) {
      const type = Math.random() > 0.85 ? "spring" : Math.random() > 0.9 ? "crumble" : "normal";
      platforms.push({
        x: Math.random() * 200 + 30,
        y: 350 - i * 55,
        width: 55 + Math.random() * 35,
        type,
        moving: Math.random() > 0.85,
        direction: Math.random() > 0.5 ? 1 : -1,
      });
    }

    gameState.current = {
      playerX: 150,
      playerY: 300,
      velocityY: 0,
      velocityX: 0,
      platforms,
      coins: [],
      enemies: [],
      particles: [],
      cameraY: 0,
      score: 0,
      maxHeight: 0,
      frame: 0,
      facingRight: true,
      lastPlatformY: platforms[platforms.length - 1].y,
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

    const keys = { left: false, right: false };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === "ArrowLeft") keys.left = true;
      if (e.key === "ArrowRight") keys.right = true;
      if (e.key === " ") setPaused(p => !p);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keys.left = false;
      if (e.key === "ArrowRight") keys.right = false;
    };

    const handleTouch = (e: TouchEvent) => {
      if (gameOver) return;
      const state = gameState.current;
      const touchX = e.touches[0].clientX;
      const rect = canvas.getBoundingClientRect();
      const canvasX = touchX - rect.left;
      
      if (canvasX < canvas.width / 2) {
        state.velocityX = -6;
        state.facingRight = false;
      } else {
        state.velocityX = 6;
        state.facingRight = true;
      }
    };

    const handleTouchEnd = () => {
      gameState.current.velocityX = 0;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouch);
    canvas.addEventListener("touchmove", handleTouch);
    canvas.addEventListener("touchend", handleTouchEnd);

    let animationId: number;

    const gameLoop = () => {
      animationId = requestAnimationFrame(gameLoop);
      if (gameOver || paused) return;

      const state = gameState.current;
      state.frame++;

      // Keyboard movement
      if (keys.left) {
        state.velocityX = -6;
        state.facingRight = false;
      } else if (keys.right) {
        state.velocityX = 6;
        state.facingRight = true;
      } else if (!canvas.ontouchstart) {
        state.velocityX *= 0.85;
      }

      state.playerX += state.velocityX;

      // Apply gravity
      state.velocityY += GRAVITY;
      state.playerY += state.velocityY;

      // Wrap around screen
      if (state.playerX < -PLAYER_SIZE) state.playerX = canvas.width + PLAYER_SIZE;
      if (state.playerX > canvas.width + PLAYER_SIZE) state.playerX = -PLAYER_SIZE;

      // Update camera
      if (state.playerY < 200) {
        const diff = 200 - state.playerY;
        state.cameraY += diff;
        state.playerY = 200;
        
        state.platforms.forEach(p => p.y += diff);
        state.coins.forEach(c => c.y += diff);
        state.enemies.forEach(e => e.y += diff);
        state.particles.forEach(p => p.y += diff);
      }

      // Update score
      const currentHeight = Math.floor(state.cameraY / 10);
      if (currentHeight > state.maxHeight) {
        state.maxHeight = currentHeight;
        state.score = state.maxHeight;
        setScore(state.score);
      }

      // Platform collisions
      if (state.velocityY > 0) {
        state.platforms.forEach(platform => {
          if (
            state.playerY + PLAYER_SIZE > platform.y &&
            state.playerY + PLAYER_SIZE < platform.y + 25 &&
            state.playerX > platform.x - PLAYER_SIZE / 2 &&
            state.playerX < platform.x + platform.width + PLAYER_SIZE / 2
          ) {
            if (platform.type === "spring") {
              state.velocityY = JUMP_FORCE * 1.6;
              createParticles(state.playerX, platform.y, "#ff6b6b", 8);
            } else if (platform.type === "crumble") {
              state.velocityY = JUMP_FORCE;
              platform.y = 9999;
              createParticles(platform.x + platform.width / 2, platform.y, "#8B4513", 12);
            } else {
              state.velocityY = JUMP_FORCE;
            }
            state.playerY = platform.y - PLAYER_SIZE;
            createParticles(state.playerX, platform.y, "#88cc88", 4);
          }
        });
      }

      // Moving platforms
      state.platforms.forEach(platform => {
        if (platform.moving) {
          platform.x += (platform.direction || 1) * 1.5;
          if (platform.x < 20 || platform.x + platform.width > canvas.width - 20) {
            platform.direction = -(platform.direction || 1);
          }
        }
      });

      // Generate new platforms
      while (state.lastPlatformY > state.platforms[0].y - 800) {
        state.lastPlatformY -= (45 + Math.random() * 25);
        const type = Math.random() > 0.88 ? "spring" : Math.random() > 0.92 ? "crumble" : "normal";
        state.platforms.push({
          x: Math.random() * 200 + 30,
          y: state.lastPlatformY,
          width: 50 + Math.random() * 35,
          type,
          moving: Math.random() > 0.82,
          direction: Math.random() > 0.5 ? 1 : -1,
        });

        if (Math.random() > 0.5) {
          state.coins.push({
            x: state.platforms[state.platforms.length - 1].x + 25,
            y: state.lastPlatformY - 35,
            collected: false,
          });
        }
      }

      // Remove old elements
      state.platforms = state.platforms.filter(p => p.y < canvas.height + 80);
      state.coins = state.coins.filter(c => c.y < canvas.height + 50 && !c.collected);

      // Game over
      if (state.playerY > canvas.height + 50) {
        setGameOver(true);
        onGameOver(state.score);
        return;
      }

      // Draw gradient sky
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      const progress = Math.min(state.cameraY / 5000, 1);
      skyGradient.addColorStop(0, `hsl(${200 + progress * 80}, 70%, ${70 - progress * 40}%)`);
      skyGradient.addColorStop(1, `hsl(${180 + progress * 60}, 60%, ${85 - progress * 30}%)`);
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw clouds
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      for (let i = 0; i < 6; i++) {
        const cloudY = ((state.cameraY * 0.08 + i * 130) % (canvas.height + 120)) - 60;
        const cloudX = (i * 67) % canvas.width;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 28, 0, Math.PI * 2);
        ctx.arc(cloudX + 28, cloudY - 8, 22, 0, Math.PI * 2);
        ctx.arc(cloudX + 50, cloudY, 25, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw platforms
      state.platforms.forEach(platform => {
        const platformGradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + 18);
        
        if (platform.type === "spring") {
          platformGradient.addColorStop(0, "#ff6b6b");
          platformGradient.addColorStop(1, "#cc4444");
          ctx.fillStyle = platformGradient;
          ctx.fillRect(platform.x, platform.y, platform.width, 18);
          // Spring coil
          ctx.strokeStyle = "#ffcc00";
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let i = 0; i < platform.width; i += 8) {
            ctx.lineTo(platform.x + i, platform.y + 9 + Math.sin(i * 0.5) * 4);
          }
          ctx.stroke();
        } else if (platform.type === "crumble") {
          platformGradient.addColorStop(0, "#aa8866");
          platformGradient.addColorStop(1, "#886644");
          ctx.fillStyle = platformGradient;
          ctx.fillRect(platform.x, platform.y, platform.width, 18);
          // Cracks
          ctx.strokeStyle = "#664433";
          ctx.lineWidth = 1;
          for (let i = 10; i < platform.width - 10; i += 15) {
            ctx.beginPath();
            ctx.moveTo(platform.x + i, platform.y + 3);
            ctx.lineTo(platform.x + i + 5, platform.y + 15);
            ctx.stroke();
          }
        } else {
          platformGradient.addColorStop(0, "#8B5A2B");
          platformGradient.addColorStop(1, "#654321");
          ctx.fillStyle = platformGradient;
          ctx.fillRect(platform.x, platform.y, platform.width, 18);
          // Grass
          ctx.fillStyle = "#44aa44";
          ctx.fillRect(platform.x, platform.y, platform.width, 6);
          ctx.fillStyle = "#55cc55";
          for (let i = 0; i < platform.width; i += 6) {
            ctx.fillRect(platform.x + i, platform.y - 2, 3, 4);
          }
        }
      });

      // Draw coins
      state.coins.forEach(coin => {
        if (coin.collected) return;

        const dx = state.playerX - coin.x;
        const dy = state.playerY - coin.y;
        if (Math.sqrt(dx * dx + dy * dy) < 28) {
          coin.collected = true;
          state.score += 50;
          setScore(state.score);
          createParticles(coin.x, coin.y, "#ffd700", 10);
          return;
        }

        // Coin glow
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ffd700";
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y + Math.sin(state.frame * 0.1) * 3, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = "#ffaa00";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y + Math.sin(state.frame * 0.1) * 3, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw particles
      state.particles = state.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life--;
        
        ctx.globalAlpha = p.life / 25;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.life / 25), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        return p.life > 0;
      });

      // Draw player
      const bobOffset = Math.sin(state.frame * 0.2) * 2;
      
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(state.playerX, state.playerY + PLAYER_SIZE + 5, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = "#FF4444";
      ctx.fillRect(state.playerX - 14, state.playerY - 8 + bobOffset, 28, 24);
      
      // Head
      ctx.fillStyle = "#FFE4B5";
      ctx.beginPath();
      ctx.arc(state.playerX, state.playerY - 20 + bobOffset, 14, 0, Math.PI * 2);
      ctx.fill();
      
      // Hat
      ctx.fillStyle = "#FF4444";
      ctx.beginPath();
      ctx.arc(state.playerX, state.playerY - 30 + bobOffset, 12, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(state.playerX - 16, state.playerY - 30 + bobOffset, 32, 6);
      
      // Eyes
      ctx.fillStyle = "#333";
      const eyeOffset = state.facingRight ? 2 : -2;
      ctx.beginPath();
      ctx.arc(state.playerX - 4 + eyeOffset, state.playerY - 22 + bobOffset, 3, 0, Math.PI * 2);
      ctx.arc(state.playerX + 4 + eyeOffset, state.playerY - 22 + bobOffset, 3, 0, Math.PI * 2);
      ctx.fill();

      // Mustache
      ctx.fillStyle = "#8B4513";
      ctx.beginPath();
      ctx.ellipse(state.playerX, state.playerY - 14 + bobOffset, 8, 3, 0, 0, Math.PI);
      ctx.fill();

      // Draw UI
      ctx.fillStyle = "#333";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`🏔️ ${state.score}m`, 18, 38);
      ctx.font = "16px Arial";
      ctx.fillStyle = "#666";
      ctx.fillText(`Best: ${highScore}m`, 18, 62);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("touchmove", handleTouch);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameOver, paused, highScore, onGameOver, resetGame]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 flex flex-col items-center p-4">
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-sky-900 hover:bg-sky-300/50">
          <Home className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-bold text-sky-900">🦘 Super Jump</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setPaused(p => !p)}
          className="text-sky-900 hover:bg-sky-300/50"
        >
          {paused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </Button>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={500}
          className="rounded-2xl shadow-2xl shadow-sky-500/30 border-4 border-white/60"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center">
            <h3 className="text-4xl font-black text-white mb-2">Game Over!</h3>
            <p className="text-2xl text-yellow-400 mb-4">Height: {score}m</p>
            {score > highScore && (
              <p className="text-xl text-green-400 mb-4 animate-bounce">🎉 New High Score!</p>
            )}
            <div className="flex gap-4">
              <Button onClick={resetGame} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-bold">
                <RotateCcw className="w-4 h-4 mr-2" /> Play Again
              </Button>
              <Button variant="outline" onClick={onBack} className="border-white/30 text-white hover:bg-white/10">
                <Home className="w-4 h-4 mr-2" /> Home
              </Button>
            </div>
          </div>
        )}

        {paused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-4">Paused</p>
              <Button onClick={() => setPaused(false)} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                <Play className="w-4 h-4 mr-2" /> Resume
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-sky-800 text-center text-sm space-y-1">
        <p>⬅️➡️ Tap sides or Arrow Keys</p>
        <p>🔴 Red = Super Jump • 🟤 Brown = Crumbles!</p>
      </div>
    </div>
  );
};
