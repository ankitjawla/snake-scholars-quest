import { useMemo } from "react";
import { ArrowLeft, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { questChapters, getChapterIndex, getNextChapterId } from "@/data/questMap";
import { type ChapterProgress } from "@/types/userProgress";

interface QuestMapProps {
  onBack: () => void;
  onOpenChapter: (chapterId: string) => void;
  chapterProgress: ChapterProgress[];
  stars: number;
  simpleMode: boolean;
}

const getChapterStatus = (chapterId: string, progress: ChapterProgress[]) => {
  const chapterProgress = progress.find(chapter => chapter.chapterId === chapterId);
  return {
    unlocked: chapterProgress?.unlocked ?? getChapterIndex(chapterId) === 0,
    badgeTier: chapterProgress?.badgeTier ?? 0,
    completedTopics: chapterProgress?.completedTopicIds?.length ?? 0,
  };
};

export const QuestMap = ({ onBack, onOpenChapter, chapterProgress, stars, simpleMode }: QuestMapProps) => {
  const unlockedChapters = useMemo(() => new Set(
    chapterProgress.filter(chapter => chapter.unlocked).map(chapter => chapter.chapterId),
  ), [chapterProgress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-white/80 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {simpleMode ? "Back" : "Back to Modes"}
          </Button>
          <div className="flex items-center gap-2 bg-amber-400/20 text-amber-200 px-4 py-2 rounded-full">
            <Star className="h-4 w-4" />
            <span className="font-semibold">{stars} {simpleMode ? "Stars" : "Shiny Stars"}</span>
          </div>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {simpleMode ? "Adventure Map" : "Quest Map: Snake Scholars World"}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {simpleMode
              ? "Choose a land to explore. Unlock new zones by acing chapter quizzes!"
              : "Travel through math biomes! Unlock each chapter by answering 2 of 3 questions correctly, earn stars, and power up your snake."}
          </p>
        </div>

        <div className="relative w-full h-[540px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.15),_transparent_60%)]" />
          <div className="absolute inset-0 pointer-events-none select-none opacity-40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id="node" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="100%" stopColor="rgba(100,116,139,0)" />
                </radialGradient>
              </defs>
              <line x1="15" y1="70" x2="35" y2="45" stroke="rgba(148,163,184,0.4)" strokeWidth="1" strokeDasharray="4 2" />
              <line x1="35" y1="45" x2="58" y2="60" stroke="rgba(148,163,184,0.4)" strokeWidth="1" strokeDasharray="4 2" />
              <line x1="58" y1="60" x2="75" y2="40" stroke="rgba(148,163,184,0.4)" strokeWidth="1" strokeDasharray="4 2" />
              <line x1="35" y1="45" x2="22" y2="25" stroke="rgba(148,163,184,0.4)" strokeWidth="1" strokeDasharray="4 2" />
              <line x1="58" y1="60" x2="88" y2="72" stroke="rgba(148,163,184,0.4)" strokeWidth="1" strokeDasharray="4 2" />
            </svg>
          </div>

          {questChapters.map(chapter => {
            const status = getChapterStatus(chapter.id, chapterProgress);
            const unlocked = status.unlocked || unlockedChapters.has(chapter.id) || getChapterIndex(chapter.id) === 0;
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => unlocked && onOpenChapter(chapter.id)}
                disabled={!unlocked}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  unlocked
                    ? "hover:scale-105 focus-visible:scale-105"
                    : "opacity-60 cursor-not-allowed"
                }`}
                style={{ left: `${chapter.mapPosition.x}%`, top: `${chapter.mapPosition.y}%` }}
              >
                <div className={`w-40 md:w-48 bg-gradient-to-br ${chapter.color} rounded-2xl p-4 shadow-xl border border-white/20`}> 
                  <div className="flex items-center justify-between">
                    <span className="text-2xl" aria-hidden>{chapter.icon}</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {status.badgeTier > 0 ? `${status.badgeTier}/3` : "0/3"}
                    </Badge>
                  </div>
                  <h2 className="mt-2 text-lg font-bold leading-tight">{chapter.title}</h2>
                  <p className="text-xs text-white/80 mt-1 line-clamp-3">{chapter.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-white/70">
                    <span>{status.completedTopics} / {chapter.topicIds.length} topics</span>
                    {!unlocked && (
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        {simpleMode ? "Locked" : "Pass quiz"}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {questChapters.map(chapter => {
            const status = getChapterStatus(chapter.id, chapterProgress);
            const nextChapterId = getNextChapterId(chapter.id);
            const lockedMessage = nextChapterId
              ? `Unlock by passing the ${chapter.title} chapter quiz.`
              : "Master all chapters to earn the Legend badge!";
            return (
              <Card key={chapter.id} className="bg-slate-900/70 border-white/10 text-white p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>{chapter.icon}</span>
                  <div>
                    <p className="text-sm uppercase tracking-wide text-white/60">{chapter.nickname}</p>
                    <h3 className="text-xl font-semibold">{chapter.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-white/75">{chapter.funFact}</p>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Badge variant="outline" className="border-white/20 text-white/80">
                    {status.completedTopics} / {chapter.topicIds.length} {simpleMode ? "lessons" : "quests"}
                  </Badge>
                  <Badge variant="outline" className="border-white/20 text-white/80">
                    Tier {status.badgeTier} badge
                  </Badge>
                </div>
                {!status.unlocked && getChapterIndex(chapter.id) !== 0 && (
                  <p className="text-xs text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-md p-2">
                    {lockedMessage}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
