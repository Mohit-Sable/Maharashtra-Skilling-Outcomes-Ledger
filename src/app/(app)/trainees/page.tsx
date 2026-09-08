'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { trainees, enrolments, courses } from '@/lib/store';
import { useMSOLStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { confidenceLabel, formatDate, getInitials } from '@/lib/utils';
import { Search, Filter, Users, ChevronRight } from 'lucide-react';
import type { OutcomeType } from '@/lib/types';

export default function TraineesPage() {
  const { language, outcomeEvents } = useMSOLStore();
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const districts = [...new Set(trainees.map(t => t.district))];

  const getLatestOutcome = (traineeId: string) => {
    const events = outcomeEvents.filter(e => e.traineeId === traineeId);
    if (events.length === 0) return null;
    return events.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())[0];
  };

  const filtered = useMemo(() => {
    return trainees.filter(tr => {
      if (search && !tr.name.toLowerCase().includes(search.toLowerCase()) && !tr.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (districtFilter && tr.district !== districtFilter) return false;
      if (statusFilter) {
        const latest = getLatestOutcome(tr.id);
        if (!latest) return statusFilter === 'NONE';
        if (latest.type !== statusFilter) return false;
      }
      return true;
    });
  }, [search, districtFilter, statusFilter, outcomeEvents]);

  const outcomeColor: Record<string, string> = {
    PLACED: 'chip-verified',
    RETAINED: 'chip-verified',
    SELF_EMPLOYED: 'chip-document',
    APPRENTICE: 'chip-document',
    LEFT_JOB: 'chip-at-risk',
    NOT_PLACED: 'chip-at-risk',
    UNREACHABLE: 'chip-unreachable',
    WAGE_UPDATE: 'chip-verified',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{t('nav.trainees', language)}</h1>
          <p className="text-sm text-gray-500">{filtered.length} of {trainees.length} engineering students</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or MSOL ID..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-navy-500 focus:ring-1 focus:ring-navy-500 outline-none"
            />
          </div>
          <select
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-navy-500 outline-none"
            aria-label="Filter by district"
          >
            <option value="">All Districts</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-navy-500 outline-none"
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="PLACED">Placed</option>
            <option value="RETAINED">Retained</option>
            <option value="LEFT_JOB">Left Job</option>
            <option value="NOT_PLACED">Not Placed</option>
            <option value="UNREACHABLE">Unreachable</option>
            <option value="SELF_EMPLOYED">Self-Employed</option>
            <option value="APPRENTICE">Apprentice</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trainee</th>
                <th>MSOL ID</th>
                <th>District</th>
                <th>Course</th>
                <th>Latest Status</th>
                <th>Confidence</th>
                <th>Consent</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(tr => {
                const latestOutcome = getLatestOutcome(tr.id);
                const enrolment = enrolments.find(e => e.traineeId === tr.id);
                return (
                  <tr key={tr.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {getInitials(tr.name)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-navy-900">{tr.name}</div>
                          <div className="text-xs text-gray-400">{tr.gender} • {tr.age}y • {tr.category}{tr.pwd ? ' • PwD' : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-navy-600">{tr.id}</td>
                    <td className="text-sm">{tr.district}</td>
                    <td className="text-sm">{enrolment?.courseName || '—'}</td>
                    <td>
                      {latestOutcome ? (
                        <span className={`chip ${outcomeColor[latestOutcome.type] || 'chip-unreachable'}`}>
                          {latestOutcome.type.replace(/_/g, ' ')}
                        </span>
                      ) : (
                        <span className="chip chip-unreachable">No data</span>
                      )}
                    </td>
                    <td>
                      {latestOutcome ? (
                        <span className={`chip ${
                          latestOutcome.confidence === 'EMPLOYER_CONFIRMED' ? 'chip-verified' :
                          latestOutcome.confidence === 'DOCUMENT_BACKED' ? 'chip-document' : 'chip-self-reported'
                        }`}>
                          {confidenceLabel(latestOutcome.confidence)}
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      <span className={`chip ${tr.consent.followUp ? 'chip-verified' : 'chip-at-risk'}`}>
                        {tr.consent.followUp ? '✓' : '✗'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/trainees/${tr.id}`} className="text-navy-600 hover:text-navy-900">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 50 && (
          <div className="p-4 text-center text-sm text-gray-500 border-t">
            Showing 50 of {filtered.length} trainees. Use filters to narrow results.
          </div>
        )}
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">{t('empty.no_trainees', language)}</p>
            <p className="text-xs text-gray-400 mt-1">तुमच्या निकषांशी जुळणारे प्रशिक्षणार्थी सापडले नाहीत</p>
          </div>
        )}
      </div>
    </div>
  );
}
