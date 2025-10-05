import {
  type BadgeProgress,
  type ChapterProgress,
  type LeaderboardProfile,
  type PowerUpInventory,
  type PracticeWorksheet,
  type StickerAlbumEntry,
  type UserProgress,
} from "@/types/userProgress";
import { questChapters } from "@/data/questMap";

const STORAGE_KEY = "snakerunner_progress";

const MAX_CATCH_UP_TOKENS = 3;

const createDefaultProgress = (): UserProgress => ({
  topicsCompleted: [],
  topicsInProgress: [],
  lessonsViewed: [],
  quizAttempts: [],
  masteryLevels: [],
  nextReviewDate: [],
  stars: 0,
  powerUps: [],
  badges: [],
  stickerAlbum: [],
  streak: {
    dailyCount: 0,
    weeklyCount: 0,
    lastSessionDate: null,
    catchUpTokens: MAX_CATCH_UP_TOKENS,
  },
  chapterProgress: questChapters.length
    ? [
        {
          chapterId: questChapters[0].id,
          unlocked: true,
          completedTopicIds: [],
          badgeTier: 0,
        },
      ]
    : [],
  practiceHistory: [],
  totalLearningMinutes: 0,
  lastSessionDate: null,
  creative: {
    unlockedSkins: ["classic"],
    activeSkin: "classic",
  },
});

const getStartOfWeek = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day;
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const ensureChapterProgress = (progress: UserProgress) => {
  if (!progress.chapterProgress) {
    progress.chapterProgress = [];
  }

  const firstChapter = questChapters[0];
  if (firstChapter && !progress.chapterProgress.some(entry => entry.chapterId === firstChapter.id)) {
    progress.chapterProgress.push({
      chapterId: firstChapter.id,
      unlocked: true,
      completedTopicIds: [],
      badgeTier: 0,
    });
  }

  progress.chapterProgress = progress.chapterProgress.map(entry => ({
    ...entry,
    completedTopicIds: Array.from(new Set(entry.completedTopicIds ?? [])),
  }));
};

const getChapterTopicCount = (chapterId: string) =>
  questChapters.find(chapter => chapter.id === chapterId)?.topicIds.length ?? 0;

