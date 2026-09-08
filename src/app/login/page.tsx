'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMSOLStore } from '@/lib/store';
import { demoUsers } from '@/lib/seed';
import { Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import type { UserRole } from '@/lib/types';

const roleLabels: Record<UserRole, string> = {
  state_admin: 'State (DTE / MSINS)',
  district_officer: 'District Officer',
  training_provider: 'College TPO',
  employer: 'Employer (HR)',
  counsellor: 'Career Counsellor',
  trainee: 'Student / Grad',
};

const roleColors: Record<UserRole, string> = {
  state_admin: 'bg-navy-900',
  district_officer: 'bg-navy-700',
  training_provider: 'bg-blue-600',
  employer: 'bg-emerald-600',
  counsellor: 'bg-purple-600',
  trainee: 'bg-saffron-500',
};

export default function LoginPage() {
  const router = useRouter();
  const { login, loginApaar, loginAsRole } = useMSOLStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [apaarMode, setApaarMode] = useState(false);
  const [apaarId, setApaarId] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(email, password)) {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials. Use demo logins listed below.');
    }
  };

  const handleApaarLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (apaarId.length === 14) { // 12 digits + 2 hyphens
      if (loginApaar(apaarId)) {
        router.push('/me');
      } else {
        setError('APAAR ID not found');
      }
    } else {
      setError('Enter a valid 12-digit APAAR ID (e.g. 1234-5678-9012)');
    }
  };

  const quickLogin = (role: UserRole) => {
    loginAsRole(role);
    router.push(role === 'trainee' ? '/me' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 ashoka-header flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl mb-6 mx-auto">☸</div>
          <h1 className="text-3xl font-bold mb-2">MSOL</h1>
          <p className="text-lg text-white/80 mb-2">Maharashtra Skilling Outcomes Ledger</p>
          <p className="text-sm text-saffron-200 italic mb-8">From certificate to livelihood</p>
          
          <div className="bg-white/10 rounded-xl p-6 text-left border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-saffron-400" />
              <span className="text-xs font-semibold text-saffron-400 uppercase tracking-wider">Demo Environment</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              This is a prototype for SIH 2026 (Problem Code SIH26135). 
              All data is simulated. No real trainee information is used.
            </p>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center text-xl text-white mx-auto mb-3">☸</div>
            <h1 className="text-2xl font-bold text-navy-900">MSOL</h1>
            <p className="text-sm text-gray-500">Maharashtra Skilling Outcomes Ledger</p>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-navy-900 mb-1">Sign In</h2>
            <p className="text-sm text-gray-500 mb-6">Use demo credentials or quick-login below</p>

            {/* Toggle: Email/APAAR */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setApaarMode(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${!apaarMode ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Email Login
              </button>
              <button
                onClick={() => setApaarMode(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${apaarMode ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                APAAR Login
              </button>
            </div>

            {!apaarMode ? (
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@msol.demo"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-navy-500 focus:ring-1 focus:ring-navy-500 outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="demo123"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-navy-500 focus:ring-1 focus:ring-navy-500 outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
                <button type="submit" className="btn-primary w-full justify-center py-2.5">
                  Sign In <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleApaarLogin}>
                <div className="mb-4">
                  <label htmlFor="apaar" className="block text-sm font-medium text-gray-700 mb-1">APAAR ID / अपार आयडी</label>
                  <input
                    id="apaar"
                    type="text"
                    maxLength={14}
                    value={apaarId}
                    onChange={e => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 4) val = val.slice(0, 4) + '-' + val.slice(4);
                      if (val.length > 9) val = val.slice(0, 9) + '-' + val.slice(9);
                      setApaarId(val);
                    }}
                    placeholder="1234-5678-9012"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-center text-xl tracking-[0.2em] font-mono focus:border-navy-500 focus:ring-1 focus:ring-navy-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Hint: Check the Students registry for a mock APAAR ID</p>
                </div>
                {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
                <button type="submit" className="btn-primary w-full justify-center py-2.5">
                  Verify & Enter <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Quick Login Buttons */}
          <div className="mt-6">
            <p className="text-xs text-gray-400 text-center mb-3 font-medium uppercase tracking-wider">Quick Login (Demo)</p>
            <div className="grid grid-cols-3 gap-2">
              {demoUsers.map(user => (
                <button
                  key={user.role}
                  onClick={() => quickLogin(user.role)}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg bg-white border border-gray-200 hover:border-navy-300 hover:shadow-md transition-all group"
                >
                  <div className={`w-8 h-8 rounded-full ${roleColors[user.role]} text-white flex items-center justify-center text-[10px] font-bold`}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-[10px] font-medium text-gray-600 group-hover:text-navy-900">{roleLabels[user.role]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 p-3 rounded-lg bg-navy-50 border border-navy-100">
            <p className="text-xs font-semibold text-navy-700 mb-2">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-navy-600">
              {demoUsers.map(user => (
                <div key={user.email} className="flex justify-between">
                  <span className="font-mono text-[10px]">{user.email}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-navy-500 mt-1">Password for all: <strong>demo123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
