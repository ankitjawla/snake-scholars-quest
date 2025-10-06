// Game constants
export const GAME_CONFIG = {
  INITIAL_SPEED: 5,
  MAX_SPEED: 15,
  SPEED_INCREMENT: 0.5,
  OBSTACLE_FREQUENCY: 120,
  COLLECTIBLE_FREQUENCY: 180,
  LANE_WIDTH: 80,
  COLLISION_THRESHOLD: 30,
} as const;

export const REWARDS = {
  CORRECT_ANSWER: 10,
  STREAK_BONUS: 5,
  LESSON_COMPLETE: 50,
  ASSESSMENT_PASS: 100,
  DAILY_STREAK: 25,
  WEEKLY_STREAK: 100,
} as const;

export const MASTERY_THRESHOLDS = {
  BEGINNER: 0,
  INTERMEDIATE: 50,
  ADVANCED: 75,
  MASTERED: 90,
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export const MAX_CATCH_UP_TOKENS = 3;
export const MAX_SESSION_LOGS = 100;
export const MAX_CHALLENGE_HISTORY = 25;
export const STORAGE_KEY = 'snakerunner_progress';
