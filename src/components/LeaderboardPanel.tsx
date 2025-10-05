import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Medal, Percent } from "lucide-react";
import { type LeaderboardProfile } from "@/types/userProgress";

interface LeaderboardPanelProps {
  onBack: () => void;
  percentile: number;
  averageScore: number;
  profile?: LeaderboardProfile;
  onSaveProfile: (profile: LeaderboardProfile) => void;
  simpleMode: boolean;
}

const percentileBand = (percentile: number) => {
  if (percentile >= 90) return "Galaxy Genius";
  if (percentile >= 75) return "Star Scholar";
  if (percentile >= 50) return "Trailblazer";
  return "Bright Beginner";
};

export const LeaderboardPanel = ({ onBack, percentile, averageScore, profile, onSaveProfile, simpleMode }: LeaderboardPanelProps) => {
  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [classCode, setClassCode] = useState(profile?.classCode ?? "");

  const bandName = percentileBand(percentile);

  const handleSave = () => {
    const cleanNickname = nickname.trim().slice(0, 12) || "SneakyHero";
    onSaveProfile({ nickname: cleanNickname, classCode: classCode.trim() || undefined, percentileBand: bandName });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={onBack} className="text-white/80 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {simpleMode ? "Back" : "Back to home"}
        </Button>

        <Card className="bg-slate-900 border-slate-700 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Medal className="h-8 w-8 text-amber-400" />
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">Safe leaderboard</p>
              <h1 className="text-3xl font-bold">{bandName}</h1>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-slate-700 p-4">
              <p className="text-sm text-slate-300">Percentile band</p>
              <p className="text-2xl font-bold text-white">Top {Math.max(100 - percentile, 1)}%</p>
              <p className="text-xs text-slate-400 mt-1">We show bands not ranks to keep competition kind.</p>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4">
              <p className="text-sm text-slate-300">Average score</p>
              <p className="text-2xl font-bold text-white">{averageScore.toFixed(0)}%</p>
              <p className="text-xs text-slate-400 mt-1">Based on last 10 quizzes or lessons.</p>
            </Card>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Percent className="h-5 w-5 text-amber-300" />
              {simpleMode ? "Make a nickname" : "Create a device-only nickname"}
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                value={nickname}
                onChange={event => setNickname(event.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                placeholder="RainbowRider"
                maxLength={12}
                aria-label="Leaderboard nickname"
              />
              <Input
                value={classCode}
                onChange={event => setClassCode(event.target.value.replace(/[^A-Z0-9]/g, "").toUpperCase())}
                placeholder="CLASS123"
                aria-label="Class code (optional)"
              />
            </div>
            <p className="text-xs text-slate-400">
              {simpleMode
                ? "Nicknames stay on this device."
                : "Nicknames stay on this device and can be shared with teachers using a class code."}
            </p>
            <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold">
              {simpleMode ? "Save" : "Save profile"}
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-300">
            <Badge variant="outline" className="border-amber-400/40 text-amber-200">No personal info</Badge>
            <Badge variant="outline" className="border-emerald-400/40 text-emerald-200">Device-only leaderboard</Badge>
            <Badge variant="outline" className="border-sky-400/40 text-sky-200">Class code optional</Badge>
            <Badge variant="outline" className="border-fuchsia-400/40 text-fuchsia-200">Celebrate effort</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
};
