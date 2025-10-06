import { useState, useCallback } from "react";

export type Screen = "start" | "assessment" | "topic" | "lesson" | "practice" | "game" | "challenge";

export const useGameState = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("start");
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [assessmentPassed, setAssessmentPassed] = useState(false);

  const navigateTo = useCallback((screen: Screen, topicId?: number) => {
    setCurrentScreen(screen);
    if (topicId !== undefined) {
      setSelectedTopicId(topicId);
    }
  }, []);

  const goToStart = useCallback(() => {
    setCurrentScreen("start");
    setSelectedTopicId(null);
  }, []);

  const selectTopic = useCallback((topicId: number) => {
    setSelectedTopicId(topicId);
  }, []);

  const passAssessment = useCallback(() => {
    setAssessmentPassed(true);
  }, []);

  return {
    currentScreen,
    selectedTopicId,
    assessmentPassed,
    navigateTo,
    goToStart,
    selectTopic,
    passAssessment,
  };
};
