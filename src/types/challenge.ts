export interface ChallengeResult {
  correct: number;
  total: number;
  accuracy: number;
  bestStreak: number;
  timeSpent: number;
  fastestAnswer: number | null;
  stars: number;
}

export interface ChallengeAttempt {
  id: string;
  correct: number;
  total: number;
  accuracy: number;
  bestStreak: number;
  starsEarned: number;
  durationSeconds: number;
  fastestAnswer: number | null;
  completedAt: Date;
}
