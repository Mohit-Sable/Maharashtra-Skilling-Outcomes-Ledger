'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useMSOLStore, trainees, enrolments, providers, employers } from '@/lib/store';
import { t } from '@/lib/i18n';
import {
  generateSahayakResponse,
  maskPhone,
  maskApaar,
  type SahayakResponse,
  type StudentContext,
  type SahayakSourceChip,
  type SahayakQuickLink,
} from '@/lib/ai/sahayak';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  GraduationCap,
  Building,
  User,
  HelpCircle,
  X,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: SahayakSourceChip[];
  links?: SahayakQuickLink[];
  suggestedQueries?: string[];
  consentRestricted?: boolean;
}

interface SahayakChatProps {
  mode?: 'page' | 'fab';
  onCloseFab?: () => void;
}

const EMPTY_STATE_CHIPS = [
  { label: 'What skills am I missing for an SDE / campus IT role?', lang: 'en' },
  { label: 'Which internship in Pune fits my branch?', lang: 'en' },
  { label: 'When is my next joining follow-up?', lang: 'en' },
  { label: 'Is my TPO offer verified by the employer?', lang: 'en' },
  { label: 'How do I revoke consent?', lang: 'en' },
  { label: 'माझ्या कौशल्य दरी काय आहेत?', lang: 'mr' },
];

