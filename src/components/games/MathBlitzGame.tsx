import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { Calculator, Lightbulb, Timer, Zap, Trophy, Star } from "lucide-react";
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
  type: string;
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

// Build basic arithmetic questions
const buildBasicQuestion = (simpleMode: boolean): MathQuestion => {
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
    options: generateOptions(answer),
    explanation,
    hint,
    type: "basic",
  };
};

// Build tricky questions
const buildTrickyQuestion = (): MathQuestion => {
  const trickyTypes = [
    () => {
      // Missing number puzzle: ? + 15 = 23
      const answer = Math.floor(Math.random() * 20) + 5;
      const b = Math.floor(Math.random() * 15) + 10;
      const sum = answer + b;
      return {
        prompt: `? + ${b} = ${sum}`,
        answer,
        explanation: `The missing number is ${answer} because ${answer} + ${b} = ${sum}. Work backwards!`,
        hint: "Work backwards: subtract to find the missing number.",
      };
    },
    () => {
      // Order of operations: 2 + 3 × 4
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 5) + 2;
      const c = Math.floor(Math.random() * 5) + 2;
      const answer = a + b * c;
      return {
        prompt: `${a} + ${b} × ${c} = ?`,
        answer,
        explanation: `First multiply: ${b} × ${c} = ${b * c}, then add: ${a} + ${b * c} = ${answer}. Always multiply before adding!`,
        hint: "Remember: multiply first, then add!",
      };
    },
    () => {
      // Double operations: (10 + 5) × 2
      const a = Math.floor(Math.random() * 10) + 5;
      const b = Math.floor(Math.random() * 5) + 2;
      const c = Math.floor(Math.random() * 3) + 2;
      const answer = (a + b) * c;
      return {
        prompt: `(${a} + ${b}) × ${c} = ?`,
        answer,
        explanation: `First add inside parentheses: ${a} + ${b} = ${a + b}, then multiply: ${a + b} × ${c} = ${answer}.`,
        hint: "Do what's inside parentheses first!",
      };
    },
    () => {
      // What number comes next: 5, 10, 15, ?
      const start = Math.floor(Math.random() * 5) + 2;
      const step = Math.floor(Math.random() * 5) + 2;
      const answer = start + step * 3;
      return {
        prompt: `${start}, ${start + step}, ${start + step * 2}, ?`,
        answer,
        explanation: `The pattern adds ${step} each time. ${start + step * 2} + ${step} = ${answer}.`,
        hint: "Look for the pattern - what number is being added each time?",
      };
    },
    () => {
      // Reverse subtraction: ? - 8 = 12
      const answer = Math.floor(Math.random() * 20) + 15;
      const b = Math.floor(Math.random() * 10) + 5;
      const result = answer - b;
      return {
        prompt: `? - ${b} = ${result}`,
        answer,
        explanation: `The missing number is ${answer} because ${answer} - ${b} = ${result}. Add to find it!`,
        hint: "Add the two numbers to find the missing number.",
      };
    },
    () => {
      // Division with remainder concept: How many groups?
      const total = Math.floor(Math.random() * 30) + 20;
      const groupSize = Math.floor(Math.random() * 5) + 3;
      const answer = Math.floor(total / groupSize);
      return {
        prompt: `If you have ${total} items and make groups of ${groupSize}, how many complete groups?`,
        answer,
        explanation: `${total} ÷ ${groupSize} = ${answer} complete groups (with some left over).`,
        hint: "Divide to find how many groups you can make.",
      };
    },
    () => {
      // Comparison: Which is bigger?
      const a = Math.floor(Math.random() * 50) + 10;
      const b = Math.floor(Math.random() * 50) + 10;
      const answer = Math.max(a, b);
      return {
        prompt: `Which is bigger: ${a} or ${b}?`,
        answer,
        explanation: `${answer} is bigger. ${answer === a ? `${a} > ${b}` : `${b} > ${a}`}`,
        hint: "Compare the numbers - which one has more value?",
      };
    },
    () => {
      // Sum of two numbers: What's the total?
      const a = Math.floor(Math.random() * 30) + 10;
      const b = Math.floor(Math.random() * 30) + 10;
      const answer = a + b;
      return {
        prompt: `Sarah has ${a} apples. Tom has ${b} apples. How many total?`,
        answer,
        explanation: `${a} + ${b} = ${answer} total apples.`,
        hint: "Add both amounts together.",
      };
    },
    () => {
      // Difference: How many more?
      const a = Math.floor(Math.random() * 30) + 20;
      const b = Math.floor(Math.random() * 20) + 5;
      const answer = a - b;
      return {
        prompt: `Emma has ${a} stickers. Jake has ${b}. How many more does Emma have?`,
        answer,
        explanation: `${a} - ${b} = ${answer}. Emma has ${answer} more stickers.`,
        hint: "Subtract to find the difference.",
      };
    },
    () => {
      // Multiplication word problem
      const groups = Math.floor(Math.random() * 5) + 2;
      const perGroup = Math.floor(Math.random() * 8) + 3;
      const answer = groups * perGroup;
      return {
        prompt: `${groups} boxes, ${perGroup} toys each. How many total toys?`,
        answer,
        explanation: `${groups} × ${perGroup} = ${answer} total toys.`,
        hint: "Multiply groups by items per group.",
      };
    },
  ];

  const selectedType = trickyTypes[Math.floor(Math.random() * trickyTypes.length)];
  const question = selectedType();
  
  return {
    ...question,
    options: generateOptions(question.answer),
    type: "tricky",
  };
};

