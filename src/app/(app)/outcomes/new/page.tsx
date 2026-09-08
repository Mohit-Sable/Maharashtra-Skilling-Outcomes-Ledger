'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trainees, enrolments, employers, courses } from '@/lib/store';
import { useMSOLStore } from '@/lib/store';
import type { WageBand, OutcomeType } from '@/lib/types';
import { ClipboardPlus, Search, CheckCircle2, Briefcase, Users, Wrench } from 'lucide-react';

export default function NewOutcomePage() {
  const router = useRouter();
  const { addOutcomeEvent } = useMSOLStore();
  const [search, setSearch] = useState('');
  const [selectedTrainee, setSelectedTrainee] = useState<string | null>(null);
  const [outcomeType, setOutcomeType] = useState<'job' | 'self' | 'apprentice'>('job');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    employerId: '',
    occupation: '',
    wageBand: '' as WageBand | '',
    jobLocation: '',
    trainingRelevant: true,
    enterpriseName: '',
    activity: '',
    establishment: '',
    stipend: '' as WageBand | '',
  });

  const filteredTrainees = search.length > 2
    ? trainees.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search)).slice(0, 8)
    : [];

  const handleSubmit = () => {
    if (!selectedTrainee) return;
    const enr = enrolments.find(e => e.traineeId === selectedTrainee);
    const typeMap: Record<string, OutcomeType> = { job: 'PLACED', self: 'SELF_EMPLOYED', apprentice: 'APPRENTICE' };

    addOutcomeEvent({
      id: `OE-NEW-${Date.now()}`,
      traineeId: selectedTrainee,
      enrolmentId: enr?.id || '',
      type: typeMap[outcomeType],
      occurredAt: new Date().toISOString().split('T')[0],
      source: 'COUNSELLOR',
      confidence: 'UNVERIFIED',
      employerId: formData.employerId || undefined,
      occupation: formData.occupation || formData.activity || formData.establishment || undefined,
      wageBand: (formData.wageBand || formData.stipend || undefined) as WageBand | undefined,
      jobLocation: formData.jobLocation || undefined,
      trainingRelevant: formData.trainingRelevant,
      notes: outcomeType === 'self' ? `Self-employed: ${formData.enterpriseName}` : undefined,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-navy-900 mb-2">Outcome Recorded</h2>
        <p className="text-sm text-gray-500 mb-6">The outcome event has been added to the trainee&apos;s timeline.</p>
        <button onClick={() => router.push('/trainees')} className="btn-primary">← Back to Trainees</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Capture Outcome</h1>

      {/* Select trainee */}
      {!selectedTrainee && (
        <div className="card p-6">
          <label htmlFor="outcome-search" className="block text-sm font-medium text-gray-700 mb-2">Search Trainee</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input id="outcome-search" type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Type name or MSOL ID..." className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-navy-500" />
          </div>
          {filteredTrainees.length > 0 && (
            <div className="mt-2 border rounded-lg divide-y max-h-48 overflow-y-auto">
              {filteredTrainees.map(tr => (
                <button key={tr.id} onClick={() => setSelectedTrainee(tr.id)} className="w-full text-left px-4 py-3 hover:bg-navy-50 transition-colors">
                  <div className="text-sm font-medium text-navy-900">{tr.name}</div>
                  <div className="text-xs text-gray-500">{tr.id} • {tr.district}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTrainee && (
        <>
          {/* Outcome Type */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-navy-900 mb-3">Outcome Type</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'job' as const, icon: <Briefcase className="w-5 h-5" />, label: 'Job Placement' },
                { key: 'self' as const, icon: <Users className="w-5 h-5" />, label: 'Self-Employment' },
                { key: 'apprentice' as const, icon: <Wrench className="w-5 h-5" />, label: 'Apprenticeship' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setOutcomeType(item.key)}
                  className={`p-4 rounded-lg border text-center transition-colors ${
                    outcomeType === item.key ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:border-navy-300'
                  }`}
                >
                  <div className="flex justify-center mb-2">{item.icon}</div>
                  <div className="text-xs font-medium">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Job form */}
          {outcomeType === 'job' && (
            <div className="card p-6 space-y-4">
              <div>
                <label htmlFor="employer" className="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                <select id="employer" value={formData.employerId} onChange={e => setFormData(f => ({ ...f, employerId: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none">
                  <option value="">Select employer...</option>
                  {employers.map(e => <option key={e.id} value={e.id}>{e.name} ({e.district})</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">Occupation / Role</label>
                <input id="occupation" type="text" value={formData.occupation} onChange={e => setFormData(f => ({ ...f, occupation: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none" />
              </div>
              <div>
                <label htmlFor="wage" className="block text-sm font-medium text-gray-700 mb-1">Wage Band</label>
                <select id="wage" value={formData.wageBand} onChange={e => setFormData(f => ({ ...f, wageBand: e.target.value as WageBand }))} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none">
                  <option value="">Select...</option>
                  <option value="<10k">&lt; ₹10,000</option>
                  <option value="10-15k">₹10,000 - ₹15,000</option>
                  <option value="15-20k">₹15,000 - ₹20,000</option>
                  <option value="20-30k">₹20,000 - ₹30,000</option>
                  <option value="30k+">₹30,000+</option>
                </select>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Job Location</label>
                <input id="location" type="text" value={formData.jobLocation} onChange={e => setFormData(f => ({ ...f, jobLocation: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none" />
              </div>
            </div>
          )}

          {/* Self-employment form */}
          {outcomeType === 'self' && (
            <div className="card p-6 space-y-4">
              <div>
                <label htmlFor="enterprise" className="block text-sm font-medium text-gray-700 mb-1">Enterprise Name</label>
                <input id="enterprise" type="text" value={formData.enterpriseName} onChange={e => setFormData(f => ({ ...f, enterpriseName: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none" />
              </div>
              <div>
                <label htmlFor="udyam" className="block text-sm font-medium text-gray-700 mb-1">Udyam Registration (optional)</label>
                <input id="udyam" type="text" placeholder="MH-XX-XX-XXXXXXX" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none" />
              </div>
              <div>
                <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-1">Business Activity</label>
                <input id="activity" type="text" value={formData.activity} onChange={e => setFormData(f => ({ ...f, activity: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none" />
              </div>
              <div>
                <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">Monthly Income Band</label>
                <select id="income" value={formData.wageBand} onChange={e => setFormData(f => ({ ...f, wageBand: e.target.value as WageBand }))} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none">
                  <option value="">Select...</option>
                  <option value="<10k">&lt; ₹10,000</option>
                  <option value="10-15k">₹10,000 - ₹15,000</option>
                  <option value="15-20k">₹15,000 - ₹20,000</option>
                  <option value="20-30k">₹20,000 - ₹30,000</option>
                  <option value="30k+">₹30,000+</option>
                </select>
              </div>
            </div>
          )}

          {/* Apprenticeship form */}
          {outcomeType === 'apprentice' && (
            <div className="card p-6 space-y-4">
              <div>
                <label htmlFor="establishment" className="block text-sm font-medium text-gray-700 mb-1">Establishment</label>
                <input id="establishment" type="text" value={formData.establishment} onChange={e => setFormData(f => ({ ...f, establishment: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none" />
              </div>
              <div>
                <label htmlFor="stipend" className="block text-sm font-medium text-gray-700 mb-1">Stipend Band</label>
                <select id="stipend" value={formData.stipend} onChange={e => setFormData(f => ({ ...f, stipend: e.target.value as WageBand }))} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none">
                  <option value="">Select...</option>
                  <option value="<10k">&lt; ₹10,000</option>
                  <option value="10-15k">₹10,000 - ₹15,000</option>
                  <option value="15-20k">₹15,000 - ₹20,000</option>
                </select>
              </div>
              <div>
                <label htmlFor="nats" className="block text-sm font-medium text-gray-700 mb-1">NATS Registration (optional)</label>
                <input id="nats" type="text" placeholder="NATS-XXXX" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none" />
              </div>
            </div>
          )}

          <button onClick={handleSubmit} className="btn-primary w-full justify-center py-3">
            <ClipboardPlus className="w-4 h-4" /> Save Outcome
          </button>
        </>
      )}
    </div>
  );
}
