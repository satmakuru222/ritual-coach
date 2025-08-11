'use client';

import { Festival } from '@/types';
import { Calendar, CheckSquare, Utensils, Palette } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface FestivalCardProps {
  festival: Festival;
  date: string;
  daysUntil: number;
  onPrepare: () => void;
  language?: 'en' | 'te' | 'hi';
}

export default function FestivalCard({ 
  festival, 
  date, 
  daysUntil, 
  onPrepare, 
  language = 'en' 
}: FestivalCardProps) {
  const { t } = useTranslation(language);

  const getUrgencyColor = (days: number) => {
    if (days <= 1) return 'bg-red-100 text-red-800 border-red-200';
    if (days <= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{festival.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm border ${getUrgencyColor(daysUntil)}`}>
          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>{date}</span>
      </div>
      
      {festival.tradition_notes && (
        <p className="text-sm text-gray-700 mb-4 bg-orange-50 p-3 rounded">
          {festival.tradition_notes}
        </p>
      )}
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <CheckSquare className="w-6 h-6 mx-auto mb-1 text-gray-600" />
          <div className="text-xs text-gray-600">
            {festival.prep_checklist.length} tasks
          </div>
        </div>
        <div className="text-center">
          <Utensils className="w-6 h-6 mx-auto mb-1 text-gray-600" />
          <div className="text-xs text-gray-600">
            {festival.prasadam_suggestions.length} dishes
          </div>
        </div>
        <div className="text-center">
          <Palette className="w-6 h-6 mx-auto mb-1 text-gray-600" />
          <div className="text-xs text-gray-600">
            {festival.decor_templates.length} templates
          </div>
        </div>
      </div>
      
      <button
        onClick={onPrepare}
        className={`
          w-full py-3 px-4 rounded-lg font-medium transition-colors
          ${daysUntil <= 1 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-orange-600 hover:bg-orange-700 text-white'
          }
        `}
      >
        {t('festival.festival_preparation')}
      </button>
    </div>
  );
}