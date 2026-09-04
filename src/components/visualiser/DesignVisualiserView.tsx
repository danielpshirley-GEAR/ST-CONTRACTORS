'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProjectState, FinishTier } from '@/types/visualiser-scope';
import { createInitialProjectState, applyProjectChange, restoreProjectVersion } from '@/lib/visualiser/project-state-engine';
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
  Undo2,
  Redo2,
  FileCheck2,
  Share2,
  Sliders,
  Ruler,
  HelpCircle,
  X,
  Home,
  AlertCircle,
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
  const [showPropertyModal, setShowPropertyModal] = useState<boolean>(false);
  const [editLength, setEditLength] = useState<string>('5.0');
  const [editWidth, setEditWidth] = useState<string>('3.8');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('terraced');
  const [selectedPropertyEra, setSelectedPropertyEra] = useState<string>('victorian');

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
      } else {
        const fallback = createInitialProjectState(data);
        setProjectState(fallback);
      }
    } catch (err) {
      console.error('Failed to generate project:', err);
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
        const local = applyProjectChange(projectState, [
          {
            operationType: 'GENERAL_MODIFICATION',
            description: changePrompt,
          },
        ]);
        setProjectState(local);
      }
    } catch (err) {
      const local = applyProjectChange(projectState, [
        {
          operationType: 'GENERAL_MODIFICATION',
          description: changePrompt,
        },
      ]);
      setProjectState(local);
    } finally {
      setIsApplyingChange(false);
    }
  };

  // Handle True Immutable Version Restore (Item 17)
  const handleRestoreVersion = async (versionNum: number) => {
    if (!projectState) return;
    setIsApplyingChange(true);
    try {
      const res = await fetch('/api/visualiser/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectState, restoreVersionNumber: versionNum }),
      });
      const json = await res.json();
      if (json.success && json.projectState) {
        setProjectState(json.projectState);
      } else {
        const restored = restoreProjectVersion(projectState, versionNum);
        setProjectState(restored);
      }
    } catch (err) {
      const restored = restoreProjectVersion(projectState, versionNum);
      setProjectState(restored);
    } finally {
      setIsApplyingChange(false);
    }
  };

  // Handle Undo (Previous Version)
  const handleUndo = () => {
    if (!projectState || projectState.versions.length <= 1) return;
    const currentVerIndex = projectState.versions.length - 1;
    const targetVer = projectState.versions[currentVerIndex - 1];
    if (targetVer) {
      handleRestoreVersion(targetVer.versionNumber);
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

  // Handle Property Info Modal Save
  const handleSavePropertyInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectState) return;
    handleApplyChange(`Property is a ${selectedPropertyEra} ${selectedPropertyType}`);
    setShowPropertyModal(false);
  };

  // Handle Answer Missing Info Question
  const handleAnswerQuestion = (questionId: string, answer: string) => {
    handleApplyChange(`Clarification on ${questionId}: ${answer}`);
    if (projectState) {
      setProjectState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          missingInformation: prev.missingInformation.map((m) =>
            m.id === questionId ? { ...m, resolved: true } : m
          ),
          completenessScore: Math.min(100, prev.completenessScore + 8),
        };
      });
    }
  };

  // Handle Confirm Assumption
  const handleConfirmAssumption = (id: string) => {
    if (!projectState) return;
    setProjectState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        assumptions: prev.assumptions.map((a) =>
          a.id === id ? { ...a, status: 'confirmed_by_user' } : a
        ),
        completenessScore: Math.min(100, prev.completenessScore + 5),
      };
    });
  };

  // Handle Change Assumption
  const handleChangeAssumption = (id: string) => {
    const assump = projectState?.assumptions.find((a) => a.id === id);
    if (assump) {
      const newVal = prompt(`Enter new value for ${assump.label}:`, String(assump.value));
      if (newVal) {
        handleApplyChange(`Update assumption for ${assump.label} to ${newVal}`);
      }
    }
  };

  // Handle Remove Assumption
  const handleRemoveAssumption = (id: string) => {
    if (!projectState) return;
    setProjectState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        assumptions: prev.assumptions.filter((a) => a.id !== id),
      };
    });
  };

  // Reset to Landing State
  const handleResetToLanding = () => {
    if (confirm('Start a new project design? Your current draft will be cleared.')) {
      setProjectState(null);
    }
  };

  const isUnknownProject = projectState?.projectTypes.includes('unknown');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24">
      {/* 1. Landing Hero (When no active project session exists) */}
      {!projectState && (
        <VisualiserLandingHero
          onGenerate={handleGenerateProject}
          isLoading={isLoading}
        />
      )}

      {/* 2. Full Active Visualiser Architecture View */}
      {projectState && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Sticky Tool Bar */}
          <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md">
            <Container>
              <div className="flex items-center justify-between h-16 gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="hidden sm:inline">ST Contractors</span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="text-[#FFAA4F]">AI Project Design Studio</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {projectState.versions.length > 1 && (
                    <Button
                      type="button"
                      onClick={handleUndo}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-slate-300 hover:text-white"
                      leftIcon={<Undo2 className="h-3.5 w-3.5" />}
                    >
                      Undo
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => setShowBriefModal(true)}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700 text-xs font-bold"
                    leftIcon={<FileCheck2 className="h-3.5 w-3.5 text-[#FFAA4F]" />}
                  >
                    View Builder Brief
                  </Button>
                  <Button
                    type="button"
                    onClick={handleResetToLanding}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-200 text-xs font-medium"
                    leftIcon={<RotateCcw className="h-3 w-3" />}
                  >
                    New Design
                  </Button>
                </div>
              </div>

              {/* Sub-Navigation Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60 text-xs">
                {NAV_SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveNav(sec.id)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      activeNav === sec.id
                        ? 'bg-[#FFAA4F] text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {sec.label}
                  </a>
                ))}
              </div>
            </Container>
          </header>

          {/* Unknown Project Clarification Banner (Item 1) */}
          {isUnknownProject && (
            <Container>
              <div className="p-6 rounded-3xl bg-amber-500/15 border-2 border-[#FFAA4F] text-amber-200 space-y-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#FFAA4F]" />
                  <h3 className="text-base font-bold text-white font-heading">
                    Let&apos;s Pinpoint Your Exact Project
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  We noticed your project intent is open-ended. To generate an accurate structural scope, bill of quantities, and architectural concept, tell us what you are planning:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    'Rear Extension & Kitchen',
                    'Kitchen Renovation',
                    'Bathroom Renovation',
                    'Loft Conversion',
                    'Interior Decorating / Bedroom',
                    'Bespoke Fitted Wardrobes',
                    'Driveway & Paving',
                  ].map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleApplyChange(`I am planning a ${choice}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-[#FFAA4F]/40 hover:bg-[#FFAA4F] hover:text-slate-950 text-xs font-bold text-white transition-all"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            </Container>
          )}

          {/* Main 2-Column Content Layout */}
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (Core Modules 1 - 10) */}
              <div className="lg:col-span-8 space-y-8">
                {/* 1. Structured Brief */}
                <ProjectBriefCard
                  state={projectState}
                  onEditDimensions={() => setShowEditDimsModal(true)}
                  onAddPropertyInfo={() => setShowPropertyModal(true)}
                />

                {/* 2. Visual Concept Card */}
                <VisualConceptCard
                  state={projectState}
                  onRefineVisual={handleApplyChange}
                  isRefining={isApplyingChange}
                />

                {/* 3. Proposed Scope of Works */}
                <ProposedScopeSection
                  items={projectState.scopeOfWorks}
                  onToggleItem={handleToggleScopeItem}
                />

                {/* 4. Finish Tiers Selector */}
                <FinishTiersSelector
                  tiers={projectState.finishTiers}
                  activeTier={projectState.finishSelections.Cabinetry || 'enhanced'}
                  onSelectTier={handleSelectGlobalTier}
                />

                {/* 5. Construction Phases */}
                <ConstructionPhasesAccordion phases={projectState.phases} />

                {/* 6. Things to Consider Grid */}
                <ThingsToConsiderGrid items={projectState.thingsToConsider} />

                {/* 7. Specification Builder */}
                <SpecificationBuilder
                  nodes={projectState.specificationTree}
                  onUpdateOption={handleUpdateSpecOption}
                  onSetNotDecided={handleSetNotDecided}
                />

                {/* 8. Deterministic Quantities Breakdown */}
                <QuantitiesBreakdown
                  quantities={projectState.calculatedQuantities}
                  onEditDimensions={() => setShowEditDimsModal(true)}
                />

                {/* 9. Feasibility & Constraints Analysis */}
                <FeasibilityConstraintsCard items={projectState.feasibility} />

                {/* 10. System Assumptions Panel */}
                <AssumptionsPanel
                  assumptions={projectState.assumptions}
                  onConfirmAssumption={handleConfirmAssumption}
                  onChangeAssumption={handleChangeAssumption}
                  onRemoveAssumption={handleRemoveAssumption}
                />

                {/* Progressive Refinement (Missing Info) */}
                <MissingInfoRank
                  missingInfo={projectState.missingInformation}
                  completenessScore={projectState.completenessScore}
                  onAnswerQuestion={handleAnswerQuestion}
                />
              </div>

              {/* Right Column (Sidebar: Modifiers, Chat, Budget, Complexity) */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                {/* Conversational Modifier Engine & Version Stack */}
                <ProjectChangeInput
                  onApplyChange={handleApplyChange}
                  isLoading={isApplyingChange}
                  versions={projectState.versions}
                  onRestoreVersion={handleRestoreVersion}
                />

                {/* Context-Grounded AI Project Assistant */}
                <AskAboutProjectChat
                  chatHistory={projectState.chatHistory}
                  onSendMessage={handleSendMessage}
                  isLoading={isSendingChat}
                />

                {/* Budget Alignment & Complexity Card */}
                <div className="space-y-4">
                  <BudgetAlignmentCard budget={projectState.budgetAlignment} />
                  <ProjectComplexityBadge complexity={projectState.complexity} />
                </div>
              </div>
            </div>
          </Container>

          {/* 3. Conversion Banner */}
          <Container>
            <ConversionBanner
              state={projectState}
              onOpenBriefModal={() => setShowBriefModal(true)}
            />
          </Container>

          {/* 4. Contextual Commercial Links */}
          <Container>
            <RelatedResourcesSection projectTypes={projectState.projectTypes} />
          </Container>
        </div>
      )}

      {/* Builder-Ready Brief Modal */}
      {projectState && (
        <BuilderReadyBriefModal
          isOpen={showBriefModal}
          onClose={() => setShowBriefModal(false)}
          state={projectState}
        />
      )}

      {/* Edit Dimensions Modal */}
      {showEditDimsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold font-heading flex items-center gap-2">
                <Ruler className="h-4 w-4 text-[#FFAA4F]" />
                <span>Adjust Room Dimensions</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEditDimsModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDimensions} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label htmlFor="dim-length" className="font-bold text-slate-700 block">
                  Length / Depth (Metres):
                </label>
                <input
                  id="dim-length"
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="30.0"
                  value={editLength}
                  onChange={(e) => setEditLength(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="dim-width" className="font-bold text-slate-700 block">
                  Width (Metres):
                </label>
                <input
                  id="dim-width"
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="30.0"
                  value={editWidth}
                  onChange={(e) => setEditWidth(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  type="button"
                  onClick={() => setShowEditDimsModal(false)}
                  variant="outline"
                  size="sm"
                  className="w-1/2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="w-1/2 bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold"
                >
                  Update Quantities
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Property Info Modal */}
      {showPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold font-heading flex items-center gap-2">
                <Home className="h-4 w-4 text-[#FFAA4F]" />
                <span>Property Details</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPropertyModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSavePropertyInfo} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Property Type:</label>
                <select
                  value={selectedPropertyType}
                  onChange={(e) => setSelectedPropertyType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                >
                  <option value="terraced">Terraced House</option>
                  <option value="semi_detached">Semi-Detached House</option>
                  <option value="detached">Detached House</option>
                  <option value="flat">Flat / Apartment</option>
                  <option value="maisonette">Maisonette</option>
                  <option value="bungalow">Bungalow</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Architectural Era:</label>
                <select
                  value={selectedPropertyEra}
                  onChange={(e) => setSelectedPropertyEra(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                >
                  <option value="victorian">Victorian (1837–1901)</option>
                  <option value="edwardian">Edwardian (1901–1914)</option>
                  <option value="georgian">Georgian (1714–1837)</option>
                  <option value="1930s">1930s Suburbia</option>
                  <option value="post_war">Post-War (1945–1980)</option>
                  <option value="modern">Modern Contemporary (Post-1980)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  type="button"
                  onClick={() => setShowPropertyModal(false)}
                  variant="outline"
                  size="sm"
                  className="w-1/2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="w-1/2 bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold"
                >
                  Save Property
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
