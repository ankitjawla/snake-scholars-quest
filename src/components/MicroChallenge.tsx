import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Clock, Volume2 } from "lucide-react";
import { type MicroChallenge } from "@/data/microChallenges";
import { getPowerUpDefinition } from "@/data/powerUps";

interface MicroChallengeProps {
  challenge: MicroChallenge;
  onFinish: (result: { success: boolean; stars: number; powerUpId: string | null }) => void;
  simpleMode: boolean;
  enableSpeech?: boolean;
}

const speak = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

export const MicroChallengeCard = ({ challenge, onFinish, simpleMode, enableSpeech = true }: MicroChallengeProps) => {
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimitSeconds);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const powerUp = useMemo(() => (challenge.powerUpReward ? getPowerUpDefinition(challenge.powerUpReward) : null), [challenge]);
  const success = submitted && selected === challenge.correctAnswer;

  useEffect(() => {
    if (!enableSpeech) return;
    speak(`${challenge.prompt}. ${challenge.funTip}`);
  }, [challenge, enableSpeech]);

  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      onFinish({ success: false, stars: 0, powerUpId: null });
      return;
    }

    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, submitted, onFinish]);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === challenge.correctAnswer) {
      setCelebrating(true);
      setTimeout(() => {
        setCelebrating(false);
        onFinish({ success: true, stars: challenge.starReward, powerUpId: challenge.powerUpReward });
      }, 1600);
    } else {
      setTimeout(() => onFinish({ success: false, stars: 0, powerUpId: null }), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-600 p-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl bg-white/95 backdrop-blur shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-indigo-500" />
            <div>
              <p className="text-xs uppercase tracking-wider text-indigo-600">{simpleMode ? "Speed Round" : "60 Second Micro-Challenge"}</p>
              <h2 className="text-2xl font-bold text-slate-900">{challenge.prompt}</h2>
            </div>
          </div>
          {enableSpeech && (
            <Button variant="ghost" size="icon" onClick={() => speak(challenge.prompt)}>
              <Volume2 className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div>
          <Progress value={(timeLeft / challenge.timeLimitSeconds) * 100} className="h-2 bg-slate-200" />
          <div className="flex justify-between text-sm text-slate-600 mt-1">
            <span>{timeLeft}s left</span>
            {powerUp && (
              <span>
                Reward: {powerUp.icon} {powerUp.name} + {challenge.starReward} ⭐
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-3">
          {challenge.options.map((option, index) => {
            const isCorrect = submitted && index === challenge.correctAnswer;
            const isWrong = submitted && selected === index && !isCorrect;
            return (
              <Button
                key={option}
                variant={selected === index ? "default" : "outline"}
                className={`justify-start h-auto py-4 px-5 text-left text-base transition-all ${
                  isCorrect ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""
                } ${isWrong ? "bg-red-100 text-red-700 border-red-200" : ""}`}
                onClick={() => !submitted && setSelected(index)}
                disabled={submitted}
              >
                <span className="flex-1">{option}</span>
                {isCorrect && <CheckCircle2 className="ml-2 h-5 w-5" />}
                {isWrong && <AlertCircle className="ml-2 h-5 w-5" />}
              </Button>
            );
          })}
        </div>

        {!submitted ? (
          <Button onClick={handleSubmit} disabled={selected === null} size="lg" className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            {simpleMode ? "Check Answer" : "Lock in answer"}
          </Button>
        ) : success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6" />
            <div>
              <p className="font-semibold">{simpleMode ? "Great job!" : "Micro-challenge mastered!"}</p>
              <p className="text-sm">{challenge.explanation}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 flex items-center gap-3">
            <AlertCircle className="h-6 w-6" />
            <div>
              <p className="font-semibold">{simpleMode ? "Let's review" : "So close!"}</p>
              <p className="text-sm">{challenge.explanation}</p>
            </div>
          </div>
        )}

        {celebrating && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-10 shadow-2xl text-center space-y-2 animate-bounce-soft">
              <p className="text-4xl">🎉</p>
              <p className="text-xl font-bold">Stars +{challenge.starReward}</p>
              {powerUp && <p className="text-sm">Unlocked {powerUp.icon} {powerUp.name}</p>}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
