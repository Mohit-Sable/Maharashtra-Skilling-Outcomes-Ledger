'use client';

import React, { useState } from 'react';
import { useMSOLStore, trainees, employers } from '@/lib/store';
import { Link2, MapPin, Building2, UserCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Application } from '@/lib/types';

export default function MatchingWorkbenchPage() {
  const { applications, opportunities } = useMSOLStore();
  const [filter, setFilter] = useState<Application['status'] | 'ALL'>('ALL');

  const statuses: Application['status'][] = ['SUGGESTED', 'APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'JOINED'];

  const filtered = applications.filter(a => filter === 'ALL' || a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <Link2 className="w-6 h-6 text-emerald-500" /> Matching Workbench
          </h1>
          <p className="text-gray-600">Track candidates through the AI matching and hiring funnel.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'ALL' ? 'bg-navy-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
        >
          All Applications ({applications.length})
        </button>
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === s ? 'bg-navy-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            {s} ({applications.filter(a => a.status === s).length})
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(app => {
          const opp = opportunities.find(o => o.id === app.opportunityId);
          const trainee = trainees.find(t => t.id === app.traineeId);
          if (!opp || !trainee) return null;

          return (
            <div key={app.id} className="card p-6 flex flex-col h-full border-t-4" style={{ borderTopColor: app.status === 'JOINED' ? '#10b981' : app.status === 'REJECTED' ? '#ef4444' : '#f59e0b' }}>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  app.status === 'JOINED' ? 'bg-emerald-100 text-emerald-800' :
                  app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-saffron-100 text-saffron-800'
                }`}>
                  {app.status}
                </span>
                <span className="text-sm font-bold text-navy-900">Score: {app.matchScore}%</span>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-bold text-navy-900 flex items-center gap-2"><UserCircle className="w-4 h-4 text-gray-400" /> {trainee.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">MSOL ID: {trainee.id}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" /> {opp.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {opp.district}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                Updated: {formatDate(app.updatedAt)}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed rounded-lg">
            No applications match this status.
          </div>
        )}
      </div>
    </div>
  );
}
