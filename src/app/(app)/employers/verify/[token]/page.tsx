'use client';

import React, { useState } from 'react';
import { useMSOLStore, trainees, enrolments, employers } from '@/lib/store';
import { formatDate, confidenceLabel } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, Upload, Shield, Smartphone } from 'lucide-react';

export default function EmployerVerifyPage() {
  const { outcomeEvents, upgradeConfidence } = useMSOLStore();
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [disputed, setDisputed] = useState<Set<string>>(new Set());

  // Get placements pending employer verification
  const pendingVerifications = outcomeEvents.filter(
    o => ['PLACED', 'RETAINED'].includes(o.type) && o.confidence === 'UNVERIFIED' && o.employerId
  ).slice(0, 10);

  const handleConfirm = (outcomeId: string) => {
    upgradeConfidence(outcomeId, 'EMPLOYER_CONFIRMED');
    setConfirmed(prev => new Set(prev).add(outcomeId));
  };

  const handleDispute = (outcomeId: string) => {
    setDisputed(prev => new Set(prev).add(outcomeId));
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* SMS Landing Page Header */}
      <div className="bg-navy-900 text-white p-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">☸</div>
          <div>
            <div className="text-sm font-medium">MSOL Employment Verification</div>
            <div className="text-xs opacity-70">Maharashtra Skilling Outcomes Ledger</div>
          </div>
        </div>
      </div>

      {/* Mobile-like mock */}
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Info card */}
        <div className="card p-4 border-saffron-200 bg-saffron-50/30">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-4 h-4 text-saffron-600" />
            <span className="text-xs font-semibold text-saffron-700 uppercase tracking-wider">Magic Link Verification</span>
          </div>
          <p className="text-sm text-gray-700">
            You received this link via SMS. Please confirm or dispute the campus placement and joining of the engineering graduates listed below. 
            No login required — this is a secure one-time verification link.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Token: <span className="font-mono">demo-token</span> • Expires: 7 days
          </p>
        </div>

        {/* Verification Cards */}
        {pendingVerifications.map(o => {
          const trainee = trainees.find(t => t.id === o.traineeId);
          const enr = enrolments.find(e => e.id === o.enrolmentId);
          const emp = employers.find(e => e.id === o.employerId);
          if (!trainee) return null;

          const isConfirmed = confirmed.has(o.id);
          const isDisputed = disputed.has(o.id);

          return (
            <div key={o.id} className={`card p-4 ${isConfirmed ? 'border-emerald-300 bg-emerald-50/50' : isDisputed ? 'border-red-300 bg-red-50/50' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-navy-900">{trainee.name}</div>
                  <div className="text-xs text-gray-500">{trainee.id}</div>
                </div>
                {isConfirmed && <span className="chip chip-verified">✓ Confirmed</span>}
                {isDisputed && <span className="chip chip-at-risk">✗ Disputed</span>}
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div>Course: <strong>{enr?.courseName}</strong></div>
                <div>Claimed role: <strong>{o.occupation || 'N/A'}</strong></div>
                <div>Claimed start: <strong>{formatDate(o.occurredAt)}</strong></div>
                <div>Employer: <strong>{emp?.name || 'N/A'}</strong></div>
              </div>

              {!isConfirmed && !isDisputed && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleConfirm(o.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm
                  </button>
                  <button
                    onClick={() => handleDispute(o.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Dispute
                  </button>
                  <button className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors">
                    <AlertTriangle className="w-4 h-4" /> Wrong Person
                  </button>
                </div>
              )}

              {isConfirmed && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-100 border border-emerald-200">
                  <div className="flex items-center gap-2 text-sm text-emerald-800 font-medium mb-2">
                    <CheckCircle2 className="w-4 h-4" /> Confidence upgraded to EMPLOYER_CONFIRMED
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`doc-${o.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-emerald-300 text-xs font-medium text-emerald-700 cursor-pointer hover:bg-emerald-50 transition-colors">
                      <Upload className="w-3 h-3" /> Upload Document (optional)
                    </label>
                    <input id={`doc-${o.id}`} type="file" className="hidden" />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {pendingVerifications.length === 0 && (
          <div className="card p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">All verifications completed</p>
          </div>
        )}

        {/* DPDP Notice */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500">Privacy Notice</span>
          </div>
          <p className="text-xs text-gray-400">
            This verification is governed by DPDP Act provisions. Your response confirms or disputes employment only.
            No additional personal data is collected.
          </p>
        </div>
      </div>
    </div>
  );
}
