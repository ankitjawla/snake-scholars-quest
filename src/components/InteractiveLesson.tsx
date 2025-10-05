import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, BookOpen, Lightbulb, Play } from "lucide-react";
import { educationalTopics } from "@/data/educationalContent";
import { PracticeProblems } from "./PracticeProblems";
import { markLessonComplete } from "@/utils/progressStorage";
import { logSession } from "@/utils/progressLogger";
import { useToast } from "@/hooks/use-toast";

interface InteractiveLessonProps {
  topicId: number;
  mode: "study" | "practice" | "challenge";
  onComplete: () => void;
  onBack: () => void;
}

export const InteractiveLesson = ({ topicId, mode, onComplete, onBack }: InteractiveLessonProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(Date.now());
  const { toast } = useToast();

  const topic = educationalTopics.find(t => t.id === topicId);

  if (!topic) {
    return <div>Topic not found</div>;
  }

  const steps = [
    { type: "intro", title: "Introduction" },
    { type: "concept", title: "Understanding the Concept" },
    { type: "example", title: "Real-World Example" },
    { type: "funfact", title: "Did You Know?" },
    { type: "practice", title: "Practice Problems" },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePracticeComplete = (score: number) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    markLessonComplete(topicId, timeSpent);
    
    // Log session for analytics
    logSession({
      topicId,
      topicTitle: topic.title,
      activity: "lesson_viewed",
      duration: timeSpent,
      score,
    });
    
    toast({
      title: "Lesson Complete! 🎉",
      description: `You scored ${score.toFixed(0)}% on the practice problems. ${
        mode === "practice" ? "Ready to play the game!" : "Great job learning!"
      }`,
    });
    
    onComplete();
  };

  const currentStepData = steps[currentStep];

  // Generate practice problems based on the topic's question
  const practiceProblems = [
    {
      question: topic.question,
      options: topic.options,
      correctAnswer: topic.correctAnswer,
      explanation: topic.explanation,
    },
    // Add 2 more similar problems (simplified for now)
    {
      question: `Another question about ${topic.title.toLowerCase()}`,
      options: [...topic.options].sort(() => Math.random() - 0.5),
      correctAnswer: Math.floor(Math.random() * topic.options.length),
      explanation: `This helps reinforce your understanding of ${topic.title}.`,
    },
    {
      question: `Challenge question: Apply your knowledge of ${topic.title.toLowerCase()}`,
      options: [...topic.options].sort(() => Math.random() - 0.5),
      correctAnswer: Math.floor(Math.random() * topic.options.length),
      explanation: `Excellent work! You're mastering ${topic.title}.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Topics
        </Button>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-3xl font-bold">{topic.title}</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-8 mb-6">
          {currentStepData.type === "intro" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-lg text-muted-foreground mb-4">
                  Welcome! In this lesson, you'll learn about <strong>{topic.title}</strong>.
                </p>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Learning Outcome:</p>
                  <p>{topic.learningOutcome}</p>
                </div>
                {topic.ncertChapter && (
                  <p className="text-sm text-muted-foreground mt-4">
                    📚 Based on: {topic.ncertChapter}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStepData.type === "concept" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-8 h-8 text-accent" />
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
              </div>
              <div className="prose max-w-none">
                <div className="bg-accent/10 p-6 rounded-lg">
                  <p className="text-lg leading-relaxed whitespace-pre-line">
                    {topic.concept}
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStepData.type === "example" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">💡</div>
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
              </div>
              <div className="prose max-w-none">
                <div className="bg-secondary/10 p-6 rounded-lg">
                  <p className="text-lg leading-relaxed whitespace-pre-line">
                    {topic.example}
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStepData.type === "funfact" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">✨</div>
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
              </div>
              <div className="prose max-w-none">
                <div className="bg-gradient-primary text-primary-foreground p-6 rounded-lg">
                  <p className="text-lg leading-relaxed whitespace-pre-line">
                    {topic.funFact}
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStepData.type === "practice" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Play className="w-8 h-8 text-secondary" />
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Let's test your understanding with a few practice problems!
              </p>
              <PracticeProblems
                problems={practiceProblems}
                onComplete={handlePracticeComplete}
              />
            </div>
          )}
        </Card>

        {currentStepData.type !== "practice" && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