// Generate smart distractors
const generateOptions = (correctAnswer: number): number[] => {
  const distractors = new Set<number>();
  
  // Add some common mistake answers
  if (correctAnswer > 10) {
    distractors.add(correctAnswer - 1);
    distractors.add(correctAnswer + 1);
  }
  if (correctAnswer > 5) {
    distractors.add(correctAnswer - 5);
    distractors.add(correctAnswer + 5);
  }
  
  // Add random nearby numbers
  while (distractors.size < 3) {
    const wiggle = Math.max(1, Math.round(correctAnswer * 0.15));
    const choice = correctAnswer + Math.floor(Math.random() * wiggle * 2) - wiggle;
    if (choice !== correctAnswer && choice > 0 && !distractors.has(choice)) {
      distractors.add(choice);
    }
  }

  return shuffleArray([correctAnswer, ...Array.from(distractors)]);
};

// Build question with variety
const buildQuestion = (simpleMode: boolean, questionNumber: number): MathQuestion => {
  // Mix of basic and tricky questions
  // First 2-3 are basic, then mix in tricky ones
  if (simpleMode) {
    // Simple mode: mostly basic with occasional easy tricky
    if (questionNumber <= 2 || Math.random() < 0.7) {
      return buildBasicQuestion(simpleMode);
    }
    return buildTrickyQuestion();
  } else {
    // Normal mode: mix of basic and tricky
    if (questionNumber <= 2 || Math.random() < 0.5) {
      return buildBasicQuestion(simpleMode);
    }
    return buildTrickyQuestion();
  }
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
  const totalQuestions = simpleMode ? 5 : 10; // Increased to 10 for more puzzles
  const questions = useMemo(() => 
    Array.from({ length: totalQuestions }, (_, i) => buildQuestion(simpleMode, i + 1)), 
    [simpleMode, totalQuestions]
  );
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  // Use refs to avoid dependency issues
  const currentQuestionRef = useRef(questions[currentIndex]);
  const hasSelectedRef = useRef(false);
  
  useEffect(() => {
    currentQuestionRef.current = questions[currentIndex];
    hasSelectedRef.current = selectedOption !== null;
  }, [questions, currentIndex, selectedOption]);

  const currentQuestion = questions[currentIndex];
  const hasSelected = selectedOption !== null;

  // Timer effect - fixed to prevent hanging
  useEffect(() => {
    if (gameComplete) return;
    
    setTimeLeft(30); // Reset timer for new question
    setSelectedOption(null);
    setFeedback(null);
    
    let timerId: NodeJS.Timeout;
    
    const startTimer = () => {
      timerId = setInterval(() => {
        setTimeLeft(prev => {
          // Check if answer was selected
          if (hasSelectedRef.current) {
            clearInterval(timerId);
            return prev;
          }
          
          if (prev <= 1) {
            // Timeout
            const question = currentQuestionRef.current;
            setSelectedOption(-1);
            setFeedback(`Time's up! The answer was ${question.answer}. ${question.explanation}`);
            setStreak(0);
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };
    
    startTimer();

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [currentIndex, gameComplete]);

  const handleSelectOption = (option: number) => {
    if (hasSelected || selectedOption === -1) return;
    setSelectedOption(option);
    const isCorrect = option === currentQuestion.answer;
    const timeBonus = Math.max(0, Math.floor(timeLeft * 2));
    const baseScore = isCorrect ? 150 : 60;
    const streakBonus = isCorrect && streak > 0 ? streak * 10 : 0;
    const totalPoints = baseScore + timeBonus + streakBonus;
    
    setScore(prev => prev + totalPoints);
    
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
      setCorrectCount(prev => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
      setFeedback(`🎉 Excellent! ${currentQuestion.explanation}${newStreak > 1 ? ` 🔥 ${newStreak} streak!` : ''}${timeBonus > 0 ? ` ⚡ +${timeBonus} speed bonus!` : ''}`);
    } else {
      setStreak(0);
      setFeedback(`Almost! The correct answer is ${currentQuestion.answer}. ${currentQuestion.explanation}`);
    }
  };

  const handleNext = () => {
    if (!hasSelected && selectedOption !== -1) return;

    if (currentIndex === questions.length - 1) {
      setGameComplete(true);
      const stars = calculateStars(correctCount, questions.length);
      const accuracy = Math.round((correctCount / questions.length) * 100);
      const message =
        correctCount === questions.length
          ? "🌟 Perfect Score! You're a Math Master! 🌟"
          : correctCount >= Math.ceil(questions.length * 0.75)
            ? `🎯 Fantastic! ${accuracy}% accuracy - Keep that math streak going!`
            : `💪 Great effort! ${accuracy}% correct - Review and try again for more stars!`;

      const result = {
        score,
        stars,
        correct: correctCount,
        total: questions.length,
        message: topicName
          ? `${topicName} mastery boost: ${correctCount} / ${questions.length} correct!`
          : `You solved ${correctCount} of ${questions.length} math puzzles! ${bestStreak > 0 ? `🔥 Best streak: ${bestStreak}!` : ''}`,
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
          <Calculator className="h-6 w-6" /> Math Puzzle Blitz
        </CardTitle>
        <CardDescription>
          Solve math puzzles and tricky questions! {currentQuestion.type === "tricky" && "🧩 This is a tricky one!"}
        </CardDescription>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-amber-700 shadow flex items-center gap-1">
            <Trophy className="h-4 w-4" /> Score: {score}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-amber-600 shadow">
            Puzzle: {currentIndex + 1} / {questions.length}
          </span>
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow",
            timeLeft <= 5 ? "text-red-600 animate-pulse" : "text-amber-600"
          )}>
            <Timer className="h-4 w-4" /> {timeLeft}s
          </span>
          {streak > 0 && (
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-orange-700 shadow animate-pulse">
              <Zap className="h-4 w-4" /> 🔥 {streak} Streak!
            </span>
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-amber-600 shadow">
            <Lightbulb className="h-4 w-4" /> {currentQuestion.hint}
          </span>
        </div>
        <Progress value={((currentIndex + (hasSelected ? 1 : 0)) / questions.length) * 100} className="h-2 bg-amber-100" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}
        <div className="rounded-xl bg-white/80 p-5 text-center shadow-inner relative overflow-hidden">
          {showCelebration && (
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-200 animate-pulse opacity-50" />
          )}
          <p className="text-2xl font-bold text-amber-800 relative z-10">{currentQuestion.prompt}</p>
          {currentQuestion.type === "tricky" && (
            <p className="text-xs text-amber-600 mt-2">🧩 Tricky Puzzle</p>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {currentQuestion.options.map(option => {
            const isSelected = option === selectedOption;
            const isCorrect = option === currentQuestion.answer;
            const isWrong = isSelected && !isCorrect;
            return (
              <Button
                key={option}
                variant="outline"
                disabled={hasSelected || selectedOption === -1}
                className={cn(
                  "h-16 justify-center rounded-xl border-2 text-lg font-semibold shadow transition-all",
                  !hasSelected && selectedOption !== -1 && "border-amber-200 bg-white text-amber-800 hover:scale-105 hover:shadow-lg",
                  isSelected && isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-700 scale-105 animate-pulse",
                  isWrong && "border-rose-300 bg-rose-50 text-rose-600",
                  (hasSelected || selectedOption === -1) && !isSelected && !isCorrect && "opacity-50",
                  selectedOption === -1 && option === currentQuestion.answer && "border-blue-400 bg-blue-50 text-blue-700",
                )}
                onClick={() => handleSelectOption(option)}
              >
                {option}
                {isSelected && isCorrect && " ✓"}
                {isWrong && " ✗"}
              </Button>
            );
          })}
        </div>
        {feedback && (
          <div className={cn(
            "rounded-xl border p-4 text-sm shadow animate-fade-in",
            selectedOption === currentQuestion.answer 
              ? "border-emerald-300 bg-emerald-50 text-emerald-700" 
              : "border-amber-200 bg-white/90 text-amber-700"
          )}>
            {feedback}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-amber-700">
            {!hasSelected && selectedOption !== -1 
              ? `⚡ Quick answers earn bonus points! ${timeLeft > 20 ? "You're doing great!" : "Time is running out!"}`
              : hasSelected 
                ? "Great thinking!" 
                : "Time's up! Check the answer above."}
          </p>
          <Button
            onClick={handleNext}
            disabled={!hasSelected && selectedOption !== -1}
            className="rounded-full bg-amber-500 px-6 py-2 text-white shadow hover:bg-amber-600 disabled:opacity-50"
          >
            {gameComplete 
              ? "🎉 View Results" 
              : currentIndex === questions.length - 1 
                ? "🏁 Finish Mission" 
                : "➡️ Next Puzzle"}
          </Button>
        </div>
        {gameComplete && (
          <div className="rounded-xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 text-center shadow-lg animate-fade-in">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-amber-800 mb-2">Puzzle Mission Complete!</h3>
            <div className="flex justify-center gap-4 text-sm">
              <div>
                <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                <p className="font-semibold">{correctCount}/{questions.length}</p>
                <p className="text-xs text-amber-600">Correct</p>
              </div>
              <div>
                <Trophy className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                <p className="font-semibold">{score}</p>
                <p className="text-xs text-amber-600">Score</p>
              </div>
              {bestStreak > 0 && (
                <div>
                  <Zap className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                  <p className="font-semibold">{bestStreak}</p>
                  <p className="text-xs text-amber-600">Best Streak</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
};
