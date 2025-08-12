import { ritualStorage } from '../storage';
import { RitualProfile } from '@/types';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('ritualStorage', () => {
  const mockProfile: RitualProfile = {
    user_id: 'test-user',
    tradition: 'andhra_smarta',
    region: 'south',
    language_pref: 'en',
    daily_time: '06:30',
    duration_minutes: 30,
    dietary_rules: 'sattvic',
    kid_mode: false,
  };

  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('Profile Management', () => {
    it('saves and retrieves profile correctly', () => {
      ritualStorage.saveProfile(mockProfile);
      const retrieved = ritualStorage.getProfile();
      
      expect(retrieved).toEqual(mockProfile);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ritual-coach-profile',
        JSON.stringify(mockProfile)
      );
    });

    it('returns null when no profile exists', () => {
      const profile = ritualStorage.getProfile();
      expect(profile).toBeNull();
    });
  });

  describe('Daily Progress Tracking', () => {
    it('saves and retrieves daily progress', () => {
      const progress = {
        date: '2024-01-01',
        completedSteps: ['step1', 'step2'],
        isCompleted: false,
      };

      ritualStorage.saveDailyProgress(progress);
      const retrieved = ritualStorage.getDailyProgress('2024-01-01');
      
      expect(retrieved).toEqual(progress);
    });

    it('returns today\'s progress correctly', () => {
      const today = new Date().toISOString().split('T')[0];
      const progress = {
        date: today,
        completedSteps: ['step1'],
        isCompleted: false,
      };

      ritualStorage.saveDailyProgress(progress);
      const todaysProgress = ritualStorage.getTodaysProgress();
      
      expect(todaysProgress).toEqual(progress);
    });

    it('returns null when no progress exists for date', () => {
      const progress = ritualStorage.getDailyProgress('2024-01-01');
      expect(progress).toBeNull();
    });
  });

  describe('Step Completion', () => {
    it('marks step as completed', () => {
      ritualStorage.markStepCompleted('step1');
      
      const today = new Date().toISOString().split('T')[0];
      const progress = ritualStorage.getDailyProgress(today);
      
      expect(progress?.completedSteps).toContain('step1');
    });

    it('does not duplicate completed steps', () => {
      ritualStorage.markStepCompleted('step1');
      ritualStorage.markStepCompleted('step1');
      
      const today = new Date().toISOString().split('T')[0];
      const progress = ritualStorage.getDailyProgress(today);
      
      expect(progress?.completedSteps.filter(id => id === 'step1')).toHaveLength(1);
    });

    it('marks step as incomplete', () => {
      ritualStorage.markStepCompleted('step1');
      ritualStorage.markStepIncomplete('step1');
      
      const today = new Date().toISOString().split('T')[0];
      const progress = ritualStorage.getDailyProgress(today);
      
      expect(progress?.completedSteps).not.toContain('step1');
    });
  });

  describe('Ritual Completion', () => {
    it('marks ritual as completed', () => {
      ritualStorage.markRitualCompleted(5, 25);
      
      const today = new Date().toISOString().split('T')[0];
      const progress = ritualStorage.getDailyProgress(today);
      
      expect(progress?.isCompleted).toBe(true);
      expect(progress?.totalDuration).toBe(25);
      expect(progress?.endTime).toBeDefined();
    });

    it('starts ritual tracking', () => {
      ritualStorage.startRitual();
      
      const today = new Date().toISOString().split('T')[0];
      const progress = ritualStorage.getDailyProgress(today);
      
      expect(progress?.startTime).toBeDefined();
    });
  });

  describe('Streak Management', () => {
    it('returns initial streak when none exists', () => {
      const streak = ritualStorage.getStreak();
      
      expect(streak).toEqual({
        current: 0,
        longest: 0,
        lastCompletionDate: null,
      });
    });

    it('updates streak when ritual is completed', () => {
      ritualStorage.markRitualCompleted(5);
      
      const streak = ritualStorage.getStreak();
      const today = new Date().toISOString().split('T')[0];
      
      expect(streak.current).toBe(1);
      expect(streak.longest).toBe(1);
      expect(streak.lastCompletionDate).toBe(today);
    });
  });

  describe('Analytics', () => {
    it('calculates weekly progress correctly', () => {
      // Mark today and yesterday as completed
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      ritualStorage.saveDailyProgress({
        date: today.toISOString().split('T')[0],
        completedSteps: [],
        isCompleted: true,
      });
      
      ritualStorage.saveDailyProgress({
        date: yesterday.toISOString().split('T')[0],
        completedSteps: [],
        isCompleted: true,
      });
      
      const weeklyProgress = ritualStorage.getWeeklyProgress();
      const completedDays = weeklyProgress.filter(day => day.isCompleted).length;
      
      expect(completedDays).toBeGreaterThanOrEqual(2);
      expect(weeklyProgress).toHaveLength(7);
    });

    it('calculates monthly stats correctly', () => {
      // Mark today as completed
      const today = new Date();
      ritualStorage.saveDailyProgress({
        date: today.toISOString().split('T')[0],
        completedSteps: [],
        isCompleted: true,
      });
      
      const stats = ritualStorage.getMonthlyStats();
      
      expect(stats.completedDays).toBeGreaterThanOrEqual(1);
      expect(stats.totalDays).toBe(today.getDate());
      expect(stats.completionRate).toBeGreaterThan(0);
    });
  });

  describe('Utility Functions', () => {
    it('clears all progress', () => {
      ritualStorage.saveProfile(mockProfile);
      ritualStorage.markStepCompleted('step1');
      
      ritualStorage.clearAllProgress();
      
      expect(ritualStorage.getProfile()).toBeNull();
      expect(ritualStorage.getTodaysProgress()).toBeNull();
    });

    it('exports progress data', () => {
      ritualStorage.saveProfile(mockProfile);
      ritualStorage.markStepCompleted('step1');
      
      const exported = ritualStorage.exportProgress();
      const data = JSON.parse(exported);
      
      expect(Object.keys(data).length).toBeGreaterThan(0);
      expect(Object.keys(data).some(key => key.startsWith('ritual-coach-'))).toBe(true);
    });
  });
});

export {};