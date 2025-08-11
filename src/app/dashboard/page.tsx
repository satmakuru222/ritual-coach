'use client';

import { useEffect, useState } from 'react';
import { RitualProfile } from '@/types';
import MainLayout from '@/app/components/layout/MainLayout';
import { CheckCircle, Calendar, BookOpen, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<Partial<RitualProfile> | null>(null);

  useEffect(() => {
    // Load profile from localStorage
    const stored = localStorage.getItem('ritual_coach_profile');
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  if (!profile) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your spiritual dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout language={profile.language_pref}>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🙏</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Your Spiritual Journey!
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Your personalized Ritual Coach experience is ready. Let&apos;s begin your authentic Hindu practice.
          </p>
        </div>

        {/* Setup Complete */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Setup Complete!</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-orange-600 font-semibold">Tradition</div>
              <div className="text-gray-900">{profile.tradition}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-semibold">Region</div>
              <div className="text-gray-900">{profile.region}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-purple-600 font-semibold">Daily Practice</div>
              <div className="text-gray-900">{profile.duration_minutes} minutes</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <BookOpen className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Daily Ritual</h3>
            <p className="text-gray-600 text-sm">Begin your personalized practice</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Calendar className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Festivals</h3>
            <p className="text-gray-600 text-sm">Prepare for celebrations</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Learn Mantras</h3>
            <p className="text-gray-600 text-sm">Sacred chants and meanings</p>
          </div>
        </div>

        {/* Sacred Blessing */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 text-center">
          <div className="text-xl font-sanskrit mb-2 text-purple-800">
            ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
          </div>
          <div className="text-sm text-gray-600">
            &ldquo;May all beings be happy, may all be free from illness&rdquo;
          </div>
        </div>
      </div>
    </MainLayout>
  );
}