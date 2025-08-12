'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Clock, ArrowLeft } from 'lucide-react';
import { RitualStep, Language } from '@/types';
import { RitualProgressTracker } from '@/lib/ritual/progress';
import { useTranslation } from '@/lib/i18n';
import RitualTimer from './RitualTimer';
import MantraDisplay from './MantraDisplay';

interface RitualProgressProps {
  steps: RitualStep[];
  language: Language;
  onComplete?: () => void;
  onExit?: () => void;
  className?: string;
}

// Mock mantra data - in real app this would come from API/database
const mockMantras = {
  sankalpa_mantra: {
    te: 'అపవిత్రః పవిత్రో వా సర్వావస్థాంగతోపి వా',
    hi: 'अपवित्रः पवित्रो वा सर्वावस्थांगतोपि वा',
    en: 'Whether pure or impure, or having passed through all conditions',
    iast: 'apavitraḥ pavitro vā sarvāvasthāṅgatopi vā',
  },
  achamana_mantra: {
    te: 'ఓం కేశవాయ నమః, ఓం నారాయణాయ నమః, ఓం మాధవాయ నమః',
    hi: 'ॐ केशवाय नमः, ॐ नारायणाय नमः, ॐ माधवाय नमः',
    en: 'Om, salutations to Keshava, Om, salutations to Narayana, Om, salutations to Madhava',
    iast: 'oṃ keśavāya namaḥ, oṃ nārāyaṇāya namaḥ, oṃ mādhavāya namaḥ',
  },
  ganapati_dhyana: {
    te: 'వక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ',
    hi: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ',
    en: 'O curved-tusked, mighty-bodied one, with the brilliance of a million suns',
    iast: 'vakratuṇḍa mahākāya sūryakoṭi samaprabha',
  },
};

export default function RitualProgress({
  steps,
  language,
  onComplete,
  onExit,
  className = '',
}: RitualProgressProps) {
  const { t } = useTranslation(language);
  const [progressTracker] = useState(() => new RitualProgressTracker(steps));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    // Initialize from saved progress
    const state = progressTracker.getState();
    setCurrentStepIndex(state.currentStepIndex);
    setCompletedSteps(state.completedSteps);
    setIsCompleted(state.isCompleted);

    // Start ritual tracking
    progressTracker.startRitual();
  }, [progressTracker]);

  const currentStep = progressTracker.getCurrentStep();
  const canGoNext = currentStepIndex < steps.length - 1;
  const canGoPrevious = currentStepIndex > 0;

  const handleStepToggle = (stepId: string) => {
    const isCurrentlyCompleted = completedSteps.has(stepId);
    
    if (isCurrentlyCompleted) {
      progressTracker.markStepIncomplete(stepId);
    } else {
      progressTracker.markStepCompleted(stepId);
    }

    // Update local state
    const newState = progressTracker.getState();
    setCompletedSteps(newState.completedSteps);
    setIsCompleted(newState.isCompleted);

    // Auto-advance to next step if this one was just completed
    if (!isCurrentlyCompleted && canGoNext) {
      setTimeout(() => {
        setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
      }, 500);
    }

    // Check for ritual completion
    if (newState.isCompleted) {
      onComplete?.();
    }
  };

  const handleNextStep = () => {
    if (canGoNext) {
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
      progressTracker.goToStep(newIndex);
    }
  };

  const handlePreviousStep = () => {
    if (canGoPrevious) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      progressTracker.goToStep(newIndex);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
    progressTracker.goToStep(stepIndex);
  };

  const getStepStatus = (step: RitualStep) => {
    if (completedSteps.has(step.id)) return 'completed';
    if (step.id === currentStep?.id) return 'active';
    return 'pending';
  };

  const getMantraForStep = (mantras: string[]) => {
    // Return first available mantra for demo
    const mantraId = mantras[0];
    return mockMantras[mantraId as keyof typeof mockMantras] || null;
  };

  const progressPercentage = Math.round((completedSteps.size / steps.length) * 100);

  if (isCompleted) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('ritual.completed_title')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('ritual.completed_message')}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onExit}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            {t('ritual.finish')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('ritual.exit')}
        </button>
        
        <div className="text-center">
          <div className="text-sm text-gray-600">
            {t('ritual.progress')}: {completedSteps.size}/{steps.length}
          </div>
          <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => setShowTimer(!showTimer)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Clock className="w-5 h-5" />
          {t('timer.toggle')}
        </button>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousStep}
          disabled={!canGoPrevious}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            canGoPrevious
              ? 'text-gray-700 hover:bg-gray-100'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          {t('ritual.previous')}
        </button>

        <div className="text-center">
          <div className="text-sm text-gray-600">{t('ritual.step')}</div>
          <div className="font-semibold">
            {currentStepIndex + 1} {t('common.of')} {steps.length}
          </div>
        </div>

        <button
          onClick={handleNextStep}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            canGoNext
              ? 'text-gray-700 hover:bg-gray-100'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          {t('ritual.next')}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Step List */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-gray-900 mb-4">{t('ritual.all_steps')}</h3>
          <div className="space-y-2">
            {steps.map((step, index) => {
              const status = getStepStatus(step);
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    status === 'active'
                      ? 'border-orange-500 bg-orange-50'
                      : status === 'completed'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${
                        status === 'active' ? 'text-orange-900' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </div>
                      {step.duration_minutes && (
                        <div className="text-xs text-gray-500">
                          {step.duration_minutes}m
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Current Step Details */}
        <div className="lg:col-span-2 space-y-6">
          {currentStep && (
            <>
              {/* Current Step Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentStep.title}
                  </h2>
                  <button
                    onClick={() => handleStepToggle(currentStep.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      completedSteps.has(currentStep.id)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    {completedSteps.has(currentStep.id)
                      ? t('ritual.mark_incomplete')
                      : t('ritual.mark_complete')
                    }
                  </button>
                </div>

                <p className="text-gray-700 mb-4">{currentStep.description}</p>

                {/* Materials */}
                {currentStep.materials && currentStep.materials.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {t('ritual.materials_needed')}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentStep.materials.map((material, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timer */}
                {showTimer && currentStep.duration_minutes && (
                  <div className="mt-6">
                    <RitualTimer
                      durationMinutes={currentStep.duration_minutes}
                      stepName={currentStep.title}
                      language={language}
                      onComplete={() => handleStepToggle(currentStep.id)}
                    />
                  </div>
                )}
              </div>

              {/* Mantras */}
              {currentStep.mantras && currentStep.mantras.length > 0 && (
                <div className="space-y-4">
                  {currentStep.mantras.map((mantraId, index) => {
                    const mantraText = getMantraForStep([mantraId]);
                    if (!mantraText) return null;

                    return (
                      <MantraDisplay
                        key={index}
                        mantraId={mantraId}
                        title={mantraId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        text={mantraText}
                        language={language}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}