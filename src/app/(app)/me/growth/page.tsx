'use client';

import React from 'react';
import { useMSOLStore } from '@/lib/store';
import { TrendingUp, ArrowUpRight, Building2, UserCircle, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function GrowthPage() {
  const { currentUser, salaryLogs } = useMSOLStore();
  const traineeId = currentUser?.traineeId || 'MSOL-MH-0001';
  
  const salaryLog = salaryLogs.find(s => s.traineeId === traineeId);

  if (!salaryLog || salaryLog.events.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center card bg-gray-50 border-dashed">
        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-700">No Salary Data Yet</h2>
        <p className="text-gray-500 mt-2">Your salary progression will appear here as your career grows and employers verify your placements.</p>
      </div>
    );
  }

  // Convert wage band to numeric for charting
  const bandValues: Record<string, number> = {
    '<10k': 8000,
    '10-15k': 12500,
    '15-20k': 17500,
    '20-30k': 25000,
    '30k+': 35000
  };

  const chartData = salaryLog.events.map(e => ({
    date: new Date(e.at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
    band: e.wageBand,
    value: bandValues[e.wageBand] || 0,
    source: e.source,
    promotion: e.promotion,
    role: e.roleTitle
  }));

  const latestEvent = salaryLog.events[salaryLog.events.length - 1];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <TrendingUp className="w-8 h-8 text-emerald-500" />
        <h1 className="text-2xl font-bold text-navy-900">Career & Salary Growth</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white md:col-span-1">
          <h3 className="text-emerald-100 font-medium text-sm uppercase tracking-wider mb-2">Current Wage Band</h3>
          <div className="text-4xl font-black">{latestEvent.wageBand}</div>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-50">
            <UserCircle className="w-4 h-4" /> Source: {latestEvent.source}
          </div>
        </div>

        <div className="card p-6 md:col-span-2">
          <h3 className="font-semibold text-navy-900 mb-6">Salary Trajectory (Estimated INR/month)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(val: any) => [`₹${val.toLocaleString('en-IN')}`, 'Est. Avg']}
                  labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10b981' }}
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-navy-900 mb-6">Milestones & Promotions</h3>
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gray-200">
          {salaryLog.events.slice().reverse().map((e, i) => (
            <div key={i} className="relative flex items-center gap-6 pl-14">
              <div className={`absolute left-0 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center z-10 shadow-sm ${e.promotion ? 'bg-saffron-500 text-white' : 'bg-navy-100 text-navy-500'}`}>
                {e.promotion ? <ArrowUpRight className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg w-full">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-navy-900">{e.wageBand} {e.promotion && <span className="ml-2 text-xs bg-saffron-100 text-saffron-800 px-2 py-0.5 rounded-full uppercase tracking-wider">Promotion</span>}</div>
                  <div className="text-sm text-gray-500">{formatDate(e.at)}</div>
                </div>
                {e.roleTitle && <div className="text-sm text-gray-700">{e.roleTitle}</div>}
                <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified via {e.source}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
