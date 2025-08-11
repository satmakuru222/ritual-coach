'use client';

import { Ritual } from '@/types';
import { Clock, BookOpen } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface RitualCardProps {
  ritual: Ritual;
  onStart: () => void;
  language?: 'en' | 'te' | 'hi';
}

export default function RitualCard({ ritual, onStart, language = 'en' }: RitualCardProps) {
  const { t } = useTranslation(language);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{ritual.name}</h3>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
          {ritual.tradition}
        </span>
      </div>
      
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{ritual.estimated_time} {t('ritual.minutes')}</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          <span>{ritual.steps.length} steps</span>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">{t('ritual.materials_needed')}</h4>
        <div className="flex flex-wrap gap-2">
          {ritual.materials.slice(0, 4).map((material, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
            >
              {material}
            </span>
          ))}
          {ritual.materials.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
              +{ritual.materials.length - 4} more
            </span>
          )}
        </div>
      </div>
      
      <button
        onClick={onStart}
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
      >
        {t('ritual.start_ritual')}
      </button>
    </div>
  );
}