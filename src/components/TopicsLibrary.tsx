import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { educationalTopics } from "@/data/educationalContent";
import { SubjectFilter } from "./SubjectFilter";

interface TopicsLibraryProps {
  onBack: () => void;
}

export const TopicsLibrary = ({ onBack }: TopicsLibraryProps) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const filteredTopics = selectedSubject === "all" 
    ? educationalTopics 
    : educationalTopics.filter(t => t.subject === selectedSubject);

  const mathTopics = filteredTopics.filter(t => t.subject === "math");
  const scienceTopics = filteredTopics.filter(t => t.subject === "science");
  const evsTopics = filteredTopics.filter(t => t.subject === "evs");
  const englishTopics = filteredTopics.filter(t => t.subject === "english");
  const hindiTopics = filteredTopics.filter(t => t.subject === "hindi");
  const socialTopics = filteredTopics.filter(t => t.subject === "social-science");
  const programmingTopics = filteredTopics.filter(t => t.subject === "programming");

  const subjectSections = [
    { title: "Mathematics", emoji: "➕", topics: mathTopics, color: "blue-500" },
    { title: "Science", emoji: "🔬", topics: scienceTopics, color: "green-500" },
    { title: "EVS", emoji: "🌍", topics: evsTopics, color: "teal-500" },
    { title: "English", emoji: "📖", topics: englishTopics, color: "orange-500" },
    { title: "हिंदी", emoji: "🇮🇳", topics: hindiTopics, color: "red-500" },
    { title: "Social Science", emoji: "🏛️", topics: socialTopics, color: "purple-500" },
    { title: "Programming", emoji: "💻", topics: programmingTopics, color: "indigo-500" },
  ].filter(section => section.topics.length > 0);

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
          <h2 className="text-xl font-bold text-foreground mb-2">Discover & Learn - Class 5 Curriculum</h2>
          <p className="text-muted-foreground">
            60+ topics covering Math, Science, English, Hindi, Social Science & Programming! Play to unlock amazing concepts.
          </p>
        </Card>

        <SubjectFilter 
          selectedSubject={selectedSubject} 
          onSubjectChange={setSelectedSubject}
        />

        {subjectSections.map((section, idx) => (
          <div key={section.title} className="mb-8 animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{section.emoji}</div>
              <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {section.topics.map((topic) => (
                <Card key={topic.id} className="p-5 bg-card/50 hover:bg-card border-2 hover:border-primary/30 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0">{topic.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{topic.title}</h3>
                        {topic.subCategory && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {topic.subCategory}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{topic.concept}</p>
                      <p className="text-xs text-muted-foreground/70 italic">{topic.learningOutcome}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">🎯 Complete 5th Grade Coverage!</h3>
          <p className="text-muted-foreground mb-2">
            <strong>{educationalTopics.length} topics</strong> aligned with NCERT Class 5 curriculum
          </p>
          <p className="text-sm text-muted-foreground">
            Keep playing to master all subjects and become a learning champion! 🏆
          </p>
        </Card>
      </div>
    </div>
  );
};
