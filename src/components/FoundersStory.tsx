import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Heart, Lightbulb } from "lucide-react";

interface FoundersStoryProps {
  onBack: () => void;
}

export const FoundersStory = ({ onBack }: FoundersStoryProps) => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Game
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet the Founders
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Two young sisters with a big dream: making learning fun for everyone!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Vrinda Mann</h3>
                <p className="text-muted-foreground">Age 10 • Co-Founder</p>
              </div>
            </div>
            <div className="space-y-4 text-foreground/90">
              <p>
                Vrinda is a curious and creative 10-year-old who loves solving puzzles and learning new things. 
                She's always asking "why?" and "how?", and she believes that every question deserves an interesting answer.
              </p>
              <p>
                At Ryan International School in Delhi, she's known for her enthusiasm in science class and her 
                ability to explain complex ideas in simple ways. She dreams of becoming a scientist or teacher 
                one day, helping others discover the joy of learning.
              </p>
              <p className="italic text-primary font-medium">
                "I wanted to create a game where you don't just play—you learn something amazing every time!"
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Aarya Mann</h3>
                <p className="text-muted-foreground">Age 9 • Co-Founder</p>
              </div>
            </div>
            <div className="space-y-4 text-foreground/90">
              <p>
                Aarya, at 9 years old, brings boundless energy and creativity to everything she does. 
                She loves games, art, and making things that bring smiles to people's faces.
              </p>
              <p>
                Also a student at Ryan International School, Aarya has a special talent for thinking outside 
                the box. She's the one who came up with the idea of adding moral lessons to each game level, 
                believing that games can teach us how to be better people.
              </p>
              <p className="italic text-secondary font-medium">
                "Games should make you feel good and teach you something important—that's what makes them special!"
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-8 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Their Journey</h2>
          </div>
          <div className="space-y-4 text-foreground/90">
            <p className="text-lg">
              The idea for "Catch the Snake" came during a family dinner when Vrinda and Aarya were discussing 
              their school projects. They realized that while they loved playing games on their iPads, most games 
              didn't really teach them anything meaningful.
            </p>
            <p className="text-lg">
              With encouragement from their mother, a dedicated school teacher who values education, and their 
              father, a Sales Director at a multinational company in Gurgaon who teaches them about problem-solving, 
              the sisters decided to create something different.
            </p>
            <p className="text-lg">
              They spent evenings brainstorming ideas, combining Vrinda's love for science and programming with 
              Aarya's creativity and storytelling. The result? A game that's not just fun to play, but also 
              teaches valuable lessons about programming logic, mathematical thinking, scientific concepts, 
              and important life values.
            </p>
            <p className="text-lg font-semibold text-primary">
              Their mission: To prove that learning can be the most exciting game you'll ever play!
            </p>
          </div>
        </Card>

        <div className="mt-12 text-center">
          <Button 
            size="lg"
            variant="hero"
            onClick={onBack}
            className="animate-pulse-glow"
          >
            Start Your Learning Adventure
          </Button>
        </div>
      </div>
    </div>
  );
};
