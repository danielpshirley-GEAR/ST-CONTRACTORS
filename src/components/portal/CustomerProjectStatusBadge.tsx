import React from 'react';
import { CustomerProjectStatus } from '@/lib/db/schema';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Calendar, Search, FileText, CheckCircle2, Hammer } from 'lucide-react';

interface CustomerProjectStatusBadgeProps {
  status: CustomerProjectStatus | string;
}

export function CustomerProjectStatusBadge({ status }: CustomerProjectStatusBadgeProps) {
  switch (status) {
    case 'ESTIMATE_SAVED':
      return (
        <Badge variant="brand" size="sm" className="bg-[#FFAA4F]/20 text-[#FFAA4F] border-[#FFAA4F]/40 text-[10px] uppercase font-bold">
          <Sparkles className="h-3 w-3 mr-1 inline" />
          Estimate Saved
        </Badge>
      );
    case 'CONSULTATION_REQUESTED':
      return (
        <Badge variant="warning" size="sm" className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] uppercase font-bold">
          <Calendar className="h-3 w-3 mr-1 inline" />
          Consultation Requested
        </Badge>
      );
    case 'SITE_SURVEY_SCHEDULED':
      return (
        <Badge variant="brand" size="sm" className="bg-blue-500/20 text-blue-300 border-blue-500/40 text-[10px] uppercase font-bold">
          <Search className="h-3 w-3 mr-1 inline" />
          Site Survey Booked
        </Badge>
      );
    case 'ARCHITECTURAL_DRAWINGS':
      return (
        <Badge variant="slate" size="sm" className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px] uppercase font-bold">
          <FileText className="h-3 w-3 mr-1 inline" />
          Architectural Stage
        </Badge>
      );
    case 'FORMAL_QUOTE_ISSUED':
      return (
        <Badge variant="brand" size="sm" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] uppercase font-bold">
          <FileText className="h-3 w-3 mr-1 inline" />
          Formal Quote Issued
        </Badge>
      );
    case 'CONSTRUCTION_ACTIVE':
      return (
        <Badge variant="brand" size="sm" className="bg-amber-500/20 text-[#FFAA4F] border-amber-500/40 text-[10px] uppercase font-bold">
          <Hammer className="h-3 w-3 mr-1 inline" />
          Construction Active
        </Badge>
      );
    case 'PROJECT_COMPLETED':
      return (
        <Badge variant="brand" size="sm" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] uppercase font-bold">
          <CheckCircle2 className="h-3 w-3 mr-1 inline" />
          Project Completed
        </Badge>
      );
    default:
      return (
        <Badge variant="slate" size="sm" className="text-[10px] uppercase">
          {status}
        </Badge>
      );
  }
}
