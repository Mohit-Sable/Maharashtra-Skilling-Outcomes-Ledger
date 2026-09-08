'use client';

import React from 'react';
import { useMSOLStore } from '@/lib/store';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const demoSteps = [
  {
    title: 'Step 1: State Admin Dashboard',
    description: 'Notice the gap between "TPO Paper Placement" and "Verified Placement" KPIs across Maharashtra engineering colleges. College-reported placement brochures ≠ 90-day verified job retention.',
    route: '/dashboard',
  },
  {
    title: 'Step 2: Institute Scorecard — TPO Paper vs 90d Retention',
    description: 'Open Pune Valley College of Engineering. TPO paper placement: 82%. After 90-day verified follow-up: retention is only 41%. 18% unreachable rate, 2 fake campus staffing leads, weak employer confirms.',
    route: '/providers/PRV-001',
  },
  {
    title: 'Step 3: Student 360° — Hostel Phone Change',
    description: 'Open student MSOL-MH-0005 who vacated college hostel and changed phone → marked unreachable → career counsellor escalation. See the full outcome timeline from graduation to follow-up.',
    route: '/trainees/MSOL-MH-0005',
  },
  {
    title: 'Step 4: WhatsApp Campus Offer Follow-up',
    description: 'Automated follow-up engine. Mock WhatsApp conversation with Marathi messages confirming campus offer joining and monthly GET stipend. Waterfall: WhatsApp → SMS → IVR → TPO call centre.',
    route: '/follow-ups',
  },
  {
    title: 'Step 5: Employer Magic-Link Verification',
    description: 'Engineering employers (e.g. Tata Motors, Persistent, L&T) receive an SMS magic link to confirm or dispute campus joining in one click. Upgrades status to "Employer Confirmed".',
    route: '/employers/verify/demo-token',
  },
  {
    title: 'Step 6: Engineering Skill Gap Heatmap',
    description: 'Branch × missing-skill heatmap shows where university curriculum falls short. Mechanical graduates lack SolidWorks & GD&T; CSE students lack SQL & DSA. Remedial cards recommend 30-hour CAD labs.',
    route: '/skill-gaps',
  },
  {
    title: 'Step 7: Policy Brief for DTE & MSINS',
    description: 'Auto-generated evidence brief: audits for inflated colleges (Pune Valley), batch expansion for honest institutes (GCOE Nashik), and targeted investments in CAD & Embedded labs.',
    route: '/policy',
  },
  {
    title: 'Step 8: Student Skill Passport (APAAR Sandbox)',
    description: 'Login as Rahul Kamble (B.E. Computer Engineering). View your unified Skill Passport with verified academic history (10th, 12th, B.E. CGPA) and take the AI Assessment.',
    route: '/me/passport',
  },
  {
    title: 'Step 9: MSOL Sahayak (AI Career Assistant)',
    description: 'Ask Sahayak: "What skills am I missing for an SDE / campus IT role?" Sahayak retrieves Rahul\'s live CSE assessment gaps (DSA & SQL) from his MSOL record and links directly to /me/roadmap.',
    route: '/me/chat',
  },
  {
    title: 'Step 10: AI Course & Remedial Roadmap',
    description: 'The AI maps identified CSE skill gaps in Data Structures & SQL directly to free NPTEL modules and Persistent Tech Academy bootcamps on your learning roadmap.',
    route: '/me/roadmap',
  },
  {
    title: 'Step 11: Engineering Internship & Job Matching',
    description: 'Based on verified skills, degree branch, and location, match with SDE and Graduate Engineer Trainee (GET) openings across Pune, Nashik, and Mumbai.',
    route: '/me/jobs',
  },
  {
    title: 'Step 12: Employer Feedback Loop',
    description: 'Login as an Employer (Persistent Systems). Submit structured feedback flagging "needs improvement in SQL indexing", which updates both the passport and the State\'s curriculum engine.',
    route: '/employers/feedback/MSOL-MH-0001',
  },
  {
    title: 'Step 13: Macro Analytics & Verified Retention',
    description: 'State Admins track the campus hiring funnel, passport coverage, GET stipend-to-salary progressions, and employer-derived curriculum gaps.',
    route: '/dashboard',
  }
];

export default function GuidedDemo() {
  const { guidedDemoActive, guidedDemoStep, nextDemoStep, prevDemoStep, endGuidedDemo } = useMSOLStore();
  const router = useRouter();

  React.useEffect(() => {
    if (guidedDemoActive) {
      router.push(demoSteps[guidedDemoStep].route);
    }
  }, [guidedDemoActive, guidedDemoStep, router]);

  if (!guidedDemoActive) return null;

  const step = demoSteps[guidedDemoStep];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-navy-900 text-white rounded-xl shadow-2xl p-5 border border-navy-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-saffron-400 text-navy-950 text-[10px] font-bold">
                {guidedDemoStep + 1} / {demoSteps.length}
              </span>
              <h3 className="font-semibold text-sm">{step.title}</h3>
            </div>
            <p className="text-sm text-navy-200 leading-relaxed">{step.description}</p>
          </div>
          <button onClick={endGuidedDemo} className="text-navy-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-navy-700">
          <button
            onClick={prevDemoStep}
            disabled={guidedDemoStep === 0}
            className="flex items-center gap-1 text-xs font-medium text-navy-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {/* Progress dots */}
          <div className="flex gap-1.5">
            {demoSteps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === guidedDemoStep ? 'bg-saffron-400 scale-125' : i < guidedDemoStep ? 'bg-saffron-400/50' : 'bg-navy-600'
                }`}
              />
            ))}
          </div>

          {guidedDemoStep < demoSteps.length - 1 ? (
            <button
              onClick={nextDemoStep}
              className="flex items-center gap-1 text-xs font-medium text-saffron-400 hover:text-saffron-300"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={endGuidedDemo}
              className="flex items-center gap-1 text-xs font-medium bg-saffron-400 text-navy-950 px-3 py-1 rounded-md hover:bg-saffron-300"
            >
              Finish Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
