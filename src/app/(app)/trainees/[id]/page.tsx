'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMSOLStore, trainees, enrolments, employers, providers } from '@/lib/store';
import { formatDate, confidenceLabel, confidenceColor, outcomeTypeColor, outcomeTypeLabel, wageBandLabel, getInitials } from '@/lib/utils';
import {
  User, Phone, MapPin, BookOpen, Shield, Clock, CheckCircle2,
  AlertTriangle, MessageSquare, Download, PhoneForwarded, Briefcase,
  TrendingUp, FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { WageBand } from '@/lib/types';

const wageBandValues: Record<WageBand, number> = {
  '<10k': 8, '10-15k': 12.5, '15-20k': 17.5, '20-30k': 25, '30k+': 35,
};

export default function TraineeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { outcomeEvents, followUps, language } = useMSOLStore();

  const trainee = trainees.find(t => t.id === id);
  if (!trainee) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-600">Student not found</h2>
          <p className="text-sm text-gray-400">ID: {id}</p>
          <Link href="/trainees" className="btn-primary mt-4 inline-flex">← Back to Students</Link>
        </div>
      </div>
    );
  }

  const traineeEnrolments = enrolments.filter(e => e.traineeId === id);
  const traineeOutcomes = outcomeEvents
    .filter(e => e.traineeId === id)
    .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
  const traineeFollowUps = followUps
    .filter(f => f.traineeId === id)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  const nextFollowUp = traineeFollowUps.find(f => f.status === 'PENDING');
  const latestOutcome = traineeOutcomes.length > 0 ? traineeOutcomes[traineeOutcomes.length - 1] : null;

  // Wage progression
  const wageData = traineeOutcomes
    .filter(o => o.wageBand)
    .map(o => ({
      date: formatDate(o.occurredAt),
      wage: wageBandValues[o.wageBand!],
      band: o.wageBand,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center text-xl font-bold">
            {getInitials(trainee.name)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">{trainee.name}</h1>
            <p className="text-sm text-gray-500 font-mono">{trainee.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/follow-ups/new" className="btn-outline text-sm">
            <PhoneForwarded className="w-4 h-4" /> Start Follow-up
          </Link>
          <button className="btn-outline text-sm" onClick={() => window.print()}>
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Profile + Consent */}
        <div className="lg:col-span-3 space-y-4">
          <div className="card">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Profile</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span>{trainee.gender} • {trainee.age} years • {trainee.category}</span>
              </div>
              {trainee.pwd && (
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Shield className="w-4 h-4" />
                  <span>Person with Disability</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{trainee.phone}</span>
                <span className={`chip text-[10px] ${
                  trainee.phoneStatus === 'active' ? 'chip-verified' :
                  trainee.phoneStatus === 'changed' ? 'chip-self-reported' : 'chip-at-risk'
                }`}>
                  {trainee.phoneStatus}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>
                  {trainee.district}
                  {trainee.currentLocation !== trainee.district && (
                    <span className="text-xs text-amber-600"> → migrated to {trainee.currentLocation}</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Consent Badges */}
          <div className="card">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Consent / संमती
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Follow-up calls', value: trainee.consent.followUp },
                { label: 'Employer verification', value: trainee.consent.employerVerify },
                { label: 'Anonymised analytics', value: trainee.consent.analyticsAnonymised },
              ].map(c => (
                <div key={c.label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{c.label}</span>
                  <span className={`chip text-[10px] ${c.value ? 'chip-verified' : 'chip-at-risk'}`}>
                    {c.value ? '✓ Granted' : '✗ Denied'}
                  </span>
                </div>
              ))}
              {trainee.consent.revokedAt && (
                <div className="mt-2 p-2 rounded bg-red-50 border border-red-200 text-xs text-red-700">
                  ⚠ Consent revoked on {formatDate(trainee.consent.revokedAt)}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-2">
                Granted: {formatDate(trainee.consent.grantedAt)}
              </div>
            </div>
          </div>

          {/* Academic Programme */}
          <div className="card">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Academic Programme / Branch
            </h3>
            {traineeEnrolments.map(enr => {
              const prov = providers.find(p => p.id === enr.providerId);
              return (
                <div key={enr.id} className="p-3 rounded-lg bg-navy-50 border border-navy-100">
                  <div className="text-sm font-semibold text-navy-900">{enr.courseName}</div>
                  <div className="text-xs text-navy-600">{enr.trade} • NSQF L{enr.nsqfLevel}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    <Link href={`/providers/${enr.providerId}`} className="text-navy-600 hover:underline">{prov?.name}</Link>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {enr.scheme} • Certified: {formatDate(enr.certifiedAt)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Timeline */}
        <div className="lg:col-span-5">
          <div className="card">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Outcome Timeline
            </h3>

            {traineeOutcomes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No outcome events recorded yet</p>
                <p className="text-xs text-gray-400">परिणाम घटना अद्याप नोंदवलेल्या नाहीत</p>
              </div>
            ) : (
              <div className="space-y-0">
                {traineeOutcomes.map((event, i) => {
                  const emp = event.employerId ? employers.find(e => e.id === event.employerId) : null;
                  return (
                    <div key={event.id} className="timeline-item">
                      <div className={`timeline-dot ${outcomeTypeColor(event.type)}`} />
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-navy-900">
                              {outcomeTypeLabel(event.type)}
                            </span>
                            <span className={`chip text-[10px] ${confidenceColor(event.confidence)}`}>
                              {confidenceLabel(event.confidence)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{formatDate(event.occurredAt)}</div>
                          {emp && (
                            <div className="text-sm text-gray-600 mt-1">
                              Employer: <Link href={`/employers`} className="text-navy-600 hover:underline">{emp.name}</Link>
                            </div>
                          )}
                          {event.occupation && (
                            <div className="text-sm text-gray-600">Role: {event.occupation}</div>
                          )}
                          {event.wageBand && (
                            <div className="text-sm text-gray-600">Wage: {wageBandLabel(event.wageBand)}</div>
                          )}
                          {event.jobLocation && (
                            <div className="text-xs text-gray-400">Location: {event.jobLocation}</div>
                          )}
                          {event.trainingRelevant !== undefined && (
                            <div className="text-xs text-gray-400">
                              Training relevant: {event.trainingRelevant === true ? '✓ Yes' : event.trainingRelevant === 'partial' ? '◐ Partial' : '✗ No'}
                            </div>
                          )}
                          {event.notes && (
                            <div className="text-xs text-gray-500 mt-1 italic bg-gray-50 p-2 rounded">{event.notes}</div>
                          )}
                          <div className="text-[10px] text-gray-400 mt-1">
                            Source: {event.source}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Current Status + Wage + Follow-ups */}
        <div className="lg:col-span-4 space-y-4">
          {/* Current Status */}
          <div className="card">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Current Status</h3>
            {latestOutcome ? (
              <div className={`p-4 rounded-lg border ${
                ['PLACED', 'RETAINED', 'WAGE_UPDATE'].includes(latestOutcome.type) ? 'bg-emerald-50 border-emerald-200' :
                latestOutcome.type === 'UNREACHABLE' ? 'bg-gray-50 border-gray-200' :
                'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {['PLACED', 'RETAINED'].includes(latestOutcome.type) ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : latestOutcome.type === 'UNREACHABLE' ? (
                    <Phone className="w-5 h-5 text-gray-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-semibold text-lg">
                    {outcomeTypeLabel(latestOutcome.type)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  As of {formatDate(latestOutcome.occurredAt)}
                </div>
                {latestOutcome.wageBand && (
                  <div className="text-lg font-bold text-navy-900 mt-2">
                    {wageBandLabel(latestOutcome.wageBand)}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-center text-sm text-gray-500">
                No outcome data
              </div>
            )}
          </div>

          {/* Wage Sparkline */}
          {wageData.length > 1 && (
            <div className="card">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Wage Progression
              </h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={wageData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: any) => [`₹${v}K`, 'Wage']} />
                  <Bar dataKey="wage" fill="#0B3D6E" radius={[4, 4, 0, 0]} barSize={24}>
                    {wageData.map((_, i) => (
                      <Cell key={i} fill={i === wageData.length - 1 ? '#F4A261' : '#0B3D6E'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Next Follow-up */}
          <div className="card">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <PhoneForwarded className="w-3.5 h-3.5" /> Follow-ups
            </h3>
            {nextFollowUp ? (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-sm font-medium text-blue-800">Next: {formatDate(nextFollowUp.dueAt)}</div>
                <div className="text-xs text-blue-600">Channel: {nextFollowUp.channel} • Attempts: {nextFollowUp.attemptCount}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No pending follow-ups</div>
            )}

            {/* Follow-up history */}
            <div className="mt-3 space-y-2">
              {traineeFollowUps.slice(0, 5).map(fu => (
                <div key={fu.id} className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
                  <div>
                    <span className="text-gray-600">{formatDate(fu.dueAt)}</span>
                    <span className="text-xs text-gray-400 ml-2">{fu.channel}</span>
                  </div>
                  <span className={`chip text-[10px] ${
                    fu.status === 'COMPLETED' ? 'chip-verified' :
                    fu.status === 'ESCALATED' ? 'chip-at-risk' :
                    fu.status === 'NO_REPLY' ? 'chip-unreachable' : 'chip-self-reported'
                  }`}>
                    {fu.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Counsellor Notes */}
          <div className="card">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> Notes
            </h3>
            {traineeOutcomes.filter(o => o.notes).map(o => (
              <div key={o.id} className="text-xs text-gray-600 p-2 rounded bg-gray-50 mb-2">
                <span className="font-medium">{formatDate(o.occurredAt)}:</span> {o.notes}
              </div>
            ))}
            {traineeOutcomes.filter(o => o.notes).length === 0 && (
              <p className="text-xs text-gray-400">No notes recorded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
