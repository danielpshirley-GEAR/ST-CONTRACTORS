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
    <div className="space-y-8 text-left max-w-7xl mx-auto py-10 px-4 sm:px-8 bg-[#F4F5F7] min-h-screen text-slate-900">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm" className="bg-[#FFAA4F]/20 text-[#D97706] border-[#FFAA4F]/40 font-bold text-xs">
              <Network className="h-3 w-3 mr-1 inline" />
              API &amp; Service Connections
            </Badge>
            <span className="text-xs text-slate-500 font-semibold">Server-Side Protected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
            SEO &amp; Analytics Integrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage credentials for Search Console, GA4, DataForSEO, PageSpeed, Google Maps, and Gemini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/seo">
            <Button variant="outline" size="sm" className="text-xs text-slate-700 border-slate-300 bg-white hover:bg-slate-50 font-bold shadow-xs">
              ← Back to SEO Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* STATUS OVERVIEW CARD */}
      <Card className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            System Connection Health
          </div>
          <div className="text-2xl font-extrabold font-heading text-slate-900 flex items-center gap-2">
            <span>{connectedCount} of {services.length} External Services Connected</span>
          </div>
          <p className="text-xs text-slate-600">
            Real credentials configured securely via server environment variables.
          </p>
        </div>

        <Badge
          variant="brand"
          className={clsx(
            'text-xs font-extrabold px-4 py-2 rounded-xl shrink-0',
            connectedCount === services.length
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-[#FFAA4F] text-slate-950 border-[#FFAA4F]'
          )}
        >
          {connectedCount === services.length ? '✓ All Systems Operational' : '⚠️ Configuration Required'}
        </Badge>
      </Card>

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const isConnected = service.status === 'connected';
          const isTesting = testingId === service.id;

          return (
            <Card
              key={service.id}
              className="p-6 bg-white border-slate-200/90 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 font-heading">
                      {service.name}
                    </h2>
                    <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">
                      {service.category.replace('_', ' ')}
                    </span>
                  </div>

                  <Badge
                    variant="brand"
                    className={clsx(
                      'text-[10px] font-extrabold shrink-0',
                      isConnected
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    )}
                  >
                    {isConnected ? 'Connected' : 'Not Configured'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-700">Required Environment Keys:</div>
                  <div className="flex flex-wrap gap-1">
                    {service.requiredEnvVars.map((env) => (
                      <span
                        key={env}
                        className="px-2 py-0.5 rounded-md bg-[#FAFAF9] border border-slate-200 text-[10px] font-mono text-slate-700 font-semibold"
                      >
                        {env}
                      </span>
                    ))}
                  </div>
                </div>

                {service.lastError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{service.lastError}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">
                  {service.lastSuccessfulSync ? `Last Sync: ${service.lastSuccessfulSync}` : 'No sync recorded'}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTestConnection(service.id)}
                  disabled={isTesting}
                  className="text-xs font-bold bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border-none shadow-xs cursor-pointer"
                >
                  <RefreshCw className={clsx('h-3.5 w-3.5 mr-1', isTesting && 'animate-spin')} />
                  <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
