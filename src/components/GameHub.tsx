import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gamepad2, Zap, Star, Trophy, Sparkles, Rocket } from "lucide-react";
import type { GameType } from "@/pages/Index";
import { SubwaySurferGame } from "./games/SubwaySurferGame";
import { MarioJumpGame } from "./games/MarioJumpGame";
import { StarCollectorGame } from "./games/StarCollectorGame";
import { MathBlitzGame } from "./games/MathBlitzGame";
import { WordGardenGame } from "./games/WordGardenGame";

interface GameHubProps {
  selectedGame: GameType;
  onSelectGame: (game: GameType) => void;
  onGameOver: (game: string, score: number) => void;
  highScores: Record<string, number>;
}

const games = [
  {
    id: "runner" as const,
    title: "Street Runner",
    description: "Dodge cars & collect coins!",
    icon: Zap,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-500/20 to-red-500/10",
    emoji: "🏃",
  },
  {
    id: "jumper" as const,
    title: "Super Jump",
    description: "Bounce to the sky!",
    icon: Gamepad2,
    color: "from-blue-500 to-cyan-400",
    bgColor: "bg-gradient-to-br from-blue-500/20 to-cyan-400/10",
    emoji: "🦘",
  },
  {
    id: "collector" as const,
    title: "Star Collector",
    description: "Catch falling stars!",
    icon: Star,
    color: "from-yellow-400 to-amber-500",
    bgColor: "bg-gradient-to-br from-yellow-400/20 to-amber-500/10",
    emoji: "⭐",
  },
  {
    id: "mathblitz" as const,
    title: "Math Blitz",
    description: "Quick math challenges!",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-500/20 to-pink-500/10",
    emoji: "🧮",
  },
  {
    id: "wordgarden" as const,
    title: "Word Garden",
    description: "Grow words from letters!",
    icon: Rocket,
    color: "from-green-500 to-emerald-400",
    bgColor: "bg-gradient-to-br from-green-500/20 to-emerald-400/10",
    emoji: "🌱",
  },
];

export const GameHub = ({ selectedGame, onSelectGame, onGameOver, highScores }: GameHubProps) => {
  if (selectedGame === "runner") {
    return (
      <SubwaySurferGame
        onGameOver={(score) => onGameOver("runner", score)}
        onBack={() => onSelectGame(null)}
        highScore={highScores.runner}
      />
    );
  }

  if (selectedGame === "jumper") {
    return (
      <MarioJumpGame
        onGameOver={(score) => onGameOver("jumper", score)}
        onBack={() => onSelectGame(null)}
        highScore={highScores.jumper}
      />
    );
  }

  if (selectedGame === "collector") {
    return (
      <StarCollectorGame
        onGameOver={(score) => onGameOver("collector", score)}
        onBack={() => onSelectGame(null)}
        highScore={highScores.collector}
      />
    );
  }

  if (selectedGame === "mathblitz") {
    return (
      <MathBlitzGame
        onGameOver={(score) => onGameOver("mathblitz", score)}
        onBack={() => onSelectGame(null)}
        highScore={highScores.mathblitz}
      />
    );
  }

  if (selectedGame === "wordgarden") {
    return (
      <WordGardenGame
        onGameOver={(score) => onGameOver("wordgarden", score)}
        onBack={() => onSelectGame(null)}
        highScore={highScores.wordgarden}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        {/* Header */}
        <div className="text-center py-6">
          <div className="inline-block">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 mb-2 animate-pulse">
              🎮 Fun Games
            </h1>
            <div className="h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 rounded-full" />
          </div>
          <p className="text-purple-200 text-lg mt-3 font-medium">Pick your adventure!</p>
        </div>

        {/* Total Score Card */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-5 mb-6 shadow-2xl">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <Trophy className="w-12 h-12 text-yellow-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
            </div>
            <div className="text-center">
              <p className="text-white/60 text-sm font-medium">Total High Scores</p>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                {Object.values(highScores).reduce((a, b) => a + b, 0)}
              </p>
            </div>
          </div>
        </Card>

        {/* Game Cards Grid */}
        <div className="grid gap-4">
          {games.map((game, index) => (
            <Card
              key={game.id}
              className={`${game.bgColor} backdrop-blur-xl border-white/10 p-5 cursor-pointer 
                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 
                active:scale-95 group overflow-hidden relative`}
              onClick={() => onSelectGame(game.id)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} 
                  flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform`}>
                  <span className="text-3xl">{game.emoji}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-white/60 text-sm">{game.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">
                      Best: {highScores[game.id] || 0}
                    </span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${game.color} text-white font-bold 
                    shadow-lg hover:shadow-xl transition-all hover:scale-105 border-0`}
                >
                  Play
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Fun Footer */}
        <div className="text-center mt-8">
          <p className="text-white/40 text-sm">
            ✨ Beat your high scores! ✨
          </p>
        </div>
      </div>
    </div>
  );
};
