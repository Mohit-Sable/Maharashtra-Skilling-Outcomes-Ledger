'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { providers, providerScores, enrolments, courses, trainees } from '@/lib/store';
import { useMSOLStore } from '@/lib/store';
import { getRetentionCurve } from '@/lib/seed';
import { wageBandLabel, formatDate } from '@/lib/utils';
import { Landmark, AlertTriangle, Users, BarChart3, TrendingUp, TrendingDown, CheckCircle2, MapPin } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ProviderDetailPage() {
  const params = useParams();
  const providerId = params.id as string;
  const { outcomeEvents } = useMSOLStore();

  const provider = providers.find(p => p.id === providerId);
  const ps = providerScores.find(s => s.providerId === providerId);

  if (!provider || !ps) {
    return (
      <div className="text-center py-12">
        <Landmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-600">Provider not found</h2>
        <Link href="/providers" className="btn-primary mt-4 inline-flex">← Back to Providers</Link>
      </div>
    );
  }

  const provEnrolments = enrolments.filter(e => e.providerId === providerId);
  const provTraineeIds = provEnrolments.map(e => e.traineeId);
  const retentionData = getRetentionCurve(providerId);

  // Course breakdown
  const courseBreakdown = [...new Set(provEnrolments.map(e => e.courseId))].map(courseId => {
    const course = courses.find(c => c.id === courseId);
    const enrolledCount = provEnrolments.filter(e => e.courseId === courseId).length;
    const placedCount = outcomeEvents.filter(
      o => provTraineeIds.includes(o.traineeId) && ['PLACED', 'SELF_EMPLOYED'].includes(o.type) &&
      provEnrolments.find(e => e.traineeId === o.traineeId && e.courseId === courseId)
    ).length;
    return {
      name: course?.name || courseId,
      enrolled: enrolledCount,
      placed: placedCount,
      rate: enrolledCount > 0 ? Math.round((placedCount / enrolledCount) * 100) : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${ps.suspectedInflation ? 'bg-red-100' : 'bg-navy-100'}`}>
            <Landmark className={`w-7 h-7 ${ps.suspectedInflation ? 'text-red-600' : 'text-navy-600'}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">{provider.name}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {provider.address} • {provider.type}
            </p>
          </div>
        </div>
        {ps.suspectedInflation && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 border border-red-300">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-800">Suspected Data Inflation</span>
          </div>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'TPO Placement', value: `${ps.placementRatePaper}%`, color: 'text-gray-600' },
          { label: 'Verified 90d', value: `${ps.placementRateVerified90d}%`, color: ps.placementRateVerified90d < ps.placementRatePaper * 0.6 ? 'text-red-600' : 'text-emerald-700' },
          { label: '90d Retention', value: `${ps.retention90d}%` },
          { label: '180d Retention', value: `${ps.retention180d}%` },
          { label: 'Avg Wage', value: wageBandLabel(ps.avgWageBand) },
          { label: 'Job Match', value: `${ps.jobRoleMatch}%` },
          { label: 'Unreachable', value: `${ps.unreachable}%`, color: ps.unreachable > 10 ? 'text-red-600' : undefined },
          { label: 'Quality Score', value: `${ps.dataQualityScore}`, color: ps.dataQualityScore < 50 ? 'text-red-600' : 'text-emerald-700' },
        ].map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className={`kpi-value ${kpi.color || 'text-navy-900'}`}>{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* The Punchline */}
      {ps.placementRateVerified90d < ps.placementRatePaper * 0.65 && (
        <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-800">Significant Verification Gap</h3>
            <p className="text-sm text-red-700 mt-1">
              This college reports <strong>{ps.placementRatePaper}%</strong> campus placement on the TPO sheet, 
              but only <strong>{ps.placementRateVerified90d}%</strong> verified retention at 90 days.
              {ps.unreachable > 10 && ` ${ps.unreachable}% of engineering graduates are unreachable.`}
              {' '}This warrants a DTE / MSINS compliance audit.
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold text-navy-900 mb-4">Retention Curve</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} unit="%" />
              <Tooltip formatter={(val: any) => [`${val}%`, 'Rate']} />
              <Line type="monotone" dataKey="rate" stroke="#0B3D6E" strokeWidth={2.5} dot={{ fill: '#F4A261', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-navy-900 mb-4">Course Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courseBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="enrolled" name="Enrolled" fill="#94a3b8" barSize={10} radius={[0, 4, 4, 0]} />
              <Bar dataKey="placed" name="Placed" fill="#0B3D6E" barSize={10} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trainee List */}
      <div className="card">
        <h3 className="text-sm font-semibold text-navy-900 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" /> Trainees ({provTraineeIds.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>MSOL ID</th>
                <th>Course</th>
                <th>Certified</th>
                <th>Latest Status</th>
              </tr>
            </thead>
            <tbody>
              {provEnrolments.slice(0, 15).map(enr => {
                const trainee = trainees.find(t => t.id === enr.traineeId);
                const latest = outcomeEvents.filter(o => o.traineeId === enr.traineeId).sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())[0];
                if (!trainee) return null;
                return (
                  <tr key={enr.id}>
                    <td>
                      <Link href={`/trainees/${trainee.id}`} className="text-sm font-medium text-navy-900 hover:underline">
                        {trainee.name}
                      </Link>
                    </td>
                    <td className="font-mono text-xs">{trainee.id}</td>
                    <td className="text-sm">{enr.courseName}</td>
                    <td className="text-sm">{formatDate(enr.certifiedAt)}</td>
                    <td>
                      {latest ? (
                        <span className={`chip ${
                          ['PLACED', 'RETAINED'].includes(latest.type) ? 'chip-verified' :
                          latest.type === 'UNREACHABLE' ? 'chip-unreachable' : 'chip-at-risk'
                        }`}>
                          {latest.type.replace(/_/g, ' ')}
                        </span>
                      ) : <span className="chip chip-unreachable">No data</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
