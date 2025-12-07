import { useState, useEffect, useRef } from "react";
import { Calculator, Lightbulb, Timer, Zap, Trophy, Star, Sparkles, Rocket } from "lucide-react";
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
  difficulty: number;
}

const shuffleArray = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Generate smart distractors
const generateOptions = (correctAnswer: number, difficulty: number = 1): number[] => {
  const distractors = new Set<number>();
  const range = Math.max(1, Math.floor(correctAnswer * (0.1 + difficulty * 0.1)));
  
  // Add nearby numbers
  distractors.add(correctAnswer - 1);
  distractors.add(correctAnswer + 1);
  if (correctAnswer > 5) {
    distractors.add(correctAnswer - 5);
    distractors.add(correctAnswer + 5);
  }
  if (correctAnswer > 10) {
    distractors.add(correctAnswer - 10);
    distractors.add(correctAnswer + 10);
  }
  
  // Add random distractors
  while (distractors.size < 6) {
    const wiggle = Math.max(1, Math.round(correctAnswer * (0.1 + difficulty * 0.15)));
    const choice = correctAnswer + Math.floor(Math.random() * wiggle * 2) - wiggle;
    if (choice !== correctAnswer && choice > 0 && !distractors.has(choice)) {
      distractors.add(choice);
    }
  }

  return shuffleArray([correctAnswer, ...Array.from(distractors).slice(0, 3)]);
};

