import { useState } from "react";
import { StartScreen } from "@/components/StartScreen";
import { EndlessRunner } from "@/components/EndlessRunner";
import { TopicReveal } from "@/components/TopicReveal";
import { TopicsLibrary } from "@/components/TopicsLibrary";

type Screen = "start" | "game" | "reveal" | "library";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [lastScore, setLastScore] = useState(0);
  const [lastTopicId, setLastTopicId] = useState(1);
  const [highScore, setHighScore] = useState(0);

  const handleStart = () => {
    setScreen("game");
  };

  const handleViewTopics = () => {
    setScreen("library");
  };

  const handleBackToStart = () => {
    setScreen("start");
  };

  const handleGameOver = (score: number, topicId: number) => {
    setLastScore(score);
    setLastTopicId(topicId);
    if (score > highScore) {
      setHighScore(score);
    }
    setScreen("reveal");
  };

  const handleContinueFromReveal = () => {
    setScreen("start");
  };

  return (
    <>
      {screen === "start" && (
        <StartScreen
          onStart={handleStart}
          onViewTopics={handleViewTopics}
          highScore={highScore}
        />
      )}
      {screen === "game" && (
        <EndlessRunner onGameOver={handleGameOver} onHome={handleBackToStart} />
      )}
      {screen === "reveal" && (
        <TopicReveal
          topicId={lastTopicId}
          score={lastScore}
          onContinue={handleContinueFromReveal}
        />
      )}
      {screen === "library" && <TopicsLibrary onBack={handleBackToStart} />}
    </>
  );
};

export default Index;
