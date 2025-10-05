export interface PowerUpInventory {
  id: string;
  quantity: number;
  lastEarned?: Date;
}

export interface BadgeProgress {
  id: string;
  tier: 1 | 2 | 3;
  earnedAt: Date;
}

export interface StickerAlbumEntry {
  topicId: number;
  tiersUnlocked: number[];
}

export interface StreakState {
  dailyCount: number;
  weeklyCount: number;
  lastSessionDate: Date | null;
  catchUpTokens: number;
}

export interface ChapterProgress {
  chapterId: string;
  unlocked: boolean;
  completedTopicIds: number[];
  badgeTier: 0 | 1 | 2 | 3;
}

export interface PracticeWorksheet {
  id: string;
  topicId: number;
  createdAt: Date;
  questions: string[];
}

export interface CreativeUnlocks {
  unlockedSkins: string[];
  activeSkin?: string;
}

export interface LeaderboardProfile {
  nickname: string;
  classCode?: string;
  percentileBand?: string;
}

export interface UserProgress {
  topicsCompleted: number[];
  topicsInProgress: number[];
  lessonsViewed: {
    topicId: number;
    timestamp: Date;
    timeSpent: number;
    completionRate: number;
  }[];
  quizAttempts: {
    topicId: number;
    score: number;
    timeToAnswer: number;
    mistakes: string[];
  }[];
  masteryLevels: {
    topicId: number;
    level: "beginner" | "intermediate" | "advanced" | "mastered";
  }[];
  nextReviewDate: {
    topicId: number;
    date: Date;
  }[];
  stars: number;
  powerUps: PowerUpInventory[];
  badges: BadgeProgress[];
  stickerAlbum: StickerAlbumEntry[];
  streak: StreakState;
  chapterProgress: ChapterProgress[];
  practiceHistory: PracticeWorksheet[];
  totalLearningMinutes: number;
  lastSessionDate: Date | null;
  leaderboardProfile?: LeaderboardProfile;
  creative: CreativeUnlocks;
}

export interface LearningSession {
  sessionId: string;
  topicId: number;
  startTime: Date;
  lessonTime: number;
  gameTime: number;
  practiceTime: number;
  questionsAttempted: number;
  questionsCorrect: number;
  hintsUsed: number;
  completed: boolean;
}

export type LearningMode = "study" | "practice" | "challenge";
