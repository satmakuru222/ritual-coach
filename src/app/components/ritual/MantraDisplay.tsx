'use client';

import { useState } from 'react';
import { Volume2, VolumeX, Copy, Check } from 'lucide-react';
import { Language, MantraText } from '@/types';
import { useTranslation } from '@/lib/i18n';

interface MantraDisplayProps {
  mantraId: string;
  title: string;
  text: MantraText;
  language: Language;
  onScriptChange?: (script: keyof MantraText) => void;
  className?: string;
}

const scriptLabels = {
  te: 'తెలుగు',
  hi: 'हिन्दी',
  en: 'English',
  iast: 'IAST',
};

export default function MantraDisplay({
  mantraId,
  title,
  text,
  language,
  onScriptChange,
  className = '',
}: MantraDisplayProps) {
  const { t } = useTranslation(language);
  const [currentScript, setCurrentScript] = useState<keyof MantraText>('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleScriptChange = (script: keyof MantraText) => {
    setCurrentScript(script);
    onScriptChange?.(script);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text[currentScript]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy mantra:', error);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      // TODO: Implement audio pause
      setIsPlaying(false);
    } else {
      // TODO: Implement audio play
      setIsPlaying(true);
      // Simulate audio duration
      setTimeout(() => setIsPlaying(false), 5000);
    }
  };

  const getFontClass = (script: keyof MantraText) => {
    switch (script) {
      case 'te':
        return 'font-telugu text-2xl';
      case 'hi':
        return 'font-devanagari text-2xl';
      case 'iast':
        return 'font-serif italic text-xl';
      default:
        return 'text-lg';
    }
  };

  return (
    <div className={`bg-orange-50 border border-orange-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-orange-900">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="p-2 text-orange-700 hover:text-orange-900 hover:bg-orange-100 rounded-full transition-colors"
            title={isPlaying ? t('mantra.pause') : t('mantra.play')}
          >
            {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={handleCopy}
            className="p-2 text-orange-700 hover:text-orange-900 hover:bg-orange-100 rounded-full transition-colors"
            title={t('mantra.copy')}
          >
            {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Script Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(scriptLabels).map(([script, label]) => (
          <button
            key={script}
            onClick={() => handleScriptChange(script as keyof MantraText)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              currentScript === script
                ? 'bg-orange-600 text-white'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mantra Text */}
      <div className="bg-white rounded-lg p-4 border border-orange-100">
        <div className={`${getFontClass(currentScript)} text-gray-900 leading-relaxed text-center`}>
          {text[currentScript] || text.en || 'Mantra text not available'}
        </div>
        
        {/* Pronunciation Guide for Sanskrit scripts */}
        {(currentScript === 'te' || currentScript === 'hi') && text.iast && (
          <div className="mt-3 pt-3 border-t border-orange-100">
            <div className="text-sm text-gray-600 text-center">
              <span className="font-medium">Pronunciation:</span>
              <div className="font-serif italic mt-1">{text.iast}</div>
            </div>
          </div>
        )}

        {/* English meaning */}
        {currentScript !== 'en' && text.en && (
          <div className="mt-3 pt-3 border-t border-orange-100">
            <div className="text-sm text-gray-600 text-center">
              <span className="font-medium">Meaning:</span>
              <div className="mt-1">{text.en}</div>
            </div>
          </div>
        )}
      </div>

      {/* Audio Progress Indicator */}
      {isPlaying && (
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-orange-700">
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>Playing pronunciation...</span>
          </div>
          <div className="mt-1 w-full bg-orange-100 rounded-full h-1">
            <div className="bg-orange-600 h-1 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}