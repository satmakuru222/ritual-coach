'use client';

import { Language } from '@/types';
import { useTranslation } from '@/lib/i18n';
import { OnboardingData } from '@/app/onboarding/page';
import { traditionLabels, regionLabels, getDietaryGuidelines } from '@/lib/traditions';
import { languages } from '@/lib/i18n';
import { CheckCircle, Users, ChevronLeft, Sparkles, Heart, Utensils } from 'lucide-react';

interface FinalStepProps {
  data: OnboardingData;
  onDataUpdate: (updates: Partial<OnboardingData>) => void;
  onComplete: () => void;
  onPrev: () => void;
  isLoading: boolean;
  language: Language;
}

export default function FinalStep({ 
  data, 
  onDataUpdate, 
  onComplete, 
  onPrev, 
  isLoading,
  language 
}: FinalStepProps) {
  const { t } = useTranslation(language);

  const dietaryOptions = data.tradition ? getDietaryGuidelines(data.tradition) : [];

  const toggleKidsMode = () => {
    onDataUpdate({ kid_mode: !data.kid_mode });
  };

  const handleDietaryChange = (rule: string) => {
    onDataUpdate({ dietary_rules: rule });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Almost Ready!
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Review your settings and set final preferences to complete your spiritual journey setup.
        </p>
      </div>

      <div className="space-y-8">
        {/* Summary of Selections */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Your Spiritual Profile
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Region</label>
                <div className="mt-1 text-gray-900">{data.region ? regionLabels[data.region] : 'Not selected'}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Tradition</label>
                <div className="mt-1 text-gray-900">{data.tradition ? traditionLabels[data.tradition] : 'Not selected'}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Language</label>
                <div className="mt-1 text-gray-900">
                  {data.language_pref ? languages[data.language_pref] : 'Not selected'}
                  {data.secondary_language && (
                    <span className="text-gray-600 text-sm ml-2">
                      + {languages[data.secondary_language]}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Daily Time</label>
                <div className="mt-1 text-gray-900">
                  {data.daily_time 
                    ? new Date(`2000-01-01T${data.daily_time}`).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})
                    : 'Not selected'
                  }
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Duration</label>
                <div className="mt-1 text-gray-900">{data.duration_minutes} minutes</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Experience Level</label>
                <div className="mt-1 text-gray-900 capitalize">{data.user_level}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Kids Mode Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            {t('kids.kids_mode')}
          </h2>
          
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Enable Kids Mode
              </h3>
              <p className="text-gray-600 mb-4">
                Transform rituals into engaging, child-friendly experiences with simple explanations, 
                interactive elements, and age-appropriate spiritual concepts.
              </p>
              
              {data.kid_mode && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Kids Mode Features:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-yellow-700">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-3 h-3" />
                      <span>Simple, fun explanations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-3 h-3" />
                      <span>Interactive activities</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Step-by-step guidance</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3 h-3" />
                      <span>Family-friendly content</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <button
                onClick={toggleKidsMode}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${data.kid_mode ? 'bg-blue-600' : 'bg-gray-300'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${data.kid_mode ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Dietary Preferences */}
        {dietaryOptions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Utensils className="w-5 h-5 mr-2 text-green-600" />
              Dietary Guidelines
            </h2>
            
            <p className="text-gray-600 mb-4">
              Traditional dietary guidelines for your chosen path. Select any that apply to your practice:
            </p>
            
            <div className="space-y-3">
              {dietaryOptions.map((option, index) => (
                <label key={index} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.dietary_rules?.includes(option)}
                    onChange={(e) => {
                      const current = data.dietary_rules?.split(', ').filter(Boolean) || [];
                      const updated = e.target.checked
                        ? [...current, option]
                        : current.filter(rule => rule !== option);
                      handleDietaryChange(updated.join(', '));
                    }}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Ready to Begin */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🙏</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Your Spiritual Journey Awaits
          </h3>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            You&apos;re all set! Ritual Coach will now provide personalized guidance based on your preferences. 
            Your daily practice will be meaningful, authentic, and perfectly suited to your spiritual path.
          </p>
          
          <div className="text-xl font-sanskrit text-orange-600 mb-2">
            ॐ शुभमस्तु
          </div>
          <div className="text-sm text-gray-600">
            &ldquo;May it be auspicious&rdquo;
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onPrev}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <button
          onClick={onComplete}
          disabled={isLoading}
          className={`
            px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105
            ${isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Setting up...</span>
            </div>
          ) : (
            'Complete Setup & Begin'
          )}
        </button>
      </div>
    </div>
  );
}