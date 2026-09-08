'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useMSOLStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GuidedDemo from '@/components/layout/GuidedDemo';
import SahayakFab from '@/components/trainee/SahayakFab';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, currentUser } = useMSOLStore();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-navy-200 border-t-navy-700 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Breadcrumb segments
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="px-6 py-2 border-b border-gray-100 bg-white">
              <nav className="flex items-center gap-1.5 text-xs text-gray-400">
                <Link
                  href={currentUser.role === 'trainee' ? '/me' : '/dashboard'}
                  className="hover:text-navy-700"
                >
                  Home
                </Link>
                {breadcrumbs.map(bc => (
                  <React.Fragment key={bc.href}>
                    <span>/</span>
                    {bc.isLast ? (
                      <span className="text-navy-900 font-medium">{bc.label}</span>
                    ) : (
                      <Link href={bc.href} className="hover:text-navy-700">{bc.label}</Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>
          )}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      <SahayakFab />
      <GuidedDemo />
    </div>
  );
}
