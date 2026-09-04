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
  PlusCircle,
  Sparkles,
} from 'lucide-react';

interface ProjectBriefCardProps {
  state: ProjectState;
  onEditDimensions: () => void;
  onAddPropertyInfo?: () => void;
  onUseExampleDimensions?: () => void;
}

export function ProjectBriefCard({
  state,
  onEditDimensions,
  onAddPropertyInfo,
  onUseExampleDimensions,
}: ProjectBriefCardProps) {
  const primarySpace = state.spaces[0];
  const isTypeUnknown = !state.property.type.value || state.property.type.value === 'unknown' || state.property.type.value === 'not_provided';
  const isEraUnknown = !state.property.era.value || state.property.era.value === 'unknown' || state.property.era.value === 'not_provided';
  const hasDimensions = primarySpace?.lengthM?.value !== undefined && primarySpace?.widthM?.value !== undefined;
  const isExampleModel = primarySpace?.lengthM?.status === 'assumed';

  return (
    <div id="section-brief" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Section 1 • Project Brief &amp; Provenance
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
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-heading">
              <Home className="h-4 w-4 text-[#FFAA4F]" />
              <span>Property Characteristics</span>
            </h3>
            {onAddPropertyInfo && (isTypeUnknown || isEraUnknown) && (
              <button
                type="button"
                onClick={onAddPropertyInfo}
                className="text-[11px] font-bold text-[#FFAA4F] hover:text-amber-800 flex items-center gap-1"
              >
                <PlusCircle className="h-3 w-3" />
                <span>Add Property Details</span>
              </button>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Property Type:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                {isTypeUnknown ? (
                  <span className="text-slate-400 font-normal italic">Not yet provided</span>
                ) : (
                  state.property.type.value.replace(/_/g, ' ')
                )}
                <StatusTag status={state.property.type.status} />
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Architectural Era:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                {isEraUnknown ? (
                  <span className="text-slate-400 font-normal italic">Not yet provided</span>
                ) : (
                  state.property.era.value
                )}
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
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Conservation / Listed:</span>
              <span className="font-bold text-slate-900">
                {state.property.isConservationArea.value === 'unknown' ? (
                  <span className="text-slate-400 font-normal italic">Unknown / Not checked</span>
                ) : (
                  state.property.isConservationArea.value ? 'Yes' : 'No'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Space Dimensions */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-heading">
              <Ruler className="h-4 w-4 text-[#FFAA4F]" />
              <span>Room Dimensions</span>
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

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Space Name:</span>
              <span className="font-bold text-slate-900">{primarySpace.name}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Dimensions:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                {hasDimensions ? (
                  <span>
                    {primarySpace.lengthM.value}m × {primarySpace.widthM.value}m
                    {primarySpace.heightM.value && ` × ${primarySpace.heightM.value}m`}
                  </span>
                ) : (
                  <span className="text-slate-400 font-normal italic">Not yet provided</span>
                )}
                {hasDimensions && <StatusTag status={primarySpace.lengthM.status} />}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Floor Area:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                {primarySpace.areaM2.value ? (
                  <span>~{primarySpace.areaM2.value} m²</span>
                ) : (
                  <span className="text-slate-400 font-normal italic">Area not yet calculated</span>
                )}
              </span>
            </div>

            {/* Example Dimensions Action (Item 12, 13) */}
            {!hasDimensions && onUseExampleDimensions && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onUseExampleDimensions}
                  className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-amber-900 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Use Typical Dimensions (Example Model 5m × 4m)</span>
                </button>
              </div>
            )}

            {isExampleModel && (
              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-800 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>EXAMPLE MODEL — Indicative 5m × 4m dimensions. Not confirmed on site.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusTag({ status }: { status?: string }) {
  if (status === 'confirmed') {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
        <CheckCircle2 className="w-2.5 h-2.5" /> Confirmed
      </span>
    );
  }
  if (status === 'assumed') {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
        <AlertCircle className="w-2.5 h-2.5" /> Assumed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
      <HelpCircle className="w-2.5 h-2.5" /> Unknown
    </span>
  );
}
