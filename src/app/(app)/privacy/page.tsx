'use client';

import React, { useState } from 'react';
import { useMSOLStore, trainees } from '@/lib/store';
import { Shield, FileText, Trash2, Clock, Lock, Eye, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';

export default function PrivacyPage() {
  const { currentUser, updateTraineeConsent } = useMSOLStore();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const traineeId = currentUser?.traineeId || 'MSOL-MH-0001';
  const trainee = trainees.find(t => t.id === traineeId);
  const isRevoked = trainee?.consent.followUp === false && trainee?.consent.matchingShare === false;

  const handleRevoke = () => {
    updateTraineeConsent(traineeId, {
      followUp: false,
      employerVerify: false,
      matchingShare: false,
      skillPassportShare: false,
      revokedAt: new Date().toISOString(),
    });
    setStatusMessage('Your DPDP consent has been revoked. Longitudinal outreach and employer sharing have been stopped.');
  };

  const handleRestore = () => {
    updateTraineeConsent(traineeId, {
      followUp: true,
      employerVerify: true,
      matchingShare: true,
      skillPassportShare: true,
      revokedAt: undefined,
    });
    setStatusMessage('Your DPDP consent has been restored. Verified employer matching and 30/90-day follow-up tracking are now active.');
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-navy-700" />
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Privacy & Data Protection / गोपनीयता</h1>
          <p className="text-sm text-gray-500">DPDP Act 2023 Compliance Notice</p>
        </div>
      </div>

      <div className="card border-l-4 border-l-navy-900">
        <h2 className="text-lg font-bold text-navy-900 mb-3">Digital Personal Data Protection Act, 2023</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          MSOL processes personal data of trainees to track employment outcomes after skilling programs.
          This processing is conducted under lawful consent, with the Government of Maharashtra (Department of Skills, 
          Employment, Entrepreneurship and Innovation) as the Data Fiduciary.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            icon: <FileText className="w-5 h-5" />,
            title: 'Purpose Limitation',
            titleMr: 'उद्देश मर्यादा',
            desc: 'Data is collected solely to track post-training employment outcomes, identify skill gaps, and improve skilling policy. It is not used for commercial purposes.',
          },
          {
            icon: <Clock className="w-5 h-5" />,
            title: 'Data Retention',
            titleMr: 'डेटा अवधारण',
            desc: 'Personal data is retained for 3 years after the last follow-up interaction. After this period, data is anonymised for longitudinal analytics only.',
          },
          {
            icon: <Lock className="w-5 h-5" />,
            title: 'Data Minimisation',
            titleMr: 'डेटा किमान',
            desc: 'Only essential data is collected: name, phone, district, training details, and employment status. No Aadhaar, biometrics, or financial details are stored.',
          },
          {
            icon: <Eye className="w-5 h-5" />,
            title: 'Transparency',
            titleMr: 'पारदर्शकता',
            desc: 'Trainees can view all data held about them via the /me page. Follow-up contact purposes are explained at each interaction.',
          },
        ].map(item => (
          <div key={item.title} className="card">
            <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center text-navy-600 mb-3">
              {item.icon}
            </div>
            <h3 className="text-sm font-semibold text-navy-900">{item.title}</h3>
            <p className="text-xs text-gray-500 mb-1">{item.titleMr}</p>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Consent Management */}
      <div className="card">
        <h2 className="text-lg font-bold text-navy-900 mb-3">Your Rights / तुमचे हक्क</h2>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800">Right to Access / प्रवेशाचा अधिकार</h3>
            <p className="text-xs text-blue-700 mt-1">View all data MSOL holds about you via your trainee profile (/me).</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-800">Right to Correction / दुरुस्तीचा अधिकार</h3>
            <p className="text-xs text-amber-700 mt-1">Request corrections to your personal data through your counsellor or the MSOL support channel.</p>
          </div>
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <h3 className="text-sm font-semibold text-red-800 flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" /> Right to Revoke Consent / संमती रद्द करण्याचा अधिकार
            </h3>
            <p className="text-xs text-red-700 mt-1 mb-3">
              You may revoke consent at any time. This will stop all follow-up contacts and remove your data from non-anonymised analytics.
            </p>

            {statusMessage && (
              <div className="mb-3 p-3 rounded-md bg-white border border-red-200 text-xs text-red-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {statusMessage}
              </div>
            )}

            {isRevoked ? (
              <button
                onClick={handleRestore}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Re-grant Consent / संमती पूर्ववत द्या
              </button>
            ) : (
              <button
                onClick={handleRevoke}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Revoke My Consent / माझी संमती रद्द करा
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="card bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Data Protection Officer</h3>
        <p className="text-sm text-gray-600">
          For queries related to your personal data, contact:<br />
          <strong>MSOL Data Protection Officer</strong><br />
          Maharashtra State Innovation Society<br />
          Email: dpo@msol.maharashtra.gov.in (demo)<br />
          Phone: 1800-XXX-XXXX (toll-free, demo)
        </p>
      </div>
    </div>
  );
}
