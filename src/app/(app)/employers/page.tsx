'use client';

import React from 'react';
import Link from 'next/link';
import { employers } from '@/lib/store';
import { useMSOLStore } from '@/lib/store';
import { Building2, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';

export default function EmployersPage() {
  const { outcomeEvents } = useMSOLStore();

  const employerStats = employers.map(emp => {
    const placedWith = outcomeEvents.filter(o => o.employerId === emp.id && ['PLACED', 'RETAINED'].includes(o.type));
    const confirmed = placedWith.filter(o => o.confidence === 'EMPLOYER_CONFIRMED').length;
    return {
      ...emp,
      totalPlacements: placedWith.length,
      confirmed,
      pending: placedWith.length - confirmed,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Employers</h1>
          <p className="text-sm text-gray-500">{employers.length} registered employers</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employerStats.map(emp => (
          <div key={emp.id} className="card card-hover">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-navy-600" />
              </div>
              <span className={`chip ${emp.confirmationRate > 70 ? 'chip-verified' : emp.confirmationRate > 40 ? 'chip-self-reported' : 'chip-at-risk'}`}>
                {emp.confirmationRate}% confirm rate
              </span>
            </div>
            <h3 className="text-sm font-semibold text-navy-900">{emp.name}</h3>
            <p className="text-xs text-gray-500">{emp.district} • {emp.sector}</p>
            <p className="text-xs text-gray-400 font-mono mt-1">GSTIN: {emp.gstin}</p>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-bold text-navy-900">{emp.totalPlacements}</div>
                <div className="text-[10px] text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600">{emp.confirmed}</div>
                <div className="text-[10px] text-gray-500">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-600">{emp.pending}</div>
                <div className="text-[10px] text-gray-500">Pending</div>
              </div>
            </div>

            {emp.pending > 0 && (
              <Link
                href={`/employers/verify/demo-token`}
                className="mt-3 flex items-center justify-center gap-1 py-2 rounded-lg bg-saffron-50 text-saffron-700 text-xs font-medium hover:bg-saffron-100 transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> Verify Placements
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
