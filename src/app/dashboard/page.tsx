'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RitualProfile } from '@/types';
import MainLayout from '@/app/components/layout/MainLayout';
import { ritualStorage } from '@/lib/ritual/storage';
import { traditionLabels, regionLabels, getTraditionFlow } from '@/lib/traditions';
import { CheckCircle, Calendar, BookOpen, Sparkles, ArrowRight, TrendingUp, Clock, Target } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<RitualProfile | null>(null);
  const [todaysProgress, setTodaysProgress] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState({ completedDays: 0, totalDays: 0, completionRate: 0 });

  useEffect(() => {
    // Load profile from storage
    const savedProfile = ritualStorage.getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      
      // Load progress data
      const progress = ritualStorage.getTodaysProgress();
      setTodaysProgress(progress);
      
      const currentStreak = ritualStorage.getStreak();
      setStreak(currentStreak.current);
      
      const stats = ritualStorage.getMonthlyStats();
      setMonthlyStats(stats);
    } else {
      // No profile found, redirect to onboarding
      router.push('/onboarding');
    }
  }, [router]);

  const handleStartRitual = () => {
    router.push('/ritual');
  };

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

  const traditionFlow = getTraditionFlow(profile.tradition, profile.region);
  const estimatedTime = traditionFlow.steps.reduce((sum, step) => sum + (step.duration_minutes || 5), 0);
  const isRitualCompleted = todaysProgress?.isCompleted || false;

  return (
    <MainLayout language={profile.language_pref}>
      <div className="space-y-8">
        {/* Today's Ritual Status */}
        <div className={`rounded-xl p-8 text-center ${
          isRitualCompleted 
            ? 'bg-gradient-to-r from-green-100 to-emerald-100' 
            : 'bg-gradient-to-r from-orange-100 to-red-100'
        }`}>
          <div className="text-4xl mb-4">
            {isRitualCompleted ? '✨' : '🙏'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isRitualCompleted 
              ? 'Today\'s Practice Complete!' 
              : 'Ready for Today\'s Practice?'
            }
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
            {isRitualCompleted 
              ? 'Well done! Your spiritual practice brings peace and blessings.'
              : `Your ${traditionLabels[profile.tradition]} practice awaits. ${estimatedTime} minutes of sacred time.`
            }
          </p>
          
          {!isRitualCompleted && (
            <button
              onClick={handleStartRitual}
              className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg flex items-center justify-center gap-3 mx-auto"
            >
              <BookOpen className="w-6 h-6" />
              Start Today's Ritual
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Target className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">
              {todaysProgress?.completedSteps.length || 0}/{traditionFlow.steps.length}
            </div>
            <div className="text-sm text-gray-600">Today's Steps</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(monthlyStats.completionRate)}%
            </div>
            <div className="text-sm text-gray-600">Monthly Rate</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{profile.daily_time}</div>
            <div className="text-sm text-gray-600">Preferred Time</div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Your Practice</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-orange-600 font-semibold">Tradition</div>
              <div className="text-gray-900">{traditionLabels[profile.tradition]}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-semibold">Region</div>
              <div className="text-gray-900">{regionLabels[profile.region]}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-purple-600 font-semibold">Duration</div>
              <div className="text-gray-900">{profile.duration_minutes} minutes</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={handleStartRitual}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <BookOpen className="w-12 h-12 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isRitualCompleted ? 'Practice Again' : 'Start Daily Ritual'}
            </h3>
            <p className="text-gray-600 text-sm">
              {isRitualCompleted ? 'Review today\'s practice' : 'Begin your personalized practice'}
            </p>
          </button>
          
          <div 
            onClick={() => router.push('/festivals')}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <Calendar className="w-12 h-12 text-red-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Festivals</h3>
            <p className="text-gray-600 text-sm">Prepare for celebrations</p>
          </div>
          
          <div 
            onClick={() => router.push('/ritual/demo')}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore Components</h3>
            <p className="text-gray-600 text-sm">Test all ritual features</p>
          </div>
        </div>

        {/* Weekly Progress */}
        {monthlyStats.completedDays > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">This Month's Progress</h3>
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {monthlyStats.completedDays}/{monthlyStats.totalDays}
                </div>
                <div className="text-sm text-gray-600">Days Completed</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(monthlyStats.completionRate)}%
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${monthlyStats.completionRate}%` }}
              />
            </div>
          </div>
        )}

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