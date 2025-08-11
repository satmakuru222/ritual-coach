'use client';

import { Language } from '@/types';
import { languages, useTranslation } from '@/lib/i18n';
import { Languages, ChevronLeft, Globe } from 'lucide-react';

interface LanguageStepProps {
  selectedLanguage?: Language;
  secondaryLanguage?: Language;
  onLanguageSelect: (primary: Language, secondary?: Language) => void;
  onNext: () => void;
  onPrev: () => void;
  language: Language;
}

export default function LanguageStep({ 
  selectedLanguage, 
  secondaryLanguage,
  onLanguageSelect, 
  onNext, 
  onPrev,
  language 
}: LanguageStepProps) {
  const { t } = useTranslation(language);

  const languageDetails = [
    {
      code: 'en' as Language,
      name: languages.en,
      nativeName: 'English',
      description: 'Universal language with transliterations',
      script: 'Latin',
      sample: 'Om Gaṇeśāya Namaḥ',
      features: [
        'IAST transliterations for mantras',
        'Detailed explanations and meanings',
        'Universal accessibility',
        'Philosophical context'
      ],
      color: 'from-blue-500 to-indigo-600'
    },
    {
      code: 'te' as Language,
      name: languages.te,
      nativeName: 'తెలుగు',
      description: 'Traditional South Indian language',
      script: 'Telugu',
      sample: 'ఓం గణేశాయ నమః',
      features: [
        'Original Telugu mantras',
        'Cultural context and traditions',
        'Regional festival guidance',
        'Family heritage preservation'
      ],
      color: 'from-orange-500 to-red-600'
    },
    {
      code: 'hi' as Language,
      name: languages.hi,
      nativeName: 'हिन्दी',
      description: 'Traditional North Indian language',
      script: 'Devanagari',
      sample: 'ॐ गणेशाय नमः',
      features: [
        'Original Devanagari mantras',
        'Vedic pronunciation guides',
        'Sanskrit etymology',
        'Classical tradition access'
      ],
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const handlePrimarySelect = (lang: Language) => {
    onLanguageSelect(lang, secondaryLanguage);
  };

  const handleSecondarySelect = (lang: Language) => {
    if (lang === selectedLanguage) return;
    onLanguageSelect(selectedLanguage!, lang === secondaryLanguage ? undefined : lang);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Languages className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.select_language')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose your primary language for guidance, and optionally select a secondary language for bilingual content.
        </p>
      </div>

      {/* Primary Language Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-600" />
          Primary Language
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languageDetails.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            
            return (
              <div
                key={lang.code}
                onClick={() => handlePrimarySelect(lang.code)}
                className={`
                  relative bg-white rounded-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-105
                  ${isSelected 
                    ? 'ring-4 ring-blue-500 shadow-xl' 
                    : 'shadow-md hover:shadow-lg border border-gray-200'
                  }
                `}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${lang.color} rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold text-sm">{lang.code.toUpperCase()}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">{lang.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{lang.description}</p>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Sample:</div>
                  <div className={`text-lg ${
                    lang.code === 'te' ? 'font-telugu' : 
                    lang.code === 'hi' ? 'font-devanagari' : 
                    'font-serif italic'
                  }`}>
                    {lang.sample}
                  </div>
                </div>

                <div className="space-y-1">
                  {lang.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Language Selection (Optional) */}
      {selectedLanguage && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Secondary Language <span className="text-sm text-gray-500 font-normal">(Optional)</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {languageDetails
              .filter(lang => lang.code !== selectedLanguage)
              .map((lang) => {
                const isSelected = secondaryLanguage === lang.code;
                
                return (
                  <div
                    key={lang.code}
                    onClick={() => handleSecondarySelect(lang.code)}
                    className={`
                      relative bg-gray-50 rounded-lg p-4 cursor-pointer transition-all duration-300
                      ${isSelected 
                        ? 'ring-2 ring-purple-400 shadow-md bg-white' 
                        : 'hover:shadow-md hover:bg-white border border-gray-200'
                      }
                    `}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${lang.color} rounded-lg flex items-center justify-center mb-3`}>
                      <span className="text-white font-bold text-xs">{lang.code.toUpperCase()}</span>
                    </div>
                    
                    <h3 className="text-md font-semibold text-gray-900 mb-1">{lang.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{lang.description}</p>
                    
                    <div className="text-sm text-gray-700">
                      {lang.sample}
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h4 className="font-semibold text-blue-900 mb-2">About Language Selection</h4>
        <div className="text-blue-800 text-sm leading-relaxed space-y-2">
          <p>
            <strong>Primary Language:</strong> Used for all interface text, explanations, and guidance.
          </p>
          <p>
            <strong>Secondary Language:</strong> Added to mantras and sacred texts for bilingual learning. 
            Perfect for preserving heritage while learning in your comfortable language.
          </p>
          <p>
            All languages include proper pronunciation guides and cultural context to ensure authentic practice.
          </p>
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
          disabled={!selectedLanguage}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${selectedLanguage
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
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