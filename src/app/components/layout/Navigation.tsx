'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, BookOpen, Users, Settings, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface NavigationProps {
  language?: 'en' | 'te' | 'hi';
}

export default function Navigation({ language = 'en' }: NavigationProps) {
  const pathname = usePathname();
  const { t } = useTranslation(language);

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Dashboard',
      description: 'Daily rituals and overview',
    },
    {
      href: '/rituals',
      icon: BookOpen,
      label: t('ritual.daily_ritual'),
      description: 'Daily pūjā guidance',
    },
    {
      href: '/festivals',
      icon: Calendar,
      label: t('festival.upcoming_festivals'),
      description: 'Festival preparation',
    },
    {
      href: '/mantras',
      icon: Sparkles,
      label: t('mantra.mantras'),
      description: 'Sacred chants and meanings',
    },
    {
      href: '/kids',
      icon: Users,
      label: t('kids.kids_mode'),
      description: 'Child-friendly guidance',
    },
    {
      href: '/settings',
      icon: Settings,
      label: 'Settings',
      description: 'Preferences and profile',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ॐ</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Ritual Coach</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                      flex items-center space-x-2
                      ${isActive(item.href)
                        ? 'bg-orange-100 text-orange-700 border-b-2 border-orange-500'
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                      }
                    `}
                    title={item.description}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - hidden by default */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                  flex items-center space-x-2
                  ${isActive(item.href)
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}