import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp } from "lucide-react";
import { getRecommendedTopics, getPersonalizedEncouragement, calculateStudyStreak } from "@/utils/adaptiveLearning";
import { educationalTopics } from "@/data/educationalContent";

interface LearningRecommendationsProps {
  onSelectTopic: (topicId: number) => void;
}

export const LearningRecommendations = ({ onSelectTopic }: LearningRecommendationsProps) => {
  const recommendedTopics = getRecommendedTopics(3);
  const encouragement = getPersonalizedEncouragement();
  const streak = calculateStudyStreak();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-primary text-primary-foreground">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="w-6 h-6" />
          <h3 className="text-xl font-bold">Keep Going!</h3>
        </div>
        <p className="mb-2">{encouragement}</p>
        {streak > 0 && (
          <p className="text-sm opacity-90">
            🔥 {streak} day streak! Keep it up!
          </p>
        )}
      </Card>

      {recommendedTopics.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Recommended for You</h3>
          </div>
          <div className="space-y-3">
            {recommendedTopics.map(topicId => {
              const topic = educationalTopics.find(t => t.id === topicId);
              if (!topic) return null;
              return (
                <div
                  key={topicId}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{topic.title}</p>
                    <p className="text-sm text-muted-foreground">{topic.subject}</p>
                  </div>
                  <Button size="sm" onClick={() => onSelectTopic(topicId)}>
                    Start
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
