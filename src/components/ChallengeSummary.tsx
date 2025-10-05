import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Award, Clock, RefreshCw, Trophy, Zap } from "lucide-react";
import type { ChallengeResult } from "@/types/challenge";

interface ChallengeSummaryProps {
  result: ChallengeResult;
  onReplay: () => void;
  onBack: () => void;
  onLeaderboard: () => void;
  simpleMode: boolean;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
};

export const ChallengeSummary = ({ result, onReplay, onBack, onLeaderboard, simpleMode }: ChallengeSummaryProps) => {
  const accuracyProgress = Math.min(100, Math.max(0, result.accuracy));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {simpleMode ? "Back" : "Back to Modes"}
          </Button>
          <Button variant="outline" onClick={onLeaderboard} className="text-slate-100 border-slate-500">
            <Trophy className="mr-2 h-4 w-4" />
            {simpleMode ? "Leaderboard" : "View Leaderboard"}
          </Button>
        </div>

        <Card className="bg-slate-900/80 border-slate-700 p-8 text-center space-y-6 shadow-2xl">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-indigo-500/20 rounded-full" />
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-500/20 border border-indigo-300">
                <Zap className="w-10 h-10 text-indigo-300" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {result.accuracy >= 90
                ? simpleMode
                  ? "Flawless!"
                  : "Challenge Champion!"
                : result.accuracy >= 70
                ? simpleMode
                  ? "Great job!"
                  : "Epic Effort!"
                : simpleMode
                ? "Keep training!"
                : "Challenge Complete"}
            </h1>
            <p className="text-slate-300 text-lg">
              {simpleMode
                ? `You solved ${result.correct} of ${result.total} tasks. +${result.stars} ⭐`
                : `You solved ${result.correct} of ${result.total} questions with ${result.accuracy}% accuracy. +${result.stars} stars earned!`}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{simpleMode ? "Accuracy" : "Accuracy Score"}</span>
              <span>{result.accuracy}%</span>
            </div>
            <Progress value={accuracyProgress} className="h-3 bg-slate-800" />
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-left">
            <Card className="bg-slate-950/70 border-slate-800 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                <p className="text-sm uppercase tracking-wide text-slate-300">Best streak</p>
              </div>
              <p className="text-2xl font-semibold">{result.bestStreak}</p>
              <p className="text-xs text-slate-400">Longest chain of correct answers</p>
            </Card>
            <Card className="bg-slate-950/70 border-slate-800 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-sky-400" />
                <p className="text-sm uppercase tracking-wide text-slate-300">Total time</p>
              </div>
              <p className="text-2xl font-semibold">{formatDuration(result.timeSpent)}</p>
              <p className="text-xs text-slate-400">Fastest answer: {result.fastestAnswer ? `${result.fastestAnswer}s` : "—"}</p>
            </Card>
            <Card className="bg-slate-950/70 border-slate-800 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-5 w-5 text-emerald-400" />
                <p className="text-sm uppercase tracking-wide text-slate-300">Stars earned</p>
              </div>
              <p className="text-2xl font-semibold">+{result.stars}</p>
              <p className="text-xs text-slate-400">Spend them on power-ups and skins</p>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row md:justify-center gap-3 pt-4">
            <Button variant="default" onClick={onReplay} className="bg-indigo-500 hover:bg-indigo-400">
              <RefreshCw className="mr-2 h-4 w-4" />
              {simpleMode ? "Play again" : "Play Challenge Again"}
            </Button>
            <Button variant="secondary" onClick={onBack} className="bg-slate-800 border-slate-700">
              {simpleMode ? "Mode select" : "Choose another mode"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
