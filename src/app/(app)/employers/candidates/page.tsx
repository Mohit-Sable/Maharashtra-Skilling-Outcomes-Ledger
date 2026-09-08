'use client';

import React, { useState } from 'react';
import { useMSOLStore, trainees } from '@/lib/store';
import { Search, MapPin, CheckCircle2, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function CandidatesPage() {
  const { skillPassports } = useMSOLStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Only show trainees who have matchingShare enabled
  const searchablePassports = skillPassports.filter(p => {
    const t = trainees.find(tr => tr.id === p.traineeId);
    return t?.consent.matchingShare !== false; // true or undefined
  });

  const filtered = searchablePassports.filter(p => {
    if (!searchTerm) return true;
    const t = trainees.find(tr => tr.id === p.traineeId);
    const searchLower = searchTerm.toLowerCase();
    
    return (
      t?.name.toLowerCase().includes(searchLower) ||
      t?.district.toLowerCase().includes(searchLower) ||
      p.skills.some(s => s.tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Candidate Search (Engineering Students)</h1>
          <p className="text-gray-600">Browse verified Skill Passports for campus hiring & internships.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by skill (e.g. SolidWorks, SQL), branch..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-saffron-50 border border-saffron-200 p-4 rounded-lg flex gap-3 text-saffron-800 text-sm">
        <EyeOff className="w-5 h-5 shrink-0" />
        <p><strong>Privacy First:</strong> {skillPassports.length - searchablePassports.length} candidates are hidden because they opted out of employer matching (DPDP compliance).</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(passport => {
          const t = trainees.find(tr => tr.id === passport.traineeId);
          if (!t) return null;

          return (
            <div key={passport.id} className="card p-6 flex flex-col h-full hover:border-navy-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center text-xl font-bold text-navy-700">
                    {t.avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">{t.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {t.district}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Verified Skills</h4>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {passport.skills.filter(s => s.verified).slice(0, 5).map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs rounded-full flex items-center gap-1">
                      {s.tag} <CheckCircle2 className="w-3 h-3" />
                    </span>
                  ))}
                  {passport.skills.filter(s => s.verified).length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{passport.skills.filter(s => s.verified).length - 5} more
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <Link href={`/passport/${t.id}`} className="btn-secondary w-full justify-center text-sm">
                  View Skill Passport
                </Link>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed rounded-lg">
            No candidates found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
