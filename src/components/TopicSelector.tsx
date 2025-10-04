import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Circle, Play } from "lucide-react";
import { educationalTopics } from "@/data/educationalContent";
import { SubjectFilter } from "./SubjectFilter";
import { hasCompletedLesson, getMasteryLevel } from "@/utils/progressStorage";
import { Badge } from "@/components/ui/badge";

interface TopicSelectorProps {
  onSelectTopic: (topicId: number) => void;
  onBack: () => void;
  mode: "study" | "practice" | "challenge";
}

const subjectColors: Record<string, string> = {
  math: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
  science: "text-green-600 bg-green-50 dark:bg-green-950/50",
  evs: "text-teal-600 bg-teal-50 dark:bg-teal-950/50",
  english: "text-orange-600 bg-orange-50 dark:bg-orange-950/50",
  hindi: "text-red-600 bg-red-50 dark:bg-red-950/50",
  "social-science": "text-purple-600 bg-purple-50 dark:bg-purple-950/50",
  programming: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50",
};

export const TopicSelector = ({ onSelectTopic, onBack, mode }: TopicSelectorProps) => {
  const [selectedSubject, setSelectedSubject] = useState("all");

  const filteredTopics = selectedSubject === "all"
    ? educationalTopics
    : educationalTopics.filter(topic => topic.subject === selectedSubject);

  const getMasteryBadge = (topicId: number) => {
    const mastery = getMasteryLevel(topicId);
    if (!mastery) return null;

    const badges = {
      beginner: { label: "Beginner", variant: "secondary" as const },
      intermediate: { label: "Intermediate", variant: "default" as const },
      advanced: { label: "Advanced", variant: "default" as const },
      mastered: { label: "Mastered", variant: "default" as const },
    };

    return badges[mastery];
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Modes
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Select a Topic to Learn</h1>
          <p className="text-xl text-muted-foreground">
            {mode === "study" && "Choose any topic to start learning"}
            {mode === "practice" && "Complete the lesson, then play the game"}
            {mode === "challenge" && "Advanced mixed-topic challenges"}
          </p>
        </div>

        <SubjectFilter 
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic, index) => {
            const completed = hasCompletedLesson(topic.id);
            const masteryBadge = getMasteryBadge(topic.id);

            return (
              <Card
                key={topic.id}
                className={`p-5 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in ${
                  subjectColors[topic.subject] || ""
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => onSelectTopic(topic.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {completed ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {topic.subject}
                      </Badge>
                      {masteryBadge && (
                        <Badge variant={masteryBadge.variant} className="text-xs">
                          {masteryBadge.label}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{topic.title}</h3>
                    {topic.subCategory && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {topic.subCategory}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {topic.learningOutcome}
                </p>

                <Button className="w-full" variant={completed ? "outline" : "default"}>
                  <Play className="mr-2 h-4 w-4" />
                  {completed ? "Review Lesson" : "Start Learning"}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
