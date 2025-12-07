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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export const SubwaySurferGame = ({ onGameOver, onBack, highScore }: SubwaySurferGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  
  const gameState = useRef({
    lane: 1,
    obstacles: [] as { lane: number; y: number; type: string }[],
    coins: [] as { lane: number; y: number; collected: boolean }[],
    powerups: [] as { lane: number; y: number; type: string }[],
    particles: [] as Particle[],
    speed: 5,
    frame: 0,
    score: 0,
    combo: 0,
    isJumping: false,
    jumpY: 0,
    isSliding: false,
    slideTimer: 0,
    shield: false,
    shieldTimer: 0,
    magnet: false,
    magnetTimer: 0,
    multiplier: 1,
    multiplierTimer: 0,
  });

  const touchStart = useRef({ x: 0, y: 0 });

  const createParticles = (x: number, y: number, color: string, count: number = 5) => {
    for (let i = 0; i < count; i++) {
      gameState.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 30,
        color,
        size: 3 + Math.random() * 4,
      });
    }
  };

  const resetGame = useCallback(() => {
    gameState.current = {
      lane: 1,
      obstacles: [],
      coins: [],
      powerups: [],
      particles: [],
      speed: 5,
      frame: 0,
      score: 0,
      combo: 0,
      isJumping: false,
      jumpY: 0,
      isSliding: false,
      slideTimer: 0,
      shield: false,
      shieldTimer: 0,
      magnet: false,
      magnetTimer: 0,
      multiplier: 1,
      multiplierTimer: 0,
    };
    setScore(0);
    setCombo(0);
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
      if (e.key === "ArrowLeft" && state.lane > 0) {
        state.lane--;
        createParticles(canvas.width / 2 + (state.lane - 1) * LANE_WIDTH, canvas.height - 100, "#ffffff", 3);
      }
      if (e.key === "ArrowRight" && state.lane < 2) {
        state.lane++;
        createParticles(canvas.width / 2 + (state.lane - 1) * LANE_WIDTH, canvas.height - 100, "#ffffff", 3);
      }
      if (e.key === "ArrowUp" && !state.isJumping && !state.isSliding) {
        state.isJumping = true;
        state.jumpY = 0;
      }
      if (e.key === "ArrowDown" && !state.isJumping && !state.isSliding) {
        state.isSliding = true;
        state.slideTimer = 30;
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
        if (dx > 30 && state.lane < 2) {
          state.lane++;
          createParticles(canvas.width / 2 + (state.lane - 1) * LANE_WIDTH, canvas.height - 100, "#ffffff", 3);
        }
        if (dx < -30 && state.lane > 0) {
          state.lane--;
          createParticles(canvas.width / 2 + (state.lane - 1) * LANE_WIDTH, canvas.height - 100, "#ffffff", 3);
        }
      } else {
        if (dy < -30 && !state.isJumping && !state.isSliding) {
          state.isJumping = true;
          state.jumpY = 0;
        }
        if (dy > 30 && !state.isJumping && !state.isSliding) {
          state.isSliding = true;
          state.slideTimer = 30;
        }
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
      
      // Update timers
      if (state.shieldTimer > 0) state.shieldTimer--;
      else state.shield = false;
      if (state.magnetTimer > 0) state.magnetTimer--;
      else state.magnet = false;
      if (state.multiplierTimer > 0) state.multiplierTimer--;
      else state.multiplier = 1;
      if (state.slideTimer > 0) state.slideTimer--;
      else state.isSliding = false;
      
      // Increase speed over time
      state.speed = 5 + Math.floor(state.frame / 400) * 0.5;

      // Clear canvas with gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, "#0f0f23");
      bgGradient.addColorStop(1, "#1a1a3e");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road lanes with glow
      const centerX = canvas.width / 2;
      for (let i = 0; i < LANES; i++) {
        const laneX = centerX + (i - 1) * LANE_WIDTH - LANE_WIDTH / 2;
        
        // Lane glow
        if (i === state.lane) {
          ctx.fillStyle = "rgba(100, 200, 255, 0.1)";
          ctx.fillRect(laneX - 5, 0, LANE_WIDTH + 6, canvas.height);
        }
        
        ctx.fillStyle = i === state.lane ? "#3b3b6c" : "#2a2a5a";
        ctx.fillRect(laneX, 0, LANE_WIDTH - 4, canvas.height);
        
        // Animated lane markers
        ctx.fillStyle = "#6a6aaa";
        for (let y = (state.frame * state.speed) % 50; y < canvas.height; y += 50) {
          ctx.fillRect(laneX + LANE_WIDTH / 2 - 3, y, 6, 25);
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
      const jumpOffset = state.isJumping ? Math.sin(state.jumpY * Math.PI / 100) * 70 : 0;
      const slideOffset = state.isSliding ? 15 : 0;

      // Draw player
      const playerX = centerX + (state.lane - 1) * LANE_WIDTH;
      const playerY = canvas.height - 100 - jumpOffset + slideOffset;
      
      // Player shadow
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(playerX, canvas.height - 75, 25 - jumpOffset / 5, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shield effect
      if (state.shield) {
        ctx.strokeStyle = `rgba(0, 200, 255, ${0.5 + Math.sin(state.frame * 0.2) * 0.3})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(playerX, playerY, PLAYER_SIZE / 2 + 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Player body
      const playerHeight = state.isSliding ? PLAYER_SIZE / 2 : PLAYER_SIZE;
      const gradient = ctx.createRadialGradient(playerX, playerY, 0, playerX, playerY, PLAYER_SIZE);
      gradient.addColorStop(0, "#ff8866");
      gradient.addColorStop(1, "#ff5533");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(playerX, playerY, playerHeight / 2, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      if (!state.isSliding) {
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
      }

      // Magnet effect
      if (state.magnet) {
        ctx.strokeStyle = `rgba(255, 200, 0, ${0.3 + Math.sin(state.frame * 0.1) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(playerX, playerY, PLAYER_SIZE + 40, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Spawn obstacles
      if (state.frame % Math.max(40, 70 - Math.floor(state.speed)) === 0) {
        const lane = Math.floor(Math.random() * LANES);
        const types = ["🚗", "🚌", "🚧", "📦", "🛢️"];
        state.obstacles.push({
          lane,
          y: -OBSTACLE_SIZE,
          type: types[Math.floor(Math.random() * types.length)],
        });
      }

      // Spawn coins
      if (state.frame % 25 === 0) {
        state.coins.push({
          lane: Math.floor(Math.random() * LANES),
          y: -30,
          collected: false,
        });
      }

      // Spawn powerups
      if (state.frame % 300 === 0) {
        const types = ["🛡️", "🧲", "⚡"];
        state.powerups.push({
          lane: Math.floor(Math.random() * LANES),
          y: -40,
          type: types[Math.floor(Math.random() * types.length)],
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
        const playerBottom = playerY + playerHeight / 2;
        const playerTop = playerY - playerHeight / 2;
        
        if (
          obs.lane === state.lane &&
          obs.y + OBSTACLE_SIZE / 2 > playerTop &&
          obs.y - OBSTACLE_SIZE / 2 < playerBottom &&
          !state.isJumping
        ) {
          if (state.shield) {
            state.shield = false;
            state.shieldTimer = 0;
            createParticles(obsX, obs.y, "#00ccff", 10);
            return false;
          }
          setGameOver(true);
          onGameOver(state.score);
          return false;
        }

        return obs.y < canvas.height + OBSTACLE_SIZE;
      });

      // Update and draw coins
      state.coins = state.coins.filter(coin => {
        if (coin.collected) return false;
        
        coin.y += state.speed * 0.8;
        
        // Magnet attraction
        if (state.magnet) {
          const dx = centerX + (state.lane - 1) * LANE_WIDTH - (centerX + (coin.lane - 1) * LANE_WIDTH);
          if (Math.abs(dx) > 5) {
            coin.lane += dx > 0 ? 0.1 : -0.1;
          }
        }
        
        const coinX = centerX + (coin.lane - 1) * LANE_WIDTH;
        
        // Collect coin
        if (
          Math.abs(coin.lane - state.lane) < 0.5 &&
          Math.abs(coin.y - playerY) < PLAYER_SIZE + 10
        ) {
          const points = 10 * state.multiplier;
          state.score += points;
          state.combo++;
          setScore(state.score);
          setCombo(state.combo);
          createParticles(coinX, coin.y, "#ffd700", 8);
          return false;
        }

        if (coin.y > canvas.height + 30) {
          state.combo = 0;
          setCombo(0);
          return false;
        }

        // Draw coin with glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ffd700";
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(coinX, coin.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = "#ffaa00";
        ctx.beginPath();
        ctx.arc(coinX, coin.y, 9, 0, Math.PI * 2);
        ctx.fill();
        
        // Dollar sign
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("$", coinX, coin.y + 4);

        return true;
      });

      // Update and draw powerups
      state.powerups = state.powerups.filter(powerup => {
        powerup.y += state.speed * 0.6;
        
        const powerX = centerX + (powerup.lane - 1) * LANE_WIDTH;
        
        // Collect powerup
        if (
          powerup.lane === state.lane &&
          Math.abs(powerup.y - playerY) < PLAYER_SIZE + 15
        ) {
          if (powerup.type === "🛡️") {
            state.shield = true;
            state.shieldTimer = 300;
          } else if (powerup.type === "🧲") {
            state.magnet = true;
            state.magnetTimer = 300;
          } else if (powerup.type === "⚡") {
            state.multiplier = 2;
            state.multiplierTimer = 300;
          }
          createParticles(powerX, powerup.y, "#00ff88", 15);
          return false;
        }

        if (powerup.y > canvas.height + 40) return false;

        // Draw powerup with glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00ff88";
        ctx.font = "36px Arial";
        ctx.textAlign = "center";
        ctx.fillText(powerup.type, powerX, powerup.y + 12);
        ctx.shadowBlur = 0;

        return true;
      });

      // Update and draw particles
      state.particles = state.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life--;
        
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.life / 30), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        return p.life > 0;
      });

      // Update score by distance
      if (state.frame % 10 === 0) {
        state.score += state.multiplier;
        setScore(state.score);
      }

      // Draw UI
      ctx.fillStyle = "white";
      ctx.font = "bold 22px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${state.score}`, 15, 35);
      ctx.font = "16px Arial";
      ctx.fillText(`Best: ${highScore}`, 15, 58);
      
      // Combo
      if (state.combo > 1) {
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`${state.combo}x Combo!`, canvas.width - 15, 35);
      }
      
      // Active powerups
      let powerupY = 60;
      if (state.shield) {
        ctx.font = "16px Arial";
        ctx.fillText(`🛡️ ${Math.ceil(state.shieldTimer / 60)}s`, canvas.width - 15, powerupY);
        powerupY += 22;
      }
      if (state.magnet) {
        ctx.fillText(`🧲 ${Math.ceil(state.magnetTimer / 60)}s`, canvas.width - 15, powerupY);
        powerupY += 22;
      }
      if (state.multiplier > 1) {
        ctx.fillText(`⚡ 2x ${Math.ceil(state.multiplierTimer / 60)}s`, canvas.width - 15, powerupY);
      }
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-900 flex flex-col items-center p-4">
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
          <Home className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-bold text-white">🏃 Street Runner</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setPaused(p => !p)}
          className="text-white hover:bg-white/10"
        >
          {paused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </Button>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={500}
          className="rounded-2xl shadow-2xl shadow-purple-500/30 border-4 border-white/20"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center">
            <h3 className="text-4xl font-black text-white mb-2">Game Over!</h3>
            <p className="text-2xl text-yellow-400 mb-4">Score: {score}</p>
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

      <div className="mt-4 text-white/60 text-center text-sm space-y-1">
        <p>⬅️➡️ Swipe/Arrow Keys to Move</p>
        <p>⬆️ Jump over obstacles • ⬇️ Slide under</p>
      </div>
    </div>
  );
};
