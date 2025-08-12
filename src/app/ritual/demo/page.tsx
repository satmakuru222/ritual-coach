'use client';

import { useState } from 'react';
import { Play, RotateCcw, Settings, Eye } from 'lucide-react';
import { Tradition, Region, Language, RitualProfile } from '@/types';
import { getTraditionFlow, traditionLabels, regionLabels } from '@/lib/traditions';
import { useTranslation } from '@/lib/i18n';
import RitualProgress from '@/app/components/ritual/RitualProgress';
import RitualCompletion from '@/app/components/ritual/RitualCompletion';
import MaterialsChecklist from '@/app/components/ritual/MaterialsChecklist';
import RitualTimer from '@/app/components/ritual/RitualTimer';
import MantraDisplay from '@/app/components/ritual/MantraDisplay';

type DemoMode = 'settings' | 'materials' | 'timer' | 'mantra' | 'progress' | 'completion';

const mockMantras = {
  sankalpa_mantra: {
    te: 'అపవిత్రః పవిత్రో వా సర్వావస్థాంగతోపి వా',
    hi: 'अपवित्रः पवित्रो वा सर्वावस्थांगतोपि वा',
    en: 'Whether pure or impure, or having passed through all conditions',
    iast: 'apavitraḥ pavitro vā sarvāvasthāṅgatopi vā',
  },
  ganapati_dhyana: {
    te: 'వక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ',
    hi: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ',
    en: 'O curved-tusked, mighty-bodied one, with the brilliance of a million suns',
    iast: 'vakratuṇḍa mahākāya sūryakoṭi samaprabha',
  },
};

