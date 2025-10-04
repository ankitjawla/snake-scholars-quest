import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Target, TrendingUp, BookOpen, Star } from "lucide-react";
import { getStoredProgress } from "@/utils/progressStorage";
import { educationalTopics } from "@/data/educationalContent";

interface ProgressDashboardProps {
  onBack: () => void;
  onReviewTopic: (topicId: number) => void;
}

export const ProgressDashboard = ({ onBack, onReviewTopic }: ProgressDashboardProps) => {
  const progress = getStoredProgress();
  
  const totalTopics = educationalTopics.length;
  const completedTopics = progress.topicsCompleted.length;
  const inProgressTopics = progress.topicsInProgress.length;
  const completionRate = (completedTopics / totalTopics) * 100;

  const masteredCount = progress.masteryLevels.filter(m => m.level === "mastered").length;
  const advancedCount = progress.masteryLevels.filter(m => m.level === "advanced").length;

  const totalQuizzes = progress.quizAttempts.length;
  const averageScore = totalQuizzes > 0
    ? progress.quizAttempts.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes
    : 0;

  // Topics that need review (based on spaced repetition)
  const topicsNeedingReview = progress.nextReviewDate
    .filter(review => new Date(review.date) <= new Date())
    .slice(0, 5);

  // Weak areas (topics with low quiz scores)
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

  // Recent achievements
  const recentlyMastered = progress.masteryLevels
    .filter(m => m.level === "mastered")
    .slice(-5)
    .reverse();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold mb-8">Your Learning Progress</h1>

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

        {topicsNeedingReview.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Due for Review</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              These topics are ready for review based on spaced repetition
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
                      Review Now
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {weakAreas.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-destructive" />
              <h2 className="text-2xl font-bold">Areas to Improve</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Focus on these topics to boost your understanding
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
                      Practice
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
              <h2 className="text-2xl font-bold">Recently Mastered</h2>
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
