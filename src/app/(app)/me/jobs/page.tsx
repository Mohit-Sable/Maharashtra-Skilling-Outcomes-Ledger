'use client';

import React, { useMemo } from 'react';
import { useMSOLStore, trainees, assessments, employers } from '@/lib/store';
import { matchOpportunities } from '@/lib/ai/rules';
import { Briefcase, MapPin, BadgeCheck, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Opportunity } from '@/lib/types';

export function OpportunitiesList({ kind }: { kind: 'JOB' | 'INTERNSHIP' }) {
  const { currentUser, skillPassports, opportunities, applications, applyToOpportunity } = useMSOLStore();
  const traineeId = currentUser?.traineeId || 'MSOL-MH-0001';
  
  const trainee = trainees.find(t => t.id === traineeId);
  const passport = skillPassports.find(p => p.traineeId === traineeId);
  const assessment = assessments.find(a => a.traineeId === traineeId);

  const matchedOpps = useMemo(() => {
    if (!passport || !trainee) return [];
    return matchOpportunities(passport, trainee, opportunities.filter(o => o.kind === kind), assessment);
  }, [passport, trainee, opportunities, assessment, kind]);

  if (!passport) return <div className="p-6">Passport not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Matched {kind === 'JOB' ? 'Jobs' : 'Internships'}</h1>
          <p className="text-gray-600">AI-matched based on your verified skills, location, and career goals.</p>
        </div>
      </div>

      {!trainee?.consent.matchingShare && (
        <div className="p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg">
          Your matching consent is disabled. Employers cannot find you, and matches here are limited. Update your privacy settings to enable full matching.
        </div>
      )}

      {matchedOpps.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          No matches found. Try updating your skills or career goal in your passport.
        </div>
      ) : (
        <div className="grid gap-6">
          {matchedOpps.map(({ opportunity: opp, score, reasons }) => {
            const hasApplied = applications.some(a => a.opportunityId === opp.id && a.traineeId === traineeId);
            return (
              <div key={opp.id} className="card p-6 border-l-4" style={{ borderLeftColor: score > 75 ? '#10b981' : score > 50 ? '#f59e0b' : '#cbd5e1' }}>
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-navy-900">{opp.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {employers.find(e => e.id === opp.employerId)?.name || opp.employerId}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {opp.district}</span>
                      <span className="font-semibold text-emerald-700">{opp.stipendOrWageBand}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end">
                    <div className="text-2xl font-black text-emerald-600">{score}%</div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Match Score</div>
                  </div>
                </div>

                <div className="bg-navy-50 p-4 rounded-lg mb-4">
                  <h3 className="text-sm font-semibold text-navy-900 mb-2">Why this match?</h3>
                  <ul className="space-y-1">
                    {reasons.map((r, i) => (
                      <li key={i} className="text-sm text-navy-700 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {opp.skillTagsRequired.map(t => (
                      <span key={t} className="text-xs bg-gray-100 border border-gray-200 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1">
                        {t} {passport.skills.some(s => s.tag === t) && <BadgeCheck className="w-3 h-3 text-emerald-500" />}
                      </span>
                    ))}
                  </div>
                  
                  {hasApplied ? (
                    <button disabled className="btn-secondary opacity-50 cursor-not-allowed">Applied</button>
                  ) : (
                    <button 
                      className="btn-primary"
                      onClick={() => applyToOpportunity({
                        id: `APP-${Date.now()}`,
                        traineeId,
                        opportunityId: opp.id,
                        matchScore: score,
                        reasons,
                        status: 'APPLIED',
                        updatedAt: new Date().toISOString()
                      })}
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return <OpportunitiesList kind="JOB" />;
}
