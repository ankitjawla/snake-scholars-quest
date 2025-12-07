import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gamepad2, Zap, Star, Trophy } from "lucide-react";
import type { GameType } from "@/pages/Index";
import { SubwaySurferGame } from "./games/SubwaySurferGame";
import { MarioJumpGame } from "./games/MarioJumpGame";
import { StarCollectorGame } from "./games/StarCollectorGame";

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
    description: "Dodge obstacles like Subway Surfers!",
    icon: Zap,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "jumper" as const,
    title: "Super Jump",
    description: "Jump on platforms like Mario!",
    icon: Gamepad2,
    color: "from-blue-500 to-purple-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "collector" as const,
    title: "Star Collector",
    description: "Catch falling stars!",
    icon: Star,
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-500/10",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-2 animate-pulse">
            🎮 Fun Games
          </h1>
          <p className="text-purple-200 text-lg">Choose a game to play!</p>
        </div>

        {/* Total Score */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4 mb-6">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div className="text-center">
              <p className="text-white/70 text-sm">Total High Scores</p>
              <p className="text-3xl font-bold text-yellow-400">
                {Object.values(highScores).reduce((a, b) => a + b, 0)}
              </p>
            </div>
          </div>
        </Card>

        {/* Game Cards */}
        <div className="space-y-4">
          {games.map((game) => (
            <Card
              key={game.id}
              className={`${game.bgColor} backdrop-blur-lg border-white/20 p-6 cursor-pointer 
                transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95`}
              onClick={() => onSelectGame(game.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} 
                  flex items-center justify-center shadow-lg`}>
                  <game.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{game.title}</h3>
                  <p className="text-white/70 text-sm">{game.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">
                      Best: {highScores[game.id] || 0}
                    </span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${game.color} text-white font-bold 
                    shadow-lg hover:shadow-xl transition-all`}
                >
                  Play
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Fun Footer */}
        <div className="text-center mt-8 text-white/50 text-sm">
          <p>🌟 Have fun and beat your high scores! 🌟</p>
        </div>
      </div>
    </div>
  );
};
