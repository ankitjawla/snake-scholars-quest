import { useMemo, useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface WordGardenGameProps {
  simpleMode: boolean;
  topicName?: string;
  onComplete: (result: { score: number; stars: number; correct: number; total: number; message: string }) => void;
}

interface WordChallenge {
  word: string;
  clue: string;
  options: string[];
  fact: string;
}

const challenges: WordChallenge[] = [
  {
    word: "glacier",
    clue: "A slow-moving river of ice found in cold mountains.",
    options: ["volcano", "glacier", "desert", "jungle"],
    fact: "Glaciers carve new shapes into the land as they move!",
  },
  {
    word: "fraction",
    clue: "A way to show equal parts of a whole, like 1/2 or 3/4.",
    options: ["diagram", "fraction", "estimate", "pattern"],
    fact: "Fractions help bakers share cakes and pizzas equally.",
  },
  {
    word: "orbit",
    clue: "The path a planet or moon takes as it travels around another object.",
    options: ["orbit", "weather", "shadow", "pulse"],
    fact: "Earth completes one orbit around the Sun every year!",
  },
  {
    word: "habitat",
    clue: "The natural home for a plant or animal.",
    options: ["habitat", "equator", "marble", "oxygen"],
    fact: "Animals build shelters that match their habitats, like burrows or nests.",
  },
  {
    word: "symphony",
    clue: "A long piece of music written for an orchestra.",
    options: ["sketch", "symphony", "recipe", "monsoon"],
    fact: "A symphony can have more than 80 musicians playing together!",
  },
  {
    word: "magma",
    clue: "Melted rock deep underground that can form lava when it erupts.",
    options: ["magma", "crystal", "compass", "prism"],
    fact: "When magma reaches the surface it cools to form new igneous rocks.",
  },
  {
    word: "ecosystem",
    clue: "A community of living things interacting with their environment.",
    options: ["ecosystem", "satellite", "equation", "compass"],
    fact: "Rainforests are vibrant ecosystems filled with creatures and plants working together.",
  },
  {
    word: "timeline",
    clue: "A visual way to show events in the order they happened.",
    options: ["equator", "timeline", "astronaut", "paragraph"],
    fact: "Historians use timelines to keep track of important discoveries and events.",
  },
];

const shuffleArray = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const calculateStars = (correct: number, total: number) => {
  if (correct === 0) return 0;
  const accuracy = correct / total;
  if (accuracy === 1) return 4;
  if (accuracy >= 0.75) return 3;
  if (accuracy >= 0.5) return 2;
  return 1;
};

const scrambleWord = (word: string) => {
  const letters = word.split("");
  let scrambled = word;
  while (scrambled === word) {
    scrambled = shuffleArray(letters).join("");
  }
  return scrambled.toUpperCase();
};

export const WordGardenGame = ({ onComplete, simpleMode, topicName }: WordGardenGameProps) => {
  const totalRounds = simpleMode ? 4 : 6;
  const availableChallenges = useMemo(() => shuffleArray(challenges).slice(0, totalRounds), [totalRounds]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentChallenge = availableChallenges[currentIndex];
  const hasSelected = selectedWord !== null;

  const handleSelectWord = (choice: string) => {
    if (hasSelected) return;
    setSelectedWord(choice);
    const isCorrect = choice === currentChallenge.word;
    setScore(prev => prev + (isCorrect ? 150 : 60));
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setFeedback(`Yes! "${currentChallenge.word}" means ${currentChallenge.clue.toLowerCase()}`);
    } else {
      setFeedback(`Good try! The correct word is "${currentChallenge.word}" — ${currentChallenge.clue.toLowerCase()}`);
    }
  };

  const handleNext = () => {
    if (!hasSelected) return;
    if (currentIndex === availableChallenges.length - 1) {
      const stars = calculateStars(correctCount, availableChallenges.length);
      const message =
        correctCount === availableChallenges.length
          ? "Word wizard! You picked every term correctly."
          : correctCount >= Math.ceil(availableChallenges.length * 0.75)
            ? "Vocabulary garden blooming nicely!"
            : "Keep exploring—revisit the clues to earn more stars.";

      onComplete({
        score,
        stars,
        correct: correctCount,
        total: availableChallenges.length,
        message: topicName
          ? `${topicName} vocabulary boost: ${correctCount} / ${availableChallenges.length} mastered`
          : `You matched ${correctCount} of ${availableChallenges.length} brilliant words!`,
      });
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setSelectedWord(null);
    setFeedback(null);
  };

  return (
    <Card className="border-2 border-sky-200 bg-sky-50 shadow-lg">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-sky-700">
          <BookOpen className="h-6 w-6" /> Wonder Word Garden
        </CardTitle>
        <CardDescription>
          Match each definition to its perfect word buddy{topicName ? ` from ${topicName}` : ""}. Every correct match grows a sparkling vocabulary vine!
        </CardDescription>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-sky-700 shadow">Score: {score}</span>
          <span className="rounded-full bg-white px-3 py-1 text-sky-600 shadow">
            Words discovered: {currentIndex + 1} / {availableChallenges.length}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sky-600 shadow">
            <Sparkles className="h-4 w-4" /> Scrambled hint: {scrambleWord(currentChallenge.word)}
          </span>
        </div>
        <Progress value={((currentIndex + (hasSelected ? 1 : 0)) / availableChallenges.length) * 100} className="h-2 bg-sky-100" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-xl bg-white/80 p-5 shadow-inner">
          <p className="text-lg font-semibold text-sky-800">{currentChallenge.clue}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {currentChallenge.options.map(option => {
            const isSelected = option === selectedWord;
            const isCorrect = option === currentChallenge.word;
            return (
              <Button
                key={option}
                variant="outline"
                className={cn(
                  "h-16 justify-start rounded-xl border-2 border-sky-200 bg-white text-left text-lg font-semibold text-sky-800 shadow",
                  isSelected &&
                    (isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-rose-300 bg-rose-50 text-rose-600"),
                )}
                onClick={() => handleSelectWord(option)}
              >
                {option}
              </Button>
            );
          })}
        </div>
        {feedback && (
          <div className="rounded-xl border border-sky-200 bg-white/90 p-4 text-sm text-sky-700 shadow">
            {feedback}
            <div className="mt-2 text-xs text-sky-600">Fun fact: {currentChallenge.fact}</div>
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-sky-700">
            Read carefully and picture the meaning in your mind. {hasSelected ? "Ready for the next word?" : "Tap the word that fits best."}
          </p>
          <Button
            onClick={handleNext}
            disabled={!hasSelected}
            className="rounded-full bg-sky-500 px-6 py-2 text-white shadow hover:bg-sky-600"
          >
            {currentIndex === availableChallenges.length - 1 ? "Show Results" : "Next Word"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
