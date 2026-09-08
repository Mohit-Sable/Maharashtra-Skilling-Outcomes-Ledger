'use client';

import React, { useState } from 'react';
import { useMSOLStore, trainees, skillPassports } from '@/lib/store';
import { Search, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function PassportRegistryPage() {
  const { language } = useMSOLStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = skillPassports.filter(p => {
    if (!searchTerm) return true;
    const t = trainees.find(tr => tr.id === p.traineeId);
    return t?.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()) || p.apaarId.includes(searchTerm);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Skill Passport Registry</h1>
          <p className="text-gray-600">State-wide registry of active trainee Skill Passports.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, Passport ID, APAAR..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-600">Trainee</th>
              <th className="p-4 font-semibold text-gray-600">Passport ID</th>
              <th className="p-4 font-semibold text-gray-600">APAAR (Mock)</th>
              <th className="p-4 font-semibold text-gray-600">Verified Skills</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(passport => {
              const t = trainees.find(tr => tr.id === passport.traineeId);
              if (!t) return null;
              
              const verifiedCount = passport.skills.filter(s => s.verified).length;

              return (
                <tr key={passport.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-navy-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.district}</div>
                  </td>
                  <td className="p-4 font-mono text-xs text-gray-600">{passport.id}</td>
                  <td className="p-4 font-mono text-xs text-gray-600 flex items-center gap-1 mt-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {passport.apaarId}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                      {verifiedCount} verified
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                      {passport.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link href={`/passport/${t.id}`} className="text-navy-600 hover:text-navy-800 font-medium text-sm">
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No passports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
