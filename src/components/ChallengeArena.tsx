import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { educationalTopics } from "@/data/educationalContent";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, Award, Target, Timer, Volume2, VolumeX, Zap } from "lucide-react";
import { logSession } from "@/utils/progressLogger";
import type { ChallengeResult } from "@/types/challenge";

interface ChallengeArenaProps {
  onExit: () => void;
  onComplete: (result: ChallengeResult) => void;
  simpleMode: boolean;
  speechEnabled: boolean;
}

interface ChallengeQuestion {
  topicId: number;
  topicTitle: string;
  subject: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUESTION_COUNT = 5;
const QUESTION_TIME_LIMIT = 20;

const speakPrompt = (text: string, enableSpeech: boolean) => {
  if (!enableSpeech) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

const buildResult = (
  answers: (boolean | null)[],
  times: number[],
  bestStreak: number,
): ChallengeResult => {
  const total = answers.length;
  const correct = answers.filter(answer => answer).length;
  const timeSpent = times.reduce((sum, value) => sum + value, 0);
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const fastestAnswer = times.reduce<number | null>((fastest, time, index) => {
    if (!answers[index]) return fastest;
    return fastest === null ? time : Math.min(fastest, time);
  }, null);

  const baseStars = correct * 12;
  const streakBonus = bestStreak >= total ? 25 : bestStreak * 4;
  const accuracyBonus = accuracy >= 90 ? 20 : accuracy >= 75 ? 12 : accuracy >= 60 ? 6 : 0;
  const timeBonus = timeSpent <= total * 12 ? 10 : timeSpent <= total * 18 ? 5 : 0;
  const stars = Math.max(20, baseStars + streakBonus + accuracyBonus + timeBonus);

  return { correct, total, accuracy, bestStreak, timeSpent, fastestAnswer, stars };
};

const createChallengeQuestions = (): ChallengeQuestion[] => {
  const shuffledTopics = [...educationalTopics]
    .filter(topic => topic.options?.length >= 2)
    .sort(() => Math.random() - 0.5)
    .slice(0, QUESTION_COUNT * 2);

  const selectedTopics = shuffledTopics.slice(0, QUESTION_COUNT);

  return selectedTopics.map(topic => {
    const sourceQuestions = topic.assessmentQuestions && topic.assessmentQuestions.length > 0
      ? topic.assessmentQuestions
      : [
          {
            question: topic.question,
            options: topic.options,
            correctAnswer: topic.correctAnswer,
            explanation: topic.explanation,
          },
        ];
    const randomQuestion = sourceQuestions[Math.floor(Math.random() * sourceQuestions.length)];

    return {
      topicId: topic.id,
      topicTitle: topic.title,
      subject: topic.subject,
      prompt: randomQuestion.question,
      options: randomQuestion.options,
      correctAnswer: randomQuestion.correctAnswer,
      explanation: randomQuestion.explanation,
    };
  });
};

export const ChallengeArena = ({ onExit, onComplete, simpleMode, speechEnabled }: ChallengeArenaProps) => {
  const questions = useMemo(createChallengeQuestions, []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<(boolean | null)[]>(() => Array(questions.length).fill(null));
  const [times, setTimes] = useState<number[]>(() => Array(questions.length).fill(0));
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [pendingResult, setPendingResult] = useState<ChallengeResult | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const correctSoFar = answers.filter(answer => answer).length;
  const fastestCorrect = answers.reduce<number | null>((fastest, answer, index) => {
    if (!answer) return fastest;
    const time = times[index];
    return fastest === null ? time : Math.min(fastest, time);
  }, null);

  useEffect(() => {
    setTimeLeft(QUESTION_TIME_LIMIT);
    setQuestionStartTime(Date.now());
    setSelectedOption(null);
    setAnswered(false);
    setTimedOut(false);
    speakPrompt(currentQuestion.prompt, speechEnabled);
  }, [currentQuestionIndex, currentQuestion.prompt, speechEnabled]);

  useEffect(() => {
    if (answered) return;

    const timer = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          window.clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [answered, currentQuestionIndex]);

  const handleOptionSelect = (index: number) => {
    if (answered) return;
    setSelectedOption(index);
  };

  const gradeQuestion = (selected: number | null, timedOutAnswer = false) => {
    if (answered) return;

    const elapsedSeconds = Math.max(1, Math.min(QUESTION_TIME_LIMIT, Math.floor((Date.now() - questionStartTime) / 1000)));
    const isCorrect = !timedOutAnswer && selected !== null && selected === currentQuestion.correctAnswer;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = isCorrect;
    setAnswers(newAnswers);

    const newTimes = [...times];
    newTimes[currentQuestionIndex] = elapsedSeconds;
    setTimes(newTimes);

    const newCurrentStreak = isCorrect ? currentStreak + 1 : 0;
    const newBestStreak = isCorrect ? Math.max(bestStreak, newCurrentStreak) : Math.max(bestStreak, currentStreak);
    setCurrentStreak(newCurrentStreak);
    setBestStreak(newBestStreak);

    if (isCorrect) {
      toast.success(simpleMode ? "Nice!" : "Correct answer!", { duration: 1200 });
    } else if (timedOutAnswer) {
      toast("Time's up!", { description: simpleMode ? "Keep your focus." : "Try to respond faster next time." });
    } else {
      toast.error(simpleMode ? "Oops!" : "Not quite right.", { duration: 1200 });
    }

    if (currentQuestionIndex === questions.length - 1) {
      const finalResult = buildResult(newAnswers, newTimes, newBestStreak);
      setPendingResult(finalResult);
    }

    setAnswered(true);
    setTimedOut(timedOutAnswer);
  };

  const handleSubmit = () => {
    if (selectedOption === null || answered) return;
    gradeQuestion(selectedOption, false);
  };

  const handleTimeout = () => {
    if (answered) return;
    gradeQuestion(null, true);
  };

  const handleNext = () => {
    if (!answered) return;

    if (currentQuestionIndex === questions.length - 1) {
      const finalResult = pendingResult ?? buildResult(answers, times, bestStreak);
      toast.success(simpleMode ? "Challenge done!" : "Challenge complete!", { duration: 1800 });
      logSession({
        topicId: 0,
        topicTitle: "Challenge Mode",
        activity: finalResult.accuracy >= 75 ? "assessment_passed" : "quiz_attempted",
        duration: finalResult.timeSpent,
        score: finalResult.accuracy,
        correctAnswers: finalResult.correct,
        totalQuestions: finalResult.total,
      });
      onComplete(finalResult);
      return;
    }

    setPendingResult(null);
    setCurrentQuestionIndex(index => index + 1);
  };

  const questionProgress = ((currentQuestionIndex + (answered ? 1 : 0)) / questions.length) * 100;
  const timerProgress = (timeLeft / QUESTION_TIME_LIMIT) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Button variant="ghost" onClick={onExit} className="w-fit text-slate-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {simpleMode ? "Back" : "Back to Modes"}
          </Button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
            <Card className="p-3 bg-slate-900/60 border-slate-700">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-slate-300">
                <Target className="h-4 w-4" />
                {simpleMode ? "Score" : "Correct"}
              </div>
              <p className="text-2xl font-bold">{correctSoFar}/{questions.length}</p>
            </Card>
            <Card className="p-3 bg-slate-900/60 border-slate-700">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-slate-300">
                <Zap className="h-4 w-4" />
                {simpleMode ? "Streak" : "Best Streak"}
              </div>
              <p className="text-2xl font-bold">{bestStreak}</p>
            </Card>
            <Card className="p-3 bg-slate-900/60 border-slate-700">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-slate-300">
                <Timer className="h-4 w-4" />
                {simpleMode ? "Time" : "Time Left"}
              </div>
              <p className="text-2xl font-bold">{timeLeft}s</p>
            </Card>
            <Card className="p-3 bg-slate-900/60 border-slate-700">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-slate-300">
                <Award className="h-4 w-4" />
                {simpleMode ? "Fastest" : "Fastest Correct"}
              </div>
              <p className="text-2xl font-bold">{fastestCorrect ? `${fastestCorrect}s` : "—"}</p>
            </Card>
          </div>
        </div>

        <Card className="bg-slate-900/70 border-slate-700 p-6 space-y-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-wider text-indigo-300">{currentQuestion.subject.toUpperCase()}</p>
              <h2 className="text-2xl md:text-3xl font-bold">{currentQuestion.prompt}</h2>
              <p className="text-sm text-slate-300 mt-1">{simpleMode ? "Topic:" : "Concept:"} {currentQuestion.topicTitle}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => speakPrompt(currentQuestion.prompt, speechEnabled)}
              className="text-indigo-200 hover:text-indigo-100 hover:bg-indigo-500/20"
            >
              {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span className="ml-2">{speechEnabled ? "Listen" : "Speech Off"}</span>
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
              <span>
                {simpleMode ? "Question" : "Question"} {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span>{timedOut ? (simpleMode ? "Time's up" : "Time ran out!") : `${timeLeft}s`}</span>
            </div>
            <Progress value={questionProgress} className="h-2 bg-slate-800" />
            <Progress value={timerProgress} className="h-2 mt-2 bg-slate-800" />
          </div>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = answered && index === currentQuestion.correctAnswer;
              const isSelected = selectedOption === index;
              const showIncorrect = answered && isSelected && index !== currentQuestion.correctAnswer;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleOptionSelect(index)}
                  disabled={answered}
                  className={cn(
                    "text-left rounded-xl border px-4 py-3 transition-all",
                    "border-slate-700 bg-slate-800/70 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400",
                    answered && isCorrect && "border-green-400 bg-green-500/20 text-green-100",
                    answered && showIncorrect && "border-red-400 bg-red-500/20 text-red-100",
                    !answered && isSelected && "border-indigo-400 bg-indigo-500/20 text-indigo-100",
                  )}
                >
                  <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-slate-300">
              {answered ? (
                <p>
                  {timedOut
                    ? simpleMode
                      ? "No points this time."
                      : "Try to answer before the timer hits zero."
                    : currentQuestion.explanation}
                </p>
              ) : (
                <p>{simpleMode ? "Choose the right answer." : "Tap an answer before the timer ends."}</p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              {!answered && (
                <Button onClick={handleSubmit} disabled={selectedOption === null} variant="secondary">
                  {simpleMode ? "Lock answer" : "Submit Answer"}
                </Button>
              )}
              {answered && (
                <Button onClick={handleNext}>
                  {currentQuestionIndex === questions.length - 1
                    ? simpleMode
                      ? "Results"
                      : "View Challenge Results"
                    : simpleMode
                    ? "Next"
                    : "Next Question"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
