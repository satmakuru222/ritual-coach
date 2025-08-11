'use client';

import { Mantra } from '@/types';
import { Play, Pause, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

interface MantraCardProps {
  mantra: Mantra;
  language?: 'en' | 'te' | 'hi';
  script?: 'en' | 'te' | 'hi' | 'iast';
}

export default function MantraCard({ mantra, language = 'en', script = language }: MantraCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const { t } = useTranslation(language);

  const getMantraText = () => {
    if (script === 'iast') return mantra.text_by_script.iast;
    return mantra.text_by_script[script] || mantra.text_by_script.en;
  };

  const getCadenceLabel = (cadence: string) => {
    const cadenceMap = {
      slow: t('mantra.slow'),
      medium: t('mantra.medium'),
      fast: t('mantra.fast'),
    };
    return cadenceMap[cadence as keyof typeof cadenceMap] || cadence;
  };

  const getScriptFont = (script: string) => {
    const fontMap = {
      te: 'font-telugu',
      hi: 'font-devanagari',
      iast: 'font-serif italic',
      en: 'font-sans',
    };
    return fontMap[script as keyof typeof fontMap] || 'font-sans';
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement audio playback
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{mantra.title}</h3>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
            {getCadenceLabel(mantra.cadence)}
          </span>
          <button
            onClick={handlePlayPause}
            className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className={`mb-4 p-4 bg-gray-50 rounded-lg ${getScriptFont(script)}`}>
        <div className="text-lg leading-relaxed text-gray-800">
          {getMantraText()}
        </div>
      </div>

      {script !== 'en' && (
        <div className="mb-4">
          <button
            onClick={() => setShowMeaning(!showMeaning)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm"
          >
            <BookOpen className="w-4 h-4" />
            {showMeaning ? 'Hide' : 'Show'} {t('mantra.meaning')}
          </button>
          
          {showMeaning && (
            <div className="mt-2 p-3 bg-blue-50 rounded text-sm text-gray-700">
              {mantra.text_by_script.en}
            </div>
          )}
        </div>
      )}

      {mantra.breakpoints.length > 0 && (
        <div className="border-t pt-4">
          <div className="text-sm text-gray-600 mb-2">
            Call and Response Breakpoints:
          </div>
          <div className="flex flex-wrap gap-2">
            {mantra.breakpoints.map((point, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
              >
                {point}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}