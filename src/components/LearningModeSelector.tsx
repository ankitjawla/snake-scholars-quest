import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Gamepad2, Trophy, ArrowLeft, Lock } from "lucide-react";
import { LearningMode } from "@/types/userProgress";
import { getStoredProgress } from "@/utils/progressStorage";

interface LearningModeSelectorProps {
  onSelectMode: (mode: LearningMode) => void;
  onBack: () => void;
}

export const LearningModeSelector = ({ onSelectMode, onBack }: LearningModeSelectorProps) => {
  const progress = getStoredProgress();
  const completedTopicsCount = progress.topicsCompleted.length;
  const challengeUnlocked = completedTopicsCount >= 10;

  const modes = [
    {
      id: "study" as LearningMode,
      title: "Study Mode",
      icon: BookOpen,
      emoji: "📚",
      description: "Learn at your own pace with interactive lessons and unlimited practice",
      features: ["No time pressure", "Step-by-step lessons", "Practice problems", "Earn study badges"],
      color: "primary",
      unlocked: true,
    },
    {
      id: "practice" as LearningMode,
      title: "Practice Mode",
      icon: Gamepad2,
      emoji: "🎮",
      description: "Complete lessons, then test your skills in the endless runner game",
      features: ["Lesson required first", "Topic-focused gameplay", "Quiz after game", "Unlimited replays"],
      color: "accent",
      unlocked: true,
    },
    {
      id: "challenge" as LearningMode,
      title: "Challenge Mode",
      icon: Trophy,
      emoji: "🏆",
      description: "Advanced mode with mixed topics and harder questions",
      features: ["Mixed subjects", "Time limits", "Leaderboards", "Certificates"],
      color: "secondary",
      unlocked: challengeUnlocked,
      requirement: challengeUnlocked ? "" : `Unlock by mastering 10 topics (${completedTopicsCount}/10)`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-background hover:text-background hover:bg-background/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-10 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-background mb-3">
            Choose Your Learning Path
          </h1>
          <p className="text-xl text-background/90">
            Select how you want to learn today
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {modes.map((mode, index) => (
            <Card
              key={mode.id}
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 animate-slide-up ${
                mode.unlocked ? "cursor-pointer" : "opacity-75 cursor-not-allowed"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => mode.unlocked && onSelectMode(mode.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{mode.emoji}</div>
                  {!mode.unlocked && (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                <h3 className="text-2xl font-bold mb-2">{mode.title}</h3>
                <p className="text-muted-foreground mb-4">{mode.description}</p>

                <ul className="space-y-2 mb-6">
                  {mode.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {mode.unlocked ? (
                  <Button className="w-full" variant="default">
                    <mode.icon className="mr-2 h-4 w-4" />
                    Select {mode.title}
                  </Button>
                ) : (
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">
                      {mode.requirement}
                    </div>
                    <Button className="w-full" variant="outline" disabled>
                      <Lock className="mr-2 h-4 w-4" />
                      Locked
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
