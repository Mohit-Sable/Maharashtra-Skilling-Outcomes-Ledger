// ============================================================
// MSOL — Utility helpers
// ============================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Confidence, OutcomeType, FollowUpStatus, WageBand } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function daysFromNow(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function confidenceColor(confidence: Confidence): string {
  switch (confidence) {
    case 'EMPLOYER_CONFIRMED': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'DOCUMENT_BACKED': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'UNVERIFIED': return 'bg-amber-100 text-amber-800 border-amber-300';
  }
}

export function confidenceLabel(confidence: Confidence): string {
  switch (confidence) {
    case 'EMPLOYER_CONFIRMED': return 'Employer Confirmed';
    case 'DOCUMENT_BACKED': return 'Document Backed';
    case 'UNVERIFIED': return 'Self-Reported';
  }
}

export function outcomeTypeColor(type: OutcomeType): string {
  switch (type) {
    case 'PLACED': return 'bg-emerald-500';
    case 'RETAINED': return 'bg-emerald-600';
    case 'SELF_EMPLOYED': return 'bg-blue-500';
    case 'APPRENTICE': return 'bg-indigo-500';
    case 'WAGE_UPDATE': return 'bg-teal-500';
    case 'LEFT_JOB': return 'bg-red-500';
    case 'NOT_PLACED': return 'bg-gray-500';
    case 'UNREACHABLE': return 'bg-gray-400';
  }
}

export function outcomeTypeLabel(type: OutcomeType): string {
  switch (type) {
    case 'PLACED': return 'Placed';
    case 'RETAINED': return 'Retained';
    case 'SELF_EMPLOYED': return 'Self-Employed';
    case 'APPRENTICE': return 'Apprentice';
    case 'WAGE_UPDATE': return 'Wage Update';
    case 'LEFT_JOB': return 'Left Job';
    case 'NOT_PLACED': return 'Not Placed';
    case 'UNREACHABLE': return 'Unreachable';
  }
}

export function followUpStatusColor(status: FollowUpStatus): string {
  switch (status) {
    case 'COMPLETED': return 'bg-emerald-100 text-emerald-800';
    case 'PENDING': return 'bg-blue-100 text-blue-800';
    case 'SENT': return 'bg-amber-100 text-amber-800';
    case 'NO_REPLY': return 'bg-gray-100 text-gray-800';
    case 'ESCALATED': return 'bg-red-100 text-red-800';
  }
}

export function wageBandToNumber(band: WageBand): number {
  switch (band) {
    case '<10k': return 8000;
    case '10-15k': return 12500;
    case '15-20k': return 17500;
    case '20-30k': return 25000;
    case '30k+': return 35000;
  }
}

export function wageBandLabel(band: WageBand | string): string {
  switch (band) {
    case '<10k': return '₹ < 10K';
    case '10-15k': return '₹ 10-15K';
    case '15-20k': return '₹ 15-20K';
    case '20-30k': return '₹ 20-30K';
    case '30k+': return '₹ 30K+';
    default: return typeof band === 'string' && band.startsWith('₹') ? band : `₹ ${band}`;
  }
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
