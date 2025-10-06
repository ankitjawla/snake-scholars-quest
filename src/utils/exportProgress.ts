import { getStoredProgress } from "./progressStorage";
import { getSessionStats } from "./progressLogger";

export const exportProgressAsJSON = () => {
  const progress = getStoredProgress();
  const stats = getSessionStats();
  
  const exportData = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    progress,
    stats,
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `snake-scholars-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
};

export const exportProgressAsCSV = () => {
  const progress = getStoredProgress();
  
  const csvRows = [
    ["Metric", "Value"],
    ["Total Stars", progress.stars],
    ["Topics Completed", progress.topicsCompleted.length],
    ["Topics In Progress", progress.topicsInProgress.length],
    ["Daily Streak", progress.streak.dailyCount],
    ["Weekly Streak", progress.streak.weeklyCount],
    ["Total Learning Minutes", progress.totalLearningMinutes],
    ["Challenges Completed", progress.challengeHistory.length],
    ["Badges Earned", progress.badges.length],
    ["", ""],
    ["Topic ID", "Mastery Level", "Last Viewed", "Time Spent"],
  ];
  
  progress.lessonsViewed.forEach(lesson => {
    const mastery = progress.masteryLevels.find(m => m.topicId === lesson.topicId);
    csvRows.push([
      String(lesson.topicId),
      mastery?.level || "beginner",
      lesson.timestamp.toLocaleDateString(),
      `${Math.round(lesson.timeSpent / 60)} min`
    ]);
  });
  
  const csvContent = csvRows.map(row => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `snake-scholars-report-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  URL.revokeObjectURL(url);
};

export const importProgressFromJSON = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.progress && data.version) {
          localStorage.setItem("snakerunner_progress", JSON.stringify(data.progress));
          resolve(true);
        } else {
          reject(new Error("Invalid backup file format"));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
