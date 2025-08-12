'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Calendar, User, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { RitualProfile, Tradition, Region, Language } from '@/types';
import { getTraditionFlow, traditionLabels, regionLabels } from '@/lib/traditions';
import { ritualStorage } from '@/lib/ritual/storage';
import { useTranslation } from '@/lib/i18n';
import RitualProgress from '@/app/components/ritual/RitualProgress';
import RitualCompletion from '@/app/components/ritual/RitualCompletion';
import MaterialsChecklist from '@/app/components/ritual/MaterialsChecklist';

type RitualState = 'setup' | 'materials' | 'progress' | 'completed';

interface PanchangInfo {
  tithi: string;
  nakshatra: string;
  day: string;
  isAuspicious: boolean;
}

export default function RitualPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<RitualProfile | null>(null);
  const [ritualState, setRitualState] = useState<RitualState>('setup');
  const [isLoading, setIsLoading] = useState(true);
  const [panchangInfo, setPanchangInfo] = useState<PanchangInfo | null>(null);
  const [agentGuidance, setAgentGuidance] = useState<string | null>(null);
  const [isLoadingGuidance, setIsLoadingGuidance] = useState(false);
  
  const language = profile?.language_pref || 'en';
  const { t } = useTranslation(language);

  useEffect(() => {
    // Load user profile
    const savedProfile = ritualStorage.getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      loadTodaysPanchang();
      checkRitualStatus(savedProfile);
    } else {
      // No profile found, redirect to onboarding
      router.push('/onboarding');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  const checkRitualStatus = (userProfile: RitualProfile) => {
    const todaysProgress = ritualStorage.getTodaysProgress();
    
    if (todaysProgress?.isCompleted) {
      setRitualState('completed');
    } else if (todaysProgress?.completedSteps.length > 0) {
      setRitualState('progress');
    } else {
      setRitualState('setup');
    }
  };

  const loadTodaysPanchang = async () => {
    // Mock panchang data - in real app this would come from panchang API
    const mockPanchang: PanchangInfo = {
      tithi: 'Dvitiya (द्वितीया)',
      nakshatra: 'Rohini (रोहिणी)',
      day: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      isAuspicious: Math.random() > 0.3, // 70% chance of auspicious
    };
    
    setPanchangInfo(mockPanchang);
  };

  const fetchAgentGuidance = async () => {
    if (!profile) return;
    
    setIsLoadingGuidance(true);
    
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Provide today's personalized ritual guidance for a ${profile.tradition} practitioner from ${profile.region} India, speaking ${profile.language_pref}. Include timing suggestions and any special considerations for today.`,
          context: {
            tradition: profile.tradition,
            region: profile.region,
            language: profile.language_pref,
            dailyTime: profile.daily_time,
            duration: profile.duration_minutes,
            kidMode: profile.kid_mode,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAgentGuidance(data.response || t('ritual.guidance_default'));
      } else {
        setAgentGuidance(t('ritual.guidance_default'));
      }
    } catch (error) {
      console.error('Failed to fetch agent guidance:', error);
      setAgentGuidance(t('ritual.guidance_default'));
    } finally {
      setIsLoadingGuidance(false);
    }
  };

  const handleStartRitual = () => {
    setRitualState('materials');
  };

  const handleMaterialsReady = () => {
    setRitualState('progress');
  };

  const handleRitualComplete = () => {
    setRitualState('completed');
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  const handleResetRitual = () => {
    ritualStorage.clearAllProgress();
    setRitualState('setup');
  };

  const getTraditionFlow = () => {
    if (!profile) return { name: '', steps: [], materials: [], mantras: [] };
    return getTraditionFlow(profile.tradition, profile.region);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; // Will redirect to onboarding
  }

  const traditionFlow = getTraditionFlow();

  // Completed state
  if (ritualState === 'completed') {
    const todaysProgress = ritualStorage.getTodaysProgress();
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <RitualCompletion
          tradition={traditionLabels[profile.tradition]}
          completedSteps={todaysProgress?.completedSteps.length || 0}
          totalSteps={traditionFlow.steps.length}
          duration={todaysProgress?.totalDuration}
          language={language}
          onGoHome={handleGoHome}
          onShare={() => {
            // TODO: Implement sharing
            console.log('Share ritual completion');
          }}
          onDownloadPDF={() => {
            // TODO: Implement PDF download
            console.log('Download PDF');
          }}
        />
        
        {/* Reset option */}
        <div className="text-center mt-8">
          <button
            onClick={handleResetRitual}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            {t('ritual.practice_again')}
          </button>
        </div>
      </div>
    );
  }

  // Progress state
  if (ritualState === 'progress') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <RitualProgress
          steps={traditionFlow.steps}
          language={language}
          onComplete={handleRitualComplete}
          onExit={handleGoHome}
        />
      </div>
    );
  }

  // Materials checklist state
  if (ritualState === 'materials') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('ritual.prepare_materials')}
            </h1>
            <p className="text-gray-600">
              {t('ritual.gather_items')}
            </p>
          </div>

          <MaterialsChecklist
            materials={traditionFlow.materials}
            language={language}
            onAllChecked={handleMaterialsReady}
            className="mb-6"
          />

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setRitualState('setup')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.back')}
            </button>
            
            <button
              onClick={handleMaterialsReady}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              {t('ritual.start_ritual')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Setup state (default)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('ritual.todays_practice')}
          </h1>
          <p className="text-xl text-gray-600">
            {traditionLabels[profile.tradition]} • {regionLabels[profile.region]}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Today's Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Panchang Info */}
            {panchangInfo && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-900">
                    {t('ritual.todays_panchang')}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">{t('ritual.date')}</div>
                    <div className="font-medium">{panchangInfo.day}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">{t('ritual.tithi')}</div>
                    <div className="font-medium">{panchangInfo.tithi}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">{t('ritual.nakshatra')}</div>
                    <div className="font-medium">{panchangInfo.nakshatra}</div>
                  </div>
                  
                  <div className={`
                    inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm
                    ${panchangInfo.isAuspicious 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    }
                  `}>
                    <Sparkles className="w-3 h-3" />
                    {panchangInfo.isAuspicious 
                      ? t('ritual.auspicious_time') 
                      : t('ritual.regular_time')
                    }
                  </div>
                </div>
              </div>
            )}

            {/* Profile Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">
                  {t('ritual.your_practice')}
                </h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">{t('ritual.tradition')}</div>
                  <div className="font-medium">{traditionLabels[profile.tradition]}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">{t('ritual.region')}</div>
                  <div className="font-medium">{regionLabels[profile.region]}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">{t('ritual.preferred_time')}</div>
                  <div className="font-medium">{profile.daily_time}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">{t('ritual.duration')}</div>
                  <div className="font-medium">{profile.duration_minutes} {t('common.minutes')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Ritual Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ritual Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {traditionFlow.name}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {traditionFlow.steps.length}
                  </div>
                  <div className="text-sm text-gray-600">{t('ritual.steps')}</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {traditionFlow.steps.reduce((sum, step) => sum + (step.duration_minutes || 5), 0)}m
                  </div>
                  <div className="text-sm text-gray-600">{t('ritual.estimated_time')}</div>
                </div>
              </div>

              {/* Steps Preview */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-900">{t('ritual.steps_overview')}</h4>
                {traditionFlow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{step.title}</div>
                      <div className="text-sm text-gray-600">
                        {step.duration_minutes}m • {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartRitual}
                className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg flex items-center justify-center gap-3"
              >
                <Clock className="w-5 h-5" />
                {t('ritual.begin_practice')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* AI Guidance */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  {t('ritual.todays_guidance')}
                </h3>
                <button
                  onClick={fetchAgentGuidance}
                  disabled={isLoadingGuidance}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                >
                  {isLoadingGuidance ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    t('ritual.get_guidance')
                  )}
                </button>
              </div>
              
              {agentGuidance ? (
                <div className="text-gray-700 leading-relaxed">
                  {agentGuidance}
                </div>
              ) : (
                <div className="text-gray-600 italic">
                  {t('ritual.guidance_placeholder')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}