import { useState } from "react";
import { Hero } from "@/components/Hero";
import { FoundersStory } from "@/components/FoundersStory";
import { GameCanvas } from "@/components/GameCanvas";
import { LevelTransition } from "@/components/LevelTransition";

type Screen = "hero" | "story" | "game" | "transition";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("hero");
  const [level, setLevel] = useState(1);

  const handleStartGame = () => {
    setScreen("game");
    setLevel(1);
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
      {screen === "game" && (
        <GameCanvas
          level={level}
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
