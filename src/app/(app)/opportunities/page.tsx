'use client';

import React from 'react';
import { useMSOLStore, employers } from '@/lib/store';
import { Briefcase, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function OpportunitiesRegistryPage() {
  const { opportunities } = useMSOLStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-saffron-500" /> Opportunities Catalog
          </h1>
          <p className="text-gray-600">Active jobs and internships available for matching.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map(opp => {
          const emp = employers.find(e => e.id === opp.employerId);

          return (
            <div key={opp.id} className="card p-6 flex flex-col h-full hover:border-navy-300 transition-colors border-t-4" style={{ borderTopColor: opp.kind === 'JOB' ? '#10b981' : '#3b82f6' }}>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  opp.kind === 'JOB' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {opp.kind}
                </span>
                <span className="text-xs text-gray-400">Posted: {formatDate(opp.postedAt)}</span>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-bold text-navy-900">{opp.title}</h3>
                  <p className="text-sm font-medium text-gray-700 mt-1">{emp?.name || opp.employerId}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {opp.district}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Wage/Stipend:</span>
                    <span className="font-semibold text-emerald-700">{opp.stipendOrWageBand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Openings:</span>
                    <span className="font-medium text-navy-900">{opp.openings}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.skillTagsRequired.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {opportunities.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed rounded-lg">
            No opportunities posted yet.
          </div>
        )}
      </div>
    </div>
  );
}
