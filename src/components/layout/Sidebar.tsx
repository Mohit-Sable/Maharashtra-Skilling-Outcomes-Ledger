'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMSOLStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import type { UserRole } from '@/lib/types';
import {
  LayoutDashboard, Users, PhoneForwarded, Building2, BarChart3,
  PieChart, BookOpen, FileText, Shield, Settings, ClipboardPlus,
  UserCircle, AlertTriangle, Landmark, BrainCircuit, Target, Briefcase, Map as MapIcon, TrendingUp, Search, Link2, Contact, MessageCircle, Video
} from 'lucide-react';

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { href: '/dashboard', labelKey: 'nav.dashboard', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['state_admin', 'district_officer', 'training_provider', 'employer', 'counsellor'] },
  { href: '/trainees', labelKey: 'nav.trainees', icon: <Users className="w-4 h-4" />, roles: ['state_admin', 'district_officer', 'training_provider', 'counsellor'] },
  { href: '/follow-ups', labelKey: 'nav.followups', icon: <PhoneForwarded className="w-4 h-4" />, roles: ['state_admin', 'district_officer', 'counsellor'] },
  { href: '/outcomes/new', labelKey: 'nav.outcomes', icon: <ClipboardPlus className="w-4 h-4" />, roles: ['state_admin', 'district_officer', 'training_provider', 'counsellor'] },
  { href: '/employers', labelKey: 'nav.employers', icon: <Building2 className="w-4 h-4" />, roles: ['state_admin', 'district_officer'] },
  { href: '/providers', labelKey: 'nav.providers', icon: <Landmark className="w-4 h-4" />, roles: ['state_admin', 'district_officer'] },
  
  // Phase 2: Passport & Matching
  { href: '/passport', labelKey: 'nav.passport', icon: <Contact className="w-4 h-4" />, roles: ['state_admin', 'district_officer', 'counsellor', 'training_provider'] },
  { href: '/assessments', labelKey: 'nav.assessments', icon: <BrainCircuit className="w-4 h-4" />, roles: ['state_admin', 'district_officer', 'counsellor'] },
  { href: '/matching', labelKey: 'nav.matching', icon: <Link2 className="w-4 h-4" />, roles: ['state_admin', 'district_officer', 'counsellor'] },
  { href: '/opportunities', labelKey: 'nav.opportunities', icon: <Briefcase className="w-4 h-4" />, roles: ['state_admin', 'district_officer', 'counsellor', 'training_provider'] },

  // Phase 2: Employers
  { href: '/employers/post', labelKey: 'nav.post_job', icon: <ClipboardPlus className="w-4 h-4" />, roles: ['employer'] },
  { href: '/employers/candidates', labelKey: 'nav.candidates', icon: <Search className="w-4 h-4" />, roles: ['employer'] },
  
  { href: '/analytics', labelKey: 'nav.analytics', icon: <BarChart3 className="w-4 h-4" />, roles: ['state_admin', 'district_officer', 'training_provider'] },
  { href: '/skill-gaps', labelKey: 'nav.skillgaps', icon: <PieChart className="w-4 h-4" />, roles: ['state_admin', 'district_officer'] },
  { href: '/policy', labelKey: 'nav.policy', icon: <FileText className="w-4 h-4" />, roles: ['state_admin', 'district_officer'] },
  
  { href: '/consent', labelKey: 'nav.consent', icon: <BookOpen className="w-4 h-4" />, roles: ['state_admin', 'training_provider'] },
  { href: '/providers/videos', labelKey: 'nav.skill_videos', icon: <Video className="w-4 h-4" />, roles: ['training_provider'] },
  { href: '/privacy', labelKey: 'nav.privacy', icon: <Shield className="w-4 h-4" />, roles: ['state_admin', 'district_officer', 'training_provider', 'employer', 'counsellor'] },
  { href: '/settings', labelKey: 'nav.settings', icon: <Settings className="w-4 h-4" />, roles: ['state_admin', 'district_officer', 'training_provider', 'employer', 'counsellor'] },
];

