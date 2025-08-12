'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import { RitualTimer as Timer, TimerState } from '@/lib/ritual/timer';
import { Language } from '@/types';
import { useTranslation } from '@/lib/i18n';

interface RitualTimerProps {
  durationMinutes: number;
  stepName: string;
  language: Language;
  onComplete?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  autoStart?: boolean;
  className?: string;
}

export default function RitualTimer({
  durationMinutes,
  stepName,
  language,
  onComplete,
  onStart,
  onPause,
  onReset,
  autoStart = false,
  className = '',
}: RitualTimerProps) {
  const { t } = useTranslation(language);
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    elapsedTime: 0,
    startTime: null,
    pausedAt: null,
    duration: durationMinutes * 60 * 1000,
  });
  
  const timerRef = useRef<Timer | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Initialize timer
    timerRef.current = new Timer(durationMinutes, {
      onTick: (state) => {
        setTimerState(state);
      },
      onComplete: () => {
        setIsCompleted(true);
        onComplete?.();
        
        // Vibrate on mobile if supported
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      },
      onStart: () => {
        setIsCompleted(false);
        onStart?.();
      },
      onPause: () => {
        onPause?.();
      },
      onReset: () => {
        setIsCompleted(false);
        onReset?.();
      },
    });

    // Auto start if requested
    if (autoStart) {
      timerRef.current.start();
    }

    return () => {
      if (timerRef.current) {
        timerRef.current.stop();
      }
    };
  }, [durationMinutes, autoStart, onComplete, onStart, onPause, onReset]);

  const handlePlayPause = () => {
    if (!timerRef.current) return;

    if (timerState.isRunning && !timerState.isPaused) {
      timerRef.current.pause();
    } else if (timerState.isPaused) {
      timerRef.current.resume();
    } else {
      timerRef.current.start();
    }
  };

  const handleReset = () => {
    if (timerRef.current) {
      timerRef.current.reset();
      setIsCompleted(false);
    }
  };

  const getProgress = () => {
    if (timerRef.current) {
      return timerRef.current.getProgress();
    }
    return 0;
  };

  const getFormattedTime = () => {
    if (timerRef.current) {
      return timerRef.current.getFormattedTime();
    }
    return '00:00';
  };

  const getProgressColor = () => {
    if (isCompleted) return 'text-green-600';
    if (timerState.isRunning && !timerState.isPaused) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getProgressRingColor = () => {
    if (isCompleted) return 'stroke-green-500';
    if (timerState.isRunning && !timerState.isPaused) return 'stroke-orange-500';
    return 'stroke-gray-300';
  };

  const circumference = 2 * Math.PI * 54; // radius = 54
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (getProgress() * circumference);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Step Name */}
      <div className="text-center mb-4">
        <h3 className="font-semibold text-gray-900 mb-1">{stepName}</h3>
        <p className="text-sm text-gray-600">
          {durationMinutes} {t('timer.minutes')} • {t('timer.recommended')}
        </p>
      </div>

      {/* Circular Progress Timer */}
      <div className="relative flex justify-center mb-6">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-300 ${getProgressRingColor()}`}
          />
        </svg>
        
        {/* Timer Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {isCompleted ? (
              <CheckCircle className={`w-8 h-8 mx-auto mb-1 ${getProgressColor()}`} />
            ) : (
              <Clock className={`w-6 h-6 mx-auto mb-1 ${getProgressColor()}`} />
            )}
            <div className={`text-2xl font-mono font-bold ${getProgressColor()}`}>
              {getFormattedTime()}
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center mb-4">
        {isCompleted ? (
          <p className="text-green-600 font-medium">{t('timer.completed')}</p>
        ) : timerState.isRunning && !timerState.isPaused ? (
          <p className="text-orange-600">{t('timer.in_progress')}</p>
        ) : timerState.isPaused ? (
          <p className="text-gray-600">{t('timer.paused')}</p>
        ) : (
          <p className="text-gray-600">{t('timer.ready_to_start')}</p>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handlePlayPause}
          disabled={isCompleted}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
            ${
              isCompleted
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : timerState.isRunning && !timerState.isPaused
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }
          `}
        >
          {timerState.isRunning && !timerState.isPaused ? (
            <>
              <Pause className="w-4 h-4" />
              {t('timer.pause')}
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              {timerState.isPaused ? t('timer.resume') : t('timer.start')}
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('timer.reset')}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{t('timer.progress')}</span>
          <span>{Math.round(getProgress() * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-green-500' : 'bg-orange-500'
            }`}
            style={{ width: `${getProgress() * 100}%` }}
          />
        </div>
      </div>

      {/* Additional Info */}
      {timerState.isRunning && (
        <div className="mt-3 text-center text-sm text-gray-500">
          {t('timer.elapsed')}: {timerRef.current?.getFormattedElapsed() || '00:00'}
        </div>
      )}
    </div>
  );
}