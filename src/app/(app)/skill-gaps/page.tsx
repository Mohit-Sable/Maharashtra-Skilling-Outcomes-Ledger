'use client';

import React from 'react';
import { getSkillGaps } from '@/lib/seed';
import { useMSOLStore, courses, nonPlacementReasons, districts, assessments, employerFeedback } from '@/lib/store';
import { t } from '@/lib/i18n';
import { PieChart as PieChartIcon, AlertTriangle, BookOpen, Lightbulb, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SkillGapsPage() {
  const { language } = useMSOLStore();
  const gaps = getSkillGaps();

  // Heatmap data: course × skill
  const courseNames = [...new Set(gaps.map(g => g.courseName))];
  const skills = [...new Set(gaps.map(g => g.skill))].slice(0, 12);

  // Top non-placement reasons by district
  const reasonByDistrict = districts.map(d => {
    const distNPR = nonPlacementReasons.filter(npr => {
      // Not efficient but fine for demo
      return true;
    });
    const reasonCounts: Record<string, number> = {};
    nonPlacementReasons.forEach(npr => {
      reasonCounts[npr.reason] = (reasonCounts[npr.reason] || 0) + 1;
    });
    const topReason = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0];
    return { district: d.name, topReason: topReason?.[0] || 'N/A', count: topReason?.[1] || 0 };
  });

  // Remedial action cards
  const remedialActions = [
    {
      course: 'B.E. Mechanical Engineering',
      district: 'Pune / Nashik',
      action: 'Mandate 30-Hour Hands-On SolidWorks & GD&T Lab',
      reason: '55% of non-placed mechanical candidates cite MISSING_SKILL in CAD/GD&T during OEM technical rounds',
      priority: 'high' as const,
    },
    {
      course: 'B.E. Computer Engineering (CSE)',
      district: 'All',
      action: 'Add Relational SQL Query Optimization & Advanced Indexing',
      reason: 'Employer feedback across Pune IT firms shows 40% of fresh hires struggle with production database queries',
      priority: 'high' as const,
    },
    {
      course: 'B.E. Civil Engineering',
      district: 'Mumbai Suburban',
      action: 'Integrate AutoCAD Civil & Site Quantity Estimation Field Practicals',
      reason: 'Infrastructure contractors require total station & quantity takeoff skills; syllabus currently over-indexes on paper theory',
      priority: 'medium' as const,
    },
    {
      course: 'B.E. Electronics & Telecommunication (ENTC)',
      district: 'Nashik / CSN',
      action: 'Add Embedded C & Industrial PLC Microcontroller Practicals',
      reason: 'Automotive embedded firms report graduates lack familiarity with RTOS and CAN/I2C protocols',
      priority: 'medium' as const,
    },
  ];

  // Phase 2: Assessment Gaps vs Employer Feedback Gaps
  const assessmentGapsMap: Record<string, number> = {};
  assessments.forEach(a => {
    a.weaknesses.forEach(w => {
      assessmentGapsMap[w] = (assessmentGapsMap[w] || 0) + 1;
    });
  });

  const employerGapsMap: Record<string, number> = {};
  employerFeedback.forEach(f => {
    f.missingSkillTags.forEach(t => {
      employerGapsMap[t] = (employerGapsMap[t] || 0) + 1;
    });
  });

  const combinedGapKeys = Array.from(new Set([...Object.keys(assessmentGapsMap), ...Object.keys(employerGapsMap)])).slice(0, 8);
  const comparisonData = combinedGapKeys.map(key => ({
    skill: key.length > 15 ? key.slice(0, 15) + '…' : key,
    assessment: assessmentGapsMap[key] || 0,
    employer: employerGapsMap[key] || 0,
    fullSkill: key
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{t('nav.skillgaps', language)}</h1>
        <p className="text-sm text-gray-500">Course × missing skill analysis with remedial recommendations</p>
      </div>

      {/* Heatmap */}
      <div className="card">
        <h3 className="text-sm font-semibold text-navy-900 mb-4">Skill Gap Heatmap: Course × Missing Skill</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-2 font-semibold text-gray-500 sticky left-0 bg-white">Course</th>
                {skills.map(s => (
                  <th key={s} className="p-2 font-medium text-gray-500 text-center min-w-[80px] whitespace-nowrap">
                    <span className="writing-mode-vertical" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: '100px' }}>{s}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courseNames.map(course => (
                <tr key={course} className="border-t border-gray-100">
                  <td className="p-2 font-medium text-navy-900 sticky left-0 bg-white whitespace-nowrap">{course}</td>
                  {skills.map(skill => {
                    const gap = gaps.find(g => g.courseName === course && g.skill === skill);
                    const count = gap?.count || 0;
                    const intensity = count === 0 ? 'bg-gray-50' :
                      count <= 2 ? 'bg-amber-100' :
                      count <= 5 ? 'bg-amber-300' :
                      count <= 10 ? 'bg-red-300' : 'bg-red-500 text-white';
                    return (
                      <td key={skill} className={`p-2 text-center ${intensity} font-medium`}>
                        {count > 0 ? count : ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span>Intensity:</span>
          <span className="flex items-center gap-1"><span className="w-4 h-3 bg-gray-50 rounded border"></span> 0</span>
          <span className="flex items-center gap-1"><span className="w-4 h-3 bg-amber-100 rounded"></span> 1-2</span>
          <span className="flex items-center gap-1"><span className="w-4 h-3 bg-amber-300 rounded"></span> 3-5</span>
          <span className="flex items-center gap-1"><span className="w-4 h-3 bg-red-300 rounded"></span> 6-10</span>
          <span className="flex items-center gap-1"><span className="w-4 h-3 bg-red-500 rounded"></span> 10+</span>
        </div>
      </div>

      {/* Comparison: Assessment vs Employer Gaps */}
      <div className="card">
        <h3 className="text-sm font-semibold text-navy-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" /> Assessment Gaps (AI) vs Observed Gaps (Employers)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="skill" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="assessment" name="AI Assessment Gaps" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="employer" name="Employer Feedback Gaps" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sankey-like Flow */}
      <div className="card">
        <h3 className="text-sm font-semibold text-navy-900 mb-4">Outcome Flow: Certified → Outcome</h3>
        <div className="flex items-center justify-center gap-0 py-6">
          {/* Certified */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-xl bg-blue-500 text-white flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">196</div>
              <div className="text-[10px]">Certified</div>
            </div>
          </div>

          {/* Flow lines */}
          <div className="flex flex-col gap-1 mx-2">
            <div className="h-3 bg-emerald-400 rounded" style={{ width: '120px' }}></div>
            <div className="h-2 bg-red-400 rounded" style={{ width: '80px' }}></div>
            <div className="h-1.5 bg-gray-300 rounded" style={{ width: '60px' }}></div>
            <div className="h-1 bg-blue-400 rounded" style={{ width: '50px' }}></div>
          </div>

          {/* Outcomes */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-20 h-12 rounded-lg bg-emerald-500 text-white flex flex-col items-center justify-center">
                <div className="text-sm font-bold">68%</div>
                <div className="text-[8px]">Placed</div>
              </div>
              <div className="flex flex-col gap-1 ml-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 bg-emerald-400 rounded" style={{ width: '40px' }}></div>
                  <div className="w-14 h-8 rounded bg-emerald-600 text-white flex flex-col items-center justify-center text-[8px]">
                    <div className="font-bold">46%</div>Retained
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 bg-red-300 rounded" style={{ width: '30px' }}></div>
                  <div className="w-14 h-8 rounded bg-red-500 text-white flex flex-col items-center justify-center text-[8px]">
                    <div className="font-bold">14%</div>Left
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 bg-gray-300 rounded" style={{ width: '20px' }}></div>
                  <div className="w-14 h-8 rounded bg-gray-400 text-white flex flex-col items-center justify-center text-[8px]">
                    <div className="font-bold">8%</div>Unreach.
                  </div>
                </div>
              </div>
            </div>
            <div className="w-20 h-10 rounded-lg bg-red-400 text-white flex flex-col items-center justify-center">
              <div className="text-sm font-bold">20%</div>
              <div className="text-[8px]">Not Placed</div>
            </div>
            <div className="w-20 h-8 rounded-lg bg-blue-400 text-white flex flex-col items-center justify-center">
              <div className="text-xs font-bold">12%</div>
              <div className="text-[8px]">Self-Emp/Appr</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Reasons Table */}
      <div className="card">
        <h3 className="text-sm font-semibold text-navy-900 mb-4">Top Non-Placement Reasons</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reason</th>
                <th>Count</th>
                <th>% of Non-Placed</th>
                <th>Common Missing Skills</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const reasonCounts: Record<string, { count: number; skills: string[] }> = {};
                nonPlacementReasons.forEach(npr => {
                  if (!reasonCounts[npr.reason]) reasonCounts[npr.reason] = { count: 0, skills: [] };
                  reasonCounts[npr.reason].count++;
                  reasonCounts[npr.reason].skills.push(...npr.missingSkillTags);
                });
                const total = nonPlacementReasons.length;
                return Object.entries(reasonCounts)
                  .sort((a, b) => b[1].count - a[1].count)
                  .slice(0, 8)
                  .map(([reason, data]) => (
                    <tr key={reason}>
                      <td className="font-medium text-navy-900">{reason.replace(/_/g, ' ')}</td>
                      <td className="font-bold">{data.count}</td>
                      <td>{Math.round((data.count / total) * 100)}%</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {[...new Set(data.skills)].slice(0, 3).map(s => (
                            <span key={s} className="chip chip-self-reported text-[10px]">{s}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remedial Action Cards */}
      <div>
        <h3 className="text-sm font-semibold text-navy-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-saffron-500" />
          Remedial Action Recommendations
        </h3>
        <div className="space-y-4">
          {remedialActions.map((action, i) => (
            <div key={i} className={`p-4 rounded-lg border-l-4 border-l-red-500 bg-red-50`}>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-red-900">{action.action}</h4>
              </div>
              <p className="text-sm text-red-700 font-medium mb-1">{action.course} • {action.district}</p>
              <p className="text-sm text-red-600 bg-white/50 p-2 rounded">
                <strong className="text-red-800">Insight:</strong> {action.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
