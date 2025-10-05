import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCallback, useMemo, useState } from "react";
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
import { QuestMap } from "@/components/QuestMap";
import { MicroChallengeCard } from "@/components/MicroChallenge";
import { LeaderboardPanel } from "@/components/LeaderboardPanel";
import { CreativeStudio } from "@/components/CreativeStudio";
import { ParentTeacherView } from "@/components/ParentTeacherView";
import { LearningMode } from "@/types/userProgress";
import {
  awardStars,
  getStoredProgress,
  grantPowerUp,
  hasCompletedLesson,
  recordChapterCompletion,
  setActiveSkin,
  spendStars,
  unlockChapter,
  unlockCreativeSkin,
  updateLeaderboardProfile,
  updateStickerAlbum,
  updateStreak,
} from "@/utils/progressStorage";
import { hasCompletedLesson } from "@/utils/progressStorage";
import {
  educationalTopics,
  type AssessmentQuestion,
  type EducationalTopic,
} from "@/data/educationalContent";
import { generateAssessmentQuestions } from "@/utils/questionBank";
import {
  getChapterByTopicId,
  getChapterTopics,
  getNextChapterId,
  questChapters,
} from "@/data/questMap";
import { getChallengeForTopic, type MicroChallenge } from "@/data/microChallenges";

type PowerUpId = "length-boost" | "angle-shield" | "fraction-freeze";

