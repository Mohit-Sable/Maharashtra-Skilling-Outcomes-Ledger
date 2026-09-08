'use client';

import React, { useState, useMemo } from 'react';
import { useMSOLStore, trainees, enrolments, providers, providerScores, courses, districts, applications } from '@/lib/store';
import { getKPIs, getRetentionCurve } from '@/lib/seed';
import { t } from '@/lib/i18n';
import { wageBandLabel, wageBandToNumber } from '@/lib/utils';
import type { WageBand, Scheme } from '@/lib/types';
import {
  BarChart3, Eye, EyeOff, Filter, Users, Briefcase, TrendingUp,
  CheckCircle2, PhoneForwarded, Building2
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Cell
} from 'recharts';

export default function AnalyticsPage() {
  const { language, outcomeEvents } = useMSOLStore();
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [filters, setFilters] = useState({
    scheme: '',
    course: '',
    provider: '',
    district: '',
    gender: '',
    category: '',
  });

  const kpis = getKPIs({
    verifiedOnly,
    providerId: filters.provider || undefined,
    courseId: filters.course || undefined,
    district: filters.district || undefined,
    scheme: filters.scheme || undefined,
  });

  // Retention curve
  const retentionData = getRetentionCurve(filters.provider || undefined);

  // Provider scatter data
  const scatterData = providerScores.map(ps => {
    const prov = providers.find(p => p.id === ps.providerId);
    return {
      name: prov?.name || ps.providerId,
      paper: ps.placementRatePaper,
      verified: ps.placementRateVerified90d,
      inflation: ps.suspectedInflation,
    };
  });

  // District bars
  const districtData = districts.map(d => {
    const distKPIs = getKPIs({ district: d.name, verifiedOnly });
    return {
      district: d.name.length > 12 ? d.name.slice(0, 12) + '…' : d.name,
      fullName: d.name,
      certified: distKPIs.certified,
      placed: distKPIs.paperPlacement,
      verified: distKPIs.verifiedPlacement,
    };
  });

  // Wage distribution
  const wageBands: WageBand[] = ['<10k', '10-15k', '15-20k', '20-30k', '30k+'];
  const wageDistribution = wageBands.map(band => {
    const count = outcomeEvents.filter(o => o.wageBand === band && (!verifiedOnly || o.confidence !== 'UNVERIFIED')).length;
    return { band: wageBandLabel(band), count };
  });

  // Salary band stacked by course
  const courseWages = courses.map(c => {
    const data: any = { course: c.name.slice(0, 15) + '…', fullName: c.name };
    wageBands.forEach(b => {
      data[b] = outcomeEvents.filter(o => {
        if (verifiedOnly && o.confidence === 'UNVERIFIED') return false;
        if (o.wageBand !== b) return false;
        const e = enrolments.find(en => en.traineeId === o.traineeId);
        return e?.courseId === c.id;
      }).length;
    });
    return data;
  });

  // Matching Funnel
  const funnelSteps = ['SUGGESTED', 'APPLIED', 'SHORTLISTED', 'SELECTED', 'JOINED'];
  const funnelData = funnelSteps.map(step => {
    let count = 0;
    if (step === 'SUGGESTED') {
      count = applications.length; // assuming all applications start as suggested/matched
    } else if (step === 'APPLIED') {
      count = applications.filter(a => ['APPLIED', 'SHORTLISTED', 'SELECTED', 'JOINED', 'REJECTED'].includes(a.status)).length;
    } else if (step === 'SHORTLISTED') {
      count = applications.filter(a => ['SHORTLISTED', 'SELECTED', 'JOINED', 'REJECTED'].includes(a.status)).length;
    } else if (step === 'SELECTED') {
      count = applications.filter(a => ['SELECTED', 'JOINED'].includes(a.status)).length;
    } else if (step === 'JOINED') {
      count = applications.filter(a => ['JOINED'].includes(a.status)).length;
    }
    return { step, count };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{t('nav.analytics', language)}</h1>
          <p className="text-sm text-gray-500">Cohort / branch / institute / district / demographic analysis</p>
        </div>
        <button
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            verifiedOnly
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}
        >
          {verifiedOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {verifiedOnly ? 'Verified Only' : 'All (incl. unverified)'}
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filters</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <select value={filters.scheme} onChange={e => setFilters(f => ({ ...f, scheme: e.target.value }))} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" aria-label="Scheme">
            <option value="">All Programmes / Schemes</option>
            {(['AICTE UG', 'Diploma', 'Internship', 'Add-on Skilling', 'Apprenticeship'] as Scheme[]).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.course} onChange={e => setFilters(f => ({ ...f, course: e.target.value }))} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" aria-label="Course">
            <option value="">All Branches</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filters.provider} onChange={e => setFilters(f => ({ ...f, provider: e.target.value }))} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" aria-label="Provider">
            <option value="">All Institutes</option>
            {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={filters.district} onChange={e => setFilters(f => ({ ...f, district: e.target.value }))} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" aria-label="District">
            <option value="">All Districts</option>
            {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
          </select>
          <select value={filters.gender} onChange={e => setFilters(f => ({ ...f, gender: e.target.value }))} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" aria-label="Gender">
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} className="px-3 py-2 rounded-lg border border-gray-200 text-sm" aria-label="Category">
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: t('kpi.certified', language), value: kpis.certified, icon: <Users className="w-4 h-4" /> },
          { label: t('kpi.paperPlacement', language), value: `${kpis.paperPlacement}%`, icon: <Briefcase className="w-4 h-4" /> },
          { label: t('kpi.verifiedPlacement', language), value: `${kpis.verifiedPlacement}%`, icon: <CheckCircle2 className="w-4 h-4" />, highlight: true },
          { label: t('kpi.retention90d', language), value: `${kpis.retention90d}%`, icon: <TrendingUp className="w-4 h-4" /> },
          { label: t('kpi.medianWage', language), value: `₹${kpis.medianWageBand}`, icon: <BarChart3 className="w-4 h-4" /> },
          { label: t('kpi.unreachable', language), value: `${kpis.unreachable}%`, icon: <PhoneForwarded className="w-4 h-4" /> },
          { label: t('kpi.selfEmployment', language), value: `${kpis.selfEmployment}%`, icon: <Building2 className="w-4 h-4" /> },
        ].map((kpi, i) => (
          <div key={i} className={`kpi-card ${kpi.highlight ? 'border-emerald-200 bg-emerald-50/30' : ''}`}>
            <div className="flex items-center gap-1 text-gray-400 mb-1">{kpi.icon}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Retention Curve */}
        <div className="card">
          <h3 className="text-sm font-semibold text-navy-900 mb-4">Retention Curve (0 → 365 days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} label={{ value: 'Days', position: 'insideBottom', offset: -5, fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} unit="%" />
              <Tooltip formatter={(val: any) => [`${val}%`, 'Retention']} />
              <Line type="monotone" dataKey="rate" stroke="#0B3D6E" strokeWidth={3} dot={{ fill: '#F4A261', r: 6, strokeWidth: 2, stroke: '#0B3D6E' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Provider Scatter: Paper vs Verified */}
        <div className="card">
          <h3 className="text-sm font-semibold text-navy-900 mb-4">Provider: Paper % vs Verified %</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" dataKey="paper" name="Paper %" unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="number" dataKey="verified" name="Verified %" unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(val: any, name: any) => [`${val}%`, name]} />
              <Scatter data={scatterData} fill="#0B3D6E">
                {scatterData.map((entry, i) => (
                  <Cell key={i} fill={entry.inflation ? '#ef4444' : '#0B3D6E'} />
                ))}
              </Scatter>
              {/* Diagonal reference line (paper = verified) — conceptual */}
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-navy-900"></span> Normal</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Suspected Inflation</span>
          </div>
        </div>

        {/* Wage Distribution */}
        <div className="card">
          <h3 className="text-sm font-semibold text-navy-900 mb-4">Wage Band Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={wageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="band" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Trainees" fill="#0B3D6E" radius={[4, 4, 0, 0]}>
                {wageDistribution.map((_, i) => (
                  <Cell key={i} fill={i < 2 ? '#ef4444' : i < 3 ? '#F4A261' : '#0B3D6E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* District Bars */}
        <div className="card">
          <h3 className="text-sm font-semibold text-navy-900 mb-4">District-wise Placement</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={districtData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <YAxis type="category" dataKey="district" width={90} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="placed" name="Paper %" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={10} />
              <Bar dataKey="verified" name="Verified %" fill="#0B3D6E" radius={[0, 4, 4, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Salary Stacked by Course */}
        <div className="card md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-navy-900">Salary Band Distribution by Course</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseWages}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="course" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="<10k" stackId="a" fill="#94a3b8" />
              <Bar dataKey="10-15k" stackId="a" fill="#60a5fa" />
              <Bar dataKey="15-20k" stackId="a" fill="#10b981" />
              <Bar dataKey="20-30k" stackId="a" fill="#f59e0b" />
              <Bar dataKey="30k+" stackId="a" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Matching Funnel */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-navy-900">AI Matching Funnel</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="step" tick={{ fontSize: 10 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#0B3D6E" radius={[0, 4, 4, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 4 ? '#10b981' : '#0B3D6E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
