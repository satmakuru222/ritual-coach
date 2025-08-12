import { RitualStep } from '@/types';
import { ritualStorage, DailyRitualState } from './storage';

export interface RitualProgressState {
  currentStepIndex: number;
  completedSteps: Set<string>;
  isCompleted: boolean;
  totalSteps: number;
  estimatedTimeRemaining: number;
  actualTimeSpent: number;
}

export class RitualProgressTracker {
  private steps: RitualStep[];
  private state: RitualProgressState;
  private startTime: number | null = null;

  constructor(steps: RitualStep[]) {
    this.steps = steps;
    this.state = {
      currentStepIndex: 0,
      completedSteps: new Set(),
      isCompleted: false,
      totalSteps: steps.length,
      estimatedTimeRemaining: this.calculateTotalTime(),
      actualTimeSpent: 0,
    };

    // Load existing progress for today
    this.loadTodaysProgress();
  }

  private loadTodaysProgress(): void {
    const todaysProgress = ritualStorage.getTodaysProgress();
    if (todaysProgress) {
      this.state.completedSteps = new Set(todaysProgress.completedSteps);
      this.state.isCompleted = todaysProgress.isCompleted;
      
      // Find the current step index based on completed steps
      if (todaysProgress.isCompleted) {
        this.state.currentStepIndex = this.steps.length;
      } else {
        // Find first incomplete step
        this.state.currentStepIndex = this.steps.findIndex(
          step => !this.state.completedSteps.has(step.id)
        );
        
        // If all steps are complete but ritual isn't marked complete
        if (this.state.currentStepIndex === -1) {
          this.state.currentStepIndex = this.steps.length - 1;
        }
      }

      this.updateEstimatedTime();
    }
  }

  private calculateTotalTime(): number {
    return this.steps.reduce((total, step) => {
      return total + (step.duration_minutes || 5);
    }, 0);
  }

  private updateEstimatedTime(): void {
    let remainingTime = 0;
    
    for (let i = this.state.currentStepIndex; i < this.steps.length; i++) {
      if (!this.state.completedSteps.has(this.steps[i].id)) {
        remainingTime += this.steps[i].duration_minutes || 5;
      }
    }
    
    this.state.estimatedTimeRemaining = remainingTime;
  }

  startRitual(): void {
    this.startTime = Date.now();
    ritualStorage.startRitual();
  }

  markStepCompleted(stepId: string): boolean {
    if (this.state.completedSteps.has(stepId)) {
      return false; // Already completed
    }

    this.state.completedSteps.add(stepId);
    ritualStorage.markStepCompleted(stepId);

    // Update current step index to next incomplete step
    this.updateCurrentStepIndex();
    this.updateEstimatedTime();
    this.updateActualTimeSpent();

    // Check if all steps are completed
    if (this.state.completedSteps.size === this.steps.length) {
      this.completeRitual();
    }

    return true;
  }

  markStepIncomplete(stepId: string): boolean {
    if (!this.state.completedSteps.has(stepId)) {
      return false; // Already incomplete
    }

    this.state.completedSteps.delete(stepId);
    ritualStorage.markStepIncomplete(stepId);
    this.state.isCompleted = false;

    // Update current step index
    this.updateCurrentStepIndex();
    this.updateEstimatedTime();

    return true;
  }

  private updateCurrentStepIndex(): void {
    // Find the first incomplete step
    const firstIncompleteIndex = this.steps.findIndex(
      step => !this.state.completedSteps.has(step.id)
    );

    if (firstIncompleteIndex === -1) {
      // All steps completed
      this.state.currentStepIndex = this.steps.length;
    } else {
      this.state.currentStepIndex = firstIncompleteIndex;
    }
  }

  private updateActualTimeSpent(): void {
    if (this.startTime) {
      this.state.actualTimeSpent = Math.floor((Date.now() - this.startTime) / (1000 * 60));
    }
  }

  private completeRitual(): void {
    this.state.isCompleted = true;
    this.state.currentStepIndex = this.steps.length;
    this.state.estimatedTimeRemaining = 0;
    this.updateActualTimeSpent();

    ritualStorage.markRitualCompleted(
      this.steps.length,
      this.state.actualTimeSpent
    );
  }

  // Navigation methods
  goToNextStep(): boolean {
    if (this.state.currentStepIndex < this.steps.length - 1) {
      this.state.currentStepIndex++;
      return true;
    }
    return false;
  }

  goToPreviousStep(): boolean {
    if (this.state.currentStepIndex > 0) {
      this.state.currentStepIndex--;
      return true;
    }
    return false;
  }

  goToStep(stepIndex: number): boolean {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.state.currentStepIndex = stepIndex;
      return true;
    }
    return false;
  }

  // Getters
  getCurrentStep(): RitualStep | null {
    if (this.state.currentStepIndex >= this.steps.length) {
      return null; // Ritual completed
    }
    return this.steps[this.state.currentStepIndex];
  }

  getStepByIndex(index: number): RitualStep | null {
    if (index >= 0 && index < this.steps.length) {
      return this.steps[index];
    }
    return null;
  }

  getStepById(stepId: string): RitualStep | null {
    return this.steps.find(step => step.id === stepId) || null;
  }

  isStepCompleted(stepId: string): boolean {
    return this.state.completedSteps.has(stepId);
  }

  isStepActive(stepId: string): boolean {
    const currentStep = this.getCurrentStep();
    return currentStep?.id === stepId;
  }

  getProgress(): number {
    if (this.steps.length === 0) return 1;
    return this.state.completedSteps.size / this.steps.length;
  }

  getProgressPercentage(): number {
    return Math.round(this.getProgress() * 100);
  }

  getState(): RitualProgressState {
    return { ...this.state };
  }

  getAllSteps(): RitualStep[] {
    return [...this.steps];
  }

  getCompletedStepsCount(): number {
    return this.state.completedSteps.size;
  }

  getRemainingStepsCount(): number {
    return this.steps.length - this.state.completedSteps.size;
  }

  // Reset methods
  resetProgress(): void {
    this.state = {
      currentStepIndex: 0,
      completedSteps: new Set(),
      isCompleted: false,
      totalSteps: this.steps.length,
      estimatedTimeRemaining: this.calculateTotalTime(),
      actualTimeSpent: 0,
    };
    this.startTime = null;
  }

  // Utility methods
  getStepProgress(stepId: string): 'pending' | 'active' | 'completed' {
    if (this.isStepCompleted(stepId)) return 'completed';
    if (this.isStepActive(stepId)) return 'active';
    return 'pending';
  }

  getTimeStats(): {
    estimated: number;
    remaining: number;
    spent: number;
    efficiency: number;
  } {
    const estimated = this.calculateTotalTime();
    const remaining = this.state.estimatedTimeRemaining;
    const spent = this.state.actualTimeSpent;
    const efficiency = estimated > 0 ? (spent / estimated) * 100 : 100;

    return {
      estimated,
      remaining,
      spent,
      efficiency,
    };
  }
}