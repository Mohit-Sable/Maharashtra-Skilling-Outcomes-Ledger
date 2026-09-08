'use client';

import React from 'react';
import { useMSOLStore, trainees, courses, districts, skillPassports } from '@/lib/store';
import { Shield, BookOpen, Briefcase, Award, CheckCircle2, MessageSquare, AlertTriangle, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ReadOnlyPassportPage() {
  const params = useParams();
  const traineeId = params.traineeId as string;
  const { employerFeedback } = useMSOLStore();
  const trainee = trainees.find(t => t.id === traineeId);
  const passport = skillPassports.find(p => p.traineeId === traineeId);
  const feedback = employerFeedback.filter(f => f.traineeId === traineeId);

  if (!trainee || !passport) return <div className="p-6">Passport not found</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link href="/passport" className="inline-flex items-center text-sm font-medium text-navy-600 hover:text-navy-800">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Registry
      </Link>

      <div className="card p-6 bg-gradient-to-r from-navy-900 to-navy-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Shield className="w-48 h-48" />
        </div>
        <div className="flex justify-between items-start relative z-10">
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
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4" /> Employment History
            </h2>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {passport.jobs.length === 0 && <p className="text-sm text-gray-500">No verified employment history.</p>}
              {passport.jobs.map((job, i) => (
                <div key={i} className="relative flex items-center group pl-14">
                  <div className="absolute left-0 w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white shadow z-10 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="w-full p-4 rounded border border-gray-200 shadow-sm bg-white">
                    <div className="font-bold text-navy-900">{job.role}</div>
                    <div className="text-sm text-gray-600">{job.org} • {job.location}</div>
                    <div className="text-xs text-gray-400 mt-2">Started: {formatDate(job.start)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
