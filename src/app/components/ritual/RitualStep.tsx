'use client';

import { RitualStep as RitualStepType } from '@/types';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface RitualStepProps {
  step: RitualStepType;
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  language?: 'en' | 'te' | 'hi';
}

export default function RitualStep({ 
  step, 
  isActive, 
  isCompleted, 
  onComplete, 
  language = 'en' 
}: RitualStepProps) {
  const { t } = useTranslation(language);

  return (
    <div className={`
      p-4 rounded-lg border-2 transition-all
      ${isActive ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}
      ${isCompleted ? 'border-green-500 bg-green-50' : ''}
    `}>
      <div className="flex items-start gap-3">
        <button
          onClick={onComplete}
          className={`
            flex-shrink-0 mt-1 transition-colors
            ${isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}
          `}
        >
          {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`
              font-semibold
              ${isActive ? 'text-orange-900' : 'text-gray-900'}
              ${isCompleted ? 'text-green-900' : ''}
            `}>
              {step.title}
            </h3>
            {step.duration_minutes && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-3 h-3" />
                {step.duration_minutes}m
              </span>
            )}
          </div>
          
          <p className={`
            text-sm mb-3
            ${isActive ? 'text-orange-800' : 'text-gray-600'}
            ${isCompleted ? 'text-green-800' : ''}
          `}>
            {step.description}
          </p>
          
          {step.materials && step.materials.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-gray-700 mb-1">
                {t('ritual.materials_needed')}:
              </h4>
              <div className="flex flex-wrap gap-1">
                {step.materials.map((material, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {step.mantras && step.mantras.length > 0 && (
            <div className="border-t pt-2 mt-2">
              <h4 className="text-xs font-medium text-gray-700 mb-1">Mantras:</h4>
              <div className="text-xs text-gray-600">
                {step.mantras.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}