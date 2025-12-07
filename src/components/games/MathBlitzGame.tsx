import { useMemo, useState } from "react";
import { Calculator, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MathBlitzGameProps {
  simpleMode?: boolean;
  topicName?: string;
  onComplete?: (result: { score: number; stars: number; correct: number; total: number; message: string }) => void;
  onGameOver?: (score: number) => void;
  onBack?: () => void;
  highScore?: number;
}

interface MathQuestion {
  prompt: string;
  answer: number;
  options: number[];
  explanation: string;
  hint: string;
}

const operations = ["+", "-", "×", "÷"] as const;

const shuffleArray = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildQuestion = (simpleMode: boolean): MathQuestion => {
  const allowedOperations = simpleMode ? operations.slice(0, 2) : operations;
  const operation = allowedOperations[Math.floor(Math.random() * allowedOperations.length)];
  let a = 0;
  let b = 0;
  let answer = 0;
  let explanation = "";

  switch (operation) {
    case "+": {
      a = Math.floor(Math.random() * 30) + 5;
      b = Math.floor(Math.random() * 20) + 3;
      answer = a + b;
      explanation = `${a} + ${b} = ${answer}. Add the ones first, then the tens!`;
      break;
    }
    case "-": {
      a = Math.floor(Math.random() * 40) + 15;
      b = Math.floor(Math.random() * (a - 5)) + 5;
      answer = a - b;
      explanation = `${a} - ${b} = ${answer}. Think about taking ${b} away from ${a}.`;
      break;
    }
    case "×": {
      a = Math.floor(Math.random() * 10) + 2;
      b = Math.floor(Math.random() * 8) + 2;
      answer = a * b;
      explanation = `${a} groups of ${b} make ${answer}. Multiplication is repeated addition!`;
      break;
    }
    case "÷": {
      b = Math.floor(Math.random() * 8) + 2;
      answer = Math.floor(Math.random() * 8) + 2;
      a = b * answer;
      explanation = `${a} ÷ ${b} = ${answer}. Division shares ${a} into ${b} equal groups.`;
      break;
    }
    default:
      break;
  }

  const distractors = new Set<number>();
  while (distractors.size < 3) {
    const wiggle = Math.max(1, Math.round(answer * 0.2));
    const choice = answer + Math.floor(Math.random() * wiggle * 2) - wiggle;
    if (choice !== answer && choice >= 0) {
      distractors.add(choice);
    }
  }

  const options = shuffleArray([answer, ...distractors]);
  const hint =
    operation === "×"
      ? `Try skip-counting by ${a}.`
      : operation === "÷"
        ? `Think: ${a} split into ${b} equal groups.`
        : operation === "+"
          ? `Add the ones, then the tens.`
          : `Count back by ${b} from ${a}.`;

  return {
    prompt: `${a} ${operation} ${b} = ?`,
    answer,
    options,
    explanation,
    hint,
  };
};

const calculateStars = (correct: number, total: number) => {
  if (correct === 0) return 0;
  const accuracy = correct / total;
  if (accuracy === 1) return 4;
  if (accuracy >= 0.75) return 3;
  if (accuracy >= 0.5) return 2;
  return 1;
};

export const MathBlitzGame = ({ onComplete, onGameOver, onBack, simpleMode = false, topicName, highScore }: MathBlitzGameProps) => {
  const totalQuestions = simpleMode ? 5 : 8;
  const questions = useMemo(() => Array.from({ length: totalQuestions }, () => buildQuestion(simpleMode)), [simpleMode, totalQuestions]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const hasSelected = selectedOption !== null;

  const handleSelectOption = (option: number) => {
    if (hasSelected) return;
    setSelectedOption(option);
    const isCorrect = option === currentQuestion.answer;
    setScore(prev => prev + (isCorrect ? 150 : 60));
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setFeedback(`Nice! ${currentQuestion.explanation}`);
    } else {
      setFeedback(`Almost! ${currentQuestion.explanation}`);
    }
  };

  const handleNext = () => {
    if (!hasSelected) return;

    if (currentIndex === questions.length - 1) {
      const stars = calculateStars(correctCount, questions.length);
      const message =
        correctCount === questions.length
          ? "You solved every puzzle!"
          : correctCount >= Math.ceil(questions.length * 0.75)
            ? "Fantastic focus—keep that math streak going!"
            : "Great effort! Review the hint and try again for more stars.";

      const result = {
        score,
        stars,
        correct: correctCount,
        total: questions.length,
        message: topicName
          ? `${topicName} mastery boost: ${correctCount} / ${questions.length} correct!`
          : `You solved ${correctCount} of ${questions.length} math meteors!`,
      };

      if (onComplete) {
        onComplete(result);
      }
      if (onGameOver) {
        onGameOver(score);
      }
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setSelectedOption(null);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      {onBack && (
        <div className="max-w-2xl mx-auto mb-4">
          <Button onClick={onBack} variant="outline" className="mb-2">
            ← Back to Games
          </Button>
          {highScore !== undefined && (
            <p className="text-sm text-amber-700">High Score: {highScore}</p>
          )}
        </div>
      )}
      <Card className="border-2 border-amber-200 bg-amber-50 shadow-lg max-w-2xl mx-auto">
        <CardHeader className="flex flex-col gap-2">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-amber-700">
          <Calculator className="h-6 w-6" /> Math Meteor Mission
        </CardTitle>
        <CardDescription>
          Blast through quick challenges to keep your mental math sharp{topicName ? ` for ${topicName}` : ""}! Each correct answer powers your rocket.
        </CardDescription>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-amber-700 shadow">Score: {score}</span>
          <span className="rounded-full bg-white px-3 py-1 text-amber-600 shadow">
            Progress: {currentIndex + 1} / {questions.length}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-amber-600 shadow">
            <Lightbulb className="h-4 w-4" /> Hint: {currentQuestion.hint}
          </span>
        </div>
        <Progress value={((currentIndex + (hasSelected ? 1 : 0)) / questions.length) * 100} className="h-2 bg-amber-100" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-xl bg-white/80 p-5 text-center shadow-inner">
          <p className="text-lg font-semibold text-amber-800">{currentQuestion.prompt}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {currentQuestion.options.map(option => {
            const isSelected = option === selectedOption;
            const isCorrect = option === currentQuestion.answer;
            return (
              <Button
                key={option}
                variant="outline"
                className={cn(
                  "h-16 justify-start rounded-xl border-2 border-amber-200 bg-white text-lg font-semibold text-amber-800 shadow",
                  isSelected &&
                    (isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-rose-300 bg-rose-50 text-rose-600"),
                )}
                onClick={() => handleSelectOption(option)}
              >
                {option}
              </Button>
            );
          })}
        </div>
        {feedback && (
          <div className="rounded-xl border border-amber-200 bg-white/90 p-4 text-sm text-amber-700 shadow">
            {feedback}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-amber-700">
            Tap an answer to lock it in. {hasSelected ? "Great thinking!" : "Use the hint if you get stuck."}
          </p>
          <Button
            onClick={handleNext}
            disabled={!hasSelected}
            className="rounded-full bg-amber-500 px-6 py-2 text-white shadow hover:bg-amber-600"
          >
            {currentIndex === questions.length - 1 ? "Finish Mission" : "Next Challenge"}
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};
