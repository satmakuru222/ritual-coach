'use client';

import { useState } from 'react';
import { Language } from '@/types';
import { useTranslation } from '@/lib/i18n';
import { Clock, Sunrise, Sun, Moon, ChevronLeft, Target } from 'lucide-react';

interface ScheduleStepProps {
  dailyTime?: string;
  duration?: number;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  onScheduleUpdate: (time: string, duration: number, level: 'beginner' | 'intermediate' | 'advanced') => void;
  onNext: () => void;
  onPrev: () => void;
  language: Language;
}

export default function ScheduleStep({ 
  dailyTime, 
  duration, 
  userLevel,
  onScheduleUpdate, 
  onNext, 
  onPrev,
  language 
}: ScheduleStepProps) {
  const { t } = useTranslation(language);
  const [selectedTime, setSelectedTime] = useState(dailyTime || '');
  const [selectedDuration, setSelectedDuration] = useState(duration || 30);
  const [selectedLevel, setSelectedLevel] = useState(userLevel || 'beginner');

  const timeSlots = [
    {
      id: 'early_morning',
      label: 'Early Morning (5:00 - 7:00 AM)',
      icon: Sunrise,
      times: ['05:00', '05:30', '06:00', '06:30'],
      description: 'Traditional Brahma Muhurta period - most auspicious for spiritual practice',
      benefits: ['Peaceful environment', 'Enhanced focus', 'Spiritual energy', 'Sets positive tone'],
      color: 'from-orange-400 to-yellow-500'
    },
    {
      id: 'morning',
      label: 'Morning (7:00 - 10:00 AM)',
      icon: Sun,
      times: ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30'],
      description: 'Fresh start to the day with clear mind and energy',
      benefits: ['Good energy levels', 'Family participation', 'Routine building', 'Morning clarity'],
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'evening',
      label: 'Evening (6:00 - 8:00 PM)',
      icon: Moon,
      times: ['18:00', '18:30', '19:00', '19:30'],
      description: 'Peaceful end to the day with gratitude and reflection',
      benefits: ['Day reflection', 'Family gathering', 'Calm transition', 'Gratitude practice'],
      color: 'from-purple-400 to-blue-500'
    }
  ];

  const durations = [
    { value: 15, label: '15 minutes', description: 'Quick daily practice', level: 'beginner' },
    { value: 30, label: '30 minutes', description: 'Standard daily ritual', level: 'beginner' },
    { value: 45, label: '45 minutes', description: 'Extended practice', level: 'intermediate' },
    { value: 60, label: '60 minutes', description: 'Comprehensive ritual', level: 'intermediate' },
    { value: 90, label: '90 minutes', description: 'Deep spiritual practice', level: 'advanced' }
  ];

  const levels = [
    {
      id: 'beginner' as const,
      label: 'Beginner',
      description: 'New to daily rituals or returning after a break',
      features: [
        'Simplified procedures',
        'Step-by-step guidance',
        'Essential mantras only',
        'Flexible timings'
      ],
      color: 'from-green-400 to-blue-500'
    },
    {
      id: 'intermediate' as const,
      label: 'Intermediate', 
      description: 'Regular practitioner wanting to deepen knowledge',
      features: [
        'Complete ritual sequences',
        'Additional mantras',
        'Cultural context',
        'Seasonal variations'
      ],
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: 'advanced' as const,
      label: 'Advanced',
      description: 'Experienced practitioner seeking authentic details',
      features: [
        'Full traditional procedures',
        'Sanskrit pronunciations',
        'Philosophical insights',
        'Advanced techniques'
      ],
      color: 'from-purple-400 to-red-500'
    }
  ];

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onScheduleUpdate(time, selectedDuration, selectedLevel);
  };

  const handleDurationSelect = (dur: number) => {
    setSelectedDuration(dur);
    onScheduleUpdate(selectedTime, dur, selectedLevel);
  };

  const handleLevelSelect = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedLevel(level);
    onScheduleUpdate(selectedTime, selectedDuration, level);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.daily_schedule')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Set up your daily practice schedule. Choose a time that works consistently for you and your family.
        </p>
      </div>

      <div className="space-y-8">
        {/* Time Selection */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferred Time</h2>
          <div className="space-y-4">
            {timeSlots.map((slot) => {
              const Icon = slot.icon;
              return (
                <div key={slot.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${slot.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{slot.label}</h3>
                      <p className="text-sm text-gray-600 mb-3">{slot.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        {slot.benefits.map((benefit, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {slot.times.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`
                          p-3 rounded-lg text-sm font-medium transition-all duration-200
                          ${selectedTime === time
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }
                        `}
                      >
                        {new Date(`2000-01-01T${time}`).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Duration Selection */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Duration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {durations.map((dur) => (
              <button
                key={dur.value}
                onClick={() => handleDurationSelect(dur.value)}
                className={`
                  p-4 rounded-lg text-center transition-all duration-200 border
                  ${selectedDuration === dur.value
                    ? 'bg-purple-500 text-white border-purple-500 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }
                `}
              >
                <div className="text-lg font-bold">{dur.label}</div>
                <div className="text-xs mt-1 opacity-75">{dur.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-600" />
            Experience Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelSelect(level.id)}
                className={`
                  text-left p-6 rounded-lg transition-all duration-200 border-2
                  ${selectedLevel === level.id
                    ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                  }
                `}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${level.color} rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold text-sm">{level.id[0].toUpperCase()}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{level.label}</h3>
                <p className="text-sm text-gray-600 mb-4">{level.description}</p>
                
                <div className="space-y-1">
                  {level.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Summary */}
      {selectedTime && (
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Daily Practice Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Time:</span>
              <div className="text-green-600 font-semibold">
                {new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Duration:</span>
              <div className="text-blue-600 font-semibold">{selectedDuration} minutes</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Level:</span>
              <div className="text-purple-600 font-semibold capitalize">{selectedLevel}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onPrev}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <button
          onClick={onNext}
          disabled={!selectedTime}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${selectedTime
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
}