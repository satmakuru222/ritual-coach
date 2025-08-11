'use client';

import { Region, Language } from '@/types';
import { regionLabels } from '@/lib/traditions';
import { useTranslation } from '@/lib/i18n';
import { MapPin, Sunrise, Mountain } from 'lucide-react';

interface RegionStepProps {
  selectedRegion?: Region;
  onRegionSelect: (region: Region) => void;
  onNext: () => void;
  language: Language;
}

export default function RegionStep({ 
  selectedRegion, 
  onRegionSelect, 
  onNext, 
  language 
}: RegionStepProps) {
  const { t } = useTranslation(language);

  const regions = [
    {
      key: 'south' as Region,
      label: regionLabels.south,
      icon: Sunrise,
      description: 'Tamil Nadu, Andhra Pradesh, Karnataka, Kerala traditions',
      features: [
        'Emphasis on Tamil and Telugu texts',
        'Traditional temple architecture influence',
        'South Indian ritual variations',
        'Regional festival celebrations'
      ],
      color: 'from-orange-500 to-red-600'
    },
    {
      key: 'north' as Region,
      label: regionLabels.north,
      icon: Mountain,
      description: 'Uttar Pradesh, Bihar, Delhi, Punjab traditions',
      features: [
        'Sanskrit and Hindi text emphasis', 
        'Vedic ritual traditions',
        'North Indian cultural practices',
        'Himalayan spiritual influence'
      ],
      color: 'from-purple-500 to-blue-600'
    }
  ];

  const handleRegionSelect = (region: Region) => {
    onRegionSelect(region);
    // Auto-advance after selection
    setTimeout(() => {
      onNext();
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.select_region')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose your regional tradition to receive authentic guidance that honors your cultural heritage and local practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {regions.map((region) => {
          const Icon = region.icon;
          const isSelected = selectedRegion === region.key;
          
          return (
            <div
              key={region.key}
              onClick={() => handleRegionSelect(region.key)}
              className={`
                relative bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105
                ${isSelected 
                  ? 'ring-4 ring-orange-500 shadow-xl' 
                  : 'shadow-lg hover:shadow-xl border border-gray-200'
                }
              `}
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${region.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{region.label}</h3>
                  <p className="text-sm text-gray-600">{region.description}</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {region.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
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

      {/* Explanation */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h4 className="font-semibold text-blue-900 mb-2">Why does region matter?</h4>
        <p className="text-blue-800 text-sm leading-relaxed">
          Hindu traditions have beautiful regional variations in language, ritual practices, festival celebrations, 
          and cultural customs. By selecting your region, Ritual Coach can provide guidance that feels authentic 
          to your family&apos;s heritage and local community practices.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div></div> {/* Empty for alignment */}
        
        <button
          onClick={onNext}
          disabled={!selectedRegion}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${selectedRegion
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
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