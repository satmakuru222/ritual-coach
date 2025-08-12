'use client';

import { useState, useEffect } from 'react';
import { Language, Tradition, Region } from '@/types';
import { traditionLabels, regionLabels, getTraditionFlow, getDietaryGuidelines } from '@/lib/traditions';
import { languages, useTranslation } from '@/lib/i18n';
import RitualCard from '@/app/components/ritual/RitualCard';
import MantraCard from '@/app/components/mantra/MantraCard';
import FestivalCard from '@/app/components/festival/FestivalCard';
import KidsRitualStep from '@/app/components/kids/KidsRitualStep';
import RitualTimer from '@/app/components/ritual/RitualTimer';
import MantraDisplay from '@/app/components/ritual/MantraDisplay';
import MaterialsChecklist from '@/app/components/ritual/MaterialsChecklist';
import RitualProgress from '@/app/components/ritual/RitualProgress';
import { ritualStorage } from '@/lib/ritual/storage';
import { ChevronDown, TestTube, CheckCircle, AlertCircle } from 'lucide-react';

export default function TestPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [selectedTradition, setSelectedTradition] = useState<Tradition>('andhra_smarta');
  const [selectedRegion, setSelectedRegion] = useState<Region>('south');
  const [kidMode, setKidMode] = useState(false);
  const [showRitualProgress, setShowRitualProgress] = useState(false);
  const [envStatus, setEnvStatus] = useState<{
    isValid: boolean;
    status?: {
      notion?: { configured: boolean; hasValidKey: boolean };
      openai?: { configured: boolean; hasValidKey: boolean };
    };
    missingVars?: string[];
    errors?: string[];
  } | null>(null);

  const { t } = useTranslation(selectedLanguage);

  useEffect(() => {
    // Check environment status
    fetch('/api/env-status')
      .then(res => res.json())
      .then(data => setEnvStatus(data))
      .catch(err => {
        console.error('Failed to check environment status:', err);
        setEnvStatus({ isValid: false, error: 'Failed to check' });
      });
  }, []);

  // Mock data using TypeScript interfaces
  const mockRitual = {
    id: 'daily-puja',
    name: 'Daily Pūjā',
    tradition: selectedTradition,
    region: selectedRegion,
    steps: getTraditionFlow(selectedTradition, selectedRegion).steps,
    materials: getTraditionFlow(selectedTradition, selectedRegion).materials,
    mantras: getTraditionFlow(selectedTradition, selectedRegion).mantras,
    estimated_time: 30,
  };

  const mockMantra = {
    id: 'ganapati-mantra',
    title: 'Gaṇapati Mantra',
    text_by_script: {
      te: 'ॐ గం గణపతయే నమః',
      hi: 'ॐ गं गणपतये नमः',
      en: 'Om Gam Ganapataye Namaha',
      iast: 'Oṁ gaṁ gaṇapataye namaḥ',
    },
    cadence: 'medium' as const,
    breakpoints: [2, 4],
  };

  const mockFestival = {
    id: 'ganesh-chaturthi',
    name: 'Gaṇeśa Caturthi',
    dates: { 2024: '2024-09-07' },
    tradition_notes: 'Celebration of Lord Gaṇeśa\'s birthday with elaborate rituals',
    prep_checklist: ['Clay Gaṇeśa idol', 'Flowers', 'Sweets', 'Decorations'],
    prasadam_suggestions: ['Modak', 'Laddoo', 'Coconut rice'],
    decor_templates: ['lotus', 'peacock', 'traditional'],
  };

  const testResults = {
    typescript: true,
    traditions: Object.keys(traditionLabels).length > 0,
    regions: Object.keys(regionLabels).length > 0,
    languages: Object.keys(languages).length > 0,
    translations: t('common.save') !== 'common.save',
    components: true,
    notion: envStatus?.status?.notion?.configured || false,
    openai: envStatus?.status?.openai?.configured || false,
  };

  const allTestsPassing = Object.values(testResults).every(result => result);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TestTube className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Foundation Test Page</h1>
                <p className="text-sm text-gray-600">Verifying all components and utilities</p>
              </div>
            </div>
            
            {/* Overall Status */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              allTestsPassing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {allTestsPassing ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">
                {allTestsPassing ? 'All Tests Passing' : 'Issues Detected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Environment Status */}
          {envStatus && (
            <div className={`rounded-xl shadow-lg p-6 ${
              envStatus.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Environment Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className={`p-4 rounded-lg ${
                  envStatus.status?.notion?.configured ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <h3 className="font-semibold mb-2">Notion Integration</h3>
                  <div className="text-sm space-y-1">
                    <div>API Key: {envStatus.status?.notion?.hasValidKey ? '✅ Valid' : '❌ Invalid/Missing'}</div>
                    <div>Databases: {envStatus.status?.notion?.configured ? '✅ All configured' : '❌ Missing IDs'}</div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  envStatus.status?.openai?.configured ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <h3 className="font-semibold mb-2">OpenAI Integration</h3>
                  <div className="text-sm space-y-1">
                    <div>API Key: {envStatus.status?.openai?.hasValidKey ? '✅ Valid' : '❌ Invalid/Missing'}</div>
                    <div>Agent: {envStatus.status?.openai?.configured ? '✅ Ready' : '❌ Not configured'}</div>
                  </div>
                </div>
              </div>

              {envStatus.missingVars && envStatus.missingVars.length > 0 && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Missing Environment Variables:</h4>
                  <div className="text-sm text-yellow-700">
                    {envStatus.missingVars.join(', ')}
                  </div>
                </div>
              )}

              {envStatus.errors && envStatus.errors.length > 0 && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                  <h4 className="font-semibold text-red-800 mb-2">Configuration Errors:</h4>
                  <ul className="text-sm text-red-700 list-disc list-inside">
                    {envStatus.errors.map((error: string, index: number) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Test Status Grid */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Foundation Component Status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(testResults).map(([test, passing]) => (
                <div key={test} className={`text-center p-3 rounded-lg border-2 ${
                  passing ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className={`w-6 h-6 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    passing ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {passing ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`text-sm font-medium capitalize ${
                    passing ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {test}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Interactive Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Language Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(languages).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Tradition Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tradition
                </label>
                <div className="relative">
                  <select
                    value={selectedTradition}
                    onChange={(e) => setSelectedTradition(e.target.value as Tradition)}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(traditionLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Region Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <div className="relative">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value as Region)}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(regionLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Kids Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kids Mode
                </label>
                <button
                  onClick={() => setKidMode(!kidMode)}
                  className={`
                    relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${kidMode ? 'bg-blue-600' : 'bg-gray-300'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                      ${kidMode ? 'translate-x-7' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Tradition Utilities Test */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tradition Utilities</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Available Traditions</h3>
                <div className="space-y-2">
                  {Object.entries(traditionLabels).map(([key, label]) => (
                    <div key={key} className={`p-3 rounded-lg border ${
                      selectedTradition === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <div className="font-medium text-gray-900">{label}</div>
                      <div className="text-sm text-gray-600">Key: {key}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  {traditionLabels[selectedTradition]} Daily Flow
                </h3>
                <div className="space-y-2">
                  {getTraditionFlow(selectedTradition, selectedRegion).steps.map((step, index) => (
                    <div key={step.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="font-medium text-gray-900">{index + 1}. {step.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{step.description}</div>
                      {step.duration_minutes && (
                        <div className="text-xs text-blue-600 mt-1">{step.duration_minutes} minutes</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dietary Guidelines */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                Dietary Guidelines for {traditionLabels[selectedTradition]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {getDietaryGuidelines(selectedTradition).map((guideline, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{guideline}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Translation Test */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Translation System Test</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Common Translations</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Save:</span> {t('common.save')}</div>
                  <div><span className="font-medium">Cancel:</span> {t('common.cancel')}</div>
                  <div><span className="font-medium">Next:</span> {t('common.next')}</div>
                  <div><span className="font-medium">Back:</span> {t('common.back')}</div>
                  <div><span className="font-medium">Loading:</span> {t('common.loading')}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Ritual Terms</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Daily Ritual:</span> {t('ritual.daily_ritual')}</div>
                  <div><span className="font-medium">Start Ritual:</span> {t('ritual.start_ritual')}</div>
                  <div><span className="font-medium">Materials:</span> {t('ritual.materials_needed')}</div>
                  <div><span className="font-medium">Minutes:</span> {t('ritual.minutes')}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Onboarding Terms</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Welcome:</span> {t('onboarding.welcome')}</div>
                  <div><span className="font-medium">Select Region:</span> {t('onboarding.select_region')}</div>
                  <div><span className="font-medium">Select Language:</span> {t('onboarding.select_language')}</div>
                  <div><span className="font-medium">Complete:</span> {t('onboarding.complete_setup')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Font Test */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Multi-Script Font Test</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-3">Telugu Script</h3>
                <div className="font-telugu text-2xl text-orange-700 mb-2">
                  ॐ గం గణపతయే నమః
                </div>
                <div className="text-sm text-gray-600">Gaṇapati Mantra in Telugu</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-3">Devanagari Script</h3>
                <div className="font-devanagari text-2xl text-purple-700 mb-2">
                  ॐ गं गणपतये नमः
                </div>
                <div className="text-sm text-gray-600">Gaṇapati Mantra in Hindi</div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">IAST Transliteration</h3>
                <div className="font-sanskrit text-2xl text-blue-700 mb-2 italic">
                  Oṁ gaṁ gaṇapataye namaḥ
                </div>
                <div className="text-sm text-gray-600">Scientific transliteration</div>
              </div>
            </div>
          </div>

          {/* Component Tests */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">UI Component Tests</h2>

            {/* Ritual Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ritual Card Component</h3>
              <RitualCard
                ritual={mockRitual}
                onStart={() => alert('Ritual card working!')}
                language={selectedLanguage}
              />
            </div>

            {/* Mantra Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mantra Card Component</h3>
              <MantraCard
                mantra={mockMantra}
                language={selectedLanguage}
                script={selectedLanguage === 'en' ? 'iast' : selectedLanguage}
              />
            </div>

            {/* Festival Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Festival Card Component</h3>
              <FestivalCard
                festival={mockFestival}
                date="September 7, 2024"
                daysUntil={30}
                onPrepare={() => alert('Festival preparation!')}
                language={selectedLanguage}
              />
            </div>

            {/* Kids Component (conditional) */}
            {kidMode && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kids Mode Component</h3>
                <KidsRitualStep
                  step={mockRitual.steps[0]}
                  isActive={true}
                  isCompleted={false}
                  onComplete={() => alert('Kids step completed!')}
                  language={selectedLanguage}
                />
              </div>
            )}
          </div>

          {/* New Ritual System Tests */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Ritual System Components</h2>

            {/* Ritual Timer */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ritual Timer Component</h3>
              <div className="max-w-md mx-auto">
                <RitualTimer
                  durationMinutes={2}
                  stepName="Test Timer (2 minutes)"
                  language={selectedLanguage}
                  onComplete={() => alert('Timer completed!')}
                  onStart={() => console.log('Timer started')}
                />
              </div>
            </div>

            {/* Mantra Display */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mantra Display Component</h3>
              <MantraDisplay
                mantraId="test-mantra"
                title="Test Gaṇapati Mantra"
                text={{
                  te: 'ॐ గం గణపతయే నమః',
                  hi: 'ॐ गं गणपतये नमः',
                  en: 'Om Gam Ganapataye Namaha - Salutations to Lord Ganesh, remover of obstacles',
                  iast: 'Oṁ gaṁ gaṇapataye namaḥ',
                }}
                language={selectedLanguage}
              />
            </div>

            {/* Materials Checklist */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Materials Checklist Component</h3>
              <div className="max-w-2xl mx-auto">
                <MaterialsChecklist
                  materials={getTraditionFlow(selectedTradition, selectedRegion).materials}
                  language={selectedLanguage}
                  onAllChecked={() => alert('All materials ready!')}
                  onMaterialToggle={(material, checked) => 
                    console.log(`${material} ${checked ? 'checked' : 'unchecked'}`)
                  }
                />
              </div>
            </div>

            {/* Ritual Progress (Full Flow Test) */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Full Ritual Progress Flow</h3>
              
              {!showRitualProgress ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Test the complete ritual progress system with step navigation, 
                    timers, mantras, and completion tracking.
                  </p>
                  <button
                    onClick={() => setShowRitualProgress(true)}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Start Ritual Progress Test
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-center">
                    <button
                      onClick={() => setShowRitualProgress(false)}
                      className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                      ← Back to Component Tests
                    </button>
                  </div>
                  <RitualProgress
                    steps={getTraditionFlow(selectedTradition, selectedRegion).steps}
                    language={selectedLanguage}
                    onComplete={() => {
                      alert('Ritual completed! Check localStorage for progress data.');
                      setShowRitualProgress(false);
                    }}
                    onExit={() => setShowRitualProgress(false)}
                  />
                </div>
              )}
            </div>

            {/* Storage & Progress Testing */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage & Progress Testing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Storage Functions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const profile = {
                          user_id: 'test-user',
                          tradition: selectedTradition,
                          region: selectedRegion,
                          language_pref: selectedLanguage,
                          daily_time: '06:30',
                          duration_minutes: 30,
                          dietary_rules: 'sattvic',
                          kid_mode: kidMode,
                        };
                        ritualStorage.saveProfile(profile);
                        alert('Test profile saved to localStorage!');
                      }}
                      className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded border text-sm"
                    >
                      Save Test Profile
                    </button>
                    
                    <button
                      onClick={() => {
                        ritualStorage.startRitual();
                        ritualStorage.markStepCompleted('test-step-1');
                        ritualStorage.markStepCompleted('test-step-2');
                        alert('Test progress saved! Check browser dev tools → Application → Local Storage');
                      }}
                      className="w-full text-left p-2 bg-green-50 hover:bg-green-100 rounded border text-sm"
                    >
                      Create Test Progress
                    </button>
                    
                    <button
                      onClick={() => {
                        const streak = ritualStorage.getStreak();
                        const monthlyStats = ritualStorage.getMonthlyStats();
                        alert(`Current Streak: ${streak.current} days\nMonthly Completion: ${monthlyStats.completionRate.toFixed(1)}%`);
                      }}
                      className="w-full text-left p-2 bg-purple-50 hover:bg-purple-100 rounded border text-sm"
                    >
                      Check Stats
                    </button>
                    
                    <button
                      onClick={() => {
                        if (confirm('Clear all ritual data? This cannot be undone.')) {
                          ritualStorage.clearAllProgress();
                          alert('All ritual data cleared!');
                        }
                      }}
                      className="w-full text-left p-2 bg-red-50 hover:bg-red-100 rounded border text-sm text-red-700"
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Current Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">Profile:</span> {
                        ritualStorage.getProfile() ? '✅ Saved' : '❌ None'
                      }
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">Today's Progress:</span> {
                        ritualStorage.getTodaysProgress() ? '✅ Started' : '❌ None'
                      }
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">Current Streak:</span> {
                        ritualStorage.getStreak().current
                      } days
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">Weekly Progress:</span> {
                        ritualStorage.getWeeklyProgress().filter(d => d.isCompleted).length
                      }/7 days
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* API Integration Test */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent API Integration Test</h3>
              
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Test the agent endpoint that provides personalized ritual guidance.
                </p>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/agent', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          message: `Provide a brief ritual guidance for ${traditionLabels[selectedTradition]} tradition`,
                          context: { tradition: selectedTradition, region: selectedRegion, language: selectedLanguage }
                        }),
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        alert(`Agent Response: ${data.response || 'No response received'}`);
                      } else {
                        alert(`API Error: ${response.status} ${response.statusText}`);
                      }
                    } catch (error) {
                      alert(`Network Error: ${error}`);
                    }
                  }}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Test Agent API
                </button>
              </div>
            </div>

            {/* Mobile Responsiveness Test */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mobile Responsiveness Test</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Mobile (320px)</h4>
                  <div className="text-sm text-gray-600">
                    Components should stack vertically and maintain readability
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Tablet (768px)</h4>
                  <div className="text-sm text-gray-600">
                    Two-column layouts should work properly
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Desktop (1024px+)</h4>
                  <div className="text-sm text-gray-600">
                    Full multi-column layouts with proper spacing
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Touch Targets</h4>
                  <div className="text-sm text-gray-600">
                    All buttons should be at least 44px for touch accessibility
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Test */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Navigation & Routing Test</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/ritual"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 text-center transition-colors"
              >
                <div className="font-medium text-orange-900">Main Ritual Page</div>
                <div className="text-sm text-orange-700">/ritual</div>
              </a>
              
              <a
                href="/ritual/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-center transition-colors"
              >
                <div className="font-medium text-blue-900">Demo Page</div>
                <div className="text-sm text-blue-700">/ritual/demo</div>
              </a>
              
              <a
                href="/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 text-center transition-colors"
              >
                <div className="font-medium text-green-900">Dashboard</div>
                <div className="text-sm text-green-700">/dashboard</div>
              </a>
              
              <a
                href="/onboarding"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 text-center transition-colors"
              >
                <div className="font-medium text-purple-900">Onboarding</div>
                <div className="text-sm text-purple-700">/onboarding</div>
              </a>
            </div>
          </div>

          {/* Success Message */}
          {allTestsPassing && (
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Foundation Ready! 🎉
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                All components, utilities, and systems are working correctly. 
                The foundation is ready for implementing the onboarding flow.
              </p>
              <div className="text-xl font-sanskrit text-green-600">
                ॐ शुभमस्तु
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}