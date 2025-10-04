import { Button } from "@/components/ui/button";

interface SubjectFilterProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
}

const subjects = [
  { id: "all", label: "All Subjects", emoji: "📚", color: "primary" },
  { id: "math", label: "Mathematics", emoji: "➕", color: "blue-500" },
  { id: "science", label: "Science", emoji: "🔬", color: "green-500" },
  { id: "evs", label: "EVS", emoji: "🌍", color: "teal-500" },
  { id: "english", label: "English", emoji: "📖", color: "orange-500" },
  { id: "hindi", label: "हिंदी", emoji: "🇮🇳", color: "red-500" },
  { id: "social-science", label: "Social Science", emoji: "🌍", color: "purple-500" },
  { id: "programming", label: "Programming", emoji: "💻", color: "indigo-500" },
];

export const SubjectFilter = ({ selectedSubject, onSubjectChange }: SubjectFilterProps) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2 justify-center">
      {subjects.map((subject) => (
        <Button
          key={subject.id}
          variant={selectedSubject === subject.id ? "default" : "outline"}
          size="sm"
          onClick={() => onSubjectChange(subject.id)}
          className="gap-1"
        >
          <span>{subject.emoji}</span>
          <span className="hidden sm:inline">{subject.label}</span>
        </Button>
      ))}
    </div>
  );
};