// Random puzzle generators - 20+ different types
const puzzleGenerators = [
  // Basic arithmetic
  (level: number) => {
    const max = 20 + level * 10;
    const a = Math.floor(Math.random() * max) + 5;
    const b = Math.floor(Math.random() * max) + 3;
    const answer = a + b;
    return {
      prompt: `${a} + ${b} = ?`,
      answer,
      explanation: `${a} + ${b} = ${answer}. Great addition!`,
      hint: "Add the numbers together!",
      type: "addition",
    };
  },
  (level: number) => {
    const max = 30 + level * 10;
    const a = Math.floor(Math.random() * max) + 15;
    const b = Math.floor(Math.random() * (a - 5)) + 5;
    const answer = a - b;
    return {
      prompt: `${a} - ${b} = ?`,
      answer,
      explanation: `${a} - ${b} = ${answer}. Subtraction!`,
      hint: "Take away the smaller number!",
      type: "subtraction",
    };
  },
  (level: number) => {
    const max = 8 + level;
    const a = Math.floor(Math.random() * max) + 2;
    const b = Math.floor(Math.random() * max) + 2;
    const answer = a * b;
    return {
      prompt: `${a} × ${b} = ?`,
      answer,
      explanation: `${a} × ${b} = ${answer}. Multiplication!`,
      hint: "Skip count or add repeatedly!",
      type: "multiplication",
    };
  },
  (level: number) => {
    const b = Math.floor(Math.random() * (8 + level)) + 2;
    const answer = Math.floor(Math.random() * (8 + level)) + 2;
    const a = b * answer;
    return {
      prompt: `${a} ÷ ${b} = ?`,
      answer,
      explanation: `${a} ÷ ${b} = ${answer}. Division!`,
      hint: "How many groups of " + b + "?",
      type: "division",
    };
  },
  
  // Missing number puzzles
  (level: number) => {
    const max = 20 + level * 10;
    const answer = Math.floor(Math.random() * max) + 5;
    const b = Math.floor(Math.random() * 15) + 10;
    const sum = answer + b;
    return {
      prompt: `? + ${b} = ${sum}`,
      answer,
      explanation: `The missing number is ${answer} because ${answer} + ${b} = ${sum}!`,
      hint: "Work backwards - subtract!",
      type: "missing_add",
    };
  },
  (level: number) => {
    const max = 30 + level * 10;
    const answer = Math.floor(Math.random() * max) + 15;
    const b = Math.floor(Math.random() * 10) + 5;
    const result = answer - b;
    return {
      prompt: `? - ${b} = ${result}`,
      answer,
      explanation: `The missing number is ${answer} because ${answer} - ${b} = ${result}!`,
      hint: "Add the two numbers!",
      type: "missing_sub",
    };
  },
  
  // Order of operations
  (level: number) => {
    const a = Math.floor(Math.random() * 5) + 2;
    const b = Math.floor(Math.random() * 5) + 2;
    const c = Math.floor(Math.random() * 5) + 2;
    const answer = a + b * c;
    return {
      prompt: `${a} + ${b} × ${c} = ?`,
      answer,
      explanation: `Multiply first: ${b} × ${c} = ${b * c}, then add: ${a} + ${b * c} = ${answer}!`,
      hint: "Multiply before adding!",
      type: "order_ops",
    };
  },
  (level: number) => {
    const a = Math.floor(Math.random() * 5) + 2;
    const b = Math.floor(Math.random() * 5) + 2;
    const c = Math.floor(Math.random() * 5) + 2;
    const answer = (a + b) * c;
    return {
      prompt: `(${a} + ${b}) × ${c} = ?`,
      answer,
      explanation: `Add first: ${a} + ${b} = ${a + b}, then multiply: ${a + b} × ${c} = ${answer}!`,
      hint: "Do parentheses first!",
      type: "parentheses",
    };
  },
  
  // Pattern recognition
  (level: number) => {
    const start = Math.floor(Math.random() * 5) + 2;
    const step = Math.floor(Math.random() * 5) + 2;
    const answer = start + step * 3;
    return {
      prompt: `${start}, ${start + step}, ${start + step * 2}, ?`,
      answer,
      explanation: `The pattern adds ${step} each time. ${start + step * 2} + ${step} = ${answer}!`,
      hint: "Find the pattern - what's being added?",
      type: "pattern",
    };
  },
  (level: number) => {
    const start = Math.floor(Math.random() * 10) + 5;
    const step = Math.floor(Math.random() * 3) + 2;
    const answer = start * (step * step);
    return {
      prompt: `${start}, ${start * step}, ${start * step * step}, ?`,
      answer,
      explanation: `The pattern multiplies by ${step} each time. ${start * step * step} × ${step} = ${answer}!`,
      hint: "What number is being multiplied?",
      type: "pattern_mult",
    };
  },
  
  // Word problems
  (level: number) => {
    const a = Math.floor(Math.random() * 30) + 10;
    const b = Math.floor(Math.random() * 30) + 10;
    const answer = a + b;
    const items = ["apples", "toys", "candies", "books", "stickers"][Math.floor(Math.random() * 5)];
    return {
      prompt: `Sarah has ${a} ${items}. Tom has ${b} ${items}. How many total?`,
      answer,
      explanation: `${a} + ${b} = ${answer} total ${items}!`,
      hint: "Add both amounts!",
      type: "word_add",
    };
  },
  (level: number) => {
    const a = Math.floor(Math.random() * 30) + 20;
    const b = Math.floor(Math.random() * 20) + 5;
    const answer = a - b;
    const names = [["Emma", "Jake"], ["Lily", "Max"], ["Sophia", "Alex"]][Math.floor(Math.random() * 3)];
    const items = ["stickers", "marbles", "cards"][Math.floor(Math.random() * 3)];
    return {
      prompt: `${names[0]} has ${a} ${items}. ${names[1]} has ${b}. How many more does ${names[0]} have?`,
      answer,
      explanation: `${a} - ${b} = ${answer}. ${names[0]} has ${answer} more!`,
      hint: "Subtract to find the difference!",
      type: "word_sub",
    };
  },
  (level: number) => {
    const groups = Math.floor(Math.random() * 5) + 2;
    const perGroup = Math.floor(Math.random() * 8) + 3;
    const answer = groups * perGroup;
    const items = ["toys", "cookies", "pencils", "balls"][Math.floor(Math.random() * 4)];
    return {
      prompt: `${groups} boxes, ${perGroup} ${items} each. How many total?`,
      answer,
      explanation: `${groups} × ${perGroup} = ${answer} total ${items}!`,
      hint: "Multiply groups by items per group!",
      type: "word_mult",
    };
  },
  
  // Comparison
  (level: number) => {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 50) + 10;
    const answer = Math.max(a, b);
    return {
      prompt: `Which is bigger: ${a} or ${b}?`,
      answer,
      explanation: `${answer} is bigger!`,
      hint: "Compare the numbers!",
      type: "comparison",
    };
  },
  
  // Double operations
  (level: number) => {
    const a = Math.floor(Math.random() * 10) + 5;
    const b = Math.floor(Math.random() * 5) + 2;
    const c = Math.floor(Math.random() * 3) + 2;
    const answer = (a + b) * c;
    return {
      prompt: `(${a} + ${b}) × ${c} = ?`,
      answer,
      explanation: `Add: ${a} + ${b} = ${a + b}, then multiply: ${a + b} × ${c} = ${answer}!`,
      hint: "Parentheses first!",
      type: "double_ops",
    };
  },
  (level: number) => {
    const a = Math.floor(Math.random() * 10) + 5;
    const b = Math.floor(Math.random() * 5) + 2;
    const c = Math.floor(Math.random() * 3) + 2;
    const answer = a * b + c;
    return {
      prompt: `${a} × ${b} + ${c} = ?`,
      answer,
      explanation: `Multiply: ${a} × ${b} = ${a * b}, then add: ${a * b} + ${c} = ${answer}!`,
      hint: "Multiply first, then add!",
      type: "double_ops2",
    };
  },
  
  // Division word problems
  (level: number) => {
    const total = Math.floor(Math.random() * 30) + 20;
    const groupSize = Math.floor(Math.random() * 5) + 3;
    const answer = Math.floor(total / groupSize);
    const items = ["candies", "toys", "books"][Math.floor(Math.random() * 3)];
    return {
      prompt: `You have ${total} ${items} and make groups of ${groupSize}. How many complete groups?`,
      answer,
      explanation: `${total} ÷ ${groupSize} = ${answer} complete groups!`,
      hint: "Divide to find groups!",
      type: "word_div",
    };
  },
  
  // Even/Odd
  (level: number) => {
    const num = Math.floor(Math.random() * 50) + 10;
    const answer = num % 2 === 0 ? num : num + 1;
    return {
      prompt: `What is the next even number after ${num}?`,
      answer,
      explanation: `${answer} is the next even number!`,
      hint: "Even numbers end in 0, 2, 4, 6, or 8!",
      type: "even_odd",
    };
  },
  
  // Rounding
  (level: number) => {
    const num = Math.floor(Math.random() * 90) + 10;
    const answer = Math.round(num / 10) * 10;
    return {
      prompt: `Round ${num} to the nearest 10`,
      answer,
      explanation: `${num} rounds to ${answer}!`,
      hint: "Look at the ones digit!",
      type: "rounding",
    };
  },
  
  // Sum of digits
  (level: number) => {
    const num = Math.floor(Math.random() * 90) + 10;
    const digits = num.toString().split('').map(Number);
    const answer = digits.reduce((a, b) => a + b, 0);
    return {
      prompt: `What is the sum of digits in ${num}?`,
      answer,
      explanation: `${digits.join(' + ')} = ${answer}!`,
      hint: "Add all the digits!",
      type: "sum_digits",
    };
  },
];

