'use client';

import React from 'react';
import { useMSOLStore, trainees } from '@/lib/store';
import { BrainCircuit, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function AssessmentsRegistryPage() {
  const { assessments } = useMSOLStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-saffron-500" /> Assessments Registry
          </h1>
          <p className="text-gray-600">Overview of AI skill assessments taken by trainees.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map(assessment => {
          const trainee = trainees.find(t => t.id === assessment.traineeId);
          if (!trainee) return null;

          return (
            <div key={assessment.id} className="card p-6 flex flex-col h-full hover:border-navy-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-navy-900">{trainee.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">MSOL ID: {trainee.id}</p>
                </div>
                <div className="text-xs text-gray-400">{formatDate(assessment.takenAt)}</div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Target Career</h4>
                  <p className="text-sm font-medium text-navy-800">{assessment.targetCareer}</p>
                </div>

                {assessment.weaknesses.length > 0 ? (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <h4 className="text-xs font-semibold text-red-800 uppercase tracking-wider flex items-center gap-1 mb-2">
                      <AlertCircle className="w-3 h-3" /> Identified Gaps
                    </h4>
                    <ul className="space-y-1">
                      {assessment.weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-red-700">{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-sm text-emerald-800">
                    Strong performance. No major gaps.
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <Link href={`/passport/${trainee.id}`} className="text-navy-600 hover:text-navy-800 font-medium text-sm">
                  View Skill Passport
                </Link>
              </div>
            </div>
          );
        })}
        {assessments.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed rounded-lg">
            No assessments recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
