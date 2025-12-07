import type { UserProgress } from "@/types/userProgress";

class LocalStorageCache {
  private cache: Map<string, unknown> = new Map();
  private readonly MAX_CACHE_AGE = 5000; // 5 seconds
  private cacheTimestamps: Map<string, number> = new Map();

  get<T>(key: string): T | null {
    const timestamp = this.cacheTimestamps.get(key);
    if (timestamp && Date.now() - timestamp < this.MAX_CACHE_AGE) {
      return this.cache.get(key) as T;
    }
    return null;
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, value);
    this.cacheTimestamps.set(key, Date.now());
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    this.cacheTimestamps.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }
}

export const storageCache = new LocalStorageCache();

// Debounced save function
let saveTimeout: NodeJS.Timeout | null = null;
const SAVE_DEBOUNCE_MS = 500;

export const debouncedSave = (key: string, data: unknown, immediate = false) => {
  if (immediate) {
    if (saveTimeout) clearTimeout(saveTimeout);
    localStorage.setItem(key, JSON.stringify(data));
    storageCache.set(key, data);
    return;
  }

  if (saveTimeout) clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(() => {
    localStorage.setItem(key, JSON.stringify(data));
    storageCache.set(key, data);
  }, SAVE_DEBOUNCE_MS);
};
