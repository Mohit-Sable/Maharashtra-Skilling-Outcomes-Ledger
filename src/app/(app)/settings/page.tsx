'use client';

import React from 'react';
import { useMSOLStore } from '@/lib/store';
import { Settings, Globe, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { language, setLanguage, resetDemoData } = useMSOLStore();
  const [resetDone, setResetDone] = React.useState(false);

  const handleReset = () => {
    resetDemoData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-navy-700" />
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Settings / सेटिंग्ज</h1>
          <p className="text-sm text-gray-500">Language and demo controls</p>
        </div>
      </div>

      {/* Language */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-navy-600" />
          <h2 className="text-base font-semibold text-navy-900">Language / भाषा</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setLanguage('en')}
            className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
              language === 'en' ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:border-navy-300'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('mr')}
            className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
              language === 'mr' ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:border-navy-300'
            }`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* Reset Demo */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <RotateCcw className="w-5 h-5 text-navy-600" />
          <h2 className="text-base font-semibold text-navy-900">Demo Controls</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Reset all demo data to initial state. This will undo any outcome events or follow-ups you&apos;ve modified during the demo.
        </p>
        <button
          onClick={handleReset}
          className="btn-outline w-full justify-center border-red-300 text-red-700 hover:bg-red-50 hover:border-red-500"
        >
          <RotateCcw className="w-4 h-4" /> Reset Demo Data / डेमो डेटा रीसेट करा
        </button>
        {resetDone && (
          <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
            <CheckCircle2 className="w-4 h-4" /> Demo data reset successfully!
          </div>
        )}
      </div>
    </div>
  );
}
