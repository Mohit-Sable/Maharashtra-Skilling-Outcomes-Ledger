'use client';

import React, { useState } from 'react';
import { useMSOLStore, trainees } from '@/lib/store';
import { useRouter, useParams } from 'next/navigation';
import { MessageSquare, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { EmployerFeedback } from '@/lib/types';

export default function EmployerFeedbackPage() {
  const params = useParams();
  const traineeId = params.traineeId as string;
  const router = useRouter();
  const { currentUser, submitEmployerFeedback } = useMSOLStore();
  const trainee = trainees.find(t => t.id === traineeId);
  
  const employerId = currentUser?.employerId || 'EMP-001';

  const [ratings, setRatings] = useState({
    technical: 0,
    workplaceReadiness: 0,
    communication: 0,
    safety: 0,
    retentionLikelihood: 0
  });
  
  const [missingSkills, setMissingSkills] = useState('');
  const [wouldHireAgain, setWouldHireAgain] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!trainee) return <div className="p-6">Student not found.</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wouldHireAgain === null) return alert('Please select if you would hire again.');

    const feedback: EmployerFeedback = {
      id: `FB-${Date.now()}`,
      employerId,
      traineeId: trainee.id,
      occurredAt: new Date().toISOString(),
      ratings,
      missingSkillTags: missingSkills.split(',').map(s => s.trim()).filter(Boolean),
      wouldHireAgain,
      notes
    };

    submitEmployerFeedback(feedback);
    setSubmitted(true);
  };

  const renderStars = (key: keyof typeof ratings, label: string) => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-700 mb-2 sm:mb-0">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setRatings({ ...ratings, [key]: star })}
            className="p-1 focus:outline-none focus:ring-2 focus:ring-navy-500 rounded"
          >
            <Star className={`w-6 h-6 ${ratings[key] >= star ? 'fill-saffron-500 text-saffron-500' : 'text-gray-300'}`} />
          </button>
        ))}
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center card mt-10">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-navy-900">Feedback Submitted</h1>
        <p className="text-gray-600 mt-2">Thank you! Your feedback updates MSOL's AI skill-gap map and helps improve future training.</p>
        <button onClick={() => router.push('/employers')} className="btn-primary mt-6">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-saffron-500" />
        <h1 className="text-2xl font-bold text-navy-900">Structured Employer Feedback</h1>
      </div>

      <div className="card p-6 bg-navy-50 border-navy-100 mb-6 flex gap-4 items-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold text-navy-700 shadow-sm">
          {trainee.avatarInitials}
        </div>
        <div>
          <h2 className="font-bold text-navy-900">{trainee.name}</h2>
          <p className="text-sm text-gray-600">MSOL ID: {trainee.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Performance Ratings</h3>
          <div className="space-y-1">
            {renderStars('technical', 'Technical / Trade Skills')}
            {renderStars('workplaceReadiness', 'Workplace Readiness & Punctuality')}
            {renderStars('communication', 'Communication & Teamwork')}
            {renderStars('safety', 'Safety & Compliance')}
            {renderStars('retentionLikelihood', 'Likelihood of Long-Term Retention')}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Skill Gaps & Notes</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observed Missing Skills (comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. SQL, Data Structures & Algorithms, SolidWorks, GD&T"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500"
              value={missingSkills}
              onChange={e => setMissingSkills(e.target.value)}
            />
            <p className="text-xs text-saffron-600 mt-2 font-medium bg-saffron-50 p-2 rounded">
              Note: Skills entered here will be flagged on the student&apos;s Skill Passport and aggregated for State curriculum & policy planning.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Would you hire this candidate again (or keep them)?</label>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setWouldHireAgain(true)}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${wouldHireAgain === true ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-gray-300 text-gray-600'}`}
              >
                Yes
              </button>
              <button 
                type="button" 
                onClick={() => setWouldHireAgain(false)}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${wouldHireAgain === false ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-300 text-gray-600'}`}
              >
                No
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea 
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500 resize-none"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any qualitative feedback..."
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
          Submit Feedback to Ledger <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </form>
    </div>
  );
}
