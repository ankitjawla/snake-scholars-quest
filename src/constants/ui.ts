// UI constants
export const TOUCH_TARGET_SIZE = 44; // Minimum touch target size in pixels

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

export const Z_INDEX = {
  MODAL: 1000,
  OVERLAY: 900,
  DROPDOWN: 800,
  TOOLTIP: 700,
  HEADER: 600,
} as const;

export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  SAVE: 500,
  RESIZE: 150,
} as const;
