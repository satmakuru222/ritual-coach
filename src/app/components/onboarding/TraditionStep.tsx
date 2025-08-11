'use client';

import { Tradition, Region, Language } from '@/types';
import { traditionLabels, getTraditionFlow } from '@/lib/traditions';
import { useTranslation } from '@/lib/i18n';
import { BookOpen, Heart, Flower, ChevronLeft } from 'lucide-react';

interface TraditionStepProps {
  selectedTradition?: Tradition;
  selectedRegion: Region;
  onTraditionSelect: (tradition: Tradition) => void;
  onNext: () => void;
  onPrev: () => void;
  language: Language;
}

export default function TraditionStep({ 
  selectedTradition, 
  selectedRegion,
  onTraditionSelect, 
  onNext, 
  onPrev,
  language 
}: TraditionStepProps) {
  const { t } = useTranslation(language);

  const traditions = [
    {
      key: 'andhra_smarta' as Tradition,
      label: traditionLabels.andhra_smarta,
      icon: BookOpen,
      description: 'Traditional Smārta lineage with emphasis on Vedic practices and universal deity worship',
      practices: [
        'Pañcāyatana Pūjā (five-deity worship)',
        'Emphasis on Vedic mantras and procedures',
        'Philosophical approach to spirituality',
        'Integration of multiple traditions'
      ],
      dailyFlow: 'Saṅkalpa → Ācamana → Gaṇapati Dhyāna → Ṣoḍaśopacāra → Ārati',
      color: 'from-orange-500 to-amber-600',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50'
    },
    {
      key: 'vaishnava' as Tradition,
      label: traditionLabels.vaishnava,
      icon: Heart,
      description: 'Devotional tradition focused on Lord Viṣṇu and his avatars with emphasis on bhakti',
      practices: [
        'Dedicated worship of Viṣṇu/Kṛṣṇa',
        'Tulasī plant reverence and care',
        'Devotional singing and kirtan',
        'Sattvic lifestyle and diet'
      ],
      dailyFlow: 'Saṅkalpa → Ācamana → Viṣṇu Dhyāna → Tulasī Arcana → Ārati',
      color: 'from-purple-500 to-blue-600',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50'
    }
  ];

  const handleTraditionSelect = (tradition: Tradition) => {
    onTraditionSelect(tradition);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Flower className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.select_tradition')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the Hindu tradition that best aligns with your family&apos;s practices and spiritual path.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {traditions.map((tradition) => {
          const Icon = tradition.icon;
          const isSelected = selectedTradition === tradition.key;
          const flow = getTraditionFlow(tradition.key, selectedRegion);
          
          return (
            <div
              key={tradition.key}
              onClick={() => handleTraditionSelect(tradition.key)}
              className={`
                relative bg-white rounded-xl p-6 cursor-pointer transition-all duration-300
                ${isSelected 
                  ? 'ring-4 ring-purple-500 shadow-xl transform scale-102' 
                  : 'shadow-lg hover:shadow-xl border border-gray-200 hover:transform hover:scale-101'
                }
              `}
            >
              <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Header */}
                <div className="flex items-start space-x-4 lg:flex-shrink-0">
                  <div className={`w-12 h-12 bg-gradient-to-br ${tradition.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 lg:w-64">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tradition.label}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{tradition.description}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  {/* Practices */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Key Practices</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tradition.practices.map((practice, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            tradition.key === 'andhra_smarta' ? 'bg-orange-500' : 'bg-purple-500'
                          }`}></div>
                          <span className="text-sm text-gray-700">{practice}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Flow */}
                  <div className={`${tradition.bgColor} rounded-lg p-4`}>
                    <h4 className={`font-semibold ${tradition.textColor} mb-2`}>Daily Ritual Flow</h4>
                    <div className="text-sm text-gray-700 font-mono">
                      {tradition.dailyFlow}
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      Estimated time: {flow.steps.reduce((sum, step) => sum + (step.duration_minutes || 0), 0)} minutes
                    </div>
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h4 className="font-semibold text-blue-900 mb-2">Understanding Traditions</h4>
        <p className="text-blue-800 text-sm leading-relaxed mb-3">
          Both traditions are authentic paths within Hinduism. The choice depends on your family&apos;s 
          background and personal spiritual inclination:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="text-orange-700">Smārta:</strong> Universal approach, philosophical emphasis, 
            multiple deities worshipped as aspects of one Brahman.
          </div>
          <div>
            <strong className="text-purple-700">Vaishnava:</strong> Devotional approach, personal relationship 
            with God, focus on Viṣṇu/Kṛṣṇa as supreme deity.
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <button
          onClick={onNext}
          disabled={!selectedTradition}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${selectedTradition
              ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
}