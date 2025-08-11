'use client';

import { RitualStep as RitualStepType } from '@/types';
import { Star, Heart, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface KidsRitualStepProps {
  step: RitualStepType & { kidFriendlyTitle?: string; kidFriendlyDescription?: string };
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  language?: 'en' | 'te' | 'hi';
}

export default function KidsRitualStep({ 
  step, 
  isActive, 
  isCompleted, 
  onComplete, 
  language = 'en' 
}: KidsRitualStepProps) {
  // const { t } = useTranslation(language);

  const getStepIcon = (stepId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      '1': <Star className="w-6 h-6" />,
      '2': <Sparkles className="w-6 h-6" />,
      '3': <Heart className="w-6 h-6" />,
      '4': <Star className="w-6 h-6" />,
      '5': <Heart className="w-6 h-6" />,
    };
    return iconMap[stepId] || <Star className="w-6 h-6" />;
  };

  const getKidFriendlyTitle = (title: string, stepId: string) => {
    const kidTitles: Record<string, string> = {
      '1': '🙏 Make a Wish (Saṅkalpa)',
      '2': '💧 Clean Your Hands (Ācamana)',
      '3': '🐘 Say Hi to Gaṇeśa',
      '4': '🌸 Offer Flowers to God',
      '5': '🕯️ Light the Lamp (Ārati)',
    };
    return step.kidFriendlyTitle || kidTitles[stepId] || title;
  };

  const getKidFriendlyDescription = (description: string, stepId: string) => {
    const kidDescriptions: Record<string, string> = {
      '1': 'Close your eyes and tell God what you want to do today. Make a special wish!',
      '2': 'Wash your hands with water and say God\'s name to get ready for prayers.',
      '3': 'Say hello to Gaṇeśa, the elephant-headed God who helps remove problems!',
      '4': 'Give beautiful flowers to God with love, just like giving a gift to a friend.',
      '5': 'Light a special lamp and wave it in circles to show God we are happy!',
    };
    return step.kidFriendlyDescription || kidDescriptions[stepId] || description;
  };

  return (
    <div className={`
      p-6 rounded-xl border-3 transition-all transform hover:scale-102
      ${isActive ? 'border-pink-400 bg-gradient-to-r from-pink-50 to-purple-50 shadow-lg' : 'border-yellow-200 bg-yellow-50'}
      ${isCompleted ? 'border-green-400 bg-green-100' : ''}
    `}>
      <div className="flex items-start gap-4">
        <button
          onClick={onComplete}
          className={`
            flex-shrink-0 p-3 rounded-full transition-all transform hover:scale-110
            ${isCompleted 
              ? 'bg-green-500 text-white shadow-lg' 
              : isActive 
                ? 'bg-pink-400 text-white shadow-md' 
                : 'bg-yellow-300 text-yellow-800 hover:bg-yellow-400'
            }
          `}
        >
          {getStepIcon(step.id)}
        </button>
        
        <div className="flex-1">
          <h3 className={`
            text-xl font-bold mb-3
            ${isActive ? 'text-pink-800' : 'text-yellow-800'}
            ${isCompleted ? 'text-green-800' : ''}
          `}>
            {getKidFriendlyTitle(step.title, step.id)}
          </h3>
          
          <p className={`
            text-lg mb-4 leading-relaxed
            ${isActive ? 'text-pink-700' : 'text-yellow-700'}
            ${isCompleted ? 'text-green-700' : ''}
          `}>
            {getKidFriendlyDescription(step.description, step.id)}
          </p>
          
          {step.materials && step.materials.length > 0 && (
            <div className="mb-4">
              <h4 className="text-base font-semibold text-purple-700 mb-2 flex items-center gap-2">
                🎒 Things You Need:
              </h4>
              <div className="flex flex-wrap gap-2">
                {step.materials.map((material, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm border-2 border-purple-200 shadow-sm"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <Sparkles className="w-5 h-5" />
              <span>Great job! You completed this step! ⭐</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}