const traineeNavItems: NavItem[] = [
  { href: '/me', labelKey: 'nav.myprofile', icon: <UserCircle className="w-4 h-4" />, roles: ['trainee'] },
  { href: '/me/passport', labelKey: 'nav.passport', icon: <Contact className="w-4 h-4" />, roles: ['trainee'] },
  { href: '/me/assess', labelKey: 'nav.assessments', icon: <BrainCircuit className="w-4 h-4" />, roles: ['trainee'] },
  { href: '/me/gaps', labelKey: 'nav.skillgaps', icon: <Target className="w-4 h-4" />, roles: ['trainee'] },
  { href: '/me/roadmap', labelKey: 'nav.roadmap', icon: <MapIcon className="w-4 h-4" />, roles: ['trainee'] },
  { href: '/me/internships', labelKey: 'nav.internships', icon: <BookOpen className="w-4 h-4" />, roles: ['trainee'] },
  { href: '/me/jobs', labelKey: 'nav.jobs', icon: <Briefcase className="w-4 h-4" />, roles: ['trainee'] },
  { href: '/me/growth', labelKey: 'nav.growth', icon: <TrendingUp className="w-4 h-4" />, roles: ['trainee'] },
  { href: '/me/chat', labelKey: 'nav.sahayak', icon: <MessageCircle className="w-4 h-4" />, roles: ['trainee'] },
  { href: '/me/resources', labelKey: 'nav.resources', icon: <Video className="w-4 h-4" />, roles: ['trainee'] },
  { href: '/privacy', labelKey: 'nav.privacy', icon: <Shield className="w-4 h-4" />, roles: ['trainee'] },
  { href: '/settings', labelKey: 'nav.settings', icon: <Settings className="w-4 h-4" />, roles: ['trainee'] },
];

export default function Sidebar() {
  const { currentUser, language, mobileSidebarOpen, closeMobileSidebar } = useMSOLStore();
  const pathname = usePathname();

  if (!currentUser) return null;

  const items = currentUser.role === 'trainee' ? traineeNavItems : navItems;
  const filteredItems = items.filter(item => item.roles.includes(currentUser.role));

  // Group items
  const mainItems = filteredItems.filter(i => ['/dashboard', '/me', '/me/passport', '/me/assess', '/me/gaps', '/me/roadmap', '/me/internships', '/me/jobs', '/me/growth', '/me/chat', '/me/resources', '/trainees', '/follow-ups', '/outcomes/new', '/employers/post', '/employers/candidates'].includes(i.href));
  const dataItems = filteredItems.filter(i => ['/employers', '/providers', '/analytics', '/skill-gaps', '/policy', '/passport', '/assessments', '/matching', '/opportunities', '/providers/videos'].includes(i.href));
  const systemItems = filteredItems.filter(i => ['/consent', '/privacy', '/settings'].includes(i.href));

  const renderNavContent = (onItemClick?: () => void) => (
    <>
      {/* Role Badge */}
      <div className="px-3 py-2 mb-2 rounded-lg bg-navy-50 border border-navy-100">
        <div className="text-[10px] font-semibold text-navy-500 uppercase tracking-wider">Logged in as</div>
        <div className="text-sm font-semibold text-navy-900">{currentUser.name}</div>
        <div className="text-xs text-navy-600">{t(`role.${currentUser.role}`, language)}</div>
      </div>

      {/* Main Nav */}
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mt-2 mb-1">Main</div>
      {mainItems.map(item => {
        const isActive = item.href === '/me' ? pathname === '/me' : (pathname === item.href || pathname.startsWith(item.href + '/'));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`sidebar-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {t(item.labelKey, language)}
          </Link>
        );
      })}

      {dataItems.length > 0 && (
        <>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mt-4 mb-1">Data & Insights</div>
          {dataItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`sidebar-link ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
            >
              {item.icon}
              {t(item.labelKey, language)}
            </Link>
          ))}
        </>
      )}

      {systemItems.length > 0 && (
        <>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mt-4 mb-1">System</div>
          {systemItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`sidebar-link ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
            >
              {item.icon}
              {t(item.labelKey, language)}
            </Link>
          ))}
        </>
      )}

      {/* Integrity flags for admin */}
      {currentUser.role === 'state_admin' && (
        <div className="mt-4 mx-1 p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-center gap-1.5 text-red-800 text-xs font-semibold mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Integrity Alerts
          </div>
          <div className="text-2xl font-bold text-red-700">5</div>
          <div className="text-[10px] text-red-600">Requires review</div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="sidebar w-56 p-3 hidden md:flex flex-col gap-1 no-print">
        {renderNavContent()}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex no-print">
          <div
            className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />
          <aside className="relative w-64 max-w-[85vw] bg-white h-full p-4 flex flex-col gap-1 shadow-2xl z-10 overflow-y-auto border-r border-gray-200">
            {renderNavContent(closeMobileSidebar)}
          </aside>
        </div>
      )}
    </>
  );
}
