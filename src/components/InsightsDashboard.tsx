import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, TrendingUp, Target, Clock, Award } from "lucide-react";
import { getStoredProgress } from "@/utils/progressStorage";
import { exportProgressAsJSON, exportProgressAsCSV } from "@/utils/exportProgress";
import { educationalTopics } from "@/data/educationalContent";

export const InsightsDashboard = () => {
  const progress = getStoredProgress();

  const insights = useMemo(() => {
    const totalTopics = educationalTopics.length;
    const completedCount = progress.topicsCompleted.length;
    const completionRate = (completedCount / totalTopics) * 100;
    
    const avgAccuracy = progress.challengeHistory.length > 0
      ? progress.challengeHistory.reduce((sum, ch) => sum + ch.accuracy, 0) / progress.challengeHistory.length
      : 0;
    
    const recentActivity = progress.lessonsViewed
      .filter(l => {
        const daysSince = (Date.now() - l.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince <= 7;
      })
      .length;
    
    const strongTopics = progress.masteryLevels
      .filter(m => m.level === "mastered" || m.level === "advanced")
      .map(m => educationalTopics.find(t => t.id === m.topicId)?.title)
      .filter(Boolean)
      .slice(0, 3);
    
    const needsPractice = progress.masteryLevels
      .filter(m => m.level === "beginner")
      .map(m => educationalTopics.find(t => t.id === m.topicId)?.title)
      .filter(Boolean)
      .slice(0, 3);

    return {
      completionRate,
      avgAccuracy,
      recentActivity,
      strongTopics,
      needsPractice,
      totalStars: progress.stars,
      totalMinutes: progress.totalLearningMinutes,
      currentStreak: progress.streak.dailyCount,
    };
  }, [progress]);

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Learning Insights</h2>
        <div className="flex gap-2">
          <Button onClick={exportProgressAsCSV} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={exportProgressAsJSON} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Completion</p>
              <p className="text-2xl font-bold">{Math.round(insights.completionRate)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Accuracy</p>
              <p className="text-2xl font-bold">{Math.round(insights.avgAccuracy * 100)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Learning Time</p>
              <p className="text-2xl font-bold">{Math.round(insights.totalMinutes / 60)}h</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Stars</p>
              <p className="text-2xl font-bold">{insights.totalStars}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Strong Topics
          </h3>
          {insights.strongTopics.length > 0 ? (
            <ul className="space-y-2">
              {insights.strongTopics.map((topic, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-2xl">🌟</span>
                  <span className="text-foreground">{topic}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Complete more topics to see your strengths!</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            Needs Practice
          </h3>
          {insights.needsPractice.length > 0 ? (
            <ul className="space-y-2">
              {insights.needsPractice.map((topic, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  <span className="text-foreground">{topic}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">You're doing great! No weak areas found.</p>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity (Last 7 Days)</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Lessons Viewed</span>
            <span className="font-medium">{insights.recentActivity}</span>
          </div>
          <Progress value={(insights.recentActivity / 7) * 100} className="h-2" />
        </div>
      </Card>
    </div>
  );
};
