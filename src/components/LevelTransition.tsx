import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Lightbulb, Calculator } from "lucide-react";

interface LevelTransitionProps {
  level: number;
  onContinue: () => void;
}

const levelContent = [
  {
    title: "Welcome to Programming!",
    moral: "Persistence: Just like catching snakes, coding requires patience and practice.",
    concept: "In programming, we use loops to repeat actions. You just practiced a loop by catching snakes over and over!",
    tip: "💡 A 'for loop' in code does something multiple times—just like you caught multiple snakes!",
    subject: "Programming Basics",
    icon: Code,
  },
  {
    title: "Variables Store Information",
    moral: "Organization: Keeping track of things helps us achieve our goals.",
    concept: "Your score is like a 'variable' in programming—it stores a number that changes as you play!",
    tip: "💡 In code: let score = 0; Then we update it: score = score + 1;",
    subject: "Programming Concepts",
    icon: Code,
  },
  {
    title: "Speed = Distance ÷ Time",
    moral: "Efficiency: Working smarter helps you accomplish more in less time.",
    concept: "The snakes move using velocity—their speed and direction. This is physics in action!",
    tip: "💡 Speed = Distance ÷ Time. Faster snakes move more distance in the same time!",
    subject: "Math & Physics",
    icon: Calculator,
  },
  {
    title: "If-Then Logic",
    moral: "Decision Making: Every choice leads to a different outcome.",
    concept: "The game uses 'if statements' to check: IF you clicked near a snake, THEN increase the score!",
    tip: "💡 In code: if (clicked) { score++; } This is how computers make decisions!",
    subject: "Logic & Programming",
    icon: Code,
  },
  {
    title: "Coordinates in 2D Space",
    moral: "Precision: Being exact helps us achieve better results.",
    concept: "Each snake has an X and Y position. This is how we track location in 2D space!",
    tip: "💡 X goes left-right, Y goes up-down. Together they pinpoint any spot on screen!",
    subject: "Mathematics",
    icon: Calculator,
  },
  {
    title: "Random Numbers & Probability",
    moral: "Adaptability: Life is unpredictable, and we must learn to adapt.",
    concept: "Snakes appear at random positions using Math.random()—a function that creates unpredictability!",
    tip: "💡 Math.random() gives a number between 0 and 1. Multiply it to get bigger random numbers!",
    subject: "Math & Programming",
    icon: Calculator,
  },
];

export const LevelTransition = ({ level, onContinue }: LevelTransitionProps) => {
  const content = levelContent[(level - 1) % levelContent.length];
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 animate-slide-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-bounce-soft">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="text-sm text-muted-foreground mb-2">{content.subject}</div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{content.title}</h2>
          <div className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
            Level {level} Complete!
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold text-foreground mb-1">Life Lesson</div>
                <p className="text-foreground/90">{content.moral}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold text-foreground mb-1">What You Learned</div>
                <p className="text-foreground/90">{content.concept}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold text-foreground mb-1">Technical Tip</div>
                <p className="text-foreground/90">{content.tip}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={onContinue}
            className="bg-gradient-primary text-background hover:opacity-90 transition-opacity shadow-lg"
          >
            Continue to Next Level
          </Button>
        </div>
      </Card>
    </div>
  );
};
