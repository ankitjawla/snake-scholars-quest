import { useMemo, useState } from "react";
import { ArrowLeft, Clock3, FileText, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { educationalTopics } from "@/data/educationalContent";
import { type UserProgress } from "@/types/userProgress";

interface ParentTeacherViewProps {
  onBack: () => void;
  progress: UserProgress;
  simpleMode: boolean;
}

const buildWorksheet = (topicId: number, count = 10) => {
  const topic = educationalTopics.find(item => item.id === topicId);
  if (!topic) return [];
  const baseQuestions = topic.assessmentQuestions ?? [];
  const questions: string[] = [];
  let index = 0;
  while (questions.length < count) {
    if (baseQuestions[index]) {
      questions.push(baseQuestions[index].question);
    } else {
      questions.push(`${topic.title}: ${topic.question}`);
    }
    index = (index + 1) % Math.max(baseQuestions.length, 1);
    if (baseQuestions.length === 0 && questions.length >= count) break;
  }
  return questions;
};

export const ParentTeacherView = ({ onBack, progress, simpleMode }: ParentTeacherViewProps) => {
  const [selectedWorksheetTopic, setSelectedWorksheetTopic] = useState<number | null>(null);

  const totalMinutes = progress.totalLearningMinutes ?? 0;
  const lastSession = progress.lastSessionDate ? new Date(progress.lastSessionDate) : null;

  const weakTopics = useMemo(() => {
    const attempts = progress.quizAttempts.slice(-10);
    const aggregated = new Map<number, { scores: number[] }>();
    attempts.forEach(attempt => {
      if (!aggregated.has(attempt.topicId)) {
        aggregated.set(attempt.topicId, { scores: [] });
      }
      aggregated.get(attempt.topicId)!.scores.push(attempt.score);
    });
    return Array.from(aggregated.entries())
      .map(([topicId, data]) => ({
        topicId,
        average: data.scores.reduce((sum, value) => sum + value, 0) / data.scores.length,
      }))
      .filter(item => item.average < 70)
      .sort((a, b) => a.average - b.average)
      .slice(0, 3);
  }, [progress.quizAttempts]);

  const masterySummary = progress.masteryLevels.reduce((acc, mastery) => {
    acc[mastery.level] = (acc[mastery.level] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const worksheetQuestions = selectedWorksheetTopic ? buildWorksheet(selectedWorksheetTopic) : [];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {simpleMode ? "Back" : "Back to dashboard"}
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{simpleMode ? "Grown-up View" : "Parent & Teacher View"}</h1>
            <p className="text-slate-600">
              {simpleMode
                ? "Peek at progress, stickers, and practice ideas."
                : "Quick snapshot of mastered concepts, time on task, and printable practice sets for focus areas."}
            </p>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
            <Users className="h-3 w-3 mr-1" /> Support crew ready
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 bg-white shadow-sm border border-slate-200">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Mastered Concepts</h2>
            <p className="text-3xl font-bold text-slate-900 mt-1">{progress.topicsCompleted.length}</p>
            <p className="text-xs text-slate-500 mt-2">Advanced badges: {masterySummary["advanced"] ?? 0} • Mastered: {masterySummary["mastered"] ?? 0}</p>
          </Card>
          <Card className="p-4 bg-white shadow-sm border border-slate-200">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Time on Task</h2>
            <p className="text-3xl font-bold text-slate-900 mt-1">{totalMinutes} mins</p>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <Clock3 className="h-3 w-3" />
              {lastSession ? `Last session: ${lastSession.toLocaleDateString()}` : "No sessions yet"}
            </p>
          </Card>
          <Card className="p-4 bg-white shadow-sm border border-slate-200">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Current streak</h2>
            <p className="text-3xl font-bold text-slate-900 mt-1">{progress.streak.dailyCount} days</p>
            <p className="text-xs text-slate-500 mt-2">Catch-up tokens left: {progress.streak.catchUpTokens}</p>
          </Card>
        </div>

        <Card className="p-5 bg-white shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{simpleMode ? "Quick practice" : "Printable practice sets"}</h2>
              <p className="text-sm text-slate-600">{simpleMode ? "Pick a topic to get 10 questions." : "Focus on areas needing extra love. Click a set to print or share."}</p>
            </div>
            <Button variant="outline" onClick={() => window.print()}>
              <FileText className="mr-2 h-4 w-4" /> Print view
            </Button>
          </div>

          <div className="mt-4 grid md:grid-cols-3 gap-3">
            {weakTopics.length === 0 && (
              <p className="text-sm text-slate-500 col-span-full">Great news! Recent quizzes look strong. Pick any chapter to keep practicing.</p>
            )}
            {weakTopics.map(item => {
              const topic = educationalTopics.find(entry => entry.id === item.topicId);
              if (!topic) return null;
              return (
                <Button
                  key={topic.id}
                  variant={selectedWorksheetTopic === topic.id ? "default" : "outline"}
                  className="justify-start h-auto py-4 px-4 text-left"
                  onClick={() => setSelectedWorksheetTopic(topic.id)}
                >
                  <div>
                    <p className="font-semibold text-slate-900">{topic.title}</p>
                    <p className="text-xs text-slate-500">Avg score {item.average.toFixed(0)}%</p>
                  </div>
                </Button>
              );
            })}
          </div>

          {worksheetQuestions.length > 0 && (
            <div className="mt-5 space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">10-question practice set</h3>
              <ol className="list-decimal ml-5 space-y-1 text-sm text-slate-700">
                {worksheetQuestions.map((question, index) => (
                  <li key={`${question}-${index}`}>{question}</li>
                ))}
              </ol>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
