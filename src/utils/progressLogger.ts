import { getStoredProgress, saveProgress } from "./progressStorage";

export interface SessionLog {
  timestamp: Date;
  topicId: number;
  topicTitle: string;
  activity: "lesson_viewed" | "quiz_attempted" | "game_played" | "assessment_passed";
  duration: number; // in seconds
  score?: number;
  correctAnswers?: number;
  totalQuestions?: number;
}

export const logSession = (log: Omit<SessionLog, "timestamp">) => {
  const progress = getStoredProgress();
  const sessionLog: SessionLog = {
    ...log,
    timestamp: new Date(),
  };

  // Store in session logs (we can add this to UserProgress interface later)
  if (!(progress as any).sessionLogs) {
    (progress as any).sessionLogs = [];
  }
  (progress as any).sessionLogs.push(sessionLog);

  // Keep only last 100 sessions to avoid localStorage bloat
  if ((progress as any).sessionLogs.length > 100) {
    (progress as any).sessionLogs = (progress as any).sessionLogs.slice(-100);
  }

  saveProgress(progress);
  
  // Log to console for debugging (can be removed in production)
  console.log("📊 Session Logged:", sessionLog);
};

export const getSessionStats = () => {
  const progress = getStoredProgress();
  const logs: SessionLog[] = (progress as any).sessionLogs || [];

  return {
    totalSessions: logs.length,
    totalTimeSpent: logs.reduce((sum, log) => sum + log.duration, 0),
    averageScore: logs
      .filter(log => log.score !== undefined)
      .reduce((sum, log, _, arr) => sum + (log.score || 0) / arr.length, 0),
    topicsStudied: new Set(logs.map(log => log.topicId)).size,
    recentSessions: logs.slice(-10).reverse(),
  };
};

export const exportProgressData = () => {
  const progress = getStoredProgress();
  const stats = getSessionStats();
  
  const exportData = {
    progress,
    stats,
    exportedAt: new Date().toISOString(),
  };

  // Create downloadable JSON
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `snake-scholars-progress-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
};
