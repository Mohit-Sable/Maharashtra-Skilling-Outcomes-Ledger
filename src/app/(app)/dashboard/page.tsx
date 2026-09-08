'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMSOLStore, trainees, enrolments, providers, providerScores, integrityFlags, courses, skillPassports, applications, employerFeedback } from '@/lib/store';
import { t } from '@/lib/i18n';
import { getKPIs, getRetentionCurve } from '@/lib/seed';
import {
  Users, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2,
  PhoneForwarded, ArrowRight, BarChart3, Eye, EyeOff, Clock,
  Building2, Shield, Briefcase, Contact, Link2, MessageSquare
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';

export default function DashboardPage() {
  const { currentUser, language, followUps, outcomeEvents } = useMSOLStore();
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentUser?.role === 'trainee') {
      router.replace('/me');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role === 'trainee') return null;

  const role = currentUser.role;
  const kpis = getKPIs({ verifiedOnly });
  const retentionData = getRetentionCurve();

  // Follow-up stats
  const pendingFollowUps = followUps.filter(f => f.status === 'PENDING').length;
  const overdueFollowUps = followUps.filter(f => f.status === 'PENDING' && new Date(f.dueAt) < new Date()).length;
  const escalatedFollowUps = followUps.filter(f => f.status === 'ESCALATED').length;

  // Provider comparison data
  const providerCompare = providers.slice(0, 6).map(p => {
    const ps = providerScores.find(s => s.providerId === p.id);
    return {
      name: p.name.length > 15 ? p.name.slice(0, 15) + '…' : p.name,
      paper: ps?.placementRatePaper || 0,
      verified: ps?.placementRateVerified90d || 0,
      fullName: p.name,
    };
  });

  // Phase 2 KPIs
  const passportCoverage = Math.round((skillPassports.length / Math.max(1, trainees.length)) * 100);
  const openMatches = applications.filter(a => a.status === 'SUGGESTED' || a.status === 'APPLIED' || a.status === 'SHORTLISTED').length;
  const matchToJoinRate = applications.length > 0 ? Math.round((applications.filter(a => a.status === 'JOINED').length / applications.length) * 100) : 0;
  const newGaps = employerFeedback.reduce((acc, f) => acc + f.missingSkillTags.length, 0);

  // Today's date
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{t('nav.dashboard', language)}</h1>
          <p className="text-sm text-gray-500">{today} • Last updated: 2 hours ago</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              verifiedOnly
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {verifiedOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {verifiedOnly ? 'Showing Verified Only' : 'Show All (incl. unverified)'}
          </button>
        </div>
      </div>

      {/* The Punchline Banner */}
      {role === 'state_admin' && (
        <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-800">Placement Verification Gap Detected</h3>
            <p className="text-sm text-red-700 mt-1">
              TPO campus placement across all colleges: <strong>{kpis.paperPlacement}%</strong>. 
              After 90-day verified follow-up: <strong>{kpis.verifiedPlacement}%</strong>. 
              {kpis.unreachable}% of engineering graduates are unreachable.
              <Link href="/providers/PRV-001" className="ml-2 text-red-600 font-semibold underline">
                Review flagged colleges →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: t('kpi.certified', language), value: kpis.certified, icon: <Users className="w-4 h-4" />, color: 'text-navy-900' },
          { label: t('kpi.paperPlacement', language), value: `${kpis.paperPlacement}%`, icon: <Briefcase className="w-4 h-4" />, color: 'text-blue-700' },
          { label: t('kpi.verifiedPlacement', language), value: `${kpis.verifiedPlacement}%`, icon: <CheckCircle2 className="w-4 h-4" />, color: kpis.verifiedPlacement < kpis.paperPlacement * 0.7 ? 'text-red-600' : 'text-emerald-700', highlight: true },
          { label: t('kpi.retention90d', language), value: `${kpis.retention90d}%`, icon: <TrendingUp className="w-4 h-4" />, color: 'text-emerald-700' },
          { label: t('kpi.medianWage', language), value: `₹${kpis.medianWageBand}`, icon: <BarChart3 className="w-4 h-4" />, color: 'text-navy-700' },
          { label: t('kpi.unreachable', language), value: `${kpis.unreachable}%`, icon: <PhoneForwarded className="w-4 h-4" />, color: kpis.unreachable > 10 ? 'text-red-600' : 'text-gray-600' },
          { label: t('kpi.selfEmployment', language), value: `${kpis.selfEmployment}%`, icon: <Building2 className="w-4 h-4" />, color: 'text-purple-700' },
        ].map((kpi, i) => (
          <div key={i} className={`kpi-card ${kpi.highlight ? 'border-red-200 bg-red-50/30' : ''}`}>
            <div className={`flex items-center gap-1 ${kpi.color} mb-1 opacity-60`}>
              {kpi.icon}
            </div>
            <div className={`kpi-value ${kpi.color}`}>{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Phase 2 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Passport Coverage', value: `${passportCoverage}%`, icon: <Contact className="w-4 h-4" />, color: 'text-saffron-700', bg: 'bg-saffron-50 border-saffron-100' },
          { label: 'Open Matches', value: openMatches, icon: <Link2 className="w-4 h-4" />, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Match-to-Join Rate', value: `${matchToJoinRate}%`, icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Feedback-Derived Gaps', value: newGaps, icon: <MessageSquare className="w-4 h-4" />, color: 'text-red-700', bg: 'bg-red-50 border-red-100' },
        ].map((kpi, i) => (
          <div key={i} className={`p-4 rounded-xl border ${kpi.bg} shadow-sm flex flex-col justify-between`}>
            <div className={`flex items-center justify-between mb-2`}>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{kpi.label}</div>
              <div className={`${kpi.color} opacity-80`}>{kpi.icon}</div>
            </div>
            <div className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Retention Curve */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-navy-900">Retention Curve (All Colleges)</h3>
            <span className="text-xs text-gray-400">% of engineering graduates</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} label={{ value: 'Days after convocation / offer', position: 'insideBottom', offset: -5, fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip formatter={(val: unknown) => [`${val}%`, 'Retention']} />
              <Line type="monotone" dataKey="rate" stroke="#0B3D6E" strokeWidth={2.5} dot={{ fill: '#F4A261', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Provider: Paper vs Verified */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-navy-900">TPO Paper vs Verified Placement by College</h3>
            <Link href="/providers" className="text-xs text-saffron-600 font-medium hover:underline">View all →</Link>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={providerCompare} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="paper" name="Paper %" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={12} />
              <Bar dataKey="verified" name="Verified %" fill="#0B3D6E" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Follow-ups + Integrity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Follow-up Queue */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-navy-900">Follow-up Queue</h3>
            <Link href="/follow-ups" className="text-xs text-saffron-600 font-medium hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">Overdue</span>
              </div>
              <span className="text-xl font-bold text-amber-700">{overdueFollowUps}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2">
                <PhoneForwarded className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Pending</span>
              </div>
              <span className="text-xl font-bold text-blue-700">{pendingFollowUps}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Escalated</span>
              </div>
              <span className="text-xl font-bold text-red-700">{escalatedFollowUps}</span>
            </div>
          </div>
        </div>

        {/* Integrity Flags */}
        {(role === 'state_admin' || role === 'district_officer') && (
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Integrity Queue
              </h3>
              <span className="text-xs text-gray-400">{integrityFlags.length} flags</span>
            </div>
            <div className="space-y-2">
              {integrityFlags.map(flag => (
                <div
                  key={flag.id}
                  className={`p-3 rounded-lg border flex items-start gap-3 ${
                    flag.severity === 'high' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    flag.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                        flag.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {flag.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-gray-400">{flag.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5">{flag.description}</p>
                  </div>
                  {flag.providerId && (
                    <Link href={`/providers/${flag.providerId}`} className="text-xs text-navy-600 font-medium hover:underline flex-shrink-0">
                      View →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
