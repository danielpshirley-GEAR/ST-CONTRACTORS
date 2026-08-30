'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Hammer,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowRight,
  Shield,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

function RegisterContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [pendingProject, setPendingProject] = useState<any>(null);
  const [pendingCalculation, setPendingCalculation] = useState<any>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/portal/dashboard';

  useEffect(() => {
    try {
      const savedProjStr = sessionStorage.getItem('pending_saved_project');
      if (savedProjStr) {
        const parsed = JSON.parse(savedProjStr);
        setPendingProject(parsed);
        if (parsed.inputData?.postcode && !postcode) {
          setPostcode(parsed.inputData.postcode);
        }
      }

      const savedCalcStr = sessionStorage.getItem('pending_saved_calculation');
      if (savedCalcStr) {
        setPendingCalculation(JSON.parse(savedCalcStr));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/customer/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          postcode,
          password,
          pendingProject,
          pendingCalculation,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Clear pending items from session storage
      sessionStorage.removeItem('pending_saved_project');
      sessionStorage.removeItem('pending_saved_calculation');

      router.push('/portal/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white">
      <div className="max-w-xl w-full space-y-6">
        {/* BRAND */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-[#FFAA4F] text-slate-950 flex items-center justify-center font-bold font-heading shadow-lg">
              <Hammer className="h-5 w-5" />
            </div>
            <span className="font-extrabold font-heading text-2xl tracking-tight text-white">
              APEX<span className="text-[#FFAA4F]">.</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight text-white">
            Create Your Project Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Save your estimate, track construction progress, manage architectural drawings, and book your consultation.
          </p>
        </div>

        {/* PENDING ESTIMATE NOTICE */}
        {pendingProject && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-[#FFAA4F] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-[#FFAA4F]">
                Your Configured Project Estimate will be Saved Automatically
              </div>
              <div className="text-slate-300">
                {pendingProject.title || `${pendingProject.inputData?.projectType} Project`} —{' '}
                <strong className="text-white">
                  £{pendingProject.estimateResult?.totalPriceRoundedLow?.toLocaleString()} – £
                  {pendingProject.estimateResult?.totalPriceRoundedHigh?.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* PENDING CALCULATION NOTICE */}
        {pendingCalculation && (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
            <Zap className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-blue-400">
                Saved Trade Calculation: {pendingCalculation.calculatorTitle}
              </div>
              <div className="text-slate-300 font-mono">
                {pendingCalculation.outputs?.primaryQuantity} ({pendingCalculation.outputs?.priceRange})
              </div>
            </div>
          </div>
        )}

        {/* REGISTER CARD */}
        <Card className="p-6 sm:p-8 bg-slate-900 border-slate-800 rounded-3xl shadow-2xl space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Full Name</label>
                <div className="relative">
                  <User className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Phone Number</label>
                <div className="relative">
                  <Phone className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07700 900123"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Email Address</label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.co.uk"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFAA4F] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Property Postcode</label>
                <div className="relative">
                  <MapPin className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    placeholder="W5 2UP"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-[#FFAA4F] transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Create Password</label>
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

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Your project details and contact data are strictly private and never shared.</span>
            </div>

            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isLoading}
              className="w-full text-sm font-bold shadow-lg py-3 flex items-center justify-center flex-row flex-nowrap whitespace-nowrap gap-2 bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950"
              rightIcon={<ArrowRight className="h-4 w-4 shrink-0" />}
            >
              {isLoading ? 'Creating Account...' : 'Create Account & Access Portal'}
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link href={`/portal/login?redirect=${encodeURIComponent(redirectUrl)}`} className="text-[#FFAA4F] font-bold hover:underline">
              Sign In Here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function CustomerRegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading portal registration...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
