// Haptic feedback utilities for mobile devices

export const triggerHaptic = (type: "light" | "medium" | "heavy" | "success" | "error" = "light") => {
  if (!("vibrate" in navigator)) return;

  const patterns = {
    light: [10],
    medium: [20],
    heavy: [30],
    success: [10, 50, 10],
    error: [20, 100, 20, 100, 20],
  };

  navigator.vibrate(patterns[type]);
};

export const hapticFeedback = {
  tap: () => triggerHaptic("light"),
  success: () => triggerHaptic("success"),
  error: () => triggerHaptic("error"),
  collision: () => triggerHaptic("heavy"),
};
