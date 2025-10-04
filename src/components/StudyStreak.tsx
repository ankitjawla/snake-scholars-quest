import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { calculateStudyStreak } from "@/utils/adaptiveLearning";

export const StudyStreak = () => {
  const streak = calculateStudyStreak();

  if (streak === 0) return null;

  return (
    <Card className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
      <div className="flex items-center gap-3">
        <Flame className="w-8 h-8 text-orange-500" />
        <div>
          <div className="text-2xl font-bold text-foreground">{streak} Day Streak!</div>
          <p className="text-sm text-muted-foreground">
            {streak >= 7 ? "Incredible consistency! 🔥" : "Keep the momentum going!"}
          </p>
        </div>
      </div>
    </Card>
  );
};
