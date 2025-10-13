import { useMemo, useState, type ReactNode } from "react";
import { Sparkles, Home, Rocket, Brain, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { educationalTopics } from "@/data/educationalContent";
import { EndlessRunner } from "./EndlessRunner";
import { MathBlitzGame } from "./games/MathBlitzGame";
import { WordGardenGame } from "./games/WordGardenGame";
import type { PowerUpId } from "@/types/powerUps";
import { toast } from "sonner";

interface GameHubProps {
  onGameOver: (score: number, topicId: number) => void;
  onHome: () => void;
  topicId?: number;
  activePowerUps?: PowerUpId[];
  onPowerUpConsumed?: (powerUpId: PowerUpId) => void;
  onEarnStars?: (stars: number) => void;
  simpleMode: boolean;
  skin?: string;
}

type GameId = "runner" | "math-blitz" | "word-garden";

const gameConfigs: Record<
  GameId,
  {
    title: string;
    description: string;
    focus: string;
    accent: string;
    icon: ReactNode;
  }
> = {
  runner: {
    title: "Firefly Forest Dash",
    description: "Dodge obstacles, collect knowledge fireflies, and keep your reflexes sharp!",
    focus: "Movement & geometry instincts",
    accent: "border-emerald-300 bg-emerald-50",
    icon: <Rocket className="h-5 w-5" />,
  },
  "math-blitz": {
    title: "Math Meteor Mission",
    description: "Quick-fire number puzzles that reinforce addition, subtraction, multiplication, and division skills.",
    focus: "Mental math fluency",
    accent: "border-amber-300 bg-amber-50",
    icon: <Brain className="h-5 w-5" />,
  },
  "word-garden": {
    title: "Wonder Word Garden",
    description: "Decode clues to grow new vocabulary and science terms.",
    focus: "Reading comprehension & science vocab",
    accent: "border-sky-300 bg-sky-50",
    icon: <BookOpenCheck className="h-5 w-5" />,
  },
};

export const GameHub = ({
  onGameOver,
  onHome,
  topicId,
  activePowerUps = [],
  onPowerUpConsumed,
  onEarnStars,
  simpleMode,
  skin,
}: GameHubProps) => {
  const [activeGame, setActiveGame] = useState<GameId>("runner");
  const selectedTopic = useMemo(() => (topicId ? educationalTopics.find(topic => topic.id === topicId) : undefined), [topicId]);

  const handleSkillGameComplete = (
    result: { score: number; stars: number; correct: number; total: number; message: string },
  ) => {
    if (result.stars > 0) {
      onEarnStars?.(result.stars);
      toast.success(`⭐ ${result.stars} star${result.stars === 1 ? "" : "s"} earned!`, { description: result.message, duration: 2500 });
    } else {
      toast(`Great effort!`, { description: result.message, duration: 2500 });
    }

    const fallbackTopicId = topicId ?? selectedTopic?.id ?? 1;
    onGameOver(result.score, fallbackTopicId);
  };

  const handleRunnerGameOver = (score: number, runnerTopicId: number) => {
    const fallbackTopicId = runnerTopicId || topicId || selectedTopic?.id || 1;
    onGameOver(score, fallbackTopicId);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-2 pb-8">
      <Card className="border-2 border-purple-200 bg-purple-50/80 shadow-lg">
        <CardHeader className="flex flex-col gap-2">
          <CardTitle className="flex flex-wrap items-center gap-2 text-2xl font-bold text-purple-800">
            <Sparkles className="h-6 w-6" /> Arcade of Learning Adventures
          </CardTitle>
          <CardDescription className="text-purple-700">
            Choose a mini-game to sharpen different skills. Try them all to keep your streak and sticker album growing!
          </CardDescription>
          <div className="flex flex-wrap items-center gap-3 text-sm text-purple-700">
            {selectedTopic ? (
              <Badge variant="secondary" className="bg-white/80 text-purple-700 shadow">
                Focus topic: {selectedTopic.title}
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-white/80 text-purple-700 shadow">
                Practice mode: choose any skill you like
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              className="ml-auto rounded-full border-purple-300 text-purple-700 hover:bg-purple-100"
              onClick={onHome}
            >
              <Home className="mr-2 h-4 w-4" /> Back to home base
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        {(Object.keys(gameConfigs) as GameId[]).map(gameKey => {
          const config = gameConfigs[gameKey];
          const isActive = activeGame === gameKey;
          return (
            <button
              key={gameKey}
              type="button"
              onClick={() => setActiveGame(gameKey)}
              className={`flex h-full flex-col gap-2 rounded-xl border-2 p-4 text-left shadow transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.accent} ${isActive ? "ring-2 ring-purple-400" : "opacity-90 hover:opacity-100"}`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                {config.icon}
                {config.title}
              </div>
              <p className="text-sm text-purple-700/80">{config.description}</p>
              <Badge variant="secondary" className="w-fit bg-white/90 text-purple-700 shadow">
                {config.focus}
              </Badge>
            </button>
          );
        })}
      </div>

      <Card className="border-2 border-purple-200/70 bg-white/90 shadow-xl">
        <CardContent className="p-4">
          {activeGame === "runner" && (
            <EndlessRunner
              onGameOver={handleRunnerGameOver}
              onHome={onHome}
              topicId={topicId}
              activePowerUps={activePowerUps}
              onPowerUpConsumed={onPowerUpConsumed}
              onEarnStars={onEarnStars}
              simpleMode={simpleMode}
              skin={skin}
            />
          )}
          {activeGame === "math-blitz" && (
            <MathBlitzGame
              simpleMode={simpleMode}
              topicName={selectedTopic?.title}
              onComplete={handleSkillGameComplete}
            />
          )}
          {activeGame === "word-garden" && (
            <WordGardenGame
              simpleMode={simpleMode}
              topicName={selectedTopic?.title}
              onComplete={handleSkillGameComplete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
