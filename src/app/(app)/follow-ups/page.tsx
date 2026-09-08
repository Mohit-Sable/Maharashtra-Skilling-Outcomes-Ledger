'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMSOLStore, trainees, enrolments } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { t } from '@/lib/i18n';
import {
  PhoneForwarded, MessageSquare, Phone, Radio, Clock, CheckCircle2,
  AlertTriangle, ChevronRight, Send, Smartphone
} from 'lucide-react';

// Mock WhatsApp conversation
const whatsappMessages = [
  { type: 'outgoing', text: 'नमस्कार! MSOL (महाराष्ट्र अभियांत्रिकी व तंत्रशिक्षण खातेवही) कडून.\n\nतुम्ही B.E. / पदविका अभ्यासक्रम पूर्ण केला आहे. कॅम्पस ऑफर लेटरनुसार तुम्ही कंपनीत रुजू झाला आहात का?\n(Hello from MSOL! You completed your engineering programme. Have you joined your campus offer role?)', time: '10:30 AM' },
  { type: 'system', text: 'Quick replies / जलद उत्तरे:' },
  { type: 'buttons', options: ['✅ रुजू झालो / Joined & Working', '❌ रुजू झालो नाही / Did not join', '💼 नवीन नोकरी शोधत आहे / Looking for other job', '📱 नंबर बदलला / Changed phone'] },
];

const ivrScript = [
  { key: '1', label: 'Joined campus offer & working / कॅम्पस कंपनीत रुजू झालो व काम करत आहे' },
  { key: '2', label: 'Switched to another engineering firm / दुसऱ्या कंपनीत गेलो' },
  { key: '3', label: 'Preparing for GATE / Higher Studies / उच्च शिक्षण' },
  { key: '4', label: 'Need placement assistance / TPO कॉलबॅक हवा' },
];

