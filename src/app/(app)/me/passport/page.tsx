'use client';

import React from 'react';
import { useMSOLStore, trainees, employers } from '@/lib/store';
import { Shield, BookOpen, Briefcase, Award, CheckCircle2, MessageSquare, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PassportPage() {
  const { currentUser, skillPassports, outcomeEvents, employerFeedback } = useMSOLStore();
  const traineeId = currentUser?.traineeId || 'MSOL-MH-0001';
  const trainee = trainees.find(t => t.id === traineeId);
  const passport = skillPassports.find(p => p.traineeId === traineeId);
  const feedback = employerFeedback.filter(f => f.traineeId === traineeId);

  if (!trainee || !passport) return <div className="p-6">Passport not found</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="card p-6 bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              {trainee.avatarInitials}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{trainee.name}</h1>
              <p className="text-navy-100 font-mono mt-1">MSOL ID: {trainee.id}</p>
              <div className="flex items-center gap-2 mt-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">APAAR (Sandbox): {trainee.apaarId}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider">
              {passport.status}
            </span>
            <p className="text-xs text-navy-200 mt-2">Last updated: {formatDate(passport.lastUpdatedAt)}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Verified Skills */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4" /> Verified Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {passport.skills.map((s, i) => (
                <div key={i} className={`px-3 py-1.5 rounded-full text-sm border flex items-center gap-1.5 ${s.verified ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                  {s.tag}
                  {s.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
              ))}
              {passport.skills.length === 0 && <span className="text-sm text-gray-400">No skills logged yet.</span>}
            </div>
          </div>

          {/* Certifications */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Award className="w-4 h-4" /> Training & Certifications
            </h2>
            <div className="space-y-4">
              {passport.certifications.map((c, i) => (
                <div key={i} className="flex gap-3 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded bg-navy-50 flex items-center justify-center text-navy-600 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900">{c.name}</h3>
                    <p className="text-sm text-gray-600">{c.issuedBy}</p>
                    <p className="text-xs text-gray-400 mt-1">Certified: {formatDate(c.date)} {c.nsqfLevel && `• NSQF L${c.nsqfLevel}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Formal Education</h2>
            <div className="space-y-3">
              {passport.educationHistory.map((e, i) => (
                <div key={i} className="pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-navy-900">{e.level} {e.stream ? `(${e.stream})` : ''}</span>
                    {e.result && <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{e.result}</span>}
                  </div>
                  <div className="text-sm text-gray-600">{e.institution} {e.boardOrUniversity ? `• ${e.boardOrUniversity}` : ''} ({e.year})</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Career Goal */}
          {passport.careerGoal && (
            <div className="card p-6 bg-saffron-50 border-saffron-200">
              <h2 className="text-sm font-semibold text-saffron-800 uppercase tracking-wider mb-2">Career Goal</h2>
              <div className="font-bold text-lg text-saffron-900">{passport.careerGoal.targetOccupation}</div>
              <div className="text-sm text-saffron-700 mt-1">
                Preferred: {passport.careerGoal.preferredDistricts.join(', ')} 
                {passport.careerGoal.willingToMigrate ? ' (Willing to migrate)' : ''}
              </div>
            </div>
          )}

          {/* Employment History */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4" /> Employment History
            </h2>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {passport.jobs.length === 0 && <p className="text-sm text-gray-500">No verified employment history.</p>}
              {passport.jobs.map((job, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-gray-200 shadow bg-white">
                    <div className="font-bold text-navy-900">{job.role}</div>
                    <div className="text-sm text-gray-600">{job.org} • {job.location}</div>
                    <div className="text-xs text-gray-400 mt-2">Started: {formatDate(job.start)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employer Feedback */}
          {feedback.length > 0 && (
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4" /> Employer Feedback
              </h2>
              <div className="space-y-4">
                {feedback.map(fb => {
                  const emp = employers.find(e => e.id === fb.employerId);
                  return (
                    <div key={fb.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-sm text-navy-900">{emp?.name || 'Employer'}</div>
                        <div className="text-xs text-gray-400">{formatDate(fb.occurredAt)}</div>
                      </div>
                      <div className="text-sm italic text-gray-600 mb-3">"{fb.notes}"</div>
                      {fb.missingSkillTags.length > 0 && (
                        <div className="flex gap-2 items-center text-xs text-red-600 bg-red-50 p-2 rounded">
                          <AlertTriangle className="w-3 h-3" /> Gaps identified: {fb.missingSkillTags.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
