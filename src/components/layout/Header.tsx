'use client';

import React from 'react';
import Link from 'next/link';
import { useMSOLStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { ChevronDown, Globe, LogOut, Play, Menu, X } from 'lucide-react';
import type { UserRole } from '@/lib/types';

const roleLabels: Record<UserRole, string> = {
  state_admin: 'State Admin (MSINS)',
  district_officer: 'District Skill Officer',
  training_provider: 'Training Provider',
  employer: 'Employer',
  counsellor: 'Counsellor',
  trainee: 'Trainee',
};

export default function Header() {
  const {
    currentUser,
    isLoggedIn,
    language,
    setLanguage,
    loginAsRole,
    logout,
    startGuidedDemo,
    mobileSidebarOpen,
    toggleMobileSidebar,
  } = useMSOLStore();
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  return (
    <>
      {/* Ashoka Header */}
      <header className="ashoka-header">
        <div className="max-w-[1440px] mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Left: Mobile Toggle + Emblem + Govt name */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn && currentUser && (
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={mobileSidebarOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {/* Ashoka Lion Emblem */}
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold flex-shrink-0">
              ☸
            </div>
            <div className="hidden sm:block">
              <div className="text-xs opacity-80">{t('header.govt', language)}</div>
              <div className="text-[10px] opacity-60 max-w-xs leading-tight hidden md:block">
                {t('header.dept', language)}
              </div>
            </div>

            {/* MSOL Title */}
            <div className="ml-2 sm:ml-3 pl-2 sm:pl-3 border-l border-white/20">
              <Link
                href={isLoggedIn ? (currentUser?.role === 'trainee' ? '/me' : '/dashboard') : '/'}
                className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity"
              >
                {t('header.msol', language)}
              </Link>
              <div className="text-[10px] opacity-70 hidden sm:block">{t('header.tagline', language)}</div>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'en' ? 'मराठी' : 'English'}
            </button>

            {isLoggedIn && currentUser && (
              <>
                {/* Guided Demo */}
                <button
                  onClick={startGuidedDemo}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-saffron-400/90 text-navy-950 hover:bg-saffron-400 transition-colors"
                  aria-label="Start Guided Demo"
                >
                  <Play className="w-3 h-3" />
                  <span className="hidden sm:inline">▶ Guided Demo</span>
                </button>

                {/* Role Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
                    aria-expanded={roleMenuOpen}
                    aria-haspopup="menu"
                    aria-label="User menu and role switcher"
                  >
                    <div className="w-6 h-6 rounded-full bg-saffron-400 text-navy-950 flex items-center justify-center text-[10px] font-bold">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="hidden md:inline">{currentUser.name}</span>
                    <span className="text-[10px] opacity-70 hidden lg:inline">({roleLabels[currentUser.role]})</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {roleMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1">
                      <div className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Switch Role (Demo)</div>
                      {(Object.keys(roleLabels) as UserRole[]).map(role => (
                        <button
                          key={role}
                          onClick={() => { loginAsRole(role); setRoleMenuOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-navy-50 transition-colors flex items-center justify-between ${
                            currentUser.role === role ? 'bg-navy-50 text-navy-900 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {roleLabels[role]}
                          {currentUser.role === role && <span className="text-xs text-saffron-500">●</span>}
                        </button>
                      ))}
                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={() => { logout(); setRoleMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          {t('nav.logout', language)}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isLoggedIn && (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-saffron-400 text-navy-950 hover:bg-saffron-300 transition-colors"
              >
                {t('nav.login', language)}
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