// Generate a completely random question
const generateRandomQuestion = (level: number): MathQuestion => {
  const generator = puzzleGenerators[Math.floor(Math.random() * puzzleGenerators.length)];
  const question = generator(level);
  const difficulty = Math.min(5, Math.floor(level / 3) + 1);

  return {
    ...question,
    options: generateOptions(question.answer, difficulty),
    difficulty,
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
  const questionsPerLevel = simpleMode ? 3 : 5;
  const [level, setLevel] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion>(() => generateRandomQuestion(1));
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [levelScore, setLevelScore] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Generate new question when level or index changes
  useEffect(() => {
    if (!gameComplete) {
      const newQuestion = generateRandomQuestion(level);
      setCurrentQuestion(newQuestion);
      setTimeLeft(30 + level * 2); // More time at higher levels
      setSelectedOption(null);
      setFeedback(null);
      setIsProcessing(false);
    }
  }, [level, currentQuestionIndex, gameComplete]);

  // Timer effect
  useEffect(() => {
    if (gameComplete || selectedOption !== null || isProcessing) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    
    timerRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timeout
          setSelectedOption(-1);
          setFeedback(`⏰ Time's up! The answer was ${currentQuestion.answer}. ${currentQuestion.explanation}`);
          setStreak(0);
          setLevelScore(prev => prev - 10);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentQuestionIndex, selectedOption, gameComplete, isProcessing, currentQuestion.answer, currentQuestion.explanation]);

  const handleSelectOption = (option: number) => {
    if (isProcessing || selectedOption !== null) return;
    
    setIsProcessing(true);
    setSelectedOption(option);
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const isCorrect = option === currentQuestion.answer;
    const timeBonus = Math.max(0, Math.floor(timeLeft * 2));
    const levelBonus = level * 5;
    const baseScore = isCorrect ? 150 : 60;
    const streakBonus = isCorrect && streak > 0 ? streak * 10 : 0;
    const totalPoints = baseScore + timeBonus + streakBonus + (isCorrect ? levelBonus : 0);
    
    setScore(prev => prev + totalPoints);
    setLevelScore(prev => prev + (isCorrect ? totalPoints : 0));
    
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
      setCorrectCount(prev => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);
      setFeedback(`🎉 Awesome! ${currentQuestion.explanation}${newStreak > 1 ? ` 🔥 ${newStreak} streak!` : ''}${timeBonus > 0 ? ` ⚡ +${timeBonus} speed!` : ''}${levelBonus > 0 ? ` ⭐ +${levelBonus} level!` : ''}`);
    } else {
      setStreak(0);
      setFeedback(`💭 Almost! The answer is ${currentQuestion.answer}. ${currentQuestion.explanation}`);
    }
    
    setTimeout(() => setIsProcessing(false), 500);
  };

  const handleNext = () => {
    if (isProcessing) return;
    if (!selectedOption && selectedOption !== -1) return;

    const isLastQuestionInLevel = currentQuestionIndex === questionsPerLevel - 1;
    
    if (isLastQuestionInLevel) {
      // Level complete - check if can advance
      const levelAccuracy = levelScore > 0 ? Math.min(100, (levelScore / (questionsPerLevel * 200)) * 100) : 0;
      
      if (levelAccuracy >= 60) {
        // Advance to next level
        setLevel(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setLevelScore(0);
        setSelectedOption(null);
        setFeedback(`🎊 Level ${level} Complete! Advancing to Level ${level + 1}! 🎊`);
        return;
      } else {
        // Game over
        setGameComplete(true);
        const stars = calculateStars(correctCount, level * questionsPerLevel);
        const accuracy = Math.round((correctCount / (level * questionsPerLevel)) * 100);
        
        const result = {
        score,
        stars,
        correct: correctCount,
          total: level * questionsPerLevel,
          message: `🎮 Reached Level ${level}! ${correctCount} correct answers! ${bestStreak > 0 ? `🔥 Best streak: ${bestStreak}!` : ''}`,
        };

        setTimeout(() => {
          if (onComplete) onComplete(result);
          if (onGameOver) onGameOver(score);
        }, 2000);
      return;
      }
    }

    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedOption(null);
    setFeedback(null);
  };

  const totalQuestions = level * questionsPerLevel;
  const hasSelected = selectedOption !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-yellow-300/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {onBack && (
        <div className="max-w-3xl mx-auto mb-4 relative z-10">
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="mb-2 bg-white/90 backdrop-blur-sm hover:scale-105 transition-transform"
            disabled={isProcessing}
          >
            ← Back to Games
          </Button>
          {highScore !== undefined && (
            <p className="text-sm text-purple-700 font-semibold">🏆 High Score: {highScore}</p>
          )}
        </div>
      )}
      
      <Card className="border-4 border-purple-300 bg-gradient-to-br from-white to-purple-50 shadow-2xl max-w-3xl mx-auto relative z-10">
        <CardHeader className="flex flex-col gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-3xl font-black">
            <div className="p-2 bg-white/20 rounded-lg">
              <Calculator className="h-8 w-8" />
            </div>
            <div>
              <div>Math Puzzle Blitz</div>
              <div className="text-lg font-normal opacity-90">Level {level} 🚀</div>
            </div>
        </CardTitle>
          <CardDescription className="text-white/90 text-base">
            Solve puzzles to advance levels! {currentQuestion.type.includes("word") && "📖 Story time!"}
            {currentQuestion.type.includes("pattern") && "🔍 Find the pattern!"}
        </CardDescription>
        </CardHeader>
        
        <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 border-b-2 border-yellow-300">
        <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-white px-4 py-2 font-bold text-purple-700 shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
              <Trophy className="h-5 w-5 text-yellow-500" /> {score}
            </span>
            <span className="rounded-full bg-white px-4 py-2 text-purple-600 shadow-lg font-semibold">
              Puzzle {currentQuestionIndex + 1}/{questionsPerLevel}
            </span>
            <span className={cn(
              "inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg font-bold transition-all",
              timeLeft <= 5 ? "text-red-600 animate-pulse scale-110" : "text-purple-600"
            )}>
              <Timer className="h-5 w-5" /> {timeLeft}s
            </span>
            {streak > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-200 px-4 py-2 text-orange-800 shadow-lg font-bold animate-pulse">
                <Zap className="h-5 w-5" /> 🔥 {streak} Streak!
          </span>
            )}
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700 shadow-lg">
              <Lightbulb className="h-5 w-5" /> {currentQuestion.hint}
          </span>
        </div>
          <Progress 
            value={((currentQuestionIndex + (hasSelected ? 1 : 0)) / questionsPerLevel) * 100} 
            className="h-3 bg-white/50 mt-3 shadow-inner" 
          />
        </div>
        
        <CardContent className="flex flex-col gap-4 p-6">
          {showCelebration && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
              <div className="text-8xl animate-bounce">🎉</div>
            </div>
          )}
          
          <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 p-6 text-center shadow-xl relative overflow-hidden border-4 border-yellow-300">
            {showCelebration && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-200 animate-pulse opacity-50" />
            )}
            <p className="text-3xl font-black text-purple-800 relative z-10 mb-2">{currentQuestion.prompt}</p>
            {currentQuestion.type.includes("tricky") && (
              <p className="text-sm text-purple-600 font-bold">🧩 Tricky Puzzle!</p>
            )}
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {currentQuestion.options.map((option, idx) => {
            const isSelected = option === selectedOption;
            const isCorrect = option === currentQuestion.answer;
              const isWrong = isSelected && !isCorrect;
            return (
              <Button
                  key={`${option}-${idx}`}
                variant="outline"
                  disabled={hasSelected || selectedOption === -1 || isProcessing}
                className={cn(
                    "h-20 justify-center rounded-2xl border-4 text-2xl font-black shadow-lg transition-all duration-200",
                    !hasSelected && selectedOption !== -1 && !isProcessing && 
                      "border-purple-300 bg-white text-purple-800 hover:scale-110 hover:shadow-2xl hover:border-purple-500 active:scale-95",
                    isSelected && isCorrect && 
                      "border-green-500 bg-green-100 text-green-800 scale-110 animate-pulse shadow-2xl",
                    isWrong && 
                      "border-red-400 bg-red-100 text-red-800 scale-105",
                    (hasSelected || selectedOption === -1 || isProcessing) && !isSelected && !isCorrect && 
                      "opacity-50 cursor-not-allowed",
                    selectedOption === -1 && option === currentQuestion.answer && 
                      "border-blue-500 bg-blue-100 text-blue-800",
                )}
                onClick={() => handleSelectOption(option)}
              >
                  <span className="flex items-center gap-2">
                {option}
                    {isSelected && isCorrect && " ✓"}
                    {isWrong && " ✗"}
                  </span>
              </Button>
            );
          })}
        </div>
          
        {feedback && (
            <div className={cn(
              "rounded-2xl border-4 p-5 text-base font-semibold shadow-xl animate-fade-in",
              selectedOption === currentQuestion.answer 
                ? "border-green-400 bg-green-50 text-green-800" 
                : "border-purple-300 bg-purple-50 text-purple-800"
            )}>
            {feedback}
          </div>
        )}
          
          <div className="flex items-center justify-between gap-3 pt-2">
            <p className="text-sm text-purple-700 font-semibold">
              {!hasSelected && selectedOption !== -1 
                ? `⚡ Quick answers = bonus points! ${timeLeft > 20 ? "You're awesome! 🌟" : "Hurry! ⏰"}`
                : hasSelected 
                  ? "Great thinking! 🎯" 
                  : "Time's up! Check the answer above."}
          </p>
          <Button
            onClick={handleNext}
              disabled={(!hasSelected && selectedOption !== -1) || isProcessing}
              className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {gameComplete 
                ? "🎉 View Results" 
                : currentQuestionIndex === questionsPerLevel - 1 
                  ? level >= 3 ? "🏁 Finish Game" : "➡️ Next Level" 
                  : "➡️ Next Puzzle"}
          </Button>
        </div>
          
          {gameComplete && (
            <div className="rounded-2xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-8 text-center shadow-2xl animate-fade-in">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-3xl font-black text-purple-800 mb-4">Amazing Game!</h3>
              <div className="flex justify-center gap-6 text-base">
                <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="font-black text-2xl">{correctCount}</p>
                  <p className="text-xs text-purple-600 font-semibold">Correct</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                  <Trophy className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="font-black text-2xl">{score}</p>
                  <p className="text-xs text-purple-600 font-semibold">Score</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                  <Rocket className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="font-black text-2xl">Level {level}</p>
                  <p className="text-xs text-purple-600 font-semibold">Reached</p>
                </div>
                {bestStreak > 0 && (
                  <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                    <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="font-black text-2xl">{bestStreak}</p>
                    <p className="text-xs text-purple-600 font-semibold">Best Streak</p>
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
