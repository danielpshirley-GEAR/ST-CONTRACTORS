'use client';

import React from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Home,
  Ruler,
  Compass,
  MapPin,
  Edit2,
} from 'lucide-react';

interface ProjectBriefCardProps {
  state: ProjectState;
  onEditDimensions: () => void;
}

export function ProjectBriefCard({ state, onEditDimensions }: ProjectBriefCardProps) {
  const primarySpace = state.spaces[0];

  return (
    <div id="section-brief" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 1 • Project Brief
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Here&apos;s How We Understand Your Project
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="slate" className="bg-slate-100 text-slate-800 border-slate-200 text-xs font-bold">
            {state.projectTypes.map((t) => t.replace(/-/g, ' ')).join(' + ')}
          </Badge>
        </div>
      </div>

      {/* Interpreted Intent Box */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
          Interpreted Project Intent
        </span>
        <p className="text-sm font-medium leading-relaxed">
          &ldquo;{state.interpretedIntent}&rdquo;
        </p>
      </div>

      {/* Property & Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Property Structure */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-heading">
            <Home className="h-4 w-4 text-[#FFAA4F]" />
            <span>Property Characteristics</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Property Type:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                {state.property.type.value.replace(/_/g, ' ')}
                <StatusTag status={state.property.type.status} />
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Architectural Era:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                {state.property.era.value}
                <StatusTag status={state.property.era.status} />
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Location:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                {state.property.location.value}
                <StatusTag status={state.property.location.status} />
              </span>
            </div>
          </div>
        </div>

        {/* Primary Space & Dimensions */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-heading">
              <Ruler className="h-4 w-4 text-[#FFAA4F]" />
              <span>Target Space &amp; Dimensions</span>
            </h3>
            <button
              type="button"
              onClick={onEditDimensions}
              className="text-[11px] font-bold text-[#FFAA4F] hover:text-amber-800 flex items-center gap-1"
            >
              <Edit2 className="h-3 w-3" />
              <span>Edit Dimensions</span>
            </button>
          </div>

          {primarySpace && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Room Name:</span>
                <span className="font-bold text-slate-900">{primarySpace.name}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Room Footprint:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  {primarySpace.lengthM.value}m × {primarySpace.widthM.value}m ({primarySpace.areaM2.value} m²)
                  <StatusTag status={primarySpace.lengthM.status} />
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Ceiling Height:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  {primarySpace.heightM.value}m
                  <StatusTag status={primarySpace.heightM.status} />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusTag({ status }: { status: string }) {
  if (status === 'confirmed') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
        <CheckCircle2 className="h-2.5 w-2.5" />
        <span>Confirmed</span>
      </span>
    );
  }
  if (status === 'assumed') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md">
        <AlertCircle className="h-2.5 w-2.5" />
        <span>Assumed</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded-md">
      <HelpCircle className="h-2.5 w-2.5" />
      <span>Unknown</span>
    </span>
  );
}
