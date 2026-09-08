'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useMSOLStore } from '@/lib/store';
import SahayakChat from './SahayakChat';
import { Bot } from 'lucide-react';

const TRAINEE_FAB_ROUTES = [
  '/me',
  '/me/passport',
  '/me/assess',
  '/me/gaps',
  '/me/roadmap',
  '/me/internships',
  '/me/jobs',
  '/me/growth',
  '/me/resources',
  '/privacy',
  '/settings',
];

export default function SahayakFab() {
  // All hooks MUST come before any early returns (Rules of Hooks)
  const { currentUser, language } = useMSOLStore();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus first input when chat opens
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const inputEl = panelRef.current.querySelector('input');
      inputEl?.focus();
    }
  }, [isOpen]);

  // --- Gate checks (after all hooks) ---

  // Role gate: Trainee only
  if (!currentUser || currentUser.role !== 'trainee') {
    return null;
  }

  // Do not show FAB on /me/chat because the user is already on the full chat page
  if (pathname === '/me/chat') {
    return null;
  }

  // Check if current route is allowed
  const isAllowedRoute = TRAINEE_FAB_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  if (!isAllowedRoute) {
    return null;
  }

  return (
    <div className="no-print">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-navy-900 text-white rounded-full shadow-2xl hover:bg-navy-800 hover:scale-105 transition-all duration-200 border-2 border-saffron-400 group cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-saffron-400/50"
          aria-label="Open MSOL Sahayak Assistant"
          title="MSOL Sahayak (सहायक)"
        >
          <div className="w-8 h-8 rounded-full bg-saffron-500/20 text-saffron-400 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-left pr-1">
            <div className="text-xs font-bold leading-tight flex items-center gap-1">
              MSOL Sahayak <span className="text-saffron-400 font-semibold text-[11px]">(सहायक)</span>
            </div>
            <div className="text-[10px] text-navy-200">
              {language === 'mr' ? 'करिअर सहाय्यक' : 'Ask about gaps & jobs'}
            </div>
          </div>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="MSOL Sahayak Career Assistant"
          className="fixed bottom-4 right-4 z-50 w-[94vw] sm:w-[460px] max-h-[90vh] shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          <SahayakChat mode="fab" onCloseFab={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
