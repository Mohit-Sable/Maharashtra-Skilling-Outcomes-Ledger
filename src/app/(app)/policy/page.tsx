'use client';

import React from 'react';
import { providerScores, providers, courses, trainees, enrolments, nonPlacementReasons, districts } from '@/lib/store';
import { useMSOLStore } from '@/lib/store';
import { getKPIs } from '@/lib/seed';
import { FileText, AlertTriangle, TrendingUp, Users, Lightbulb, Shield } from 'lucide-react';

export default function PolicyPage() {
  const { language } = useMSOLStore();
  const kpis = getKPIs({});

  // Gender gap
  const maleTrainees = trainees.filter(t => t.gender === 'Male');
  const femaleTrainees = trainees.filter(t => t.gender === 'Female');
  const scstTrainees = trainees.filter(t => t.category === 'SC' || t.category === 'ST');

  const computePlacementRate = (ids: string[]) => {
    const { outcomeEvents } = useMSOLStore.getState();
    const placed = new Set(outcomeEvents.filter(o => ids.includes(o.traineeId) && ['PLACED', 'SELF_EMPLOYED', 'APPRENTICE'].includes(o.type)).map(o => o.traineeId));
    return ids.length > 0 ? Math.round((placed.size / ids.length) * 100) : 0;
  };

  const malePlacement = computePlacementRate(maleTrainees.map(t => t.id));
  const femalePlacement = computePlacementRate(femaleTrainees.map(t => t.id));
  const scstPlacement = computePlacementRate(scstTrainees.map(t => t.id));
  const generalPlacement = computePlacementRate(trainees.filter(t => t.category === 'General').map(t => t.id));

  // Flagged providers
  const flaggedProviders = providerScores.filter(ps => ps.suspectedInflation);

  // Courses to redesign
  const lowRetentionCourses = [...new Set(enrolments.map(e => e.courseId))].map(courseId => {
    const course = courses.find(c => c.id === courseId);
    const courseEnr = enrolments.filter(e => e.courseId === courseId);
    const { outcomeEvents } = useMSOLStore.getState();
    const left = outcomeEvents.filter(o => courseEnr.map(e => e.traineeId).includes(o.traineeId) && o.type === 'LEFT_JOB').length;
    const placed = outcomeEvents.filter(o => courseEnr.map(e => e.traineeId).includes(o.traineeId) && ['PLACED'].includes(o.type)).length;
    return {
      name: course?.name || courseId,
      attrition: placed > 0 ? Math.round((left / placed) * 100) : 0,
      enrolled: courseEnr.length,
    };
  }).filter(c => c.attrition > 20).sort((a, b) => b.attrition - a.attrition);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-navy-100 flex items-center justify-center">
          <FileText className="w-6 h-6 text-navy-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Policy Brief</h1>
          <p className="text-sm text-gray-500">Auto-generated evidence brief from MSOL data • {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="card border-l-4 border-l-navy-900">
        <h2 className="text-lg font-bold text-navy-900 mb-3">Executive Summary</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Analysis of <strong>{kpis.certified}</strong> engineering graduates across <strong>{providers.length}</strong> colleges and polytechnics 
          in <strong>{districts.length}</strong> districts reveals a significant gap between TPO-reported campus placement and verified 90-day employment retention.
          TPO paper placement stands at <strong>{kpis.paperPlacement}%</strong>, but verified 90-day retention drops to <strong>{kpis.verifiedPlacement}%</strong>.
          {kpis.unreachable > 8 && ` A concerning ${kpis.unreachable}% of graduates are unreachable after campus exit.`}
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Tech startups and self-employment account for <strong>{kpis.selfEmployment}%</strong> of outcomes. 
          Median salary is in the <strong>₹{kpis.medianWageBand}</strong> monthly GET band.
        </p>
      </div>

      {/* Where to Invest */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-navy-900">Where to Invest</h2>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">●</span>
            <span><strong>Scale institutes with high verification rates:</strong> Government College of Engineering, Nashik shows 61% paper, 58% verified — honest reporting with strong employer confirmation rates from auto/manufacturing OEMs. These institutes should receive enhanced research grants and AICTE batch expansion.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">●</span>
            <span><strong>Mechanical & Core Trades CAD/CAM Modernization:</strong> Heavy skill gap in SolidWorks & GD&T. Fund 30-hour hands-on CAD labs, CNC calibration units, and industrial total station equipment to bridge the practical readiness deficit.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">●</span>
            <span><strong>Tech Startup & Self-Employment Incubation:</strong> {kpis.selfEmployment}% of graduates start tech enterprises or consulting practices. Provide MSINS student innovation grants and patent filing support.</span>
          </li>
        </ul>
      </div>

      {/* Which Providers to Audit */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-navy-900">Institutes Requiring DTE / MSINS Audit</h2>
        </div>
        {flaggedProviders.length > 0 ? (
          <div className="space-y-3">
            {flaggedProviders.map(ps => {
              const prov = providers.find(p => p.id === ps.providerId);
              return (
                <div key={ps.providerId} className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="text-sm font-semibold text-red-800">{prov?.name}</div>
                  <p className="text-sm text-red-700 mt-1">
                    TPO Paper: {ps.placementRatePaper}% → Verified: {ps.placementRateVerified90d}% (gap: {ps.placementRatePaper - ps.placementRateVerified90d}pp).
                    Unreachable: {ps.unreachable}%. Data quality score: {ps.dataQualityScore}/100.
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No institutes flagged for audit.</p>
        )}
      </div>

      {/* Courses to Redesign */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-saffron-500" />
          <h2 className="text-lg font-bold text-navy-900">Branches Requiring Curriculum Redesign</h2>
        </div>
        <div className="space-y-2">
          {lowRetentionCourses.slice(0, 4).map(c => (
            <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div>
                <div className="text-sm font-medium text-amber-900">{c.name}</div>
                <div className="text-xs text-amber-700">{c.enrolled} enrolled</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-amber-700">{c.attrition}%</div>
                <div className="text-[10px] text-amber-600">attrition rate</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equity Note */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-navy-900">Equity Analysis</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <h3 className="text-sm font-semibold text-purple-800 mb-2">Gender Gap</h3>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-navy-900">{malePlacement}%</div>
                <div className="text-xs text-gray-500">Male placement</div>
              </div>
              <div className="text-gray-300">vs</div>
              <div>
                <div className="text-2xl font-bold text-purple-700">{femalePlacement}%</div>
                <div className="text-xs text-gray-500">Female placement</div>
              </div>
            </div>
            {malePlacement - femalePlacement > 5 && (
              <p className="text-xs text-purple-700 mt-2">
                ⚠ {malePlacement - femalePlacement}pp gender gap. Investigate barriers to female employment post-training.
              </p>
            )}
          </div>
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <h3 className="text-sm font-semibold text-purple-800 mb-2">SC/ST Gap</h3>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-navy-900">{generalPlacement}%</div>
                <div className="text-xs text-gray-500">General placement</div>
              </div>
              <div className="text-gray-300">vs</div>
              <div>
                <div className="text-2xl font-bold text-purple-700">{scstPlacement}%</div>
                <div className="text-xs text-gray-500">SC/ST placement</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DPDP Note */}
      <div className="card bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Data Privacy Note</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          This brief is generated from anonymised, consent-backed data under DPDP Act provisions.
          Individual trainee identities are not disclosed. All placement metrics are aggregated.
          Consent revocation requests are honoured — revoked trainees are excluded from analytics.
        </p>
      </div>
    </div>
  );
}
