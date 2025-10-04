import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VisualLearningToolProps {
  type: "fraction-bar" | "number-line" | "multiplication-grid";
  topic: string;
}

export const VisualLearningTool = ({ type, topic }: VisualLearningToolProps) => {
  const [value, setValue] = useState(50);

  if (type === "fraction-bar") {
    return (
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Interactive Fraction Visualizer</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium w-20">Value:</span>
            <Slider
              value={[value]}
              onValueChange={(vals) => setValue(vals[0])}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="font-bold w-16">{value}/100</span>
          </div>
          <div className="h-12 bg-muted rounded-lg overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${value}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            This represents {value}% or {(value / 100).toFixed(2)} as a decimal
          </p>
        </div>
      </Card>
    );
  }

  if (type === "number-line") {
    return (
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Interactive Number Line</h3>
        <div className="space-y-4">
          <div className="relative h-16 bg-muted rounded-lg">
            <div className="absolute inset-x-0 top-1/2 h-1 bg-foreground/20" />
            {[0, 25, 50, 75, 100].map(num => (
              <div
                key={num}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${num}%` }}
              >
                <div className="w-1 h-4 bg-foreground/40 -translate-x-1/2" />
                <span className="absolute top-6 left-0 -translate-x-1/2 text-xs">
                  {num}
                </span>
              </div>
            ))}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 transition-all duration-300"
              style={{ left: `${value}%` }}
            />
          </div>
          <Slider
            value={[value]}
            onValueChange={(vals) => setValue(vals[0])}
            max={100}
            step={5}
          />
          <p className="text-center font-bold text-xl">{value}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4">Visual Learning Tool</h3>
      <p className="text-muted-foreground">Interactive visualization for {topic}</p>
    </Card>
  );
};
