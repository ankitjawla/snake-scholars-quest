import { useState } from "react";
import { StartScreen } from "@/components/StartScreen";
import { FoundersStory } from "@/components/FoundersStory";
import { GamePlay } from "@/components/GamePlay";
import { StoryReveal } from "@/components/StoryReveal";
import { ProgressMap } from "@/components/ProgressMap";

type Screen = "start" | "founders" | "game" | "story" | "map";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [level, setLevel] = useState(1);
  const [lastStoryId, setLastStoryId] = useState(1);

  const handleStart = () => {
    setScreen("game");
  };

  const handleViewStories = () => {
    setScreen("founders");
  };

  const handleViewMap = () => {
    setScreen("map");
  };

  const handleBackToStart = () => {
    setScreen("start");
  };

  const handleLevelComplete = (storyId: number) => {
    setLastStoryId(storyId);
    setScreen("story");
  };

  const handleContinueFromStory = () => {
    setLevel((prev) => prev + 1);
    setScreen("game");
  };

  return (
    <>
      {screen === "start" && (
        <StartScreen
          onStart={handleStart}
          onViewStories={handleViewStories}
          onViewMap={handleViewMap}
        />
      )}
      {screen === "founders" && <FoundersStory onBack={handleBackToStart} />}
      {screen === "game" && (
        <GamePlay
          level={level}
          onBack={handleBackToStart}
          onLevelComplete={handleLevelComplete}
        />
      )}
      {screen === "story" && (
        <StoryReveal storyId={lastStoryId} onContinue={handleContinueFromStory} />
      )}
      {screen === "map" && (
        <ProgressMap currentLevel={level} onBack={handleBackToStart} />
      )}
    </>
  );
};

export default Index;
