import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Paintbrush } from "lucide-react";

interface CreativeStudioProps {
  stars: number;
  unlockedSkins: string[];
  activeSkin?: string;
  onUnlock: (skinId: string, cost: number) => void;
  onEquip: (skinId: string) => void;
  onBack: () => void;
  simpleMode: boolean;
}

const skinCatalog = [
  {
    id: "classic",
    name: "Classic Jungle",
    cost: 0,
    description: "Green glow with forest freckles.",
    colors: ["#22c55e", "#166534"],
  },
  {
    id: "sunburst",
    name: "Sunburst Sprint",
    cost: 60,
    description: "Orange and yellow gradient inspired by desert sunsets.",
    colors: ["#f97316", "#facc15"],
  },
  {
    id: "nebula",
    name: "Nebula Night",
    cost: 80,
    description: "Cosmic purples with star sparkles for galaxy explorers.",
    colors: ["#a855f7", "#6366f1"],
  },
  {
    id: "geo",
    name: "Geo Glider",
    cost: 50,
    description: "Geometry Grove inspired with teal triangles and lines.",
    colors: ["#0ea5e9", "#14b8a6"],
  },
];

export const CreativeStudio = ({ stars, unlockedSkins, activeSkin, onUnlock, onEquip, onBack, simpleMode }: CreativeStudioProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-fuchsia-900 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-white/80 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {simpleMode ? "Back" : "Back to map"}
          </Button>
          <Badge variant="secondary" className="bg-amber-400/20 text-amber-100 border-amber-300/40">
            ⭐ {stars} {simpleMode ? "Stars" : "Design stars"}
          </Badge>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold">{simpleMode ? "Snake Skins" : "Creative Studio"}</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            {simpleMode
              ? "Spend stars to paint your snake. Each skin makes the arcade stage sparkle!"
              : "Design your dream snake using stars earned from quests and micro-challenges. Unlock a skin after you finish a chapter quiz."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {skinCatalog.map(skin => {
            const unlocked = unlockedSkins.includes(skin.id);
            const equipped = activeSkin === skin.id;
            return (
              <Card key={skin.id} className="bg-white/10 border-white/20 text-white p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full border border-white/40 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full" style={{
                      background: `linear-gradient(135deg, ${skin.colors[0]}, ${skin.colors[1]})`,
                    }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{skin.name}</h2>
                    <p className="text-sm text-white/70">{skin.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Cost: {skin.cost} ⭐</span>
                  {equipped && <Badge variant="secondary" className="bg-emerald-500/30 text-emerald-100 border-emerald-200/30">Equipped</Badge>}
                </div>

                <div className="flex gap-3">
                  {!unlocked ? (
                    <Button
                      className="flex-1 bg-amber-400 text-slate-900 hover:bg-amber-300"
                      disabled={stars < skin.cost}
                      onClick={() => onUnlock(skin.id, skin.cost)}
                    >
                      <Paintbrush className="mr-2 h-4 w-4" />
                      {simpleMode ? "Buy" : "Unlock skin"}
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                      variant={equipped ? "default" : "secondary"}
                      onClick={() => onEquip(skin.id)}
                    >
                      {equipped ? (simpleMode ? "Ready" : "Equipped") : (simpleMode ? "Wear" : "Equip skin")}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
