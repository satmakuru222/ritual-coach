export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  elapsedTime: number; // in milliseconds
  startTime: number | null;
  pausedAt: number | null;
  duration: number; // target duration in milliseconds
}

export interface TimerCallbacks {
  onTick?: (state: TimerState) => void;
  onComplete?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
}

export class RitualTimer {
  private state: TimerState;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: TimerCallbacks;

  constructor(durationMinutes: number, callbacks: TimerCallbacks = {}) {
    this.state = {
      isRunning: false,
      isPaused: false,
      elapsedTime: 0,
      startTime: null,
      pausedAt: null,
      duration: durationMinutes * 60 * 1000, // convert to milliseconds
    };
    this.callbacks = callbacks;
  }

  start(): void {
    if (this.state.isRunning) return;

    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.startTime = Date.now() - this.state.elapsedTime;
    
    this.callbacks.onStart?.();
    this.startInterval();
  }

  pause(): void {
    if (!this.state.isRunning || this.state.isPaused) return;

    this.state.isPaused = true;
    this.state.pausedAt = Date.now();
    this.stopInterval();
    this.callbacks.onPause?.();
  }

  resume(): void {
    if (!this.state.isRunning || !this.state.isPaused) return;

    this.state.isPaused = false;
    const pausedDuration = Date.now() - (this.state.pausedAt || 0);
    this.state.startTime = (this.state.startTime || 0) + pausedDuration;
    this.state.pausedAt = null;
    
    this.callbacks.onResume?.();
    this.startInterval();
  }

  reset(): void {
    this.stopInterval();
    this.state = {
      isRunning: false,
      isPaused: false,
      elapsedTime: 0,
      startTime: null,
      pausedAt: null,
      duration: this.state.duration,
    };
    this.callbacks.onReset?.();
  }

  stop(): void {
    this.stopInterval();
    this.state.isRunning = false;
    this.state.isPaused = false;
  }

  private startInterval(): void {
    this.intervalId = setInterval(() => {
      this.tick();
    }, 100); // Update every 100ms for smooth progress
  }

  private stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick(): void {
    if (!this.state.isRunning || this.state.isPaused) return;

    const now = Date.now();
    this.state.elapsedTime = now - (this.state.startTime || now);

    this.callbacks.onTick?.(this.getState());

    // Check if timer is complete
    if (this.state.elapsedTime >= this.state.duration) {
      this.complete();
    }
  }

  private complete(): void {
    this.state.elapsedTime = this.state.duration;
    this.stop();
    this.callbacks.onComplete?.();
  }

  getState(): TimerState {
    return { ...this.state };
  }

  getRemainingTime(): number {
    return Math.max(0, this.state.duration - this.state.elapsedTime);
  }

  getProgress(): number {
    if (this.state.duration === 0) return 1;
    return Math.min(1, this.state.elapsedTime / this.state.duration);
  }

  getFormattedTime(): string {
    const remaining = this.getRemainingTime();
    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getFormattedElapsed(): string {
    const elapsed = this.state.elapsedTime;
    const minutes = Math.floor(elapsed / (60 * 1000));
    const seconds = Math.floor((elapsed % (60 * 1000)) / 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Static utility methods
  static formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes === 0) {
      return `${seconds}s`;
    }
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  static formatMinutes(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  }
}