export default function SahayakChat({ mode = 'page', onCloseFab }: SahayakChatProps) {
  const {
    currentUser,
    language,
    outcomeEvents,
    followUps,
    skillPassports,
    assessments,
    roadmaps,
    opportunities,
    applications,
    employerFeedback,
    catalog,
  } = useMSOLStore();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Resolve trainee details
  const traineeId = currentUser?.traineeId || 'MSOL-MH-0001';
  const trainee = trainees.find((t) => t.id === traineeId) || trainees[0];
  const enrolment = enrolments.find((e) => e.traineeId === trainee.id);
  const provider = enrolment ? providers.find((p) => p.id === enrolment.providerId) : undefined;
  const passport = skillPassports.find((p) => p.traineeId === trainee.id);
  const assessment = assessments.find((a) => a.traineeId === trainee.id);
  const roadmap = roadmaps.find((r) => r.traineeId === trainee.id);
  const myApplications = applications.filter((a) => a.traineeId === trainee.id);
  const myFeedback = employerFeedback.filter((f) => f.traineeId === trainee.id);
  const myOutcomes = outcomeEvents.filter((o) => o.traineeId === trainee.id);
  const myFollowUps = followUps.filter((f) => f.traineeId === trainee.id);

  // Storage key isolated per trainee
  const storageKey = `msol_sahayak_chat_${trainee.id}`;

  // Load chat history from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      // Ignore sessionStorage parsing failures
    }

    // Default initial greeting if no messages yet
    const studentContext: StudentContext = {
      trainee,
      enrolment,
      provider,
      passport,
      assessment,
      roadmap,
      catalog,
      opportunities,
      applications: myApplications,
      feedback: myFeedback,
      outcomes: myOutcomes,
      followUps: myFollowUps,
      employers,
    };

    const initialResp = generateSahayakResponse('hello', studentContext, language);
    const initialMsg: ChatMessage = {
      id: 'msg-initial',
      sender: 'assistant',
      text: initialResp.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: initialResp.sources,
      links: initialResp.links,
      suggestedQueries: initialResp.suggestedQueries,
    };
    setMessages([initialMsg]);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify([initialMsg]));
    } catch {
      // storage unavailable
    }
  }, [trainee.id, language]);

  // Auto-scroll on new messages or typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Save messages to sessionStorage capped at ~20 messages
  const persistMessages = (newMsgs: ChatMessage[]) => {
    const capped = newMsgs.slice(-20);
    setMessages(capped);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(capped));
    } catch {
      // ignore
    }
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMsg];
    persistMessages(updated);
    setInput('');
    setIsTyping(true);

    // Build context
    const studentContext: StudentContext = {
      trainee,
      enrolment,
      provider,
      passport,
      assessment,
      roadmap,
      catalog,
      opportunities,
      applications: myApplications,
      feedback: myFeedback,
      outcomes: myOutcomes,
      followUps: myFollowUps,
      employers,
    };

    // Realistic typing indicator 350-500ms
    const delay = Math.floor(Math.random() * 150) + 350;
    setTimeout(() => {
      const resp: SahayakResponse = generateSahayakResponse(query, studentContext, language);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: resp.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: resp.sources,
        links: resp.links,
        suggestedQueries: resp.suggestedQueries,
        consentRestricted: resp.consentRestricted,
      };

      persistMessages([...updated, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleClearChat = () => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }

    const studentContext: StudentContext = {
      trainee,
      enrolment,
      provider,
      passport,
      assessment,
      roadmap,
      catalog,
      opportunities,
      applications: myApplications,
      feedback: myFeedback,
      outcomes: myOutcomes,
      followUps: myFollowUps,
      employers,
    };

    const initialResp = generateSahayakResponse('hello', studentContext, language);
    const initialMsg: ChatMessage = {
      id: `msg-initial-${Date.now()}`,
      sender: 'assistant',
      text: initialResp.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: initialResp.sources,
      links: initialResp.links,
      suggestedQueries: initialResp.suggestedQueries,
    };
    persistMessages([initialMsg]);
  };

  const renderSourceChip = (chip: SahayakSourceChip) => {
    const colors: Record<string, string> = {
      passport: 'bg-blue-50 text-blue-700 border-blue-200',
      assessment: 'bg-purple-50 text-purple-700 border-purple-200',
      tpo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      feedback: 'bg-amber-50 text-amber-700 border-amber-200',
      followup: 'bg-teal-50 text-teal-700 border-teal-200',
      consent: 'bg-rose-50 text-rose-700 border-rose-200',
      roadmap: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
    const cls = colors[chip.sourceType] || 'bg-gray-50 text-gray-700 border-gray-200';
    return (
      <span key={chip.label} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${cls}`}>
        <CheckCircle2 className="w-3 h-3 opacity-70" />
        {chip.label}
      </span>
    );
  };

  return (
    <div
      className={`flex flex-col bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden ${
        mode === 'page' ? 'h-[calc(100vh-140px)] min-h-[580px]' : 'h-[580px] w-full max-w-lg'
      }`}
    >
      {/* Header — Navy background with saffron accent */}
      <div className="bg-navy-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-navy-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-saffron-500/20 border border-saffron-400/40 flex items-center justify-center text-saffron-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                MSOL Sahayak <span className="text-saffron-400 font-semibold text-sm">(सहायक)</span>
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-saffron-400/20 text-saffron-300 border border-saffron-400/30">
                Official MSOL Record
              </span>
            </div>
            <p className="text-xs text-navy-200 line-clamp-1">
              {trainee.name} • {enrolment?.trade || 'Engineering'} • {maskApaar(trainee.apaarId)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            title={t('sahayak.clear_chat', language)}
            className="p-1.5 text-navy-300 hover:text-white hover:bg-navy-800 rounded-lg transition-colors text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{t('sahayak.clear_chat', language)}</span>
          </button>
          {mode === 'fab' && onCloseFab && (
            <button
              onClick={onCloseFab}
              className="p-1.5 text-navy-300 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Subheader Banner */}
      <div className="bg-navy-50/70 border-b border-navy-100 px-4 py-2 flex items-center justify-between text-xs text-navy-700 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-[11px] font-medium text-navy-800">
            {t('sahayak.badge', language)}
          </span>
        </div>
        <div className="text-[10px] text-gray-500 hidden sm:block">
          Phone: {maskPhone(trainee.phone)} • DPDP Active
        </div>
      </div>

      {/* Message List */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
        aria-live="polite"
        id="sahayak-chat-messages"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1 px-1">
              {msg.sender === 'user' ? (
                <>
                  <span>You</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-saffron-600" />
                  <span className="font-medium text-navy-800">MSOL Sahayak</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            <div
              className={`max-w-[88%] rounded-2xl p-4 text-sm shadow-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-navy-900 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-200/90 rounded-tl-none'
              }`}
            >
              {/* Message Content with simple bold & list formatting */}
              <div className="whitespace-pre-wrap space-y-1.5">
                {msg.text.split('\n').map((line, idx) => {
                  if (line.startsWith('• ') || line.startsWith('- ')) {
                    const content = line.replace(/^[•-]\s+/, '');
                    return (
                      <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
                        <span className="text-saffron-500 font-bold leading-none mt-1.5">•</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: content
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>'),
                          }}
                        />
                      </div>
                    );
                  }
                  return (
                    <p
                      key={idx}
                      dangerouslySetInnerHTML={{
                        __html: line
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>'),
                      }}
                    />
                  );
                })}
              </div>

              {/* Source Chips */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase font-semibold text-gray-400 mr-1 tracking-wider">
                    Source Verified:
                  </span>
                  {msg.sources.map((chip) => renderSourceChip(chip))}
                </div>
              )}

              {/* Action Links */}
              {msg.links && msg.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-navy-50 text-navy-800 hover:bg-saffron-50 hover:text-saffron-700 border border-navy-200 transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Suggested Queries */}
            {msg.suggestedQueries && msg.suggestedQueries.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[88%]">
                {msg.suggestedQueries.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-left text-xs bg-white text-navy-700 hover:bg-saffron-50 hover:text-saffron-900 border border-navy-200/80 px-2.5 py-1 rounded-full transition-all shadow-2xs"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-1 px-1">
              <Bot className="w-3 h-3 text-saffron-600" />
              <span>MSOL Sahayak is retrieving records...</span>
            </div>
            <div className="bg-white text-navy-900 border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-saffron-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-saffron-500 animate-bounce [animation-delay:0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-saffron-500 animate-bounce [animation-delay:0.3s]"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Empty-state / Quick Chips carousel when few messages */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-slate-100/60 border-t border-gray-200/70">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-saffron-500" />
            Common Student Questions / वारंवार विचारले जाणारे प्रश्न:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {EMPTY_STATE_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleSend(chip.label)}
                className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-navy-800 hover:bg-saffron-50 hover:border-saffron-300 hover:text-navy-950 transition-colors shadow-2xs text-left"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form & Disclaimer */}
      <div className="p-3 bg-white border-t border-gray-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('sahayak.input_placeholder', language)}
              className="w-full text-sm py-2.5 pl-3.5 pr-10 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-navy-600 focus:border-transparent transition-all"
              aria-label="Ask MSOL Sahayak"
              disabled={isTyping}
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-2.5 rounded-lg bg-saffron-500 text-navy-950 font-semibold hover:bg-saffron-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            aria-label={t('sahayak.send', language)}
          >
            <span className="hidden sm:inline text-xs font-bold">{t('sahayak.send', language)}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Legal Prototype Disclaimer */}
        <div className="mt-2 text-center">
          <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3 text-gray-400 shrink-0" />
            {t('sahayak.disclaimer', language)}
          </p>
        </div>
      </div>
    </div>
  );
}
