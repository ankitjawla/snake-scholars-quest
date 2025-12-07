import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Home, Pause, Play, RotateCcw } from "lucide-react";

interface StarCollectorGameProps {
  onGameOver: (score: number) => void;
  onBack: () => void;
  highScore: number;
}

const PLAYER_WIDTH = 70;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export const StarCollectorGame = ({ onGameOver, onBack, highScore }: StarCollectorGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const gameState = useRef({
    playerX: 150,
    stars: [] as { x: number; y: number; size: number; speed: number; type: string; rotation: number }[],
    bombs: [] as { x: number; y: number; speed: number; rotation: number }[],
    powerups: [] as { x: number; y: number; type: string; speed: number }[],
    particles: [] as Particle[],
    score: 0,
    lives: 3,
    combo: 0,
    frame: 0,
    level: 1,
    shield: false,
    shieldTimer: 0,
    slowmo: false,
    slowmoTimer: 0,
    frenzy: false,
    frenzyTimer: 0,
  });

  const createParticles = (x: number, y: number, color: string, count: number = 5) => {
    for (let i = 0; i < count; i++) {
      gameState.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 3,
        life: 30,
        color,
        size: 3 + Math.random() * 5,
      });
    }
  };

  const resetGame = useCallback(() => {
    gameState.current = {
      playerX: 150,
      stars: [],
      bombs: [],
      powerups: [],
      particles: [],
      score: 0,
      lives: 3,
      combo: 0,
      frame: 0,
      level: 1,
      shield: false,
      shieldTimer: 0,
      slowmo: false,
      slowmoTimer: 0,
      frenzy: false,
      frenzyTimer: 0,
    };
    setScore(0);
    setLives(3);
    setCombo(0);
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
      if (e.key === "ArrowLeft") targetX -= 35;
      if (e.key === "ArrowRight") targetX += 35;
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
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      targetX = e.touches[0].clientX - rect.left;
      targetX = Math.max(PLAYER_WIDTH / 2, Math.min(canvas.width - PLAYER_WIDTH / 2, targetX));
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    let animationId: number;

    const gameLoop = () => {
      animationId = requestAnimationFrame(gameLoop);
      if (gameOver || paused) return;

      const state = gameState.current;
      state.frame++;

      // Update timers
      if (state.shieldTimer > 0) state.shieldTimer--;
      else state.shield = false;
      if (state.slowmoTimer > 0) state.slowmoTimer--;
      else state.slowmo = false;
      if (state.frenzyTimer > 0) state.frenzyTimer--;
      else state.frenzy = false;

      const speedMultiplier = state.slowmo ? 0.4 : 1;

      // Smooth player movement
      state.playerX += (targetX - state.playerX) * 0.18;

      // Level progression
      state.level = 1 + Math.floor(state.score / 250);

      // Spawn stars
      const starSpawnRate = state.frenzy ? 8 : Math.max(15, 35 - state.level * 2);
      if (state.frame % starSpawnRate === 0) {
        const types = ["normal", "normal", "normal", "gold", "gold", "rainbow"];
        state.stars.push({
          x: Math.random() * (canvas.width - 50) + 25,
          y: -25,
          size: 16 + Math.random() * 10,
          speed: (2 + Math.random() * 2 + state.level * 0.25) * speedMultiplier,
          type: state.frenzy ? "rainbow" : types[Math.floor(Math.random() * types.length)],
          rotation: 0,
        });
      }

      // Spawn bombs
      if (!state.frenzy && state.frame % Math.max(50, 100 - state.level * 8) === 0) {
        state.bombs.push({
          x: Math.random() * (canvas.width - 50) + 25,
          y: -25,
          speed: (2.5 + state.level * 0.4) * speedMultiplier,
          rotation: 0,
        });
      }

      // Spawn powerups
      if (state.frame % 400 === 0) {
        const types = ["🛡️", "⏰", "🌟"];
        state.powerups.push({
          x: Math.random() * (canvas.width - 50) + 25,
          y: -35,
          type: types[Math.floor(Math.random() * types.length)],
          speed: 2,
        });
      }

      // Draw background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0a0a20");
      gradient.addColorStop(0.4, "#1a1a40");
      gradient.addColorStop(1, "#2a2a60");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated background stars
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let i = 0; i < 60; i++) {
        const x = (i * 73 + state.frame * 0.08) % canvas.width;
        const y = (i * 47 + state.frame * 0.15) % canvas.height;
        const twinkle = Math.sin(state.frame * 0.05 + i) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle * 0.7;
        ctx.beginPath();
        ctx.arc(x, y, 1 + twinkle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Update and draw stars
      state.stars = state.stars.filter(star => {
        star.y += star.speed * speedMultiplier;
        star.rotation += 0.08;

        // Collision
        if (
          star.y > canvas.height - 55 &&
          star.y < canvas.height - 15 &&
          Math.abs(star.x - state.playerX) < PLAYER_WIDTH / 2 + star.size / 2
        ) {
          const basePoints = star.type === "rainbow" ? 50 : star.type === "gold" ? 25 : 10;
          const comboMultiplier = 1 + state.combo * 0.1;
          const points = Math.floor(basePoints * comboMultiplier);
          state.score += points;
          state.combo++;
          setScore(state.score);
          setCombo(state.combo);
          
          const colors = star.type === "rainbow" ? ["#ff0000", "#ffa500", "#ffff00", "#00ff00", "#0000ff"] : ["#ffd700", "#ffaa00"];
          colors.forEach(c => createParticles(star.x, star.y, c, 3));
          return false;
        }

        if (star.y > canvas.height) {
          state.combo = 0;
          setCombo(0);
          return false;
        }

        // Draw star
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(star.rotation);

        if (star.type === "rainbow") {
          const rainbow = ctx.createLinearGradient(-star.size, 0, star.size, 0);
          rainbow.addColorStop(0, "#ff0000");
          rainbow.addColorStop(0.2, "#ff7f00");
          rainbow.addColorStop(0.4, "#ffff00");
          rainbow.addColorStop(0.6, "#00ff00");
          rainbow.addColorStop(0.8, "#0000ff");
          rainbow.addColorStop(1, "#8b00ff");
          ctx.fillStyle = rainbow;
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#ffffff";
        } else if (star.type === "gold") {
          ctx.fillStyle = "#FFD700";
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#ffd700";
        } else {
          ctx.fillStyle = "#FFEB3B";
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#ffeb3b";
        }

        // Star shape
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
        ctx.shadowBlur = 0;
        ctx.restore();

        return true;
      });

      // Update and draw bombs
      state.bombs = state.bombs.filter(bomb => {
        bomb.y += bomb.speed * speedMultiplier;
        bomb.rotation += 0.05;

        // Collision
        if (
          bomb.y > canvas.height - 55 &&
          bomb.y < canvas.height - 15 &&
          Math.abs(bomb.x - state.playerX) < PLAYER_WIDTH / 2 + 18
        ) {
          if (state.shield) {
            state.shield = false;
            state.shieldTimer = 0;
            createParticles(bomb.x, bomb.y, "#00ccff", 12);
          } else {
            state.lives--;
            state.combo = 0;
            setLives(state.lives);
            setCombo(0);
            createParticles(bomb.x, bomb.y, "#ff4444", 15);
            if (state.lives <= 0) {
              setGameOver(true);
              onGameOver(state.score);
            }
          }
          return false;
        }

        if (bomb.y > canvas.height) return false;

        // Draw bomb
        ctx.save();
        ctx.translate(bomb.x, bomb.y);
        ctx.rotate(bomb.rotation);
        
        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();

        // Fuse
        ctx.strokeStyle = "#8B4513";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.quadraticCurveTo(12, -28, 8, -35);
        ctx.stroke();

        // Spark
        if (state.frame % 8 < 4) {
          ctx.fillStyle = "#FF6600";
          ctx.beginPath();
          ctx.arc(8, -37, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Skull
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("☠️", 0, 6);
        
        ctx.restore();
        return true;
      });

      // Update and draw powerups
      state.powerups = state.powerups.filter(powerup => {
        powerup.y += powerup.speed;

        if (
          powerup.y > canvas.height - 55 &&
          powerup.y < canvas.height - 15 &&
          Math.abs(powerup.x - state.playerX) < PLAYER_WIDTH / 2 + 20
        ) {
          if (powerup.type === "🛡️") {
            state.shield = true;
            state.shieldTimer = 400;
          } else if (powerup.type === "⏰") {
            state.slowmo = true;
            state.slowmoTimer = 300;
          } else if (powerup.type === "🌟") {
            state.frenzy = true;
            state.frenzyTimer = 250;
          }
          createParticles(powerup.x, powerup.y, "#00ffaa", 12);
          return false;
        }

        if (powerup.y > canvas.height) return false;

        ctx.shadowBlur = 18;
        ctx.shadowColor = "#00ffaa";
        ctx.font = "38px Arial";
        ctx.textAlign = "center";
        ctx.fillText(powerup.type, powerup.x, powerup.y + 12);
        ctx.shadowBlur = 0;

        return true;
      });

      // Draw particles
      state.particles = state.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.life--;
        
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.life / 30), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        return p.life > 0;
      });

      // Draw player (net/basket)
      const netY = canvas.height - 45;
      
      // Shield effect
      if (state.shield) {
        ctx.strokeStyle = `rgba(0, 200, 255, ${0.5 + Math.sin(state.frame * 0.15) * 0.3})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(state.playerX, netY, PLAYER_WIDTH / 2 + 12, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Net
      const netGradient = ctx.createLinearGradient(
        state.playerX - PLAYER_WIDTH / 2,
        netY - 20,
        state.playerX + PLAYER_WIDTH / 2,
        netY + 15
      );
      netGradient.addColorStop(0, "#9966ff");
      netGradient.addColorStop(0.5, "#cc88ff");
      netGradient.addColorStop(1, "#9966ff");
      
      ctx.fillStyle = netGradient;
      ctx.beginPath();
      ctx.moveTo(state.playerX - PLAYER_WIDTH / 2, netY - 18);
      ctx.quadraticCurveTo(state.playerX, netY + 20, state.playerX + PLAYER_WIDTH / 2, netY - 18);
      ctx.lineTo(state.playerX + PLAYER_WIDTH / 2 - 8, netY + 10);
      ctx.quadraticCurveTo(state.playerX, netY + 28, state.playerX - PLAYER_WIDTH / 2 + 8, netY + 10);
      ctx.closePath();
      ctx.fill();
      
      // Net pattern
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.5;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(state.playerX + i * 10, netY - 15);
        ctx.lineTo(state.playerX + i * 8, netY + 18);
        ctx.stroke();
      }

      // Handle
      ctx.fillStyle = "#8844cc";
      ctx.fillRect(state.playerX - 5, netY + 10, 10, 15);

      // Draw UI
      ctx.fillStyle = "white";
      ctx.font = "bold 22px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`⭐ ${state.score}`, 18, 35);
      ctx.font = "14px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(`Best: ${highScore}`, 18, 55);
      
      // Lives
      ctx.textAlign = "right";
      ctx.font = "22px Arial";
      ctx.fillText("❤️".repeat(Math.max(0, state.lives)), canvas.width - 18, 35);
      
      // Level
      ctx.textAlign = "center";
      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#aaccff";
      ctx.fillText(`Level ${state.level}`, canvas.width / 2, 35);

      // Combo
      if (state.combo > 2) {
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 16px Arial";
        ctx.fillText(`${state.combo}x Combo!`, canvas.width / 2, 58);
      }

      // Active powerups
      ctx.textAlign = "right";
      ctx.font = "14px Arial";
      let powerupY = 58;
      if (state.shield) {
        ctx.fillText(`🛡️ ${Math.ceil(state.shieldTimer / 60)}s`, canvas.width - 18, powerupY);
        powerupY += 18;
      }
      if (state.slowmo) {
        ctx.fillText(`⏰ ${Math.ceil(state.slowmoTimer / 60)}s`, canvas.width - 18, powerupY);
        powerupY += 18;
      }
      if (state.frenzy) {
        ctx.fillStyle = "#ff66ff";
        ctx.fillText(`🌟 FRENZY! ${Math.ceil(state.frenzyTimer / 60)}s`, canvas.width - 18, powerupY);
      }
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-900 flex flex-col items-center p-4">
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
          <Home className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-bold text-white">⭐ Star Collector</h2>
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
        <p>🖱️ Move mouse/touch to catch stars</p>
        <p>☠️ Avoid bombs! 🛡️⏰🌟 Collect powerups!</p>
      </div>
    </div>
  );
};
