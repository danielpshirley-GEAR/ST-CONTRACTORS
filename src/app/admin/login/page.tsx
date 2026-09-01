'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, Building2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid administrator password');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setStatus('error');
      setErrorMessage(message);
    }
  };

  return (
    <div className="py-20 bg-[#F4F5F7] min-h-[85vh] flex items-center justify-center text-left">
      <Container size="sm">
        <Card className="p-8 sm:p-10 bg-white border-slate-200 text-slate-900 max-w-md mx-auto shadow-xl rounded-3xl">
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-[#FFAA4F] text-slate-950 flex items-center justify-center mx-auto font-black mb-4 shadow-md">
              <Building2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
              ST CONTRACTORS
            </h1>
            <p className="text-xs text-[#D97706] font-bold uppercase tracking-wider mt-1">
              Staff Portal &amp; CRM Management
            </p>
            <p className="text-xs text-slate-600 mt-2">
              Principal contractor pipeline, lead qualification, and SEO console.
            </p>
          </div>

          {status === 'error' && (
            <div className="p-3 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Administrator Passphrase
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFAF9] border border-slate-300 text-slate-900 text-sm focus:border-[#FFAA4F] focus:ring-2 focus:ring-[#FFAA4F]/20 focus:outline-none placeholder:text-slate-400 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{status === 'loading' ? 'Authenticating...' : 'Access Staff Console'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Encrypted Session • ST Contractors Principal System</span>
          </div>
        </Card>
      </Container>
    </div>
  );
}