export default function RitualDemoPage() {
  const [demoMode, setDemoMode] = useState<DemoMode>('settings');
  const [demoProfile, setDemoProfile] = useState<RitualProfile>({
    user_id: 'demo-user',
    tradition: 'andhra_smarta',
    region: 'south',
    language_pref: 'en',
    daily_time: '06:30',
    duration_minutes: 30,
    dietary_rules: 'sattvic',
    kid_mode: false,
  });

  const { t } = useTranslation(demoProfile.language_pref);
  const traditionFlow = getTraditionFlow(demoProfile.tradition, demoProfile.region);

  const handleProfileChange = (key: keyof RitualProfile, value: any) => {
    setDemoProfile(prev => ({ ...prev, [key]: value }));
  };

  const resetDemo = () => {
    setDemoMode('settings');
    setDemoProfile({
      user_id: 'demo-user',
      tradition: 'andhra_smarta',
      region: 'south',
      language_pref: 'en',
      daily_time: '06:30',
      duration_minutes: 30,
      dietary_rules: 'sattvic',
      kid_mode: false,
    });
  };

  const renderDemoControls = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Demo Controls</h2>
        <button
          onClick={resetDemo}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {([
          { mode: 'settings', label: 'Settings', icon: Settings },
          { mode: 'materials', label: 'Materials', icon: Eye },
          { mode: 'timer', label: 'Timer', icon: Play },
          { mode: 'mantra', label: 'Mantra', icon: Eye },
          { mode: 'progress', label: 'Progress', icon: Play },
          { mode: 'completion', label: 'Completion', icon: Eye },
        ] as const).map(({ mode, label, icon: Icon }) => (
          <button
            key={mode}
            onClick={() => setDemoMode(mode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              demoMode === mode
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSettingsDemo = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Demo Profile Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tradition
          </label>
          <select
            value={demoProfile.tradition}
            onChange={(e) => handleProfileChange('tradition', e.target.value as Tradition)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="andhra_smarta">Andhra Smārta</option>
            <option value="vaishnava">Vaishnava</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <select
            value={demoProfile.region}
            onChange={(e) => handleProfileChange('region', e.target.value as Region)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="south">South Indian</option>
            <option value="north">North Indian</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={demoProfile.language_pref}
            onChange={(e) => handleProfileChange('language_pref', e.target.value as Language)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="en">English</option>
            <option value="te">Telugu</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Time
          </label>
          <input
            type="time"
            value={demoProfile.daily_time}
            onChange={(e) => handleProfileChange('daily_time', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            min="10"
            max="120"
            value={demoProfile.duration_minutes}
            onChange={(e) => handleProfileChange('duration_minutes', parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={demoProfile.kid_mode}
              onChange={(e) => handleProfileChange('kid_mode', e.target.checked)}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">Kids Mode</span>
          </label>
        </div>
      </div>

      {/* Current Tradition Flow Info */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Current Tradition Flow</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-orange-600">{traditionFlow.steps.length}</div>
              <div className="text-sm text-gray-600">Steps</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{traditionFlow.materials.length}</div>
              <div className="text-sm text-gray-600">Materials</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{traditionFlow.mantras.length}</div>
              <div className="text-sm text-gray-600">Mantras</div>
            </div>
          </div>
          
          <div className="text-center">
            <h5 className="font-medium text-gray-900">{traditionFlow.name}</h5>
            <p className="text-sm text-gray-600 mt-1">
              {traditionLabels[demoProfile.tradition]} • {regionLabels[demoProfile.region]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaterialsDemo = () => (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Materials Checklist Demo</h3>
      <MaterialsChecklist
        materials={traditionFlow.materials}
        language={demoProfile.language_pref}
        onAllChecked={() => alert('All materials checked!')}
        onMaterialToggle={(material, checked) => 
          console.log(`Material ${material} ${checked ? 'checked' : 'unchecked'}`)
        }
      />
    </div>
  );

  const renderTimerDemo = () => (
    <div className="max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Timer Component Demo</h3>
      <RitualTimer
        durationMinutes={5}
        stepName="Gaṇapati Dhyāna"
        language={demoProfile.language_pref}
        onComplete={() => alert('Timer completed!')}
        onStart={() => console.log('Timer started')}
      />
    </div>
  );

  const renderMantraDemo = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 text-center">Mantra Display Demo</h3>
      
      <MantraDisplay
        mantraId="sankalpa_mantra"
        title="Saṅkalpa Mantra"
        text={mockMantras.sankalpa_mantra}
        language={demoProfile.language_pref}
      />
      
      <MantraDisplay
        mantraId="ganapati_dhyana"
        title="Gaṇapati Dhyāna"
        text={mockMantras.ganapati_dhyana}
        language={demoProfile.language_pref}
      />
    </div>
  );

  const renderProgressDemo = () => (
    <RitualProgress
      steps={traditionFlow.steps}
      language={demoProfile.language_pref}
      onComplete={() => setDemoMode('completion')}
      onExit={() => setDemoMode('settings')}
    />
  );

  const renderCompletionDemo = () => (
    <div className="max-w-2xl mx-auto">
      <RitualCompletion
        tradition={traditionLabels[demoProfile.tradition]}
        completedSteps={traditionFlow.steps.length}
        totalSteps={traditionFlow.steps.length}
        duration={25}
        language={demoProfile.language_pref}
        onGoHome={() => setDemoMode('settings')}
        onShare={() => alert('Share feature demo')}
        onDownloadPDF={() => alert('PDF download demo')}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Ritual System Demo
          </h1>
          <p className="text-xl text-gray-600">
            Test all ritual components and flows
          </p>
        </div>

        {/* Demo Controls */}
        {renderDemoControls()}

        {/* Demo Content */}
        <div className="bg-gray-50">
          {demoMode === 'settings' && renderSettingsDemo()}
          {demoMode === 'materials' && renderMaterialsDemo()}
          {demoMode === 'timer' && renderTimerDemo()}
          {demoMode === 'mantra' && renderMantraDemo()}
          {demoMode === 'progress' && renderProgressDemo()}
          {demoMode === 'completion' && renderCompletionDemo()}
        </div>

        {/* Component Status */}
        <div className="mt-8 bg-white rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Component Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>RitualProgress ✅</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>RitualTimer ✅</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>MantraDisplay ✅</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>RitualCompletion ✅</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>MaterialsChecklist ✅</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Storage Utils ✅</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}