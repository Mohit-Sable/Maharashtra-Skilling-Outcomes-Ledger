'use client';

import React, { useState } from 'react';
import { useMSOLStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Briefcase, CheckCircle2 } from 'lucide-react';
import type { Opportunity } from '@/lib/types';

export default function PostOpportunityPage() {
  const router = useRouter();
  const { currentUser, opportunities } = useMSOLStore();
  const employerId = currentUser?.employerId || 'EMP-001';

  const [formData, setFormData] = useState({
    kind: 'JOB' as 'JOB' | 'INTERNSHIP',
    title: '',
    occupation: '',
    district: '',
    stipendOrWageBand: '',
    openings: 1,
    skillTagsRequired: '',
    careerGoalTags: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // Expose a raw set action from store just for this demo, or we can just append it locally for the demo session.
  // We didn't add postOpportunity to store.ts earlier, so we'll just push to the array (which won't trigger re-render in other tabs immediately if not using set(), but good enough for a single session if we just redirect to opportunities list, or we can use set() via a small trick).
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOpp: Opportunity = {
      id: `OPP-${Date.now()}`,
      kind: formData.kind,
      employerId,
      title: formData.title,
      occupation: formData.occupation,
      district: formData.district,
      stipendOrWageBand: formData.stipendOrWageBand,
      openings: formData.openings,
      skillTagsRequired: formData.skillTagsRequired.split(',').map(s => s.trim()).filter(Boolean),
      skillTagsNice: [],
      careerGoalTags: formData.careerGoalTags.split(',').map(s => s.trim()).filter(Boolean),
      postedAt: new Date().toISOString().split('T')[0],
      status: 'OPEN'
    };
    
    // Instead of adding a new action, we can just push it for the demo, but it's better to update the store properly.
    useMSOLStore.setState(state => ({ opportunities: [newOpp, ...state.opportunities] }));
    
    setSubmitted(true);
    setTimeout(() => {
      router.push('/opportunities');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center card mt-10">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-navy-900">Successfully Posted</h1>
        <p className="text-gray-600 mt-2">Your {formData.kind.toLowerCase()} has been published to the MSOL network.</p>
        <p className="text-sm text-gray-500 mt-4">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-6 h-6 text-saffron-500" />
        <h1 className="text-2xl font-bold text-navy-900">Post an Opportunity</h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500"
              value={formData.kind}
              onChange={e => setFormData({ ...formData, kind: e.target.value as any })}
            >
              <option value="JOB">Job</option>
              <option value="INTERNSHIP">Internship / Apprenticeship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Openings</label>
            <input 
              type="number" min="1" required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500"
              value={formData.openings}
              onChange={e => setFormData({ ...formData, openings: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input 
            type="text" required placeholder="e.g. Graduate Engineer Trainee (GET) - Mechanical"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Occupation</label>
            <input 
              type="text" required placeholder="e.g. Mechanical Engineer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500"
              value={formData.occupation}
              onChange={e => setFormData({ ...formData, occupation: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Career Goal Tags (comma separated)</label>
            <input 
              type="text" required placeholder="e.g. Mechanical Engineer, Design Engineer, GET"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500"
              value={formData.careerGoalTags}
              onChange={e => setFormData({ ...formData, careerGoalTags: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input 
              type="text" required placeholder="e.g. Pune"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500"
              value={formData.district}
              onChange={e => setFormData({ ...formData, district: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wage / Stipend Band</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500"
              value={formData.stipendOrWageBand}
              onChange={e => setFormData({ ...formData, stipendOrWageBand: e.target.value })}
            >
              <option value="">Select Band...</option>
              <option value="<10k">&lt;10k</option>
              <option value="10-15k">10-15k</option>
              <option value="15-20k">15-20k</option>
              <option value="20-30k">20-30k</option>
              <option value="30k+">30k+</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated)</label>
          <input 
            type="text" required placeholder="e.g. SolidWorks, GD&T, AutoCAD"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500"
            value={formData.skillTagsRequired}
            onChange={e => setFormData({ ...formData, skillTagsRequired: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">MSOL AI will match candidates based on these skills.</p>
        </div>

        <div className="pt-4">
          <button type="submit" className="btn-primary w-full justify-center">Post {formData.kind === 'JOB' ? 'Job' : 'Internship'}</button>
        </div>
      </form>
    </div>
  );
}
