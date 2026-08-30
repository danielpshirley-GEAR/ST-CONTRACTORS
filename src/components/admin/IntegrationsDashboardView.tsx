'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IntegrationServiceInfo } from '@/lib/seo/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Network,
  CheckCircle2,
  AlertCircle,
  Shield,
  RefreshCw,
  Search,
  BarChart3,
  Sparkles,
  Zap,
  MapPin,
  Building,
} from 'lucide-react';
import { clsx } from 'clsx';

interface IntegrationsDashboardViewProps {
  initialServices: IntegrationServiceInfo[];
}

export const IntegrationsDashboardView: React.FC<IntegrationsDashboardViewProps> = ({
  initialServices,
}) => {
  const [services, setServices] = useState<IntegrationServiceInfo[]>(initialServices);
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    try {
      const res = await fetch('/api/admin/seo/health');
      const data = await res.json();
      if (data.services) {
        const found = data.services.find((s: any) => s.serviceId === id);
        setServices((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: found?.status === 'PASS' ? 'connected' : found?.status === 'DISABLED' ? 'disabled' : 'not_configured',
                  lastSuccessfulSync: new Date().toLocaleTimeString(),
                  lastError: found?.status !== 'PASS' ? found?.message : undefined,
                }
              : s
          )
        );
      }
    } catch (err) {
      console.error('Connection test failed:', err);
    } finally {
      setTestingId(null);
    }
  };

  const connectedCount = services.filter((s) => s.status === 'connected').length;

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm" className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
              <Network className="h-3 w-3 mr-1 inline" />
              API &amp; Service Connections
            </Badge>
            <span className="text-xs text-slate-400">Server-Side Protected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading">
            SEO &amp; Analytics Integrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage credentials for Search Console, GA4, DataForSEO, PageSpeed, Google Maps, and Gemini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/seo">
            <Button variant="outline" size="sm" className="text-xs text-slate-300 border-slate-700 bg-slate-800 hover:bg-slate-700">
              ← Back to SEO Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* STATUS OVERVIEW CARD */}
      <Card className="p-6 bg-slate-800/90 border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            System Connection Health
          </div>
          <div className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
            <span>{connectedCount} of {services.length} External Services Connected</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All integrations fail gracefully with cached benchmark fallbacks, ensuring zero public website downtime.
          </p>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/80 text-xs text-slate-300 space-y-1 max-w-sm">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Shield className="h-4 w-4" />
            <span>Environment Variable Security</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Configure keys in your deployment environment or <code className="text-amber-300">.env.local</code>. Never commit secrets to Git.
          </p>
        </div>
      </Card>

      {/* INTEGRATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv) => {
          const isTesting = testingId === srv.id;

          return (
            <Card
              key={srv.id}
              className="p-6 bg-slate-800/90 border-slate-700 hover:border-slate-600 transition-all rounded-3xl flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-white font-heading">{srv.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{srv.description}</p>
                  </div>
                  {srv.status === 'connected' ? (
                    <Badge variant="brand" size="sm" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs shrink-0">
                      <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                      Connected
                    </Badge>
                  ) : srv.status === 'disabled' ? (
                    <Badge variant="slate" size="sm" className="bg-slate-700 text-slate-400 border-slate-600 text-xs shrink-0">
                      Disabled
                    </Badge>
                  ) : (
                    <Badge variant="slate" size="sm" className="bg-slate-700 text-slate-300 border-slate-600 text-xs shrink-0">
                      Not Configured
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-700/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Required Environment Variables:
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {srv.requiredEnvVars.map((envVar) => (
                      <span
                        key={envVar}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300"
                      >
                        {envVar}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400">
                  {srv.lastSuccessfulSync ? `Checked ${srv.lastSuccessfulSync}` : 'Fallback mode active'}
                </div>
                <button
                  type="button"
                  onClick={() => handleTestConnection(srv.id)}
                  disabled={isTesting}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-650 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={clsx('h-3.5 w-3.5', isTesting && 'animate-spin')} />
                  <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