export const getStoredProgress = (): UserProgress => {
  if (typeof window === "undefined") {
    return createDefaultProgress();
  }

  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return createDefaultProgress();
  }

  if (!stored) {
    return createDefaultProgress();
  }

  try {
    const parsed = JSON.parse(stored);

    parsed.lessonsViewed = (parsed.lessonsViewed || []).map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
    parsed.nextReviewDate = (parsed.nextReviewDate || []).map((item: any) => ({
      ...item,
      date: new Date(item.date),
    }));

    parsed.badges = (parsed.badges || []).map((badge: BadgeProgress) => ({
      ...badge,
      earnedAt: new Date(badge.earnedAt),
    }));

    parsed.practiceHistory = (parsed.practiceHistory || []).map(
      (worksheet: PracticeWorksheet) => ({
        ...worksheet,
        createdAt: new Date(worksheet.createdAt),
      }),
    );

    parsed.powerUps = (parsed.powerUps || []).map((powerUp: PowerUpInventory) => ({
      ...powerUp,
      lastEarned: powerUp.lastEarned ? new Date(powerUp.lastEarned) : undefined,
    }));

    parsed.streak = parsed.streak || {
      dailyCount: 0,
      weeklyCount: 0,
      lastSessionDate: null,
      catchUpTokens: MAX_CATCH_UP_TOKENS,
    };
    if (parsed.streak.lastSessionDate) {
      parsed.streak.lastSessionDate = new Date(parsed.streak.lastSessionDate);
    }
    parsed.streak.catchUpTokens = Math.min(
      MAX_CATCH_UP_TOKENS,
      parsed.streak.catchUpTokens ?? MAX_CATCH_UP_TOKENS,
    );

    parsed.chapterProgress = (parsed.chapterProgress || []).map(
      (chapter: ChapterProgress) => ({
        ...chapter,
        completedTopicIds: Array.from(new Set(chapter.completedTopicIds || [])),
      }),
    );

    parsed.stickerAlbum = (parsed.stickerAlbum || []).map(
      (sticker: StickerAlbumEntry) => ({ ...sticker }),
    );

    parsed.totalLearningMinutes = parsed.totalLearningMinutes || 0;
    parsed.lastSessionDate = parsed.lastSessionDate
      ? new Date(parsed.lastSessionDate)
      : null;

    parsed.stars = parsed.stars ?? 0;
    parsed.creative = parsed.creative || {
      unlockedSkins: ["classic"],
      activeSkin: "classic",
    return {
      topicsCompleted: [],
      topicsInProgress: [],
      lessonsViewed: [],
      quizAttempts: [],
      masteryLevels: [],
      nextReviewDate: [],
      stars: 0,
      powerUps: [],
      badges: [],
      stickerAlbum: [],
      streak: {
        dailyCount: 0,
        weeklyCount: 0,
        lastSessionDate: null,
        catchUpTokens: 2,
      },
      chapterProgress: [],
      practiceHistory: [],
      totalLearningMinutes: 0,
      lastSessionDate: null,
      creative: {
        unlockedSkins: ["classic"],
        activeSkin: "classic",
      },
    };

    ensureChapterProgress(parsed);

    return parsed as UserProgress;
  } catch (error) {
    console.warn("Failed to parse stored progress", error);
    return createDefaultProgress();
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

  parsed.badges = (parsed.badges || []).map((badge: BadgeProgress) => ({
    ...badge,
    earnedAt: new Date(badge.earnedAt),
  }));

  parsed.practiceHistory = (parsed.practiceHistory || []).map(
    (worksheet: PracticeWorksheet) => ({
      ...worksheet,
      createdAt: new Date(worksheet.createdAt),
    }),
  );

  parsed.powerUps = (parsed.powerUps || []).map((powerUp: PowerUpInventory) => ({
    ...powerUp,
    lastEarned: powerUp.lastEarned ? new Date(powerUp.lastEarned) : undefined,
  }));

  parsed.streak = parsed.streak || {
    dailyCount: 0,
    weeklyCount: 0,
    lastSessionDate: null,
    catchUpTokens: 2,
  };
  if (parsed.streak.lastSessionDate) {
    parsed.streak.lastSessionDate = new Date(parsed.streak.lastSessionDate);
  }

  parsed.chapterProgress = (parsed.chapterProgress || []).map(
    (chapter: ChapterProgress) => ({ ...chapter }),
  );

  parsed.stickerAlbum = (parsed.stickerAlbum || []).map(
    (sticker: StickerAlbumEntry) => ({ ...sticker }),
  );

  parsed.totalLearningMinutes = parsed.totalLearningMinutes || 0;
  parsed.lastSessionDate = parsed.lastSessionDate
    ? new Date(parsed.lastSessionDate)
    : null;

  parsed.stars = parsed.stars ?? 0;
  parsed.creative = parsed.creative || {
    unlockedSkins: ["classic"],
    activeSkin: "classic",
  };

  return parsed;

};

export const saveProgress = (progress: UserProgress) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore write errors, e.g. in private browsing mode
  }
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

export const awardStars = (amount: number) => {
  const progress = getStoredProgress();
  progress.stars = Math.max(0, (progress.stars || 0) + amount);
  saveProgress(progress);
  return progress.stars;
};

export const spendStars = (amount: number) => {
  const progress = getStoredProgress();
  if ((progress.stars || 0) < amount) {
    return false;
  }
  progress.stars -= amount;
  saveProgress(progress);
  return true;
};

