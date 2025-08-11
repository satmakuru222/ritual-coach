'use client';

import Navigation from './Navigation';
import { Language } from '@/types';

interface MainLayoutProps {
  children: React.ReactNode;
  language?: Language;
}

export default function MainLayout({ children, language = 'en' }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation language={language} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-gray-600 text-sm">
                Built with reverence for Hindu traditions
              </span>
              <span className="text-orange-500">🙏</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>ॐ शान्ति शान्ति शान्तिः</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}