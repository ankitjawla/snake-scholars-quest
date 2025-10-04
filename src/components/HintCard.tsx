import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface HintCardProps {
  hint: string;
  visible: boolean;
}

export const HintCard = ({ hint, visible }: HintCardProps) => {
  if (!visible) return null;

  return (
    <Card className="absolute top-4 left-1/2 -translate-x-1/2 z-10 p-3 bg-primary/90 text-primary-foreground backdrop-blur-sm animate-slide-up max-w-md">
      <div className="flex items-start gap-2">
        <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p className="text-sm">{hint}</p>
      </div>
    </Card>
  );
};
