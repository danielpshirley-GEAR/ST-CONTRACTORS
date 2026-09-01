'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, Hammer, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <div className="py-20 bg-slate-950 min-h-[85vh] flex items-center justify-center text-left">
      <Container size="sm">
        <Card className="p-8 sm:p-10 bg-slate-900 border-slate-800 text-white max-w-md mx-auto shadow-2xl rounded-3xl">
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-[#FFAA4F] flex items-center justify-center mx-auto text-slate-950 font-black mb-4 shadow-lg">
              <Hammer className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white font-heading tracking-tight">
              ST CONTRACTORS
            </h1>
            <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-1">
              Staff Portal &amp; CRM Management
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Principal contractor pipeline, lead qualification, and SEO console.
            </p>
          </div>

          {status === 'error' && (
            <div className="p-3 mb-6 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Administrator Passphrase
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none placeholder:text-slate-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-extrabold text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{status === 'loading' ? 'Authenticating...' : 'Access Staff Console'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Encrypted Session • ST Contractors Principal System</span>
          </div>
        </Card>
      </Container>
    </div>
  );
}
