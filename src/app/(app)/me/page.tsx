'use client';

import React from 'react';
import Link from 'next/link';
import { useMSOLStore, trainees, enrolments, providers, employers } from '@/lib/store';
import { formatDate, outcomeTypeLabel, outcomeTypeColor, confidenceLabel, confidenceColor, wageBandLabel } from '@/lib/utils';
import { t } from '@/lib/i18n';
import {
  UserCircle, Phone, MapPin, BookOpen, Shield, Clock,
  CheckCircle2, AlertTriangle, PhoneForwarded, Trash2
} from 'lucide-react';

export default function TraineeMePage() {
  const { currentUser, outcomeEvents, followUps, language } = useMSOLStore();
  
  // Get trainee (default to first if not specific)
  const traineeId = currentUser?.traineeId || 'MSOL-MH-0001';
  const trainee = trainees.find(t => t.id === traineeId) || trainees[0];
  if (!trainee) return null;

  const myEnrolments = enrolments.filter(e => e.traineeId === trainee.id);
  const myOutcomes = outcomeEvents.filter(e => e.traineeId === trainee.id)
    .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
  const myFollowUps = followUps.filter(f => f.traineeId === trainee.id);
  const nextFollowUp = myFollowUps.find(f => f.status === 'PENDING');
  const latestOutcome = myOutcomes.length > 0 ? myOutcomes[myOutcomes.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center text-2xl font-bold">
            {trainee.avatarInitials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-900">{trainee.name}</h1>
            <p className="text-sm text-gray-500 font-mono">{trainee.id}</p>
            <p className="text-xs text-gray-400">{trainee.gender} • {trainee.age} years • {trainee.category}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            {trainee.phone}
            <span className={`chip text-[10px] ${trainee.phoneStatus === 'active' ? 'chip-verified' : 'chip-at-risk'}`}>
              {trainee.phoneStatus}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            {trainee.district}
            {trainee.currentLocation !== trainee.district && (
              <span className="text-xs text-saffron-600">→ {trainee.currentLocation}</span>
            )}
          </div>
        </div>
      </div>

      {/* Current Job Status */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4" /> My Current Status / माझी सध्याची स्थिती
        </h2>
        {latestOutcome ? (
          <div className={`p-4 rounded-lg border ${
            ['PLACED', 'RETAINED', 'WAGE_UPDATE'].includes(latestOutcome.type) ? 'bg-emerald-50 border-emerald-200' :
            latestOutcome.type === 'UNREACHABLE' ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="text-lg font-bold text-navy-900">{outcomeTypeLabel(latestOutcome.type)}</div>
            <div className="text-sm text-gray-600 mt-1">As of {formatDate(latestOutcome.occurredAt)}</div>
            {latestOutcome.wageBand && <div className="text-lg font-bold text-saffron-600 mt-1">{wageBandLabel(latestOutcome.wageBand)}</div>}
            {latestOutcome.employerId && (
              <div className="text-sm text-gray-600 mt-1">
                Employer: {employers.find(e => e.id === latestOutcome.employerId)?.name || 'N/A'}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-center text-sm text-gray-500">
            No outcome recorded yet / अद्याप कोणताही परिणाम नोंदवलेला नाही
          </div>
        )}
      </div>

      {/* My Training */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
          <BookOpen className="w-4 h-4" /> My Training / माझे प्रशिक्षण
        </h2>
        {myEnrolments.map(enr => {
          const prov = providers.find(p => p.id === enr.providerId);
          return (
            <div key={enr.id} className="p-4 rounded-lg bg-navy-50 border border-navy-100">
              <div className="text-base font-semibold text-navy-900">{enr.courseName}</div>
              <div className="text-sm text-navy-600">{enr.trade} • NSQF Level {enr.nsqfLevel}</div>
              <div className="text-sm text-gray-500 mt-1">{prov?.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                {enr.scheme} • Enrolled: {formatDate(enr.enrolledAt)} • Certified: {formatDate(enr.certifiedAt)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Follow-up */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
          <PhoneForwarded className="w-4 h-4" /> Next Follow-up / पुढील पाठपुरावा
        </h2>
        {nextFollowUp ? (
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-sm font-medium text-blue-800">Scheduled: {formatDate(nextFollowUp.dueAt)}</div>
            <div className="text-xs text-blue-600">Channel: {nextFollowUp.channel}</div>
            <p className="text-xs text-blue-700 mt-2">
              We will contact you to check your employment status. Please keep your phone reachable.
              <br/>आम्ही तुमच्या रोजगार स्थितीची तपासणी करण्यासाठी तुमच्याशी संपर्क साधू. कृपया तुमचा फोन उपलब्ध ठेवा.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 text-center text-sm text-gray-500">
            No pending follow-ups / प्रलंबित पाठपुरावा नाही
          </div>
        )}
      </div>

      {/* Consent */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
          <Shield className="w-4 h-4" /> My Consent / माझी संमती
        </h2>
        <div className="space-y-2">
          {[
            { label: 'Follow-up contacts', mr: 'पाठपुरावा संपर्क', value: trainee.consent.followUp },
            { label: 'Employer verification', mr: 'नियोक्ता सत्यापन', value: trainee.consent.employerVerify },
            { label: 'Anonymised analytics', mr: 'निनावी विश्लेषण', value: trainee.consent.analyticsAnonymised },
          ].map(c => (
            <div key={c.label} className="flex items-center justify-between p-2 rounded border border-gray-100">
              <div>
                <div className="text-sm text-navy-900">{c.label}</div>
                <div className="text-xs text-gray-400">{c.mr}</div>
              </div>
              <span className={`chip text-[10px] ${c.value ? 'chip-verified' : 'chip-at-risk'}`}>
                {c.value ? '✓ Granted' : '✗ Denied'}
              </span>
            </div>
          ))}
        </div>
        <button className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
          Revoke Consent / संमती रद्द करा
        </button>
      </div>

      {/* Outcome Timeline */}
      {myOutcomes.length > 0 && (
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Clock className="w-4 h-4" /> My Timeline / माझी टाइमलाइन
          </h2>
          <div className="space-y-0">
            {myOutcomes.map(event => (
              <div key={event.id} className="timeline-item">
                <div className={`timeline-dot ${outcomeTypeColor(event.type)}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-navy-900">{outcomeTypeLabel(event.type)}</span>
                    <span className={`chip text-[10px] ${confidenceColor(event.confidence)}`}>
                      {confidenceLabel(event.confidence)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{formatDate(event.occurredAt)}</div>
                  {event.wageBand && <div className="text-sm text-gray-600 mt-0.5">{wageBandLabel(event.wageBand)}</div>}
                  {event.notes && <div className="text-xs text-gray-500 mt-1 italic">{event.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
