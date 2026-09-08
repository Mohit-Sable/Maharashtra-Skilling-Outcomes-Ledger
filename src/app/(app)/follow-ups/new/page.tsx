'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trainees, enrolments } from '@/lib/store';
import { useMSOLStore } from '@/lib/store';
import type { WageBand, NonPlacementReasonCode } from '@/lib/types';
import { ClipboardPlus, Search, CheckCircle2 } from 'lucide-react';

export default function NewFollowUpPage() {
  const router = useRouter();
  const { addOutcomeEvent, updateFollowUp, followUps } = useMSOLStore();
  const [search, setSearch] = useState('');
  const [selectedTrainee, setSelectedTrainee] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    working: null as boolean | null,
    sameEmployer: null as boolean | null,
    wageBand: '' as WageBand | '',
    trainingUsed: null as boolean | null,
    reason: '' as NonPlacementReasonCode | '',
    missingSkills: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const filteredTrainees = search.length > 2
    ? trainees.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search))
    : [];

  const handleSubmit = () => {
    if (!selectedTrainee) return;
    const enr = enrolments.find(e => e.traineeId === selectedTrainee);
    addOutcomeEvent({
      id: `OE-MANUAL-${Date.now()}`,
      traineeId: selectedTrainee,
      enrolmentId: enr?.id || '',
      type: answers.working ? 'RETAINED' : 'NOT_PLACED',
      occurredAt: new Date().toISOString().split('T')[0],
      source: 'COUNSELLOR',
      confidence: 'UNVERIFIED',
      wageBand: (answers.wageBand as WageBand) || undefined,
      notes: `Follow-up survey. ${answers.reason ? `Reason: ${answers.reason}` : ''} ${answers.missingSkills ? `Missing skills: ${answers.missingSkills}` : ''}`,
    });
    
    // Update any pending follow-up
    const pending = followUps.find(f => f.traineeId === selectedTrainee && f.status === 'PENDING');
    if (pending) {
      updateFollowUp(pending.id, { status: 'COMPLETED', completedAt: new Date().toISOString().split('T')[0] });
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-navy-900 mb-2">Follow-up Recorded</h2>
        <p className="text-sm text-gray-500 mb-6">The outcome event has been added to the student&apos;s timeline.</p>
        <button onClick={() => router.push('/follow-ups')} className="btn-primary">← Back to Follow-ups</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">New Follow-up Survey</h1>
      <p className="text-sm text-gray-500">Assisted survey — max 6 questions</p>

      {/* Step 1: Select student */}
      {!selectedTrainee && (
        <div className="card p-6">
          <label htmlFor="trainee-search" className="block text-sm font-medium text-gray-700 mb-2">Search Student / Graduate</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="trainee-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Type name or MSOL ID..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-navy-500"
            />
          </div>
          {filteredTrainees.length > 0 && (
            <div className="mt-2 border rounded-lg divide-y max-h-60 overflow-y-auto">
              {filteredTrainees.slice(0, 10).map(tr => (
                <button
                  key={tr.id}
                  onClick={() => setSelectedTrainee(tr.id)}
                  className="w-full text-left px-4 py-3 hover:bg-navy-50 transition-colors"
                >
                  <div className="text-sm font-medium text-navy-900">{tr.name}</div>
                  <div className="text-xs text-gray-500">{tr.id} • {tr.district}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Survey Questions */}
      {selectedTrainee && (
        <div className="card p-6 space-y-6">
          <div className="p-3 rounded-lg bg-navy-50 border border-navy-100">
            <div className="text-sm font-medium text-navy-900">
              {trainees.find(t => t.id === selectedTrainee)?.name}
            </div>
            <div className="text-xs text-navy-600">{selectedTrainee}</div>
          </div>

          {/* Q1: Working? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1. Are you currently working? / तुम्ही सध्या काम करत आहात का?
            </label>
            <div className="flex gap-3">
              {[true, false].map(v => (
                <button
                  key={String(v)}
                  onClick={() => setAnswers(a => ({ ...a, working: v }))}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    answers.working === v ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:border-navy-300'
                  }`}
                >
                  {v ? 'Yes / हो' : 'No / नाही'}
                </button>
              ))}
            </div>
          </div>

          {/* Q2-Q4 for working */}
          {answers.working === true && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. Same employer? / तोच नियोक्ता?
                </label>
                <div className="flex gap-3">
                  {[true, false].map(v => (
                    <button
                      key={String(v)}
                      onClick={() => setAnswers(a => ({ ...a, sameEmployer: v }))}
                      className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                        answers.sameEmployer === v ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:border-navy-300'
                      }`}
                    >
                      {v ? 'Yes / हो' : 'No / नाही'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="wage" className="block text-sm font-medium text-gray-700 mb-2">
                  3. Current monthly wage band? / सध्याची मासिक वेतन श्रेणी?
                </label>
                <select
                  id="wage"
                  value={answers.wageBand}
                  onChange={e => setAnswers(a => ({ ...a, wageBand: e.target.value as WageBand }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-navy-500"
                >
                  <option value="">Select...</option>
                  <option value="<10k">Less than ₹10,000</option>
                  <option value="10-15k">₹10,000 - ₹15,000</option>
                  <option value="15-20k">₹15,000 - ₹20,000</option>
                  <option value="20-30k">₹20,000 - ₹30,000</option>
                  <option value="30k+">₹30,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  4. Is training used on the job? / प्रशिक्षण नोकरीत वापरले जाते का?
                </label>
                <div className="flex gap-3">
                  {[true, false].map(v => (
                    <button
                      key={String(v)}
                      onClick={() => setAnswers(a => ({ ...a, trainingUsed: v }))}
                      className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                        answers.trainingUsed === v ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-600 border-gray-200 hover:border-navy-300'
                      }`}
                    >
                      {v ? 'Yes / हो' : 'No / नाही'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Q5-Q6 for not working */}
          {answers.working === false && (
            <>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  5. Primary reason for not working? / काम न करण्याचे प्रमुख कारण?
                </label>
                <select
                  id="reason"
                  value={answers.reason}
                  onChange={e => setAnswers(a => ({ ...a, reason: e.target.value as NonPlacementReasonCode }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-navy-500"
                >
                  <option value="">Select reason...</option>
                  <option value="NO_VACANCY">No vacancy available / रिक्त जागा नाही</option>
                  <option value="WAGE_TOO_LOW">Wage too low / वेतन खूप कमी</option>
                  <option value="LOCATION">Location issue / स्थान समस्या</option>
                  <option value="LANGUAGE">Language barrier / भाषा अडथळा</option>
                  <option value="MISSING_SKILL">Missing skill / कौशल्य नाही</option>
                  <option value="FAMILY">Family reasons / कौटुंबिक कारणे</option>
                  <option value="HEALTH">Health issue / आरोग्य समस्या</option>
                  <option value="MIGRATION">Migrated / स्थलांतर</option>
                  <option value="FAKE_LEAD">Fake placement lead / बनावट</option>
                  <option value="EMPLOYER_REJECTED">Employer rejected / नियोक्त्याने नाकारले</option>
                  <option value="DOCUMENT_ISSUE">Document issue / कागदपत्र समस्या</option>
                  <option value="OTHER">Other / इतर</option>
                </select>
              </div>

              <div>
                <label htmlFor="missing-skills" className="block text-sm font-medium text-gray-700 mb-2">
                  6. Missing skills? / कोणते कौशल्य कमी आहे? (comma separated)
                </label>
                <input
                  id="missing-skills"
                  type="text"
                  value={answers.missingSkills}
                  onChange={e => setAnswers(a => ({ ...a, missingSkills: e.target.value }))}
                  placeholder="e.g. Spoken English, SolidWorks, SQL, GD&T..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-navy-500"
                />
              </div>
            </>
          )}

          {answers.working !== null && (
            <button onClick={handleSubmit} className="btn-primary w-full justify-center py-3">
              <ClipboardPlus className="w-4 h-4" /> Submit Follow-up
            </button>
          )}
        </div>
      )}
    </div>
  );
}
