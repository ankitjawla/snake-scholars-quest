import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Lock, CheckCircle } from "lucide-react";
import { innovationCities } from "@/data/founderStories";

interface ProgressMapProps {
  currentLevel: number;
  onBack: () => void;
}

export const ProgressMap = ({ currentLevel, onBack }: ProgressMapProps) => {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Innovation Map</h1>
          <div className="w-20" />
        </div>

        <Card className="p-6 mb-8 bg-primary/5 border-primary/20 text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Your Progress</h2>
          <p className="text-muted-foreground">
            You've unlocked <span className="text-primary font-bold">{Math.min(currentLevel, innovationCities.length)}</span> out of {innovationCities.length} Innovation Cities
          </p>
        </Card>

        <div className="relative">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {innovationCities.slice(0, -1).map((city, idx) => {
              const next = innovationCities[idx + 1];
              const isUnlocked = currentLevel >= city.unlockLevel;
              return (
                <line
                  key={`line-${idx}`}
                  x1="50%"
                  y1={`${(idx * 100 / (innovationCities.length - 1))}%`}
                  x2="50%"
                  y2={`${((idx + 1) * 100 / (innovationCities.length - 1))}%`}
                  stroke={isUnlocked ? "hsl(var(--primary))" : "hsl(var(--border))"}
                  strokeWidth="2"
                  strokeDasharray={isUnlocked ? "0" : "5,5"}
                />
              );
            })}
          </svg>

          {/* Cities */}
          <div className="relative space-y-4" style={{ zIndex: 1 }}>
            {innovationCities.map((city, idx) => {
              const isUnlocked = currentLevel >= city.unlockLevel;
              const isCurrent = currentLevel === city.unlockLevel;

              return (
                <Card
                  key={city.name}
                  className={`p-6 transition-all ${
                    isUnlocked
                      ? isCurrent
                        ? "bg-primary/10 border-primary/40 animate-pulse-glow"
                        : "bg-primary/5 border-primary/20"
                      : "bg-muted/20 border-border opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        isUnlocked
                          ? isCurrent
                            ? "bg-primary text-primary-foreground animate-bounce-soft"
                            : "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isUnlocked ? (
                        isCurrent ? (
                          <MapPin className="w-6 h-6" />
                        ) : (
                          <CheckCircle className="w-6 h-6" />
                        )
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{city.name}</h3>
                      <p className="text-sm text-muted-foreground">{city.country}</p>
                      {isCurrent && (
                        <p className="text-xs text-primary font-medium mt-1">📍 Current Location</p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold text-muted-foreground">
                        Level {city.unlockLevel}
                      </div>
                      {!isUnlocked && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {city.unlockLevel - currentLevel} levels to unlock
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="mt-8 p-6 bg-gradient-to-br from-accent/10 to-secondary/10 border-accent/20 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Keep Going!</h3>
          <p className="text-muted-foreground">
            Complete more levels to unlock all Innovation Cities and discover inspiring founders from around the world.
          </p>
        </Card>
      </div>
    </div>
  );
};
