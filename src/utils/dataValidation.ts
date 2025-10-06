import { z } from "zod";

const PowerUpInventorySchema = z.object({
  id: z.string(),
  quantity: z.number(),
  lastEarned: z.date().optional(),
});

const BadgeProgressSchema = z.object({
  id: z.string(),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  earnedAt: z.date(),
});

const StickerAlbumEntrySchema = z.object({
  topicId: z.number(),
  tiersUnlocked: z.array(z.number()),
});

const StreakStateSchema = z.object({
  dailyCount: z.number(),
  weeklyCount: z.number(),
  lastSessionDate: z.date().nullable(),
  catchUpTokens: z.number(),
});

const ChapterProgressSchema = z.object({
  chapterId: z.string(),
  unlocked: z.boolean(),
  completedTopicIds: z.array(z.number()),
  badgeTier: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

const ChallengeAttemptSchema = z.object({
  id: z.string(),
  correct: z.number(),
  total: z.number(),
  accuracy: z.number(),
  bestStreak: z.number(),
  starsEarned: z.number(),
  durationSeconds: z.number(),
  fastestAnswer: z.number().nullable(),
  completedAt: z.date(),
});

export const UserProgressSchema = z.object({
  topicsCompleted: z.array(z.number()),
  topicsInProgress: z.array(z.number()),
  lessonsViewed: z.array(z.object({
    topicId: z.number(),
    timestamp: z.date(),
    timeSpent: z.number(),
    completionRate: z.number(),
  })),
  quizAttempts: z.array(z.object({
    topicId: z.number(),
    score: z.number(),
    timeToAnswer: z.number(),
    mistakes: z.array(z.string()),
  })),
  masteryLevels: z.array(z.object({
    topicId: z.number(),
    level: z.enum(["beginner", "intermediate", "advanced", "mastered"]),
  })),
  nextReviewDate: z.array(z.object({
    topicId: z.number(),
    date: z.date(),
  })),
  stars: z.number(),
  powerUps: z.array(PowerUpInventorySchema),
  badges: z.array(BadgeProgressSchema),
  stickerAlbum: z.array(StickerAlbumEntrySchema),
  streak: StreakStateSchema,
  chapterProgress: z.array(ChapterProgressSchema),
  practiceHistory: z.array(z.any()),
  totalLearningMinutes: z.number(),
  lastSessionDate: z.date().nullable(),
  leaderboardProfile: z.any().optional(),
  creative: z.object({
    unlockedSkins: z.array(z.string()),
    activeSkin: z.string().optional(),
  }),
  challengeHistory: z.array(ChallengeAttemptSchema),
});

export const validateProgressData = (data: unknown) => {
  try {
    return UserProgressSchema.parse(data);
  } catch (error) {
    console.error("Progress data validation failed:", error);
    return null;
  }
};

export const safeParseJSON = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};
