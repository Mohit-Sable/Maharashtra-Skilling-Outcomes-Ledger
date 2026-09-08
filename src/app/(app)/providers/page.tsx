'use client';

import React from 'react';
import Link from 'next/link';
import { providers, providerScores, courses } from '@/lib/store';
import { useMSOLStore } from '@/lib/store';
import { wageBandLabel } from '@/lib/utils';
import { Landmark, AlertTriangle, ChevronRight, TrendingDown, CheckCircle2 } from 'lucide-react';

export default function ProvidersPage() {
  const { language } = useMSOLStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Institute Scorecards</h1>
        <p className="text-sm text-gray-500">{providers.length} registered colleges & polytechnics • TPO Paper vs Verified metrics</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map(prov => {
          const ps = providerScores.find(s => s.providerId === prov.id);
          if (!ps) return null;

          return (
            <Link key={prov.id} href={`/providers/${prov.id}`} className="card card-hover group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    ps.suspectedInflation ? 'bg-red-100' : 'bg-navy-50'
                  }`}>
                    <Landmark className={`w-5 h-5 ${ps.suspectedInflation ? 'text-red-600' : 'text-navy-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-navy-900 group-hover:text-saffron-600 transition-colors">{prov.name}</h3>
                    <p className="text-xs text-gray-500">{prov.district} • {prov.type}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-navy-600 transition-colors" />
              </div>

              {ps.suspectedInflation && (
                <div className="flex items-center gap-1.5 mb-3 p-2 rounded bg-red-50 border border-red-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs font-medium text-red-700">Suspected Inflation</span>
                </div>
              )}

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded bg-gray-50">
                  <div className="text-lg font-bold text-gray-500">{ps.placementRatePaper}%</div>
                  <div className="text-[10px] text-gray-400">TPO Paper Placement</div>
                </div>
                <div className={`p-2 rounded ${ps.placementRateVerified90d < ps.placementRatePaper * 0.6 ? 'bg-red-50' : 'bg-emerald-50'}`}>
                  <div className={`text-lg font-bold ${ps.placementRateVerified90d < ps.placementRatePaper * 0.6 ? 'text-red-600' : 'text-emerald-700'}`}>
                    {ps.placementRateVerified90d}%
                  </div>
                  <div className="text-[10px] text-gray-400">Verified 90d</div>
                </div>
                <div className="p-2 rounded bg-gray-50">
                  <div className="text-lg font-bold text-navy-900">{ps.retention90d}%</div>
                  <div className="text-[10px] text-gray-400">90d Retention</div>
                </div>
                <div className="p-2 rounded bg-gray-50">
                  <div className="text-lg font-bold text-navy-900">{ps.unreachable}%</div>
                  <div className="text-[10px] text-gray-400">Unreachable</div>
                </div>
              </div>

              {/* Quality bar */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Data Quality Score</span>
                  <span className="font-semibold">{ps.dataQualityScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${ps.dataQualityScore > 70 ? 'bg-emerald-500' : ps.dataQualityScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${ps.dataQualityScore}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
