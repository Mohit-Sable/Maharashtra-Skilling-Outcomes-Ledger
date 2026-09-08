'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMSOLStore } from '@/lib/store';
import SahayakChat from '@/components/trainee/SahayakChat';

export default function TraineeChatPage() {
  const { currentUser, isLoggedIn } = useMSOLStore();
  const router = useRouter();

  // Role Gate: currentUser.role === 'trainee' only. Non-trainee -> /dashboard.
  useEffect(() => {
    if (isLoggedIn && currentUser && currentUser.role !== 'trainee') {
      router.replace('/dashboard');
    }
  }, [isLoggedIn, currentUser, router]);

  if (!currentUser || currentUser.role !== 'trainee') {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center text-sm text-gray-500">
          Redirecting to authorized dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <SahayakChat mode="page" />
    </div>
  );
}
