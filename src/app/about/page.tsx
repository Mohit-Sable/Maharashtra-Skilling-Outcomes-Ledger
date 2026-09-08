'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, BarChart3, Users, CheckCircle2, Clock, Layers, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas">

      <div className="ashoka-header py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">About MSOL</h1>
          <p className="text-white/70">SIH 2026 — Problem Code SIH26135</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Problem Statement */}
        <div className="card border-l-4 border-l-red-500">
          <h2 className="text-lg font-bold text-navy-900 mb-3">Problem Statement</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            <strong>SIH26135:</strong> Difficulties in tracking employment outcomes, skill gaps, and the impact of skilling initiatives.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>Organisation:</strong> Government of Maharashtra — Maharashtra State Innovation Society, 
            Department of Skills, Employment, Entrepreneurship and Innovation
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Theme:</strong> Smart Education / Software
          </p>
        </div>

        {/* How MSOL Differs */}
        <div className="card">
          <h2 className="text-lg font-bold text-navy-900 mb-4">How MSOL Differs from Training MIS</h2>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>Existing Training MIS</th>
                  <th>MSOL (Outcomes Layer)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Tracks', 'Enrolment, attendance, certification', 'Post-training employment outcomes'],
                  ['Placement', 'Single Yes/No at certification', 'Longitudinal: 30/90/180/365 days'],
                  ['Verification', 'Self-reported by provider', 'Employer-confirmed + document-backed'],
                  ['Follow-up', 'None', 'Automated WhatsApp→SMS→IVR→Call'],
                  ['Skill Gaps', 'Not captured', 'Structured taxonomy + heatmaps'],
                  ['Institute Accountability', 'TPO brochure numbers only', 'Paper vs verified, inflation detection'],
                  ['Privacy', 'Varies', 'DPDP-aligned, consent-first, granular'],
                  ['Wage Tracking', 'None', 'Band-level, progression over time'],
                ].map(([aspect, mis, msol]) => (
                  <tr key={aspect}>
                    <td className="font-medium text-navy-900">{aspect}</td>
                    <td className="text-red-600">{mis}</td>
                    <td className="text-emerald-700 font-medium">{msol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Privacy Principles */}
        <div className="card">
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-navy-600" />
            Privacy Principles
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: 'Consent-First', desc: 'No data collection without explicit, informed consent. Granular toggles for follow-up, employer verify, and analytics.' },
              { title: 'Purpose Limitation', desc: 'Data used only for outcome tracking and technical curriculum improvement. No commercial use.' },
              { title: 'Data Minimisation', desc: 'Only essential fields collected. No Aadhaar, biometrics, or financial details.' },
              { title: 'Right to Revoke', desc: 'Students can revoke consent at any time. Revoked data excluded from analytics.' },
            ].map(p => (
              <div key={p.title} className="p-3 rounded-lg bg-navy-50 border border-navy-100">
                <h3 className="text-sm font-semibold text-navy-900">{p.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 2 Roadmap */}
        <div className="card bg-gray-50">
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-navy-600" />
            Phase 2 Roadmap (Future Scope)
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Aadhaar-based de-duplication (with UIDAI consent bridge)',
              'AICTE / DTE Maharashtra & DigiLocker API integration',
              'WhatsApp Business API for automated offer follow-ups',
              'IVR integration via Exotel/Twilio for unreachable alumni',
              'ML model for campus placement attrition prediction',
              'GIS mapping of engineering graduate migration',
              'Mobile app for students & college TPO cells',
              'DigiLocker integration for degree & diploma verification',
            ].map(item => (
              <div key={item} className="flex items-start gap-2 p-2 rounded bg-white border border-gray-200">
                <Zap className="w-3.5 h-3.5 text-saffron-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8 text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-navy-900 mb-4 leading-relaxed">
            &ldquo;An engineering graduate does not have 6 certificates in 6 portals. They have one Skill Passport. AI shows the gap. Matching fills the gap. Employer feedback updates the gap. Outcomes prove whether it worked.&rdquo;
          </h2>
          <p className="text-gray-600">The core philosophy behind MSOL Phase 2</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Phase 1: The Outcomes Ledger</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Consent-Based Identity:</strong> Tied to APAAR/Aadhaar via DPDP compliant workflows.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Longitudinal Follow-ups:</strong> Automated & assisted check-ins at 30, 90, 180, and 365 days.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Employer Verification:</strong> Cryptographically verifiable placement claims.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Institute Scorecards:</strong> Expose TPO paper placement vs verified retention inflation.</span>
              </li>
            </ul>
          </div>

          <div className="card p-8 border-t-4 border-t-saffron-500">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Phase 2: The Skill Passport</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Continuous Profile:</strong> One unified passport aggregating skills, certs, and wages.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>AI Assessments:</strong> Identify missing skills vs target career goals.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Feedback Loop:</strong> Employer feedback directly tags missing skills back into the state curriculum engine.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Smart Matching:</strong> AI matching candidates to jobs/internships based on verified skills.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <Link href="/login" className="btn-saffron text-base px-8 py-3">
            Enter Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy-950 text-white/60 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs">
          <p>MSOL — Maharashtra Skilling Outcomes Ledger | SIH 2026 Prototype | Problem Code SIH26135</p>
          <p className="mt-1 text-white/40">This is a prototype. No real government data is used.</p>
        </div>
      </footer>
    </div>
  );
}
