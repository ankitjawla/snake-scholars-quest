import { getStoredProgress, saveProgress } from "./progressStorage";
import { educationalTopics } from "@/data/educationalContent";

export const getRecommendedTopics = (limit: number = 5): number[] => {
  const progress = getStoredProgress();
  const completed = new Set(progress.topicsCompleted);
  const inProgress = new Set(progress.topicsInProgress);

  // Get subjects the user has done well in
  const subjectPerformance: Record<string, { total: number; sum: number }> = {};
  
  progress.quizAttempts.forEach(quiz => {
    const topic = educationalTopics.find(t => t.id === quiz.topicId);
    if (topic) {
      if (!subjectPerformance[topic.subject]) {
        subjectPerformance[topic.subject] = { total: 0, sum: 0 };
      }
      subjectPerformance[topic.subject].total++;
      subjectPerformance[topic.subject].sum += quiz.score;
    }
  });

  // Find best performing subject
  let bestSubject = "";
  let bestScore = 0;
  Object.entries(subjectPerformance).forEach(([subject, perf]) => {
    const avg = perf.sum / perf.total;
    if (avg > bestScore) {
      bestScore = avg;
      bestSubject = subject;
    }
  });

  // Recommend topics: prioritize in-progress, then from best subject, then new topics
  const recommendations: number[] = [];

  // Add in-progress topics first
  const inProgressTopics = educationalTopics
    .filter(t => inProgress.has(t.id) && !completed.has(t.id))
    .slice(0, 2);
  recommendations.push(...inProgressTopics.map(t => t.id));

  // Add topics from best subject
  if (bestSubject && recommendations.length < limit) {
    const subjectTopics = educationalTopics
      .filter(t => t.subject === bestSubject && !completed.has(t.id) && !inProgress.has(t.id))
      .slice(0, limit - recommendations.length);
    recommendations.push(...subjectTopics.map(t => t.id));
  }

  // Fill with new topics
  if (recommendations.length < limit) {
    const newTopics = educationalTopics
      .filter(t => !completed.has(t.id) && !inProgress.has(t.id) && !recommendations.includes(t.id))
      .slice(0, limit - recommendations.length);
    recommendations.push(...newTopics.map(t => t.id));
  }

  return recommendations;
};

export const scheduleReview = (topicId: number, performanceScore: number) => {
  const progress = getStoredProgress();
  
  // Spaced repetition intervals based on performance
  let daysUntilReview = 1;
  if (performanceScore >= 90) daysUntilReview = 7;
  else if (performanceScore >= 70) daysUntilReview = 3;
  else if (performanceScore >= 50) daysUntilReview = 1;
  
  const reviewDate = new Date();
  reviewDate.setDate(reviewDate.getDate() + daysUntilReview);

  const existingIndex = progress.nextReviewDate.findIndex(r => r.topicId === topicId);
  
  if (existingIndex >= 0) {
    progress.nextReviewDate[existingIndex].date = reviewDate;
  } else {
    progress.nextReviewDate.push({ topicId, date: reviewDate });
  }

  saveProgress(progress);
};

export const analyzeCommonMistakes = (topicId: number): string[] => {
  const progress = getStoredProgress();
  
  const topicAttempts = progress.quizAttempts.filter(q => q.topicId === topicId);
  
  if (topicAttempts.length === 0) return [];

  // Aggregate all mistakes for this topic
  const allMistakes = topicAttempts.flatMap(q => q.mistakes || []);
  
  // Count frequency
  const mistakeCounts: Record<string, number> = {};
  allMistakes.forEach(mistake => {
    mistakeCounts[mistake] = (mistakeCounts[mistake] || 0) + 1;
  });

  // Return most common mistakes
  return Object.entries(mistakeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([mistake]) => mistake);
};

export const getPersonalizedEncouragement = (): string => {
  const progress = getStoredProgress();
  
  const completedCount = progress.topicsCompleted.length;
  const masteredCount = progress.masteryLevels.filter(m => m.level === "mastered").length;
  
  if (masteredCount >= 20) {
    return "You're becoming an expert! 🌟 Your dedication is truly impressive!";
  } else if (masteredCount >= 10) {
    return "Great progress! 🎯 You're mastering topics consistently!";
  } else if (completedCount >= 5) {
    return "Keep it up! 💪 You're building strong foundations!";
  } else {
    return "Welcome to your learning journey! 🚀 Every expert was once a beginner!";
  }
};

export const calculateStudyStreak = (): number => {
  const progress = getStoredProgress();
  
  if (progress.lessonsViewed.length === 0) return 0;

  // Sort lessons by timestamp
  const sortedLessons = [...progress.lessonsViewed].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const lesson of sortedLessons) {
    const lessonDate = new Date(lesson.timestamp);
    lessonDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - lessonDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
};