type Screen =
  | "start"
  | "mode-select"
  | "quest-map"
  | "topic-select"
  | "assessment"
  | "micro-challenge"
  | "lesson"
  | "game"
  | "reveal"
  | "library"
  | "founders"
  | "progress"
  | "leaderboard"
  | "creative"
  | "parent";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [selectedMode, setSelectedMode] = useState<LearningMode>("practice");
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [lastScore, setLastScore] = useState(0);
  const [lastTopicId, setLastTopicId] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[] | null>(null);
  const [pendingRewards, setPendingRewards] = useState<{ powerUps: PowerUpId[]; stars: number }>({ powerUps: [], stars: 0 });
  const [sessionPowerUps, setSessionPowerUps] = useState<PowerUpId[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<MicroChallenge | null>(null);
  const [simpleMode, setSimpleMode] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [playerProgress, setPlayerProgress] = useState(getStoredProgress);

  const refreshProgress = () => setPlayerProgress(getStoredProgress());

  useEffect(() => {
    refreshProgress();
  }, []);
  const [assessmentQuestions, setAssessmentQuestions] = useState<
    AssessmentQuestion[] | null
  >(null);

  const selectedTopic = useMemo(() => {
    if (selectedTopicId == null) return null;
    return educationalTopics.find(topic => topic.id === selectedTopicId) ?? null;
  }, [selectedTopicId]);

  const buildAssessmentQuestions = useCallback(
    (topic: EducationalTopic): AssessmentQuestion[] =>
      topic.assessmentQuestions ??
      generateAssessmentQuestions(
        topic.id,
        topic.question,
        topic.options,
        topic.correctAnswer,
        topic.explanation,
      ),
    [],
  );

  const handleStart = () => {
    updateStreak();
    refreshProgress();
    setScreen("mode-select");
  };

  const handleModeSelect = (mode: LearningMode) => {
    setSelectedMode(mode);
    setScreen("quest-map");
  };

  const handleOpenChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setScreen("topic-select");
  };

  const handleTopicSelect = (topicId: number) => {
    setSelectedTopicId(topicId);

    const topic = educationalTopics.find(t => t.id === topicId);
    if (topic) {
      setAssessmentQuestions(buildAssessmentQuestions(topic));
    } else {
      setAssessmentQuestions(null);
    }
    }

    const lessonCompleted = hasCompletedLesson(topicId);
    if (lessonCompleted && selectedMode === "practice") {
      setScreen("assessment");
      return;
    }

    setScreen("lesson");
  };

    const lessonCompleted = hasCompletedLesson(topicId);
    if (lessonCompleted && selectedMode === "practice") {
      setScreen("assessment");
      return;
    }

    setScreen("lesson");
  };

  const handleAssessmentRetry = () => {
    if (selectedTopic) {
      setAssessmentQuestions(buildAssessmentQuestions(selectedTopic));
    }
    setScreen("assessment");
  };

  const handleLessonComplete = () => {
    if (selectedMode === "practice") {
      setScreen("assessment");
    } else {
      setScreen("quest-map");
    }
  };

  const applyRewards = (powerUps: PowerUpId[], stars: number) => {
    if (powerUps.length > 0) {
      powerUps.forEach(power => grantPowerUp(power));
      setSessionPowerUps(powerUps);
    } else {
      setSessionPowerUps([]);
    }

    if (stars > 0) {
      awardStars(stars);
    }
    refreshProgress();
  };

  const handleAssessmentPass = (result: { correct: number; total: number; stars: number; powerUps: PowerUpId[] }) => {
    if (!selectedTopic) return;

    const chapter = getChapterByTopicId(selectedTopic.id);
    if (chapter) {
      recordChapterCompletion(chapter.id, selectedTopic.id);
      if (result.correct >= 2) {
        const nextChapterId = getNextChapterId(chapter.id);
        if (nextChapterId) {
          unlockChapter(nextChapterId);
        }
      }
    }

    const tier = result.correct === result.total ? 3 : result.correct === result.total - 1 ? 2 : 1;
    updateStickerAlbum(selectedTopic.id, tier);

    setPendingRewards({ powerUps: result.powerUps, stars: result.stars });

    const challenge = getChallengeForTopic(selectedTopic.id);
    if (challenge) {
      setActiveChallenge(challenge);
      setScreen("micro-challenge");
    } else {
      applyRewards(result.powerUps, result.stars);
      setPendingRewards({ powerUps: [], stars: 0 });
      setScreen("game");
    }

    refreshProgress();
  };

  const handleMicroChallengeFinish = (outcome: { success: boolean; stars: number; powerUpId: string | null }) => {
    const rewardPowerUps = [...pendingRewards.powerUps];
    if (outcome.success && outcome.powerUpId) {
      rewardPowerUps.push(outcome.powerUpId as PowerUpId);
    }
    const totalStars = pendingRewards.stars + (outcome.success ? outcome.stars : 0);
    applyRewards(rewardPowerUps, totalStars);
    setPendingRewards({ powerUps: [], stars: 0 });
    setActiveChallenge(null);
    setScreen("game");
  };

  const handleViewTopics = () => {
    setScreen("quest-map");
  };

  const handleViewFounders = () => {
    setScreen("founders");
  };

  const handleViewProgress = () => {
    refreshProgress();
    setScreen("progress");
  };

  const handleViewLeaderboard = () => {
    refreshProgress();
    setScreen("leaderboard");
  };

  const handleOpenParent = () => {
    refreshProgress();
    setScreen("parent");
  };

  const handleOpenCreative = () => {
    refreshProgress();
    setScreen("creative");
  };

  const handleReviewTopic = (topicId: number) => {
    setSelectedTopicId(topicId);
    setScreen("lesson");
  };

  const handleBackToStart = () => {
    setScreen("start");
    setSelectedTopicId(null);
    setAssessmentQuestions(null);
    setSessionPowerUps([]);
  };

  const handleBackToModes = () => {
    setScreen("mode-select");
  };

  const handleBackToQuestMap = () => {
    setScreen("quest-map");
  };

  const handleGameOver = (score: number, topicId: number) => {
    setLastScore(score);
    setLastTopicId(topicId);
    if (score > highScore) {
      setHighScore(score);
    }
    setSessionPowerUps([]);
    refreshProgress();
    setScreen("reveal");
  };

  const handleContinueFromReveal = () => {
    setScreen("quest-map");
  };

  const handleEarnStarsInGame = (stars: number) => {
    if (stars > 0) {
      awardStars(stars);
      refreshProgress();
    }
  };

  const handleUnlockSkin = (skinId: string, cost: number) => {
    if (!spendStars(cost)) {
      toast.error("Not enough stars yet. Try a challenge!", { duration: 2000 });
      return;
    }
    unlockCreativeSkin(skinId);
    refreshProgress();
  };

  const handleEquipSkin = (skinId: string) => {
    setActiveSkin(skinId);
    refreshProgress();
  };

  const handleSaveLeaderboardProfile = (profile: { nickname: string; classCode?: string; percentileBand?: string }) => {
    updateLeaderboardProfile(profile);
    refreshProgress();
    setScreen("progress");
  };

  const currentChapter = selectedChapterId ? questChapters.find(chapter => chapter.id === selectedChapterId) : null;
  const chapterTopicIds = currentChapter ? getChapterTopics(currentChapter.id).map(topic => topic.id) : undefined;

  const averageScore = playerProgress.quizAttempts.length
    ? playerProgress.quizAttempts.reduce((sum, quiz) => sum + quiz.score, 0) / playerProgress.quizAttempts.length
    : 0;
  const percentile = Math.min(99, Math.max(5, Math.round(averageScore)));

  const leaderboardProfile = playerProgress.leaderboardProfile;

  return (
    <>
      {screen === "start" && (
        <StartScreen
          onStart={handleStart}
          onViewTopics={handleViewTopics}
          onViewFounders={handleViewFounders}
          onViewProgress={handleViewProgress}
          onViewParent={handleOpenParent}
          onViewLeaderboard={handleViewLeaderboard}
          onOpenCreative={handleOpenCreative}
          onToggleSimpleMode={() => setSimpleMode(!simpleMode)}
          onToggleSpeech={() => setSpeechEnabled(!speechEnabled)}
          simpleMode={simpleMode}
          speechEnabled={speechEnabled}
          highScore={highScore}
        />
      )}
      {screen === "mode-select" && (
        <LearningModeSelector
          onSelectMode={handleModeSelect}
          onBack={handleBackToStart}
        />
      )}
      {screen === "quest-map" && (
        <QuestMap
          onBack={handleBackToModes}
          onOpenChapter={handleOpenChapter}
          chapterProgress={playerProgress.chapterProgress}
          stars={playerProgress.stars}
          simpleMode={simpleMode}
        />
      )}
      {screen === "topic-select" && currentChapter && (
        <TopicSelector
          onSelectTopic={handleTopicSelect}
          onBack={handleBackToQuestMap}
          onBackToMap={handleBackToQuestMap}
          mode={selectedMode}
          availableTopicIds={chapterTopicIds}
          chapterTitle={currentChapter.title}
          simpleMode={simpleMode}
        />
      )}
      {screen === "lesson" && selectedTopicId && (
        <InteractiveLesson
          topicId={selectedTopicId}
          mode={selectedMode}
          onComplete={handleLessonComplete}
          onBack={handleBackToQuestMap}
        />
      )}
      {screen === "assessment" && selectedTopic && assessmentQuestions && (
        <AssessmentGate
          topicId={selectedTopic.id}
          topicTitle={selectedTopic.title}
          questions={assessmentQuestions}
          onPass={handleAssessmentPass}
          onRetry={handleAssessmentRetry}
          simpleMode={simpleMode}
          speechEnabled={speechEnabled}
        />
      )}
      {screen === "micro-challenge" && activeChallenge && (
        <MicroChallengeCard
          challenge={activeChallenge}
          onFinish={handleMicroChallengeFinish}
          simpleMode={simpleMode}
          enableSpeech={speechEnabled}
        />
      )}
      {screen === "assessment" && selectedTopic && assessmentQuestions && (
        <AssessmentGate
          topicId={selectedTopic.id}
          topicTitle={selectedTopic.title}
          questions={assessmentQuestions}
          onPass={handleAssessmentPass}
          onRetry={handleAssessmentRetry}
        />
      )}
      {screen === "game" && (
        <EndlessRunner
          onGameOver={handleGameOver}
          onHome={handleBackToStart}
          topicId={selectedTopicId || undefined}
          activePowerUps={sessionPowerUps}
          onPowerUpConsumed={() => setSessionPowerUps([])}
          onEarnStars={handleEarnStarsInGame}
          simpleMode={simpleMode}
          skin={playerProgress.creative.activeSkin}
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
          onOpenParent={handleOpenParent}
          onOpenCreative={handleOpenCreative}
          simpleMode={simpleMode}
        />
      )}
      {screen === "leaderboard" && (
        <LeaderboardPanel
          onBack={handleBackToStart}
          percentile={percentile}
          averageScore={averageScore}
          profile={leaderboardProfile}
          onSaveProfile={handleSaveLeaderboardProfile}
          simpleMode={simpleMode}
        />
      )}
      {screen === "creative" && (
        <CreativeStudio
          stars={playerProgress.stars}
          unlockedSkins={playerProgress.creative.unlockedSkins}
          activeSkin={playerProgress.creative.activeSkin}
          onUnlock={handleUnlockSkin}
          onEquip={handleEquipSkin}
          onBack={handleBackToStart}
          simpleMode={simpleMode}
        />
      )}
      {screen === "parent" && (
        <ParentTeacherView
          onBack={handleBackToStart}
          progress={playerProgress}
          simpleMode={simpleMode}
        />
      )}
    </>
  );
};

export default Index;
