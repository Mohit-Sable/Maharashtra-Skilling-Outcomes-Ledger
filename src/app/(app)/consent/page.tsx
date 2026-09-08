'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle2, Smartphone, BookOpen, ArrowRight } from 'lucide-react';

export default function ConsentPage() {
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState('');
  const [consents, setConsents] = useState({ followUp: true, employerVerify: true, analytics: true });
  const [completed, setCompleted] = useState(false);

  if (completed) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-navy-900 mb-2">Consent Recorded / संमती नोंदवली</h2>
        <p className="text-sm text-gray-500 mb-2">MSOL ID generated: <strong className="font-mono">MSOL-MH-0201</strong></p>
        <p className="text-xs text-gray-400">Your data will be used only for the purposes you have consented to.</p>
        <p className="text-xs text-gray-400 mt-1">तुमचा डेटा फक्त तुम्ही संमती दिलेल्या उद्देशांसाठी वापरला जाईल.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-navy-700" />
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Consent / संमती</h1>
          <p className="text-sm text-gray-500">Consent-first onboarding — DPDP aligned</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {['Verify Mobile', 'Purpose', 'Consent Toggles', 'Generate ID'].map((label, i) => (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-1.5 ${i <= step ? 'text-navy-900' : 'text-gray-300'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-navy-900 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:inline">{label}</span>
            </div>
            {i < 3 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: OTP */}
      {step === 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-navy-600" />
            <h2 className="text-base font-semibold text-navy-900">Verify Mobile / मोबाइल सत्यापित करा</h2>
          </div>
          <div className="mb-4">
            <label htmlFor="consent-phone" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number / मोबाइल नंबर</label>
            <input id="consent-phone" type="tel" defaultValue="9876543210" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-navy-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="consent-otp" className="block text-sm font-medium text-gray-700 mb-1">OTP (any 6 digits) / ओटीपी</label>
            <input
              id="consent-otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-center text-xl tracking-[0.5em] font-mono outline-none focus:border-navy-500"
            />
          </div>
          <button
            onClick={() => otp.length === 6 && setStep(1)}
            disabled={otp.length !== 6}
            className="btn-primary w-full justify-center disabled:opacity-50"
          >
            Verify OTP <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Purpose */}
      {step === 1 && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-navy-600" />
            <h2 className="text-base font-semibold text-navy-900">Purpose / उद्देश</h2>
          </div>
          <div className="bg-navy-50 rounded-lg p-4 border border-navy-100 text-sm text-navy-800 leading-relaxed mb-4">
            <p className="mb-3">
              <strong>English:</strong> We collect your data to track your employment outcomes after training. 
              Your information is protected under the Digital Personal Data Protection Act, 2023.
              We will contact you at 30, 90, 180, and 365 days to check your employment status.
              You can revoke consent at any time.
            </p>
            <p>
              <strong>मराठी:</strong> प्रशिक्षणानंतर तुमच्या रोजगार परिणामांचा मागोवा घेण्यासाठी आम्ही तुमचा डेटा गोळा करतो. 
              तुमची माहिती डिजिटल वैयक्तिक डेटा संरक्षण कायदा, 2023 अंतर्गत संरक्षित आहे. 
              आम्ही तुमच्या रोजगार स्थितीची तपासणी करण्यासाठी 30, 90, 180 आणि 365 दिवसांनी तुमच्याशी संपर्क साधू.
              तुम्ही कधीही संमती रद्द करू शकता.
            </p>
          </div>
          <button onClick={() => setStep(2)} className="btn-primary w-full justify-center">
            I Understand / मला समजले <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 3: Toggles */}
      {step === 2 && (
        <div className="card p-6">
          <h2 className="text-base font-semibold text-navy-900 mb-4">Granular Consent / तपशीलवार संमती</h2>
          <div className="space-y-4">
            {[
              { key: 'followUp' as const, label: 'Allow follow-up calls/messages about my employment status', mr: 'माझ्या रोजगार स्थितीबद्दल पाठपुरावा कॉल/संदेशांना परवानगी द्या' },
              { key: 'employerVerify' as const, label: 'Allow my employer to verify my employment', mr: 'माझ्या नियोक्त्याला माझा रोजगार सत्यापित करण्याची परवानगी द्या' },
              { key: 'analytics' as const, label: 'Allow anonymised data for policy analytics', mr: 'धोरण विश्लेषणासाठी निनावी डेटा वापरण्याची परवानगी द्या' },
            ].map(item => (
              <label key={item.key} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-navy-50 transition-colors">
                <input
                  type="checkbox"
                  checked={consents[item.key]}
                  onChange={e => setConsents(c => ({ ...c, [item.key]: e.target.checked }))}
                  className="mt-1 w-4 h-4 accent-navy-900"
                />
                <div>
                  <div className="text-sm font-medium text-navy-900">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.mr}</div>
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            ⚠ Follow-up consent is required to track outcomes. Without it, we cannot contact you.
          </p>
          <button
            onClick={() => setStep(3)}
            disabled={!consents.followUp}
            className="btn-primary w-full justify-center mt-4 disabled:opacity-50"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 4: Generate ID */}
      {step === 3 && (
        <div className="card p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-navy-100 flex items-center justify-center text-2xl mx-auto mb-4">☸</div>
          <h2 className="text-lg font-bold text-navy-900 mb-2">Generate MSOL ID</h2>
          <p className="text-sm text-gray-500 mb-1">Your unique tracking identifier will be created.</p>
          <p className="text-xs text-gray-400 mb-6">तुमचा अद्वितीय ट्रॅकिंग ओळखकर्ता तयार केला जाईल.</p>
          <button onClick={() => setCompleted(true)} className="btn-saffron text-base px-8 py-3">
            Generate MSOL ID <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
