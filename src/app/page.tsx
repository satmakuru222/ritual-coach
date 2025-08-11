'use client';

import { useState } from 'react';
import { traditionLabels, regionLabels } from '@/lib/traditions';
import { languages, useTranslation } from '@/lib/i18n';
import { Language } from '@/types';
import { ChevronDown } from 'lucide-react';

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const { t } = useTranslation(selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ॐ</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Ritual Coach</h1>
            </div>
            
            {/* Language Selector */}
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t('onboarding.welcome')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your AI-powered guide to authentic Hindu rituals, festivals, and daily spiritual practices
            </p>
            <div className="text-2xl font-sanskrit text-orange-600">
              ॐ गं गणपतये नमः
            </div>
          </div>

          {/* Foundation Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Available Traditions */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Available Traditions
              </h3>
              <div className="space-y-2">
                {Object.entries(traditionLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Support */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Regional Support
              </h3>
              <div className="space-y-2">
                {Object.entries(regionLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Support */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t('onboarding.select_language')}
              </h3>
              <div className="space-y-2">
                {Object.entries(languages).map(([key, name]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedLanguage === key ? 'bg-purple-500' : 'bg-purple-300'
                    }`}></div>
                    <span className={`${
                      selectedLanguage === key ? 'text-purple-700 font-medium' : 'text-gray-700'
                    }`}>
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Foundation Features Demo */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Foundation Features Status
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="text-sm font-medium text-green-700">TypeScript Types</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="text-sm font-medium text-green-700">i18n System</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="text-sm font-medium text-green-700">Tailwind CSS</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="text-sm font-medium text-green-700">API Routes</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Multi-Script Font Test</h4>
              <div className="space-y-2">
                <div className="font-telugu text-lg">
                  తెలుగు: శ్రీ గణేశాయ నమః
                </div>
                <div className="font-devanagari text-lg">
                  देवनागरी: श्री गणेशाय नमः
                </div>
                <div className="font-sanskrit text-lg italic">
                  IAST: śrī gaṇeśāya namaḥ
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Layout Test */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg p-6 text-center">
              <h4 className="font-semibold text-orange-900 mb-2">Mobile First</h4>
              <p className="text-sm text-orange-700">Responsive design working on all screen sizes</p>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-lg p-6 text-center">
              <h4 className="font-semibold text-red-900 mb-2">Tablet</h4>
              <p className="text-sm text-red-700">Grid adapts beautifully for medium screens</p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-6 text-center sm:col-span-2 lg:col-span-1">
              <h4 className="font-semibold text-purple-900 mb-2">Desktop</h4>
              <p className="text-sm text-purple-700">Full layout with optimal spacing</p>
            </div>
          </div>

          {/* Start Onboarding Button */}
          <div className="text-center">
            <div className="space-y-4">
              <button
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => window.location.href = '/test'}
              >
                🧪 Test Foundation Components
              </button>
              <div className="text-center">
                <button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
                  onClick={() => window.location.href = '/onboarding'}
                >
                  {t('onboarding.complete_setup')}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Test all foundation components first, then proceed to onboarding
            </p>
          </div>

          {/* Sacred Blessing */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 text-center">
            <div className="text-xl font-sanskrit mb-2 text-purple-800">
              ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः।
              सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥
            </div>
            <div className="text-sm text-gray-600 italic">
              &ldquo;May all beings be happy, may all be free from illness. May all see what is auspicious, may no one suffer.&rdquo;
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            Foundation setup complete • Built with reverence for Hindu traditions 🙏
          </div>
        </div>
      </footer>
    </div>
  );
}
