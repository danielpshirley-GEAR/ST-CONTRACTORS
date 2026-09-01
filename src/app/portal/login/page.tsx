'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Hammer, Lock, Mail, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/portal/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/customer/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@stcontractors.co.uk');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white">
      <div className="max-w-md w-full space-y-6">
        {/* BRAND */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-[#FFAA4F] text-slate-950 flex items-center justify-center font-bold font-heading shadow-lg">
              <Hammer className="h-5 w-5" />
            </div>
            <span className="font-extrabold font-heading text-2xl tracking-tight text-white">
              ST CONTRACTORS
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight text-white">
            Homeowner Project Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Sign in to view your saved estimates, project timeline, and upload architectural plans.
          </p>
        </div>

        {/* LOGIN CARD */}
        <Card className="p-6 sm:p-8 bg-slate-900 border-slate-800 rounded-3xl shadow-2xl space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 block">Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.co.uk"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Password</label>
                <span className="text-[11px] text-slate-400">Min 6 characters</span>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isLoading}
              className="w-full text-sm font-bold shadow-lg py-3 flex items-center justify-center flex-row flex-nowrap whitespace-nowrap gap-2 bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950"
              rightIcon={<ArrowRight className="h-4 w-4 shrink-0" />}
            >
              {isLoading ? 'Signing In...' : 'Sign In to Portal'}
            </Button>
          </form>

          {/* DEMO ACCORDION */}
          <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-amber-500/20 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold flex items-center gap-1.5 text-[11px] text-[#FFAA4F]">
                <Shield className="h-3.5 w-3.5" /> Demo Account Access:
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-bold text-[#FFAA4F] hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
              >
                Autofill Demo Login
              </button>
            </div>
            <div className="font-mono text-[11px] text-slate-300">
              demo@stcontractors.co.uk &bull; Password123!
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link href={`/portal/register?redirect=${encodeURIComponent(redirectUrl)}`} className="text-[#FFAA4F] font-bold hover:underline">
              Create Free Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading portal login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
