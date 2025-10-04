import { UserProgress } from "@/types/userProgress";

const STORAGE_KEY = "snakerunner_progress";

export const getStoredProgress = (): UserProgress => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      topicsCompleted: [],
      topicsInProgress: [],
      lessonsViewed: [],
      quizAttempts: [],
      masteryLevels: [],
      nextReviewDate: [],
    };
  }
  
  const parsed = JSON.parse(stored);
  // Convert date strings back to Date objects
  parsed.lessonsViewed = parsed.lessonsViewed.map((item: any) => ({
    ...item,
    timestamp: new Date(item.timestamp),
  }));
  parsed.nextReviewDate = parsed.nextReviewDate.map((item: any) => ({
    ...item,
    date: new Date(item.date),
  }));
  
  return parsed;
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const hasCompletedLesson = (topicId: number): boolean => {
  const progress = getStoredProgress();
  return progress.lessonsViewed.some(lesson => 
    lesson.topicId === topicId && lesson.completionRate === 100
  );
};

export const markLessonComplete = (topicId: number, timeSpent: number) => {
  const progress = getStoredProgress();
  
  const existingIndex = progress.lessonsViewed.findIndex(l => l.topicId === topicId);
  
  if (existingIndex >= 0) {
    progress.lessonsViewed[existingIndex] = {
      topicId,
      timestamp: new Date(),
      timeSpent,
      completionRate: 100,
    };
  } else {
    progress.lessonsViewed.push({
      topicId,
      timestamp: new Date(),
      timeSpent,
      completionRate: 100,
    });
  }
  
  if (!progress.topicsInProgress.includes(topicId)) {
    progress.topicsInProgress.push(topicId);
  }
  
  saveProgress(progress);
};

export const getMasteryLevel = (topicId: number): "beginner" | "intermediate" | "advanced" | "mastered" | null => {
  const progress = getStoredProgress();
  const mastery = progress.masteryLevels.find(m => m.topicId === topicId);
  return mastery?.level || null;
};

export const updateMasteryLevel = (topicId: number, level: "beginner" | "intermediate" | "advanced" | "mastered") => {
  const progress = getStoredProgress();
  
  const existingIndex = progress.masteryLevels.findIndex(m => m.topicId === topicId);
  
  if (existingIndex >= 0) {
    progress.masteryLevels[existingIndex].level = level;
  } else {
    progress.masteryLevels.push({ topicId, level });
  }
  
  if (level === "mastered" && !progress.topicsCompleted.includes(topicId)) {
    progress.topicsCompleted.push(topicId);
  }
  
  saveProgress(progress);
};
