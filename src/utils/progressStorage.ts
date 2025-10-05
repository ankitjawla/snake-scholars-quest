import {
  type BadgeProgress,
  type ChapterProgress,
  type LeaderboardProfile,
  type PowerUpInventory,
  type PracticeWorksheet,
  type StickerAlbumEntry,
  type UserProgress,
} from "@/types/userProgress";

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
  const lastSession = progress.streak.lastSessionDate;
  const currentDate = new Date(sessionDate.toDateString());
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  if (!lastSession) {
    progress.streak.dailyCount = 1;
    progress.streak.weeklyCount = 1;
  } else {
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
    }

    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const lastWeekStart = new Date(lastDate);
    lastWeekStart.setDate(lastDate.getDate() - lastDate.getDay());
    if (weekStart.getTime() === lastWeekStart.getTime()) {
      progress.streak.weeklyCount = Math.max(progress.streak.weeklyCount, progress.streak.dailyCount);
    } else {
      progress.streak.weeklyCount = progress.streak.dailyCount;
    }
  }

  progress.streak.lastSessionDate = currentDate;
  saveProgress(progress);
  return progress.streak;
};
