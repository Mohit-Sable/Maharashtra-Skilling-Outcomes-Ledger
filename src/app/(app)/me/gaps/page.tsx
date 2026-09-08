'use client';

import React from 'react';
import { useMSOLStore } from '@/lib/store';
import { Target, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GapsPage() {
  const { currentUser, skillPassports, assessments } = useMSOLStore();
  const traineeId = currentUser?.traineeId || 'MSOL-MH-0001';
  
  const passport = skillPassports.find(p => p.traineeId === traineeId);
  const assessment = assessments.find(a => a.traineeId === traineeId);

  if (!passport) return <div className="p-6">Passport not found</div>;

  const goal = passport.careerGoal?.targetOccupation || 'Not set';
  
  // Aggregate missing skills from assessment and employer feedback (which updates passport)
  // But wait, passport.skills has the verified ones.
  // Assessment has `missingForTarget`.
  const missingSkills = assessment ? assessment.missingForTarget : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Skill Gap Analysis</h1>

      <div className="card p-6 border-t-4 border-t-saffron-500">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-saffron-50 rounded-full flex items-center justify-center text-saffron-600 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Target Career</h2>
            <div className="text-xl font-bold text-navy-900 mt-1">{goal}</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-saffron-500" /> Critical Missing Skills
        </h3>
        
        {missingSkills.length === 0 ? (
          <div className="text-gray-500 text-sm">No critical gaps identified. Keep up the good work!</div>
        ) : (
          <div className="space-y-3">
            {missingSkills.map((skill, i) => (
              <div key={i} className="p-3 bg-red-50 border border-red-100 rounded-lg flex justify-between items-center">
                <span className="font-medium text-red-900">{skill}</span>
                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Required for {goal}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {missingSkills.length > 0 && (
        <div className="flex justify-end mt-6">
          <Link href="/me/roadmap" className="btn-primary">
            Generate Learning Roadmap <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
}
