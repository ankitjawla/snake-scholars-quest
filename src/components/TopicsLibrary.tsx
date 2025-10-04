import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { educationalTopics } from "@/data/educationalContent";

interface TopicsLibraryProps {
  onBack: () => void;
}

export const TopicsLibrary = ({ onBack }: TopicsLibraryProps) => {
  const mathTopics = educationalTopics.filter(t => t.subject === "math");
  const scienceTopics = educationalTopics.filter(t => t.subject === "science");
  const programmingTopics = educationalTopics.filter(t => t.subject === "programming");

  const subjectSections = [
    { title: "Mathematics", emoji: "➕", topics: mathTopics, color: "primary" },
    { title: "Science", emoji: "🔬", topics: scienceTopics, color: "secondary" },
    { title: "Programming", emoji: "💻", topics: programmingTopics, color: "accent" },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Learning Topics</h1>
          <div className="w-20" />
        </div>

        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-bold text-foreground mb-2">Discover & Learn</h2>
          <p className="text-muted-foreground">
            Play the game to unlock these amazing topics! Each topic reveals cool concepts, examples, and fun facts.
          </p>
        </Card>

        {subjectSections.map((section, idx) => (
          <div key={section.title} className="mb-8 animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{section.emoji}</div>
              <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {section.topics.map((topic) => (
                <Card key={topic.id} className={`p-5 bg-${section.color}/5 border-${section.color}/20 hover:shadow-lg transition-all`}>
                  <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0">{topic.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground">{topic.concept}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Keep Playing!</h3>
          <p className="text-muted-foreground">
            The more you play, the more topics you'll discover. Learning has never been this fun! 🎮📚
          </p>
        </Card>
      </div>
    </div>
  );
};
