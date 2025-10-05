import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { educationalTopics } from "@/data/educationalContent";
import { type StickerAlbumEntry } from "@/types/userProgress";

interface StickerAlbumProps {
  stickers: StickerAlbumEntry[];
  simpleMode: boolean;
}

const getTierLabel = (tier: number) => {
  switch (tier) {
    case 1:
      return "Bronze";
    case 2:
      return "Silver";
    case 3:
      return "Gold";
    default:
      return "Starter";
  }
};

export const StickerAlbum = ({ stickers, simpleMode }: StickerAlbumProps) => {
  const stickerMap = new Map(stickers.map(sticker => [sticker.topicId, sticker]));

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {educationalTopics.filter(topic => topic.subject === "math").map(topic => {
        const entry = stickerMap.get(topic.id);
        const tiers = entry?.tiersUnlocked ?? [];
        const highestTier = tiers.length > 0 ? Math.max(...tiers) : 0;
        return (
          <Card key={topic.id} className="p-4 bg-gradient-to-br from-white via-slate-50 to-emerald-50 border-emerald-200/30">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl" aria-hidden>{topic.emoji}</span>
              <div>
                <h3 className="font-semibold text-slate-900">{topic.title}</h3>
                <p className="text-xs text-slate-500">{simpleMode ? "Sticker" : "Concept sticker"}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{topic.learningOutcome}</p>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map(tier => (
                <Badge
                  key={tier}
                  variant={tiers.includes(tier) ? "default" : "outline"}
                  className={tiers.includes(tier) ? "bg-emerald-500 text-white" : "text-slate-500"}
                >
                  {getTierLabel(tier)}
                </Badge>
              ))}
            </div>
            <div className="mt-3 text-xs text-emerald-700">
              {highestTier > 0
                ? `${getTierLabel(highestTier)} badge earned!`
                : "Answer chapter quizzes to unlock shiny stickers."}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
