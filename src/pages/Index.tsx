import { useState } from "react";
import { Hero } from "@/components/Hero";
import { FoundersStory } from "@/components/FoundersStory";
import { DifficultySelect } from "@/components/DifficultySelect";
import { GameCanvas } from "@/components/GameCanvas";
import { LevelTransition } from "@/components/LevelTransition";

type Screen = "hero" | "story" | "difficulty" | "game" | "transition";
type Difficulty = "easy" | "medium" | "hard";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("hero");
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const handleStartGame = () => {
    setScreen("difficulty");
  };

  const handleDifficultySelect = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setLevel(1);
    setScreen("game");
  };

  const handleLearnMore = () => {
    setScreen("story");
  };

  const handleBackToHero = () => {
    setScreen("hero");
  };

  const handleLevelComplete = () => {
    setScreen("transition");
  };

  const handleContinueToNextLevel = () => {
    setLevel((prev) => prev + 1);
    setScreen("game");
  };

  return (
    <>
      {screen === "hero" && (
        <Hero onStartGame={handleStartGame} onLearnMore={handleLearnMore} />
      )}
      {screen === "story" && <FoundersStory onBack={handleBackToHero} />}
      {screen === "difficulty" && (
        <DifficultySelect onSelect={handleDifficultySelect} onBack={handleBackToHero} />
      )}
      {screen === "game" && (
        <GameCanvas
          level={level}
          difficulty={difficulty}
          onBack={handleBackToHero}
          onLevelComplete={handleLevelComplete}
        />
      )}
      {screen === "transition" && (
        <LevelTransition level={level} onContinue={handleContinueToNextLevel} />
      )}
    </>
  );
};

export default Index;
