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
