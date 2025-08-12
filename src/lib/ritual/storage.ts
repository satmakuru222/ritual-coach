import { RitualProfile } from '@/types';

const STORAGE_KEYS = {
  PROFILE: 'ritual-coach-profile',
  PROGRESS: 'ritual-coach-progress',
  STREAK: 'ritual-coach-streak',
  LAST_COMPLETION: 'ritual-coach-last-completion',
} as const;

export interface RitualProgress {
  date: string;
  stepId: string;
  completed: boolean;
  timestamp: number;
}

export interface RitualStreak {
  current: number;
  longest: number;
  lastCompletionDate: string | null;
}

export interface DailyRitualState {
  date: string;
  completedSteps: string[];
  isCompleted: boolean;
  startTime?: number;
  endTime?: number;
  totalDuration?: number;
}

export const ritualStorage = {
  // Profile management
  saveProfile(profile: RitualProfile): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    }
  },

  getProfile(): RitualProfile | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  },

  // Daily progress tracking
  saveDailyProgress(progress: DailyRitualState): void {
    if (typeof window !== 'undefined') {
      const key = `${STORAGE_KEYS.PROGRESS}-${progress.date}`;
      localStorage.setItem(key, JSON.stringify(progress));
    }
  },

  getDailyProgress(date: string): DailyRitualState | null {
    if (typeof window !== 'undefined') {
      const key = `${STORAGE_KEYS.PROGRESS}-${date}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  },

  getTodaysProgress(): DailyRitualState | null {
    const today = new Date().toISOString().split('T')[0];
    return this.getDailyProgress(today);
  },

  // Step completion tracking
  markStepCompleted(stepId: string, date?: string): void {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const currentProgress = this.getDailyProgress(targetDate) || {
      date: targetDate,
      completedSteps: [],
      isCompleted: false,
    };

    if (!currentProgress.completedSteps.includes(stepId)) {
      currentProgress.completedSteps.push(stepId);
    }

    this.saveDailyProgress(currentProgress);
  },

  markStepIncomplete(stepId: string, date?: string): void {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const currentProgress = this.getDailyProgress(targetDate);
    
    if (currentProgress) {
      currentProgress.completedSteps = currentProgress.completedSteps.filter(
        id => id !== stepId
      );
      currentProgress.isCompleted = false;
      this.saveDailyProgress(currentProgress);
    }
  },

  // Ritual completion
  markRitualCompleted(totalSteps: number, duration?: number): void {
    const today = new Date().toISOString().split('T')[0];
    const currentProgress = this.getDailyProgress(today) || {
      date: today,
      completedSteps: [],
      isCompleted: false,
    };

    currentProgress.isCompleted = true;
    currentProgress.endTime = Date.now();
    if (duration) {
      currentProgress.totalDuration = duration;
    }

    this.saveDailyProgress(currentProgress);
    this.updateStreak();
  },

  startRitual(): void {
    const today = new Date().toISOString().split('T')[0];
    const currentProgress = this.getDailyProgress(today) || {
      date: today,
      completedSteps: [],
      isCompleted: false,
    };

    currentProgress.startTime = Date.now();
    this.saveDailyProgress(currentProgress);
  },

  // Streak management
  updateStreak(): void {
    if (typeof window === 'undefined') return;

    const today = new Date().toISOString().split('T')[0];
    const currentStreak = this.getStreak();
    const lastCompletion = currentStreak.lastCompletionDate;

    if (lastCompletion === today) {
      // Already completed today, no change needed
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newCurrent = 1; // At least 1 for today

    if (lastCompletion === yesterdayStr) {
      // Continuing streak
      newCurrent = currentStreak.current + 1;
    } else if (lastCompletion && lastCompletion < yesterdayStr) {
      // Streak broken, reset to 1
      newCurrent = 1;
    }

    const newStreak: RitualStreak = {
      current: newCurrent,
      longest: Math.max(newCurrent, currentStreak.longest),
      lastCompletionDate: today,
    };

    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(newStreak));
  },

  getStreak(): RitualStreak {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (stored) {
        return JSON.parse(stored);
      }
    }
    
    return {
      current: 0,
      longest: 0,
      lastCompletionDate: null,
    };
  },

  // Progress analytics
  getWeeklyProgress(): DailyRitualState[] {
    const progress: DailyRitualState[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayProgress = this.getDailyProgress(dateStr);
      if (dayProgress) {
        progress.push(dayProgress);
      } else {
        progress.push({
          date: dateStr,
          completedSteps: [],
          isCompleted: false,
        });
      }
    }
    
    return progress;
  },

  getMonthlyStats(): { completedDays: number; totalDays: number; completionRate: number } {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const totalDays = today.getDate();
    
    let completedDays = 0;
    
    for (let i = 0; i < totalDays; i++) {
      const checkDate = new Date(firstDayOfMonth);
      checkDate.setDate(checkDate.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayProgress = this.getDailyProgress(dateStr);
      if (dayProgress?.isCompleted) {
        completedDays++;
      }
    }
    
    return {
      completedDays,
      totalDays,
      completionRate: totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
    };
  },

  // Utility functions
  clearAllProgress(): void {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(key => {
        // Clear all progress entries
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const storageKey = localStorage.key(i);
          if (storageKey?.startsWith(key)) {
            localStorage.removeItem(storageKey);
          }
        }
      });
    }
  },

  exportProgress(): string {
    if (typeof window === 'undefined') return '{}';
    
    const data: Record<string, string> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('ritual-coach-')) {
        const value = localStorage.getItem(key);
        if (value) {
          data[key] = value;
        }
      }
    }
    
    return JSON.stringify(data, null, 2);
  },
};