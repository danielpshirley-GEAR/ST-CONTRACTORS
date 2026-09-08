'use client';

import { ProjectState, StructuralEngineerSpec, FinishTier } from '@/types/visualiser-scope';
import { ProposedScopeSection } from './ProposedScopeSection';
import { SpecificationBuilder } from './SpecificationBuilder';
import { QuantitiesBreakdown } from './QuantitiesBreakdown';
import { FeasibilityConstraintsCard } from './FeasibilityConstraintsCard';
import { AssumptionsPanel } from './AssumptionsPanel';
import { MissingInfoRank } from './MissingInfoRank';
import { FileCheck2, Cpu, Wrench, Layers, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TechnicalDetailViewProps {
  projectState: ProjectState;
  onToggleScopeItem: (id: string) => void;
  onUpdateSpecOption: (nodeId: string, optionName: string, tier: FinishTier) => void;
  onSetNotDecided: (nodeId: string) => void;
  onEditDimensions: () => void;
  onSaveEngineerSpec: (spec: StructuralEngineerSpec) => void;
  onConfirmAssumption: (id: string) => void;
  onChangeAssumption: (id: string) => void;
  onRemoveAssumption: (id: string) => void;
  onAnswerQuestion: (questionId: string, answer: string) => void;
  onOpenBriefModal: () => void;
}

export function TechnicalDetailView({
  projectState,
  onToggleScopeItem,
  onUpdateSpecOption,
  onSetNotDecided,
  onEditDimensions,
  onSaveEngineerSpec,
  onConfirmAssumption,
  onChangeAssumption,
  onRemoveAssumption,
  onAnswerQuestion,
  onOpenBriefModal,
}: TechnicalDetailViewProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#FFAA4F]">
            <Cpu className="w-5 h-5" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Technical Specification & Engineering Model
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Detailed Bill of Quantities, material take-offs, statutory feasibility matrix, and engineer structural schedules.
          </p>
        </div>

        <Button
          type="button"
          onClick={onOpenBriefModal}
          variant="outline"
          size="sm"
          className="border-slate-700 bg-slate-800 text-slate-200 hover:text-white font-bold text-xs"
        >
          <FileCheck2 className="w-4 h-4 text-[#FFAA4F] mr-2" />
          Export Builder Brief
        </Button>
      </div>

      {/* 1. Proposed Scope of Works */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-300 text-sm font-bold">
          <Wrench className="w-4 h-4 text-[#FFAA4F]" />
          <span>1. Itemised Scope of Works (BoQ Schedule)</span>
        </div>
        <ProposedScopeSection
          items={projectState.scopeOfWorks}
          onToggleItem={onToggleScopeItem}
        />
      </div>

      {/* 2. Specification Tree */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-300 text-sm font-bold">
          <Layers className="w-4 h-4 text-[#FFAA4F]" />
          <span>2. Specification Tree & Material Choices</span>
        </div>
        <SpecificationBuilder
          nodes={projectState.specificationTree}
          onUpdateOption={onUpdateSpecOption}
          onSetNotDecided={onSetNotDecided}
        />
      </div>

      {/* 3. Calculated Quantities Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-300 text-sm font-bold">
          <Calculator className="w-4 h-4 text-[#FFAA4F]" />
          <span>3. Deterministic Material Quantities</span>
        </div>
        <QuantitiesBreakdown
          quantities={projectState.calculatedQuantities}
          onEditDimensions={onEditDimensions}
          onSaveEngineerSpec={onSaveEngineerSpec}
          currentEngineerSpec={projectState.structuralEngineerSpec}
        />
      </div>

      {/* 4. Feasibility & Constraints Analysis */}
      <div className="space-y-3">
        <FeasibilityConstraintsCard items={projectState.feasibility} />
      </div>

      {/* 5. System Assumptions Panel */}
      <div className="space-y-3">
        <AssumptionsPanel
          assumptions={projectState.assumptions}
          onConfirmAssumption={onConfirmAssumption}
          onChangeAssumption={onChangeAssumption}
          onRemoveAssumption={onRemoveAssumption}
        />
      </div>

      {/* 6. Missing Info / Clarifications */}
      <div className="space-y-3">
        <MissingInfoRank
          missingInfo={projectState.missingInformation}
          completenessScore={projectState.completenessScore}
          onAnswerQuestion={onAnswerQuestion}
        />
      </div>
    </div>
  );
}