export const grantPowerUp = (id: string, quantity = 1) => {
  const progress = getStoredProgress();
  const inventory = progress.powerUps || [];
  const existing = inventory.find(power => power.id === id);
  if (existing) {
    existing.quantity += quantity;
    existing.lastEarned = new Date();
  } else {
    inventory.push({ id, quantity, lastEarned: new Date() });
  }
  progress.powerUps = inventory;
  saveProgress(progress);
  return progress.powerUps;
};

export const updateStickerAlbum = (topicId: number, tier: number) => {
  const progress = getStoredProgress();
  const entry = (progress.stickerAlbum || []).find(item => item.topicId === topicId);
  if (entry) {
    if (!entry.tiersUnlocked.includes(tier)) {
      entry.tiersUnlocked.push(tier);
    }
  } else {
    progress.stickerAlbum.push({ topicId, tiersUnlocked: [tier] });
  }
  saveProgress(progress);
  return progress.stickerAlbum;
};

export const unlockChapter = (chapterId: string) => {
  const progress = getStoredProgress();
  ensureChapterProgress(progress);
  let entry = progress.chapterProgress.find(chapter => chapter.chapterId === chapterId);
  if (!entry) {
    entry = { chapterId, unlocked: true, completedTopicIds: [], badgeTier: 0 };
    progress.chapterProgress.push(entry);
  }
  entry.unlocked = true;
  const chapters = progress.chapterProgress || [];
  const entry = chapters.find(chapter => chapter.chapterId === chapterId);
  if (entry) {
    entry.unlocked = true;
  } else {
    chapters.push({ chapterId, unlocked: true, completedTopicIds: [], badgeTier: 0 });
  }
  progress.chapterProgress = chapters;
  saveProgress(progress);
  return progress.chapterProgress;
};

export const recordChapterCompletion = (chapterId: string, topicId: number) => {
  const progress = getStoredProgress();
  ensureChapterProgress(progress);
  let entry = progress.chapterProgress.find(chapter => chapter.chapterId === chapterId);
  if (!entry) {
    entry = { chapterId, unlocked: true, completedTopicIds: [], badgeTier: 0 };
    progress.chapterProgress.push(entry);
  }

  if (!entry.completedTopicIds.includes(topicId)) {
    entry.completedTopicIds.push(topicId);
  }

  const totalTopics = getChapterTopicCount(chapterId);
  const completionFraction = totalTopics > 0 ? entry.completedTopicIds.length / totalTopics : 0;

  let newTier: 0 | 1 | 2 | 3 = 0;
  if (completionFraction >= 1) {
    newTier = 3;
  } else if (completionFraction >= 2 / 3) {
    newTier = 2;
  } else if (completionFraction >= 1 / 3) {
    newTier = 1;
  }

  entry.badgeTier = Math.max(entry.badgeTier, newTier);
  const entry = progress.chapterProgress.find(chapter => chapter.chapterId === chapterId);
  if (entry) {
    if (!entry.completedTopicIds.includes(topicId)) {
      entry.completedTopicIds.push(topicId);
    }
    const completionRatio = entry.completedTopicIds.length;
    if (completionRatio >= 9) {
      entry.badgeTier = 3;
    } else if (completionRatio >= 6) {
      entry.badgeTier = Math.max(entry.badgeTier, 2);
    } else if (completionRatio >= 3) {
      entry.badgeTier = Math.max(entry.badgeTier, 1);
    }
  } else {
    progress.chapterProgress.push({
      chapterId,
      unlocked: true,
      completedTopicIds: [topicId],
      badgeTier: 1,
    });
  }
  saveProgress(progress);
  return progress.chapterProgress;
};

export const recordBadge = (id: string, tier: 1 | 2 | 3) => {
  const progress = getStoredProgress();
  const existing = progress.badges.find(badge => badge.id === id && badge.tier === tier);
  if (!existing) {
    progress.badges.push({ id, tier, earnedAt: new Date() });
    saveProgress(progress);
  }
  return progress.badges;
};

