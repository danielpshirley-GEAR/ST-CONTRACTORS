'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, Hammer, AlertCircle, ArrowRight } from 'lucide-react';

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
        throw new Error(data.error || 'Invalid credentials');
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
    <div className="py-20 bg-slate-950 min-h-[80vh] flex items-center justify-center">
      <Container size="sm">
        <Card className="p-8 sm:p-10 bg-slate-900 border-slate-800 text-white max-w-md mx-auto shadow-2xl">
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-brand-600 flex items-center justify-center mx-auto text-white mb-3 shadow-lg">
              <Hammer className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-white font-heading">
              Apex Staff Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Internal CRM & Lead Management System
            </p>
          </div>

          {status === 'error' && (
            <div className="p-3 mb-6 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={status === 'loading'}
                className="w-full justify-center text-sm font-semibold"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Access Admin Dashboard
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
            Default dev password: <code className="text-brand-400 bg-slate-800 px-1.5 py-0.5 rounded">ApexAdmin2026!Secure</code>
          </div>
        </Card>
      </Container>
    </div>
  );
}
