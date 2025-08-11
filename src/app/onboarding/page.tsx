'use client';

import { useState } from 'react';
import { RitualProfile, Tradition, Region, Language } from '@/types';
import { useTranslation } from '@/lib/i18n';
import ProgressIndicator from '@/app/components/onboarding/ProgressIndicator';
import RegionStep from '@/app/components/onboarding/RegionStep';
import TraditionStep from '@/app/components/onboarding/TraditionStep';
import LanguageStep from '@/app/components/onboarding/LanguageStep';
import ScheduleStep from '@/app/components/onboarding/ScheduleStep';
import FinalStep from '@/app/components/onboarding/FinalStep';

export interface OnboardingData {
  region?: Region;
  tradition?: Tradition;
  language_pref?: Language;
  secondary_language?: Language;
  daily_time?: string;
  duration_minutes?: number;
  kid_mode?: boolean;
  dietary_rules?: string;
  user_level?: 'beginner' | 'intermediate' | 'advanced';
}

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    duration_minutes: 30,
    kid_mode: false,
    dietary_rules: '',
    user_level: 'beginner',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation(data.language_pref || 'en');

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Create user profile
      const profile: Partial<RitualProfile> = {
        user_id: `user_${Date.now()}`, // In production, this would come from auth
        tradition: data.tradition!,
        region: data.region!,
        language_pref: data.language_pref!,
        daily_time: data.daily_time!,
        duration_minutes: data.duration_minutes!,
        dietary_rules: data.dietary_rules!,
        kid_mode: data.kid_mode!,
      };

      // Save to API
      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'profile',
          data: profile,
        }),
      });

      if (response.ok) {
        // Store in localStorage for immediate use
        localStorage.setItem('ritual_coach_profile', JSON.stringify(profile));
        
        // Redirect to main app
        window.location.href = '/dashboard';
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0: // Welcome & Region
        return !!data.region;
      case 1: // Tradition
        return !!data.tradition;
      case 2: // Language
        return !!data.language_pref;
      case 3: // Schedule
        return !!data.daily_time;
      case 4: // Final
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <RegionStep
            selectedRegion={data.region}
            onRegionSelect={(region) => updateData({ region })}
            onNext={nextStep}
            language={data.language_pref || 'en'}
          />
        );
      case 1:
        return (
          <TraditionStep
            selectedTradition={data.tradition}
            selectedRegion={data.region!}
            onTraditionSelect={(tradition) => updateData({ tradition })}
            onNext={nextStep}
            onPrev={prevStep}
            language={data.language_pref || 'en'}
          />
        );
      case 2:
        return (
          <LanguageStep
            selectedLanguage={data.language_pref}
            secondaryLanguage={data.secondary_language}
            onLanguageSelect={(language_pref, secondary_language) => 
              updateData({ language_pref, secondary_language })
            }
            onNext={nextStep}
            onPrev={prevStep}
            language={data.language_pref || 'en'}
          />
        );
      case 3:
        return (
          <ScheduleStep
            dailyTime={data.daily_time}
            duration={data.duration_minutes}
            userLevel={data.user_level}
            onScheduleUpdate={(daily_time, duration_minutes, user_level) => 
              updateData({ daily_time, duration_minutes, user_level })
            }
            onNext={nextStep}
            onPrev={prevStep}
            language={data.language_pref || 'en'}
          />
        );
      case 4:
        return (
          <FinalStep
            data={data}
            onDataUpdate={updateData}
            onComplete={handleComplete}
            onPrev={prevStep}
            isLoading={isLoading}
            language={data.language_pref || 'en'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ॐ</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ritual Coach</h1>
                <p className="text-sm text-gray-600">{t('onboarding.welcome')}</p>
              </div>
            </div>
            
            {/* Progress */}
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {TOTAL_STEPS}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStep()}
      </main>

      {/* Sacred Footer */}
      <footer className="mt-16 py-6 text-center">
        <div className="text-lg font-sanskrit text-orange-600 mb-2">
          ॐ गं गणपतये नमः
        </div>
        <div className="text-sm text-gray-500">
          Setting up your spiritual journey with reverence
        </div>
      </footer>
    </div>
  );
}