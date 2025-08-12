'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Package, AlertCircle } from 'lucide-react';
import { Language } from '@/types';
import { useTranslation } from '@/lib/i18n';

interface MaterialsChecklistProps {
  materials: string[];
  language: Language;
  onAllChecked?: () => void;
  onMaterialToggle?: (material: string, checked: boolean) => void;
  className?: string;
}

export default function MaterialsChecklist({
  materials,
  language,
  onAllChecked,
  onMaterialToggle,
  className = '',
}: MaterialsChecklistProps) {
  const { t } = useTranslation(language);
  const [checkedMaterials, setCheckedMaterials] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check if all materials are checked
    if (checkedMaterials.size === materials.length && materials.length > 0) {
      onAllChecked?.();
    }
  }, [checkedMaterials, materials.length, onAllChecked]);

  const handleMaterialToggle = (material: string) => {
    const newCheckedMaterials = new Set(checkedMaterials);
    
    if (newCheckedMaterials.has(material)) {
      newCheckedMaterials.delete(material);
    } else {
      newCheckedMaterials.add(material);
    }
    
    setCheckedMaterials(newCheckedMaterials);
    onMaterialToggle?.(material, newCheckedMaterials.has(material));
  };

  const toggleAll = () => {
    if (checkedMaterials.size === materials.length) {
      // Uncheck all
      setCheckedMaterials(new Set());
      materials.forEach(material => onMaterialToggle?.(material, false));
    } else {
      // Check all
      const allMaterials = new Set(materials);
      setCheckedMaterials(allMaterials);
      materials.forEach(material => onMaterialToggle?.(material, true));
    }
  };

  const completionPercentage = materials.length > 0 
    ? Math.round((checkedMaterials.size / materials.length) * 100)
    : 100;

  const allChecked = checkedMaterials.size === materials.length && materials.length > 0;

  if (materials.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 text-center ${className}`}>
        <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">{t('materials.none_required')}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">
            {t('materials.title')}
          </h3>
        </div>
        
        <button
          onClick={toggleAll}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          {allChecked ? t('materials.uncheck_all') : t('materials.check_all')}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{t('materials.progress')}</span>
          <span>{checkedMaterials.size}/{materials.length} ({completionPercentage}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              allChecked ? 'bg-green-500' : 'bg-orange-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Materials List */}
      <div className="space-y-2 mb-4">
        {materials.map((material, index) => {
          const isChecked = checkedMaterials.has(material);
          
          return (
            <button
              key={index}
              onClick={() => handleMaterialToggle(material)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left
                ${isChecked 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-white hover:bg-gray-50'
                }
              `}
            >
              {isChecked ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              
              <span className={`
                flex-1 ${isChecked 
                  ? 'text-green-900 line-through' 
                  : 'text-gray-900'
                }
              `}>
                {material}
              </span>
            </button>
          );
        })}
      </div>

      {/* Status Message */}
      <div className={`
        flex items-center gap-2 p-3 rounded-lg text-sm
        ${allChecked 
          ? 'bg-green-50 text-green-800 border border-green-200' 
          : 'bg-orange-50 text-orange-800 border border-orange-200'
        }
      `}>
        {allChecked ? (
          <>
            <CheckCircle className="w-4 h-4" />
            {t('materials.all_ready')}
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4" />
            {t('materials.gather_remaining', { count: materials.length - checkedMaterials.size })}
          </>
        )}
      </div>

      {/* Tips */}
      {!allChecked && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-2">{t('materials.tips_title')}</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• {t('materials.tip_1')}</li>
            <li>• {t('materials.tip_2')}</li>
            <li>• {t('materials.tip_3')}</li>
          </ul>
        </div>
      )}
    </div>
  );
}