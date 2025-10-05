import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Target, TrendingUp, BookOpen, Star, Award, Flame, Zap, Clock } from "lucide-react";
import { getStoredProgress } from "@/utils/progressStorage";
import { educationalTopics } from "@/data/educationalContent";
import { StickerAlbum } from "./StickerAlbum";
import type { ChallengeAttempt } from "@/types/challenge";

interface ProgressDashboardProps {
  onBack: () => void;
  onReviewTopic: (topicId: number) => void;
  onOpenParent: () => void;
  onOpenCreative: () => void;
  simpleMode: boolean;
}

export const ProgressDashboard = ({ onBack, onReviewTopic, onOpenParent, onOpenCreative, simpleMode }: ProgressDashboardProps) => {
  const progress = getStoredProgress();

  const totalTopics = educationalTopics.length;
  const completedTopics = progress.topicsCompleted.length;
  const completionRate = (completedTopics / totalTopics) * 100;

  const masteredCount = progress.masteryLevels.filter(m => m.level === "mastered").length;
  const advancedCount = progress.masteryLevels.filter(m => m.level === "advanced").length;

  const totalQuizzes = progress.quizAttempts.length;
  const averageScore = totalQuizzes > 0
    ? progress.quizAttempts.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes
    : 0;

  const topicsNeedingReview = progress.nextReviewDate
    .filter(review => new Date(review.date) <= new Date())
    .slice(0, 5);

  const weakAreas = progress.quizAttempts
    .filter(quiz => quiz.score < 60)
    .reduce((acc, quiz) => {
      const existing = acc.find(q => q.topicId === quiz.topicId);
      if (existing) {
        existing.attempts++;
        existing.avgScore = (existing.avgScore + quiz.score) / 2;
      } else {
        acc.push({ topicId: quiz.topicId, attempts: 1, avgScore: quiz.score });
      }
      return acc;
    }, [] as { topicId: number; attempts: number; avgScore: number }[])
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 3);

  const recentlyMastered = progress.masteryLevels
    .filter(m => m.level === "mastered")
    .slice(-5)
    .reverse();

  const challengeHistory = progress.challengeHistory || [];
  const recentChallenges = challengeHistory.slice(-3).reverse();
  const bestChallenge = challengeHistory.reduce<ChallengeAttempt | null>((best, attempt) => {
    if (!best || attempt.accuracy > best.accuracy) {
      return attempt;
    }
    return best;
  }, null);
  const topChallengeStreak = challengeHistory.reduce((max, attempt) => Math.max(max, attempt.bestStreak), 0);
  const challengeStarsTotal = challengeHistory.reduce((sum, attempt) => sum + attempt.starsEarned, 0);
  const formatChallengeDate = (date: Date) =>
    new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const formatChallengeDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {simpleMode ? "Back" : "Back to Home"}
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">{simpleMode ? "My Progress" : "Your Learning Progress"}</h1>
            <p className="text-muted-foreground">{simpleMode ? "Stars, stickers, and streaks" : "Track concepts, badges, and streaks across Snake Scholars Quest."}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onOpenParent}>👪 {simpleMode ? "Grown-ups" : "Parent View"}</Button>
            <Button variant="outline" onClick={onOpenCreative}>🎨 {simpleMode ? "Snake skins" : "Creative Studio"}</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Topics Completed</p>
                <p className="text-3xl font-bold">{completedTopics}</p>
              </div>
            </div>
            <Progress value={completionRate} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedTopics} of {totalTopics} topics
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold">{averageScore.toFixed(0)}%</p>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{totalQuizzes} quizzes taken</Badge>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-8 h-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Mastery Level</p>
                <p className="text-3xl font-bold">{masteredCount}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{advancedCount} advanced</Badge>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Flame className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Daily streak</p>
                <p className="text-2xl font-bold">{progress.streak.dailyCount} days</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Catch-up tokens left: {progress.streak.catchUpTokens}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">Stars collected</p>
                <p className="text-2xl font-bold">{progress.stars}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Spend stars on power-ups and custom skins.</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Time on task</p>
                <p className="text-2xl font-bold">{progress.totalLearningMinutes} mins</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Last session: {progress.lastSessionDate ? new Date(progress.lastSessionDate).toLocaleDateString() : "—"}</p>
          </Card>
        </div>

        {challengeHistory.length > 0 && (
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-bold">{simpleMode ? "Challenge highlights" : "Challenge Mode Highlights"}</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{simpleMode ? "Attempts" : "Total Attempts"}</p>
                <p className="text-2xl font-semibold">{challengeHistory.length}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{simpleMode ? "Best accuracy" : "Best Accuracy"}</p>
                <p className="text-2xl font-semibold">{bestChallenge ? `${bestChallenge.accuracy}%` : "—"}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{simpleMode ? "Top streak" : "Longest Streak"}</p>
                <p className="text-2xl font-semibold">{topChallengeStreak}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{simpleMode ? "Stars" : "Stars Earned"}</p>
                <p className="text-2xl font-semibold">{challengeStarsTotal}</p>
              </div>
            </div>
            <div className="space-y-2">
              {recentChallenges.map(attempt => (
                <div key={attempt.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 bg-muted/70 rounded-lg">
                  <div>
                    <p className="font-semibold">{formatChallengeDate(attempt.completedAt)}</p>
                    <p className="text-sm text-muted-foreground">
                      {attempt.correct}/{attempt.total} correct • {attempt.accuracy}% • {formatChallengeDuration(attempt.durationSeconds)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-accent" />
                    <span>+{attempt.starsEarned} ⭐</span>
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{attempt.fastestAnswer ? `${attempt.fastestAnswer}s` : "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {topicsNeedingReview.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Due for Review</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              {simpleMode ? "Ready for a quick refresh" : "These topics are ready for review based on spaced repetition"}
            </p>
            <div className="space-y-2">
              {topicsNeedingReview.map(review => {
                const topic = educationalTopics.find(t => t.id === review.topicId);
                if (!topic) return null;
                return (
                  <div key={review.topicId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-semibold">{topic.title}</p>
                      <p className="text-sm text-muted-foreground">{topic.subject}</p>
                    </div>
                    <Button size="sm" onClick={() => onReviewTopic(review.topicId)}>
                      {simpleMode ? "Play" : "Review Now"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Sticker Album</h2>
          <StickerAlbum stickers={progress.stickerAlbum} simpleMode={simpleMode} />
        </div>

        {weakAreas.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-destructive" />
              <h2 className="text-2xl font-bold">Areas to Improve</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              {simpleMode ? "Practice these again" : "Focus on these topics to boost your understanding"}
            </p>
            <div className="space-y-2">
              {weakAreas.map(area => {
                const topic = educationalTopics.find(t => t.id === area.topicId);
                if (!topic) return null;
                return (
                  <div key={area.topicId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{topic.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={area.avgScore} className="h-2 flex-1" />
                        <span className="text-sm text-muted-foreground">{area.avgScore.toFixed(0)}%</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => onReviewTopic(area.topicId)} className="ml-4">
                      {simpleMode ? "Practice" : "Practice"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {recentlyMastered.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-bold">{simpleMode ? "Latest stickers" : "Recently Mastered"}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {recentlyMastered.map(mastery => {
                const topic = educationalTopics.find(t => t.id === mastery.topicId);
                if (!topic) return null;
                return (
                  <div key={mastery.topicId} className="p-3 bg-secondary/10 rounded-lg">
                    <p className="font-semibold">{topic.title}</p>
                    <p className="text-sm text-muted-foreground">{topic.subject}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
