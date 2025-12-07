import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { UserProgress } from "@/types/userProgress";
import { getStoredProgress, saveProgress } from "@/utils/progressStorage";
import { storageCache, debouncedSave } from "@/utils/localStorageCache";
import { STORAGE_KEY } from "@/constants/game";

interface ProgressContextType {
  progress: UserProgress;
  updateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  refreshProgress: () => void;
  saveImmediately: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => getStoredProgress());

  const updateProgress = useCallback((updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const updated = updater(prev);
      debouncedSave(STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const refreshProgress = useCallback(() => {
    const fresh = getStoredProgress();
    setProgress(fresh);
  }, []);

  const saveImmediately = useCallback(() => {
    saveProgress(progress);
    storageCache.set(STORAGE_KEY, progress);
  }, [progress]);

  useEffect(() => {
    return () => {
      saveProgress(progress);
    };
  }, [progress]);

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, refreshProgress, saveImmediately }}>
      {children}
    </ProgressContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
};
