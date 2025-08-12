'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Star, Calendar, Share2, Download, Home } from 'lucide-react';
import { Language } from '@/types';
import { useTranslation } from '@/lib/i18n';
import { ritualStorage } from '@/lib/ritual/storage';

interface RitualCompletionProps {
  tradition: string;
  completedSteps: number;
  totalSteps: number;
  duration?: number;
  language: Language;
  onGoHome?: () => void;
  onShare?: () => void;
  onDownloadPDF?: () => void;
  className?: string;
}

export default function RitualCompletion({
  tradition,
  completedSteps,
  totalSteps,
  duration,
  language,
  onGoHome,
  onShare,
  onDownloadPDF,
  className = '',
}: RitualCompletionProps) {
  const { t } = useTranslation(language);
  const [streak, setStreak] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState({ completedDays: 0, totalDays: 0, completionRate: 0 });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Load streak and stats
    const currentStreak = ritualStorage.getStreak();
    const stats = ritualStorage.getMonthlyStats();
    
    setStreak(currentStreak.current);
    setMonthlyStats(stats);

    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const isNewStreak = streak === 1;
  const isSignificantStreak = streak > 0 && streak % 7 === 0; // Weekly milestones

  const getStreakMessage = () => {
    if (isNewStreak) {
      return t('completion.streak_started');
    } else if (isSignificantStreak) {
      return t('completion.weekly_milestone');
    } else if (streak > 1) {
      return t('completion.streak_continued');
    }
    return t('completion.well_done');
  };

  const getStreakIcon = () => {
    if (streak >= 21) return '🏆'; // Trophy for 3+ weeks
    if (streak >= 14) return '⭐'; // Star for 2+ weeks  
    if (streak >= 7) return '🔥'; // Fire for 1+ week
    if (streak >= 3) return '💪'; // Strong for 3+ days
    return '✨'; // Sparkle for starting
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return t('completion.duration_unknown');
    
    if (minutes < 60) {
      return t('completion.duration_minutes', { minutes });
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return t('completion.duration_hours', { hours });
    }
    
    return t('completion.duration_hours_minutes', { hours, minutes: remainingMinutes });
  };

  return (
    <div className={`relative max-w-2xl mx-auto text-center ${className}`}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">🎉</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Completion Message */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <CheckCircle className="w-16 h-16 text-green-600" />
            <div className="absolute -top-2 -right-2 text-2xl animate-pulse">
              {getStreakIcon()}
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('completion.title')}
        </h1>
        
        <p className="text-xl text-gray-600 mb-6">
          {getStreakMessage()}
        </p>

        {/* Completion Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">
              {completedSteps}/{totalSteps}
            </div>
            <div className="text-sm text-gray-600">{t('completion.steps')}</div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {formatDuration(duration)}
            </div>
            <div className="text-sm text-gray-600">{t('completion.duration')}</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {streak}
            </div>
            <div className="text-sm text-gray-600">{t('completion.day_streak')}</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(monthlyStats.completionRate)}%
            </div>
            <div className="text-sm text-gray-600">{t('completion.monthly')}</div>
          </div>
        </div>

        {/* Tradition Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full mb-6">
          <Star className="w-4 h-4" />
          <span className="font-medium">{tradition} {t('completion.tradition')}</span>
        </div>

        {/* Achievement Message */}
        {isSignificantStreak && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="text-yellow-800 font-medium mb-1">
              🎯 {t('completion.achievement_unlocked')}
            </div>
            <div className="text-yellow-700 text-sm">
              {streak >= 21 ? t('completion.master_practitioner') :
               streak >= 14 ? t('completion.dedicated_devotee') :
               t('completion.consistent_practice')}
            </div>
          </div>
        )}

        {/* Inspirational Quote */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 italic text-gray-700">
          "{t('completion.inspirational_quote')}"
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={onGoHome}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">{t('completion.go_home')}</span>
        </button>

        <button
          onClick={onDownloadPDF}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">{t('completion.download_pdf')}</span>
        </button>

        <button
          onClick={onShare}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">{t('completion.share')}</span>
        </button>

        <button
          onClick={() => window.open('/calendar', '_blank')}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">{t('completion.schedule')}</span>
        </button>
      </div>

      {/* Next Steps */}
      <div className="mt-6 bg-white rounded-lg p-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-3">{t('completion.next_steps')}</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            {t('completion.next_step_1')}
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            {t('completion.next_step_2')}
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            {t('completion.next_step_3')}
          </li>
        </ul>
      </div>

      {/* Progress Insight */}
      <div className="mt-4 text-sm text-gray-500">
        {t('completion.progress_insight', {
          completed: monthlyStats.completedDays,
          total: monthlyStats.totalDays,
        })}
      </div>
    </div>
  );
}