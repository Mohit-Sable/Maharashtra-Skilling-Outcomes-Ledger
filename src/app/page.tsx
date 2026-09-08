'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, BarChart3, Users, CheckCircle2, TrendingDown, PhoneForwarded, Clock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">

      {/* Hero */}
      <section className="ashoka-header py-0">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              {/* SIH Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-saffron-400 animate-pulse-soft"></span>
                Smart India Hackathon 2026 — SIH26135
              </div>

              <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">☸</div>
                <div>
                  <div className="text-xs opacity-70">Government of Maharashtra</div>
                  <div className="text-[10px] opacity-50">Dept. of Skills, Employment, Entrepreneurship & Innovation</div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                <span className="text-saffron-400">MSOL</span>
              </h1>
              <h2 className="text-xl md:text-2xl font-light mb-2 text-white/90">Maharashtra Skilling Outcomes Ledger <span className="font-bold text-emerald-400">& Skill Passport</span></h2>
              <p className="text-sm text-saffron-200 font-medium italic mb-6">
                APAAR-linked, consent-based continuous career profile — for engineering colleges & technical students.
              </p>

              <p className="text-base text-white/80 mb-8 max-w-lg leading-relaxed">
                An engineering graduate does not have 6 certificates scattered across 6 portals. They have <strong className="text-white">one Skill Passport</strong>.
                AI shows the gap. Matching fills the gap. Employer feedback updates the gap. Outcomes prove whether it worked.
              </p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link href="/login" className="btn-saffron text-base px-6 py-3">
                  Launch Live Demo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/about" className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Hero Visual — The Punchline */}
            <div className="flex-1 max-w-md">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-sm font-semibold text-saffron-400 mb-4 uppercase tracking-wider">The Problem MSOL Solves</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-white/80">College TPO claims "placed"</span>
                    <span className="text-2xl font-bold text-white">80%</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/20 border border-red-400/30">
                    <span className="text-sm text-white/80">Verified 90-day retention</span>
                    <span className="text-2xl font-bold text-red-400">42%</span>
                  </div>
                </div>
                <p className="text-xs text-white/60 mt-4 text-center italic">
                  &ldquo;A college can show 80% placed on the TPO sheet; after 90-day verified follow-up, retention may be 42%.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Column Problem/MIS/MSOL */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-4">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">The Problem</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              India&apos;s engineering education ecosystem tracks <strong>inputs</strong> — enrolment, university exams, and offer letters.
              But nobody systematically tracks <strong>outcomes</strong>: Did the graduate actually join? 
              Are they still retained after 90 days? What do they earn? Why do candidates leave early?
            </p>
          </div>

          <div className="card animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">Why TPO Sheets Are Not Enough</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Campus placement reports capture offer letters at final semester. Placement is reported as an impressive percentage — <strong>self-reported by colleges, unverified by employers, never tracked post-joining</strong>. 
              Institutes have structural incentives to inflate paper numbers.
            </p>
          </div>

          <div className="card animate-fade-in-up stagger-3 border-emerald-200 bg-emerald-50/30" style={{ opacity: 0 }}>
            <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-navy-700" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">What MSOL Does</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The <strong>Skill Passport</strong>: APAAR-linked identity, AI assessments, internship & GET matching, 
              and employer feedback. The <strong>Outcomes Ledger</strong> verifies real placements and wages at 30/90/180/365 days. 
              All DPDP-compliant and evidence-backed.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Longitudinal Outcome Tracking</h2>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
            {[
              { label: 'Convocation / Offer', icon: <CheckCircle2 className="w-5 h-5" />, day: 'Day 0', color: 'bg-blue-500' },
              { label: '30-Day Joining', icon: <PhoneForwarded className="w-5 h-5" />, day: 'Day 30', color: 'bg-emerald-500' },
              { label: '90-Day Retention', icon: <Shield className="w-5 h-5" />, day: 'Day 90', color: 'bg-saffron-400' },
              { label: '180-Day Progression', icon: <BarChart3 className="w-5 h-5" />, day: 'Day 180', color: 'bg-purple-500' },
              { label: '365-Day Career Impact', icon: <Users className="w-5 h-5" />, day: 'Day 365', color: 'bg-pink-500' },
            ].map((step, i) => (
              <React.Fragment key={step.day}>
                <div className="flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}>
                  <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white mb-2`}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold text-saffron-400">{step.day}</div>
                  <div className="text-sm text-white mt-1">{step.label}</div>
                </div>
                {i < 4 && (
                  <div className="hidden md:block flex-1 h-0.5 bg-gradient-to-r from-white/30 to-white/10 mx-2 mt-[-20px]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-navy-900 text-center mb-10">Key Capabilities</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Shield className="w-5 h-5" />, title: 'Consent-First', desc: 'DPDP-aligned granular consent. Students own and control their career data.' },
            { icon: <PhoneForwarded className="w-5 h-5" />, title: 'Automated Follow-ups', desc: 'WhatsApp → SMS → IVR → TPO counsellor waterfall.' },
            { icon: <CheckCircle2 className="w-5 h-5" />, title: 'Employer Validation', desc: 'One-click magic link confirmation from verified corporate GSTINs.' },
            { icon: <BarChart3 className="w-5 h-5" />, title: 'Institute Scorecards', desc: 'TPO Paper % vs Verified %. Inflation detection. Quality scores.' },
            { icon: <Users className="w-5 h-5" />, title: 'Student 360°', desc: 'Full longitudinal timeline from graduation to livelihood.' },
            { icon: <TrendingDown className="w-5 h-5" />, title: 'Skill Gap Analysis', desc: 'Branch × missing skill heatmap with remedial action recommendations.' },
            { icon: <Clock className="w-5 h-5" />, title: 'Retention Curves', desc: '0→30→90→180→365 day tracking. Not a single-point boolean.' },
            { icon: <BarChart3 className="w-5 h-5" />, title: 'Evidence-Based Policy', desc: 'Auto-generated briefs: where to invest, what to audit.' },
          ].map(f => (
            <div key={f.title} className="card card-hover p-4">
              <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-700 mb-3">
                {f.icon}
              </div>
              <h4 className="text-sm font-semibold text-navy-900 mb-1">{f.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-navy-900 to-navy-800 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">See It In Action</h2>
          <p className="text-white/70 mb-6">Login with demo credentials. Switch between 6 roles. Explore real-ish data for 200+ trainees.</p>
          <Link href="/login" className="btn-saffron text-base px-8 py-3">
            Enter Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-white/60 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs mb-2">
            <strong className="text-white/80">MSOL — Maharashtra Skilling Outcomes Ledger</strong> | SIH 2026 Prototype | Problem Code SIH26135
          </p>
          <p className="text-xs mb-2">
            Government of Maharashtra — Maharashtra State Innovation Society (MSINS)
          </p>
          <p className="text-xs mb-2">
            Department of Skills, Employment, Entrepreneurship and Innovation
          </p>
          <p className="text-[10px] mt-4 text-white/40">
            This is a prototype demonstration. No real government data is used. 
            Privacy principles aligned with Digital Personal Data Protection Act, 2023.
          </p>
        </div>
      </footer>
    </div>
  );
}
