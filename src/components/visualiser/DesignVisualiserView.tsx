'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProjectState, FinishTier } from '@/types/visualiser-scope';
import { createInitialProjectState, applyProjectChange } from '@/lib/visualiser/project-state-engine';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VisualiserLandingHero } from './VisualiserLandingHero';
import { ProjectBriefCard } from './ProjectBriefCard';
import { VisualConceptCard } from './VisualConceptCard';
import { ProposedScopeSection } from './ProposedScopeSection';
import { FinishTiersSelector } from './FinishTiersSelector';
import { ConstructionPhasesAccordion } from './ConstructionPhasesAccordion';
import { ThingsToConsiderGrid } from './ThingsToConsiderGrid';
import { SpecificationBuilder } from './SpecificationBuilder';
import { QuantitiesBreakdown } from './QuantitiesBreakdown';
import { FeasibilityConstraintsCard } from './FeasibilityConstraintsCard';
import { AssumptionsPanel } from './AssumptionsPanel';
import { MissingInfoRank } from './MissingInfoRank';
import { ProjectChangeInput } from './ProjectChangeInput';
import { AskAboutProjectChat } from './AskAboutProjectChat';
import { BudgetAlignmentCard } from './BudgetAlignmentCard';
import { ProjectComplexityBadge } from './ProjectComplexityBadge';
import { BuilderReadyBriefModal } from './BuilderReadyBriefModal';
import { ConversionBanner } from './ConversionBanner';
import { RelatedResourcesSection } from './RelatedResourcesSection';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  FileCheck2,
  Share2,
  Sliders,
  Ruler,
  HelpCircle,
  X,
} from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'section-brief', label: '1. Brief' },
  { id: 'section-visual', label: '2. Visual' },
  { id: 'section-scope', label: '3. Scope' },
  { id: 'section-finishes', label: '4. Finishes' },
  { id: 'section-phases', label: '5. Phases' },
  { id: 'section-considerations', label: '6. Checks' },
  { id: 'section-specification', label: '7. Spec' },
  { id: 'section-quantities', label: '8. Quantities' },
  { id: 'section-feasibility', label: '9. Feasibility' },
  { id: 'section-assumptions', label: '10. Assumptions' },
  { id: 'section-ask-ai', label: '11. Ask AI' },
  { id: 'section-budget', label: '12. Budget' },
];