export default function FollowUpsPage() {
  const { followUps, updateFollowUp, language } = useMSOLStore();
  const [tab, setTab] = useState<'due' | 'overdue' | 'completed' | 'escalated'>('overdue');
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showIVR, setShowIVR] = useState(false);
  const [selectedFU, setSelectedFU] = useState<string | null>(null);
  const [whatsAppStep, setWhatsAppStep] = useState(0);
  const [surveyStep, setSurveyStep] = useState(0);

  const now = new Date();

  const categorized = {
    due: followUps.filter(f => f.status === 'PENDING' && new Date(f.dueAt) >= now),
    overdue: followUps.filter(f => f.status === 'PENDING' && new Date(f.dueAt) < now),
    completed: followUps.filter(f => f.status === 'COMPLETED'),
    escalated: followUps.filter(f => f.status === 'ESCALATED' || f.status === 'NO_REPLY'),
  };

  const tabItems = [
    { key: 'overdue' as const, label: `Overdue (${categorized.overdue.length})`, color: 'text-red-600' },
    { key: 'due' as const, label: `Due (${categorized.due.length})`, color: 'text-blue-600' },
    { key: 'escalated' as const, label: `Escalated (${categorized.escalated.length})`, color: 'text-amber-600' },
    { key: 'completed' as const, label: `Completed (${categorized.completed.length})`, color: 'text-emerald-600' },
  ];

  const handleWhatsAppReply = (reply: string) => {
    setWhatsAppStep(2);
    if (selectedFU) {
      updateFollowUp(selectedFU, { status: 'COMPLETED', completedAt: new Date().toISOString().split('T')[0] });
    }
  };

  const openWhatsApp = (fuId: string) => {
    setSelectedFU(fuId);
    setShowWhatsApp(true);
    setWhatsAppStep(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{t('nav.followups', language)}</h1>
          <p className="text-sm text-gray-500">Automated cadences: 30 / 90 / 180 / 365 days from certification</p>
        </div>
        <Link href="/follow-ups/new" className="btn-primary">
          <PhoneForwarded className="w-4 h-4" /> New Follow-up
        </Link>
      </div>

      {/* Channel Waterfall */}
      <div className="card p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Channel Waterfall</h3>
        <div className="flex items-center gap-2">
          {[
            { icon: <MessageSquare className="w-4 h-4" />, label: 'WhatsApp', color: 'bg-green-500' },
            { icon: <Smartphone className="w-4 h-4" />, label: 'SMS', color: 'bg-blue-500' },
            { icon: <Radio className="w-4 h-4" />, label: 'IVR', color: 'bg-purple-500' },
            { icon: <Phone className="w-4 h-4" />, label: 'Call Centre', color: 'bg-saffron-500' },
          ].map((ch, i) => (
            <React.Fragment key={ch.label}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200">
                <div className={`w-6 h-6 rounded-full ${ch.color} text-white flex items-center justify-center`}>
                  {ch.icon}
                </div>
                <span className="text-xs font-medium">{ch.label}</span>
              </div>
              {i < 3 && <span className="text-gray-300 text-xs">→ No reply →</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {tabItems.map(ti => (
          <button
            key={ti.key}
            onClick={() => setTab(ti.key)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === ti.key ? 'bg-white shadow-sm text-navy-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {ti.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {categorized[tab].slice(0, 30).map(fu => {
          const trainee = trainees.find(t => t.id === fu.traineeId);
          const enr = enrolments.find(e => e.traineeId === fu.traineeId);
          if (!trainee) return null;

          return (
            <div key={fu.id} className="card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {trainee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/trainees/${trainee.id}`} className="text-sm font-medium text-navy-900 hover:underline truncate">
                      {trainee.name}
                    </Link>
                    <span className="text-xs text-gray-400 font-mono">{trainee.id}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {enr?.courseName} • {trainee.district} • {fu.channel}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm text-gray-600">{formatDate(fu.dueAt)}</div>
                <div className="text-xs text-gray-400">Attempts: {fu.attemptCount}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {fu.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => openWhatsApp(fu.id)}
                      className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      title="Send WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedFU(fu.id); setShowIVR(true); }}
                      className="p-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                      title="IVR Call"
                    >
                      <Radio className="w-4 h-4" />
                    </button>
                  </>
                )}
                <Link href={`/trainees/${trainee.id}`} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}

        {categorized[tab].length === 0 && (
          <div className="card p-12 text-center">
            <PhoneForwarded className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">{t('empty.no_followups', language)}</p>
            <p className="text-xs text-gray-400 mt-1">रांगेत पाठपुरावा नाही</p>
          </div>
        )}
      </div>

      {/* WhatsApp Mock Modal */}
      {showWhatsApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] text-white p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">☸</div>
              <div>
                <div className="text-sm font-medium">MSOL Follow-up</div>
                <div className="text-[10px] opacity-70">Maharashtra Skilling Outcomes Ledger</div>
              </div>
              <button onClick={() => setShowWhatsApp(false)} className="ml-auto text-white/70 hover:text-white">✕</button>
            </div>

            {/* Chat */}
            <div className="bg-[#ECE5DD] p-4 min-h-[300px]">
              <div className="space-y-3">
                {/* Outgoing message */}
                <div className="whatsapp-bubble outgoing">
                  <p className="text-sm whitespace-pre-line">{whatsappMessages[0].text}</p>
                  <div className="text-[10px] text-gray-500 text-right mt-1">{whatsappMessages[0].time} ✓✓</div>
                </div>

                {/* Quick reply buttons */}
                {whatsAppStep === 0 && (
                  <div className="space-y-2">
                    <div className="text-center text-xs text-gray-500 my-2">Quick Replies / जलद उत्तरे</div>
                    {(whatsappMessages[2] as { type: string; options: string[] }).options.map((opt: string) => (
                      <button
                        key={opt}
                        onClick={() => handleWhatsAppReply(opt)}
                        className="w-full py-2.5 px-4 bg-white rounded-lg border border-[#075E54] text-[#075E54] text-sm font-medium hover:bg-[#075E54] hover:text-white transition-colors"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Reply */}
                {whatsAppStep >= 2 && (
                  <>
                    <div className="whatsapp-bubble incoming">
                      <p className="text-sm">✅ काम करत आहे / Working</p>
                      <div className="text-[10px] text-gray-500 text-right mt-1">10:32 AM</div>
                    </div>
                    <div className="whatsapp-bubble outgoing">
                      <p className="text-sm">धन्यवाद! 🙏 तुमचा प्रतिसाद नोंदवला आहे. पुढील पाठपुरावा 90 दिवसांनी होईल.</p>
                      <p className="text-sm mt-1 text-gray-600">(Thank you! Your response has been recorded. Next follow-up in 90 days.)</p>
                      <div className="text-[10px] text-gray-500 text-right mt-1">10:32 AM ✓✓</div>
                    </div>
                    <div className="text-center">
                      <span className="chip chip-verified">✓ Follow-up completed</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Input bar */}
            <div className="bg-[#F0F0F0] p-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-full bg-white text-sm outline-none"
                disabled
              />
              <button className="w-8 h-8 rounded-full bg-[#075E54] text-white flex items-center justify-center">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IVR Mock Modal */}
      {showIVR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="bg-navy-900 text-white p-4 text-center">
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm font-medium">IVR Call — Mock Transcript</div>
              <div className="text-xs opacity-70">MSOL Automated Follow-up</div>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-600 italic">
                &ldquo;नमस्कार, हा MSOL कडून स्वयंचलित कॉल आहे. तुमच्या प्रशिक्षणानंतरची रोजगार स्थिती जाणून घेण्यासाठी कृपया खालील पर्यायांपैकी एक निवडा...&rdquo;
              </div>
              <div className="text-xs text-gray-400 mb-3">Press key / कीपॅड दाबा:</div>
              <div className="space-y-2">
                {ivrScript.map(item => (
                  <button
                    key={item.key}
                    onClick={() => {
                      if (selectedFU) {
                        updateFollowUp(selectedFU, { status: 'COMPLETED', completedAt: new Date().toISOString().split('T')[0] });
                      }
                      setShowIVR(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-navy-300 hover:bg-navy-50 transition-colors text-left"
                  >
                    <span className="w-8 h-8 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {item.key}
                    </span>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowIVR(false)}
                className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
