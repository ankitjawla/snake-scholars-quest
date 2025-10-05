import { useState } from "react";
import { StartScreen } from "@/components/StartScreen";
import { EndlessRunner } from "@/components/EndlessRunner";
import { TopicReveal } from "@/components/TopicReveal";
import { TopicsLibrary } from "@/components/TopicsLibrary";
import { FoundersStory } from "@/components/FoundersStory";
import { LearningModeSelector } from "@/components/LearningModeSelector";
import { TopicSelector } from "@/components/TopicSelector";
import { InteractiveLesson } from "@/components/InteractiveLesson";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { AssessmentGate } from "@/components/AssessmentGate";
import { LearningMode } from "@/types/userProgress";
import { hasCompletedLesson } from "@/utils/progressStorage";
import { educationalTopics } from "@/data/educationalContent";

type Screen = "start" | "mode-select" | "topic-select" | "assessment" | "lesson" | "game" | "reveal" | "library" | "founders" | "progress";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [selectedMode, setSelectedMode] = useState<LearningMode>("practice");
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [lastScore, setLastScore] = useState(0);
  const [lastTopicId, setLastTopicId] = useState(1);
  const [highScore, setHighScore] = useState(0);

  const handleStart = () => {
    setScreen("mode-select");
  };

  const handleModeSelect = (mode: LearningMode) => {
    setSelectedMode(mode);
    setScreen("topic-select");
  };

  const handleTopicSelect = (topicId: number) => {
    setSelectedTopicId(topicId);
    
    // Check if lesson is already completed
    if (hasCompletedLesson(topicId)) {
      if (selectedMode === "practice") {
        // Go to assessment gate before game
        setScreen("assessment");
      } else {
        // In study mode, go to lesson
        setScreen("lesson");
      }
    } else {
      // Show lesson first
      setScreen("lesson");
    }
  };

  const handleAssessmentPass = () => {
    setScreen("game");
  };

  const handleAssessmentRetry = () => {
    // Generate new shuffled questions and retry
    setScreen("assessment");
  };

  const handleLessonComplete = () => {
    if (selectedMode === "practice") {
      // After lesson in practice mode, go to assessment gate
      setScreen("assessment");
    } else {
      // In study mode, go back to topic selection
      setScreen("topic-select");
    }
  };

  const handleViewTopics = () => {
    setScreen("library");
  };

  const handleViewFounders = () => {
    setScreen("founders");
  };

  const handleViewProgress = () => {
    setScreen("progress");
  };

  const handleReviewTopic = (topicId: number) => {
    setSelectedTopicId(topicId);
    setScreen("lesson");
  };

  const handleBackToStart = () => {
    setScreen("start");
    setSelectedTopicId(null);
  };

  const handleBackToModes = () => {
    setScreen("mode-select");
  };

  const handleBackToTopics = () => {
    setScreen("topic-select");
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
          onViewFounders={handleViewFounders}
          onViewProgress={handleViewProgress}
          highScore={highScore}
        />
      )}
      {screen === "mode-select" && (
        <LearningModeSelector
          onSelectMode={handleModeSelect}
          onBack={handleBackToStart}
        />
      )}
      {screen === "topic-select" && (
        <TopicSelector
          onSelectTopic={handleTopicSelect}
          onBack={handleBackToModes}
          mode={selectedMode}
        />
      )}
      {screen === "lesson" && selectedTopicId && (
        <InteractiveLesson
          topicId={selectedTopicId}
          mode={selectedMode}
          onComplete={handleLessonComplete}
          onBack={handleBackToTopics}
        />
      )}
      {screen === "assessment" && selectedTopicId && (() => {
        const topic = educationalTopics.find(t => t.id === selectedTopicId);
        if (!topic) return null;
        
        const questions = topic.assessmentQuestions || 
          require('@/utils/questionBank').generateAssessmentQuestions(
            topic.id,
            topic.question,
            topic.options,
            topic.correctAnswer,
            topic.explanation
          );
        
        return (
          <AssessmentGate
            topicId={selectedTopicId}
            topicTitle={topic.title}
            questions={questions}
            onPass={handleAssessmentPass}
            onRetry={handleAssessmentRetry}
          />
        );
      })()}
      {screen === "game" && (
        <EndlessRunner 
          onGameOver={handleGameOver} 
          onHome={handleBackToStart}
          topicId={selectedTopicId || undefined}
        />
      )}
      {screen === "reveal" && (
        <TopicReveal
          topicId={lastTopicId}
          score={lastScore}
          onContinue={handleContinueFromReveal}
        />
      )}
      {screen === "library" && <TopicsLibrary onBack={handleBackToStart} />}
      {screen === "founders" && <FoundersStory onBack={handleBackToStart} />}
      {screen === "progress" && (
        <ProgressDashboard 
          onBack={handleBackToStart}
          onReviewTopic={handleReviewTopic}
        />
      )}
    </>
  );
};

export default Index;