export function DesignVisualiserView() {
  const searchParams = useSearchParams();
  const promptParam = searchParams.get('prompt') || '';
  const lengthParam = searchParams.get('length');
  const widthParam = searchParams.get('width');

  const [projectState, setProjectState] = useState<ProjectState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApplyingChange, setIsApplyingChange] = useState<boolean>(false);
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<string>('section-brief');
  const [showBriefModal, setShowBriefModal] = useState<boolean>(false);
  const [showEditDimsModal, setShowEditDimsModal] = useState<boolean>(false);
  const [editLength, setEditLength] = useState<string>('5.0');
  const [editWidth, setEditWidth] = useState<string>('3.8');

  // Auto-initialize if promptParam exists
  useEffect(() => {
    if (promptParam && !projectState) {
      const parsedLength = lengthParam ? parseFloat(lengthParam) : undefined;
      const parsedWidth = widthParam ? parseFloat(widthParam) : undefined;
      const initial = createInitialProjectState({
        briefText: promptParam,
        dimensions: { length: parsedLength, width: parsedWidth },
      });
      setProjectState(initial);
      if (initial.spaces[0]) {
        setEditLength(String(initial.spaces[0].lengthM.value));
        setEditWidth(String(initial.spaces[0].widthM.value));
      }
    }
  }, [promptParam, lengthParam, widthParam, projectState]);

  // Handle Landing Form Submission
  const handleGenerateProject = async (data: {
    briefText: string;
    images: { url: string; filename: string; category?: any }[];
    dimensions?: { length?: number; width?: number; height?: number };
    propertyType?: string;
    propertyEra?: string;
    location?: string;
    budget?: number;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/visualiser/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.projectState) {
        setProjectState(json.projectState);
        if (json.projectState.spaces[0]) {
          setEditLength(String(json.projectState.spaces[0].lengthM.value));
          setEditWidth(String(json.projectState.spaces[0].widthM.value));
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Failed to generate project:', err);
      // Fallback local calculation
      const fallback = createInitialProjectState(data);
      setProjectState(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Natural Language Changes
  const handleApplyChange = async (changePrompt: string) => {
    if (!projectState) return;
    setIsApplyingChange(true);
    try {
      const res = await fetch('/api/visualiser/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectState, changePrompt }),
      });
      const json = await res.json();
      if (json.success && json.projectState) {
        setProjectState(json.projectState);
      } else {
        const local = applyProjectChange(projectState, changePrompt);
        setProjectState(local);
      }
    } catch (err) {
      const local = applyProjectChange(projectState, changePrompt);
      setProjectState(local);
    } finally {
      setIsApplyingChange(false);
    }
  };

  // Handle Restore Version
  const handleRestoreVersion = (versionNum: number) => {
    if (!projectState) return;
    const targetVer = projectState.versions.find((v) => v.versionNumber === versionNum);
    if (targetVer) {
      const restored = applyProjectChange(projectState, `Revert to Version ${versionNum}: ${targetVer.description}`);
      setProjectState(restored);
    }
  };

  // Handle Contextual AI Chat Question
  const handleSendMessage = async (question: string) => {
    if (!projectState) return;
    setIsSendingChat(true);

    const userMsg = {
      role: 'user' as const,
      message: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setProjectState((prev) => (prev ? { ...prev, chatHistory: [...prev.chatHistory, userMsg] } : prev));

    try {
      const res = await fetch('/api/visualiser/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectState, question }),
      });
      const json = await res.json();
      const assistantMsg = {
        role: 'assistant' as const,
        message: json.answer || 'Thank you for your question. Our estimating team will review this in detail during your consultation.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setProjectState((prev) => (prev ? { ...prev, chatHistory: [...prev.chatHistory, assistantMsg] } : prev));
    } catch (err) {
      const assistantMsg = {
        role: 'assistant' as const,
        message: 'Based on your scope, our structural project managers verify all subfloors and load-bearing spans during the measured survey.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setProjectState((prev) => (prev ? { ...prev, chatHistory: [...prev.chatHistory, assistantMsg] } : prev));
    } finally {
      setIsSendingChat(false);
    }
  };

  // Handle Toggle Scope Item
  const handleToggleScopeItem = (itemId: string) => {
    if (!projectState) return;
    setProjectState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        scopeOfWorks: prev.scopeOfWorks.map((s) => (s.id === itemId ? { ...s, included: !s.included } : s)),
      };
    });
  };

  // Handle Global Finish Tier Switch
  const handleSelectGlobalTier = (tier: FinishTier) => {
    handleApplyChange(`Switch all finishes to ${tier} tier`);
  };

  // Handle Spec Node Option Update
  const handleUpdateSpecOption = (nodeId: string, optionName: string, tier: FinishTier) => {
    if (!projectState) return;
    setProjectState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        specificationTree: prev.specificationTree.map((n) =>
          n.id === nodeId ? { ...n, selectedOption: optionName, finishTier: tier, status: 'selected' } : n
        ),
      };
    });
  };

  // Handle Set Spec Node "Not Decided"
  const handleSetNotDecided = (nodeId: string) => {
    if (!projectState) return;
    setProjectState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        specificationTree: prev.specificationTree.map((n) =>
          n.id === nodeId ? { ...n, status: n.status === 'not_decided' ? 'selected' : 'not_decided' } : n
        ),
      };
    });
  };

  // Handle Dimension Modal Save
  const handleSaveDimensions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectState) return;
    const l = parseFloat(editLength);
    const w = parseFloat(editWidth);
    if (l > 0 && w > 0) {
      handleApplyChange(`Update room dimensions to ${l}m length by ${w}m width`);
      setShowEditDimsModal(false);
    }
  };

  // Handle Assumption Confirmation
  const handleConfirmAssumption = (assumpId: string) => {
    if (!projectState) return;
    setProjectState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        assumptions: prev.assumptions.map((a) =>
          a.id === assumpId ? { ...a, status: 'confirmed_by_user' } : a
        ),
      };
    });
  };

  // Handle Question Answer
  const handleAnswerQuestion = (questionId: string, answer: string) => {
    if (!projectState) return;
    handleApplyChange(`Clarify detail for question ${questionId}: ${answer}`);
    setProjectState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        missingInformation: prev.missingInformation.map((m) =>
          m.id === questionId ? { ...m, resolved: true } : m
        ),
        completenessScore: Math.min(100, prev.completenessScore + 10),
      };
    });
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-20">
      {/* If No ProjectState yet, render Hero Input */}
      {!projectState ? (
        <VisualiserLandingHero
          onGenerate={handleGenerateProject}
          isLoading={isLoading}
          initialPrompt={promptParam}
          initialLength={lengthParam ? parseFloat(lengthParam) : undefined}
          initialWidth={widthParam ? parseFloat(widthParam) : undefined}
        />
      ) : (
        <div>
          {/* Top Sticky Progress & Action Header */}
          <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-xs">
            <Container>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                  {NAV_SECTIONS.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={() => setActiveNav(sec.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                        activeNav === sec.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sec.label}
                    </a>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    onClick={() => setShowBriefModal(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold bg-white text-slate-800 border-slate-300"
                    leftIcon={<FileCheck2 className="h-3.5 w-3.5" />}
                  >
                    View Brief
                  </Button>

                  <button
                    type="button"
                    onClick={() => setProjectState(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-semibold"
                    title="Start new project"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">New Brief</span>
                  </button>
                </div>
              </div>
            </Container>
          </div>

          {/* Main Results Body */}
          <Container className="pt-10 space-y-12">
            {/* 1. Project Brief */}
            <ProjectBriefCard
              state={projectState}
              onEditDimensions={() => setShowEditDimsModal(true)}
            />

            {/* 2. Visual Concept */}
            <VisualConceptCard
              state={projectState}
              onRefineVisual={handleApplyChange}
              isRefining={isApplyingChange}
            />

            {/* 3. Proposed Scope of Works */}
            <ProposedScopeSection
              scopeOfWorks={projectState.scopeOfWorks}
              onToggleItem={handleToggleScopeItem}
            />

            {/* 4. Finish Tiers */}
            <FinishTiersSelector
              finishTiers={projectState.finishTiers}
              activeTier={projectState.finishSelections.Cabinetry || 'enhanced'}
              onSelectGlobalTier={handleSelectGlobalTier}
              onVisualiseTier={(tier) => handleApplyChange(`Visualise ${tier} tier finish`)}
            />

            {/* 5. Construction Phases */}
            <ConstructionPhasesAccordion phases={projectState.phases} />

            {/* 6. Things to Consider (Balanced 4, 6, or 8 Grid) */}
            <ThingsToConsiderGrid items={projectState.thingsToConsider} />

            {/* 7. Specification Builder */}
            <SpecificationBuilder
              specificationTree={projectState.specificationTree}
              onUpdateSpecOption={handleUpdateSpecOption}
              onSetNotDecided={handleSetNotDecided}
            />

            {/* 8. Estimated Project Quantities */}
            <QuantitiesBreakdown
              quantities={projectState.calculatedQuantities}
              onEditDimensions={() => setShowEditDimsModal(true)}
            />

            {/* 9. Feasibility & Project Constraints */}
            <FeasibilityConstraintsCard feasibility={projectState.feasibility} />

            {/* 10. Assumptions & Missing Info */}
            <div className="space-y-6">
              <AssumptionsPanel
                assumptions={projectState.assumptions}
                onConfirmAssumption={handleConfirmAssumption}
                onChangeAssumption={() => setShowEditDimsModal(true)}
                onRemoveAssumption={(id) =>
                  setProjectState((prev) =>
                    prev ? { ...prev, assumptions: prev.assumptions.filter((a) => a.id !== id) } : prev
                  )
                }
              />

              <MissingInfoRank
                missingInfo={projectState.missingInformation}
                completenessScore={projectState.completenessScore}
                onAnswerQuestion={handleAnswerQuestion}
              />
            </div>

            {/* 11. Conversational Project Change Engine */}
            <ProjectChangeInput
              onApplyChange={handleApplyChange}
              versions={projectState.versions}
              onRestoreVersion={handleRestoreVersion}
              isApplyingChange={isApplyingChange}
            />

            {/* 12. Ask About Your Project Chat */}
            <AskAboutProjectChat
              chatHistory={projectState.chatHistory}
              onSendMessage={handleSendMessage}
              isSending={isSendingChat}
            />

            {/* 13. Project Complexity & Budget Alignment */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <ProjectComplexityBadge complexity={projectState.complexity} />
              </div>
              <div className="lg:col-span-8">
                <BudgetAlignmentCard budget={projectState.budgetAlignment} />
              </div>
            </div>

            {/* 14. Related Resources & Similar Projects */}
            <RelatedResourcesSection state={projectState} />

            {/* 15. Closing Conversion Flow */}
            <ConversionBanner
              state={projectState}
              onOpenBriefModal={() => setShowBriefModal(true)}
            />
          </Container>
        </div>
      )}

      {/* Builder Ready Brief Modal */}
      {projectState && (
        <BuilderReadyBriefModal
          state={projectState}
          isOpen={showBriefModal}
          onClose={() => setShowBriefModal(false)}
          onSendToSTContractors={() => {
            setShowBriefModal(false);
            window.location.href = `/contact?type=consultation&source=visualiser_brief&projectId=${projectState.projectId}`;
          }}
        />
      )}

      {/* Edit Dimensions Modal */}
      {showEditDimsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <Ruler className="h-4 w-4 text-[#FFAA4F]" />
                <span>Update Space Dimensions</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEditDimsModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveDimensions} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Room Length (metres):</label>
                <input
                  type="number"
                  step="0.1"
                  value={editLength}
                  onChange={(e) => setEditLength(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Room Width (metres):</label>
                <input
                  type="number"
                  step="0.1"
                  value={editWidth}
                  onChange={(e) => setEditWidth(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-slate-600 text-[11px] leading-relaxed">
                Updating dimensions will automatically recalculate flooring, plasterboard, paint, steel beam, and concrete quantities.
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full text-xs font-extrabold bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335]"
                >
                  Recalculate Plan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
