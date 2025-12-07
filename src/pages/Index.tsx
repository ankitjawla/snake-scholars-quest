import { useState, useEffect } from "react";
import { GameHub } from "@/components/GameHub";

export type GameType = "runner" | "jumper" | "collector" | "mathblitz" | "wordgarden" | null;

export default function Index() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [highScores, setHighScores] = useState<Record<string, number>>({
    runner: 0,
    jumper: 0,
    collector: 0,
    mathblitz: 0,
    wordgarden: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("gameHighScores");
    if (saved) {
      try {
        setHighScores(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error("Failed to load high scores");
      }
    }
  }, []);

  const handleGameOver = (game: string, score: number) => {
    setHighScores(prev => {
      const newScores = {
        ...prev,
        [game]: Math.max(prev[game] || 0, score),
      };
      localStorage.setItem("gameHighScores", JSON.stringify(newScores));
      return newScores;
    });
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
