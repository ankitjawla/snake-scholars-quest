import { useState } from "react";
import { GameHub } from "@/components/GameHub";

export type GameType = "runner" | "jumper" | "collector" | null;

export default function Index() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [highScores, setHighScores] = useState<Record<string, number>>({
    runner: 0,
    jumper: 0,
    collector: 0,
  });

  const handleGameOver = (game: string, score: number) => {
    setHighScores(prev => ({
      ...prev,
      [game]: Math.max(prev[game] || 0, score),
    }));
    setSelectedGame(null);
  };

  return (
    <GameHub
      selectedGame={selectedGame}
      onSelectGame={setSelectedGame}
      onGameOver={handleGameOver}
      highScores={highScores}
    />
  );
}