export const logPracticeWorksheet = (worksheet: PracticeWorksheet) => {
  const progress = getStoredProgress();
  progress.practiceHistory.push({ ...worksheet, createdAt: new Date(worksheet.createdAt) });
  saveProgress(progress);
  return progress.practiceHistory;
};

export const updateLeaderboardProfile = (profile: LeaderboardProfile) => {
  const progress = getStoredProgress();
  progress.leaderboardProfile = profile;
  saveProgress(progress);
  return progress.leaderboardProfile;
};

export const unlockCreativeSkin = (skinId: string) => {
  const progress = getStoredProgress();
  if (!progress.creative.unlockedSkins.includes(skinId)) {
    progress.creative.unlockedSkins.push(skinId);
  }
  progress.creative.activeSkin = skinId;
  saveProgress(progress);
  return progress.creative;
};

export const setActiveSkin = (skinId: string) => {
  const progress = getStoredProgress();
  progress.creative.activeSkin = skinId;
  saveProgress(progress);
  return progress.creative;
};

export const updateLearningMinutes = (minutes: number) => {
  const progress = getStoredProgress();
  progress.totalLearningMinutes = (progress.totalLearningMinutes || 0) + minutes;
  progress.lastSessionDate = new Date();
  saveProgress(progress);
  return progress.totalLearningMinutes;
};

export const updateStreak = (sessionDate = new Date()) => {
  const progress = getStoredProgress();
  ensureChapterProgress(progress);
  const lastSession = progress.streak.lastSessionDate;
  const currentDate = new Date(sessionDate.toDateString());
  const lastSession = progress.streak.lastSessionDate;
  const currentDate = new Date(sessionDate.toDateString());
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  if (!lastSession) {
    progress.streak.dailyCount = 1;
    progress.streak.weeklyCount = 1;
  } else {
    const lastDate = new Date(new Date(lastSession).toDateString());
    const dayDiff = Math.floor(
      (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (dayDiff === 1) {
      progress.streak.dailyCount += 1;
    } else if (dayDiff > 1) {
      const missedDays = dayDiff - 1;
      if (progress.streak.catchUpTokens >= missedDays) {
        progress.streak.catchUpTokens -= missedDays;
    const last = new Date(lastSession.toString());
    const lastDate = new Date(last.toDateString());
    if (lastDate.getTime() === yesterday.getTime()) {
      progress.streak.dailyCount += 1;
    } else if (lastDate.getTime() !== currentDate.getTime()) {
      if (progress.streak.catchUpTokens > 0) {
        progress.streak.catchUpTokens -= 1;
        progress.streak.dailyCount += 1;
      } else {
        progress.streak.dailyCount = 1;
      }
    } else if (dayDiff === 0) {
      // Same-day session shouldn't change streak counts
      progress.streak.lastSessionDate = currentDate;
      progress.lastSessionDate = currentDate;
      saveProgress(progress);
      return progress.streak;
    }

    const weekStart = getStartOfWeek(currentDate);
    const lastWeekStart = getStartOfWeek(lastDate);
    }

    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const lastWeekStart = new Date(lastDate);
    lastWeekStart.setDate(lastDate.getDate() - lastDate.getDay());
    if (weekStart.getTime() === lastWeekStart.getTime()) {
      progress.streak.weeklyCount = Math.max(progress.streak.weeklyCount, progress.streak.dailyCount);
    } else {
      progress.streak.weeklyCount = progress.streak.dailyCount;
      progress.streak.catchUpTokens = Math.min(
        MAX_CATCH_UP_TOKENS,
        progress.streak.catchUpTokens + 1,
      );
    }
  }

  progress.streak.catchUpTokens = Math.min(MAX_CATCH_UP_TOKENS, progress.streak.catchUpTokens);
  progress.streak.lastSessionDate = currentDate;
  progress.lastSessionDate = currentDate;
    }
  }

  progress.streak.lastSessionDate = currentDate;
  saveProgress(progress);
  return progress.streak;
};
