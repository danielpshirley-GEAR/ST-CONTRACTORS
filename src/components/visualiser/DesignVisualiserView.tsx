'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ProjectState,
  FinishTier,
  StructuralEngineerSpec,
  MultiPartProjectUnderstanding,
  ConsultationQuestion,
  AnsweredQuestion,
  ConsultationStage,
} from '@/types/visualiser-scope';
import {
  createInitialProjectState,
  applyProjectChange,
  restoreProjectVersion,
} from '@/lib/visualiser/project-state-engine';
import { analyzeProjectBrief } from '@/lib/visualiser/project-understanding-engine';
import { getNextBestQuestion } from '@/lib/visualiser/next-best-question-engine';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VisualiserLandingInput } from './VisualiserLandingInput';
import { ConsultationQuestionCard } from './ConsultationQuestionCard';
import { PlanConfirmationCard } from './PlanConfirmationCard';
import { ProjectHeroSection } from './ProjectHeroSection';
import { ProjectSnapshotGrid } from './ProjectSnapshotGrid';
import { OurInitialViewSection } from './OurInitialViewSection';
import { WhatCouldBeIncludedSection } from './WhatCouldBeIncludedSection';
import { HomeownerFinishTiers } from './HomeownerFinishTiers';
import { HomeownerBudgetCard } from './HomeownerBudgetCard';
import { WorkTimelineSection } from './WorkTimelineSection';
import { ThingsWorthKnowingSection } from './ThingsWorthKnowingSection';
import { WhatNeedsConfirmingSection } from './WhatNeedsConfirmingSection';
import { DecisionsToMakeSection } from './DecisionsToMakeSection';
import { ProjectConfiguratorSection } from './ProjectConfiguratorSection';
import { ProjectFactorsSection } from './ProjectFactorsSection';
import { TechnicalDetailView } from './TechnicalDetailView';
import { ProjectReviewSection } from './ProjectReviewSection';
import { ProjectReviewModal } from './ProjectReviewModal';
import { BuilderReadyBriefModal } from './BuilderReadyBriefModal';
import { StickyProjectSummaryPanel } from './StickyProjectSummaryPanel';
import { RelatedResourcesSection } from './RelatedResourcesSection';
import { ProjectChangeInput } from './ProjectChangeInput';
import { AskAboutProjectChat } from './AskAboutProjectChat';
import { generateProjectRoadmap } from '@/lib/visualiser/project-roadmap-engine';
import { ProjectGlanceBanner } from './ProjectGlanceBanner';
import { VisualRoadmapSection } from './VisualRoadmapSection';
import { BuyingPackagesSection } from './BuyingPackagesSection';
import { InteractiveCostSection } from './InteractiveCostSection';
import { ThingsWeConfirmSection } from './ThingsWeConfirmSection';
import { CustomerDecisionsSection } from './CustomerDecisionsSection';
import { RenovationVisualShowcase } from './RenovationVisualShowcase';
import { SimilarProjectShowcase } from './SimilarProjectShowcase';
import { ContractorJourneySection } from './ContractorJourneySection';
import { trackEvent } from '@/lib/analytics';
import {
  Sparkles,
  Undo2,
  FileCheck2,
  RotateCcw,
  Sliders,
  MessageSquare,
  X,
  AlertCircle,
  Wrench,
} from 'lucide-react';

const HOMEOWNER_NAV_SECTIONS = [
  { id: 'section-overview', label: '1. Overview' },
  { id: 'section-finishes', label: '2. Finishes' },
  { id: 'section-budget', label: '3. Cost & Timeline' },
  { id: 'section-checks', label: '4. Important Checks' },
  { id: 'section-review', label: '5. Next Steps' },
];

const TECHNICAL_NAV_SECTIONS = [
  { id: 'section-scope', label: '1. Scope Schedule' },
  { id: 'section-specification', label: '2. Specification' },
  { id: 'section-quantities', label: '3. Quantities' },
  { id: 'section-feasibility', label: '4. Feasibility' },
  { id: 'section-assumptions', label: '5. Assumptions' },
  { id: 'section-missing-info', label: '6. Clarifications' },
];

export function DesignVisualiserView() {
  const searchParams = useSearchParams();
  const promptParam = searchParams.get('prompt') || '';
  const lengthParam = searchParams.get('length');
  const widthParam = searchParams.get('width');

  // Consultation Lifecycle State
  const [consultationStage, setConsultationStage] = useState<ConsultationStage>('input');
  const [consultationBrief, setConsultationBrief] = useState<string>('');
  const [consultationImages, setConsultationImages] = useState<{ url: string; filename: string; category?: any }[]>([]);
  const [understanding, setUnderstanding] = useState<MultiPartProjectUnderstanding | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<ConsultationQuestion | null>(null);
  const [questionHistory, setQuestionHistory] = useState<ConsultationQuestion[]>([]);
  const [isProcessingConsultation, setIsProcessingConsultation] = useState<boolean>(false);

  // Full Project Report State
  const [projectState, setProjectState] = useState<ProjectState | null>(null);
  const [viewMode, setViewMode] = useState<'homeowner' | 'technical'>('homeowner');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApplyingChange, setIsApplyingChange] = useState<boolean>(false);
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<string>('section-overview');

  // Modals & Drawers
  const [showBriefModal, setShowBriefModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showModifyDrawer, setShowModifyDrawer] = useState<boolean>(false);
  const [showAskDrawer, setShowAskDrawer] = useState<boolean>(false);
  const [showEditDimsModal, setShowEditDimsModal] = useState<boolean>(false);
  const [showPropertyModal, setShowPropertyModal] = useState<boolean>(false);

  const [editLength, setEditLength] = useState<string>('5.0');
  const [editWidth, setEditWidth] = useState<string>('3.8');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('terraced');
  const [selectedPropertyEra, setSelectedPropertyEra] = useState<string>('victorian');

  // AI Project Guide: Roadmap & Interactive Options State
  const [roadmapChoices, setRoadmapChoices] = useState<Record<string, string>>({});
  const roadmap = useMemo(() => {
    if (!projectState) return null;
    return generateProjectRoadmap(projectState, roadmapChoices);
  }, [projectState, roadmapChoices]);

  const handleSelectRoadmapChoice = (workAreaId: string, choiceId: string) => {
    setRoadmapChoices((prev) => ({
      ...prev,
      [workAreaId]: choiceId,
      ...(workAreaId === 'gc-stage-3' ? { frontage: choiceId } : {}),
      ...(workAreaId === 'gc-stage-5' ? { heating: choiceId } : {}),
      ...(workAreaId === 'gc-stage-6' ? { flooring: choiceId } : {}),
      ...(workAreaId === 'door-stage-3' ? { door_type: choiceId } : {}),
      ...(workAreaId === 'bath-stage-4' ? { surfaces: choiceId } : {}),
      ...(workAreaId === 'ext-stage-3' ? { glazing: choiceId } : {}),
    }));
    trackEvent('roadmap_choice_selected', { workAreaId, choiceId });
  };

  const handleSelectCategoryOption = (categoryId: string, optionId: string) => {
    setRoadmapChoices((prev) => ({
      ...prev,
      [categoryId]: optionId,
    }));
    trackEvent('cost_option_changed', { categoryId, optionId });
  };

  const handleApplyPreferencePreset = (preset: 'cost' | 'value' | 'design' | 'comfort' | 'speed') => {
    if (preset === 'cost') {
      setRoadmapChoices((prev) => ({
        ...prev,
        frontage: 'keep_appearance',
        flooring: 'laminate',
        heating: 'electric_panel',
        door_type: 'standard_fire',
        surfaces: 'metro_tile',
        glazing: 'upvc_bifolds',
      }));
    } else if (preset === 'design') {
      setRoadmapChoices((prev) => ({
        ...prev,
        frontage: 'large_glazing',
        flooring: 'premium_timber',
        heating: 'underfloor',
        door_type: 'glazed_fire',
        surfaces: 'microcement',
        glazing: 'frameless_corner',
      }));
    } else if (preset === 'comfort') {
      setRoadmapChoices((prev) => ({
        ...prev,
        heating: 'underfloor',
        flooring: 'engineered_timber',
        frontage: 'wall_window',
      }));
    } else {
      setRoadmapChoices((prev) => ({
        ...prev,
        frontage: 'wall_window',
        flooring: 'engineered_timber',
        heating: 'wet_central',
        door_type: 'fd30s_timber',
        surfaces: 'large_porcelain',
        glazing: 'aluminium_sliders',
      }));
    }
    trackEvent('preference_preset_applied', { preset });
  };

  // Track page view for conversion measurement
  useEffect(() => {
    trackEvent('visualiser_view');
  }, []);

  // Auto-initialize if promptParam exists
  useEffect(() => {
    if (promptParam && consultationStage === 'input' && !projectState) {
      handleStartConsultation({
        briefText: promptParam,
        images: [],
      });
    }
  }, [promptParam, consultationStage, projectState]);

  // Stage 1 -> Stage 2: Start Consultation
  const handleStartConsultation = (data: {
    briefText: string;
    images: { url: string; filename: string; category?: any }[];
  }) => {
    trackEvent('consultation_started', {
      briefLength: data.briefText?.length || 0,
      hasImages: (data.images || []).length > 0,
    });

    setConsultationBrief(data.briefText);
    setConsultationImages(data.images);

    const initialUnder = analyzeProjectBrief({
      briefText: data.briefText,
      images: data.images,
    });
    setUnderstanding(initialUnder);
    setAnsweredQuestions([]);

    const firstQ = getNextBestQuestion(initialUnder, []);
    if (firstQ) {
      setCurrentQuestion(firstQ);
      setQuestionHistory([firstQ]);
      setConsultationStage('consultation');
    } else {
      setConsultationStage('confirmation');
    }
  };

  // Stage 2: Answer Question (In-place transition, no page reload)
  const handleAnswerConsultationQuestion = (ans: AnsweredQuestion) => {
    setIsProcessingConsultation(true);
    const newAnswered = [...answeredQuestions, ans];
    setAnsweredQuestions(newAnswered);

    trackEvent('consultation_question_answered', {
      questionId: ans.questionId,
      answerValue: ans.answerValue,
    });

    const updatedUnder = analyzeProjectBrief({
      briefText: consultationBrief,
      images: consultationImages,
      answeredQuestions: newAnswered,
    });
    setUnderstanding(updatedUnder);

    const nextQ = getNextBestQuestion(updatedUnder, newAnswered);
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setQuestionHistory((prev) => [...prev, nextQ]);
    } else {
      setConsultationStage('confirmation');
    }
    setIsProcessingConsultation(false);
  };

  // Back button handler: Step back one question, or from Q1 back to Stage 1 input
  const handleBackConsultationQuestion = () => {
    if (consultationStage === 'confirmation') {
      setConsultationStage('consultation');
      return;
    }

    if (consultationStage === 'consultation') {
      if (answeredQuestions.length === 0 || questionHistory.length <= 1) {
        setConsultationStage('input');
        return;
      }

      const newAnswered = answeredQuestions.slice(0, -1);
      setAnsweredQuestions(newAnswered);

      const newHistory = questionHistory.slice(0, -1);
      setQuestionHistory(newHistory);
      const prevQ = newHistory[newHistory.length - 1];
      if (prevQ) {
        setCurrentQuestion(prevQ);
      }

      const prevUnder = analyzeProjectBrief({
        briefText: consultationBrief,
        images: consultationImages,
        answeredQuestions: newAnswered,
      });
      setUnderstanding(prevUnder);
    }
  };

  // Reset button handler: Clean slate back to Stage 1
  const handleResetConsultation = () => {
    if (consultationBrief || answeredQuestions.length > 0) {
      if (!confirm('Start over? This will clear your current brief and answers.')) {
        return;
      }
    }
    setConsultationStage('input');
    setConsultationBrief('');
    setConsultationImages([]);
    setAnsweredQuestions([]);
    setQuestionHistory([]);
    setCurrentQuestion(null);
    setUnderstanding(null);
    setProjectState(null);
    setRoadmapChoices({});
  };

  // Stage 2: Skip Question
  const handleSkipConsultationQuestion = () => {
    if (!currentQuestion) return;
    handleAnswerConsultationQuestion({
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      answerValue: 'skipped',
      answerLabel: 'Decide later / skipped',
    });
  };

  // Stage 2: Natural Language Note at Any Time (Part 17)
  const handleAddNaturalLanguageNote = (note: string) => {
    const updatedBrief = `${consultationBrief} ${note}`;
    setConsultationBrief(updatedBrief);
    const updatedUnder = analyzeProjectBrief({
      briefText: updatedBrief,
      images: consultationImages,
      answeredQuestions,
    });
    setUnderstanding(updatedUnder);

    const nextQ = getNextBestQuestion(updatedUnder, answeredQuestions);
    if (nextQ) {
      setCurrentQuestion(nextQ);
    } else {
      setConsultationStage('confirmation');
    }
  };

  // Stage 3: Tweak on Confirmation Card (Part 21)
  const handleChangeSomething = (tweakText: string) => {
    const updatedBrief = `${consultationBrief} ${tweakText}`;
    setConsultationBrief(updatedBrief);
    const updatedUnder = analyzeProjectBrief({
      briefText: updatedBrief,
      images: consultationImages,
      answeredQuestions,
    });
    setUnderstanding(updatedUnder);
  };

  // Stage 3 -> Stage 4: Confirm and Build Plan (Part 22 Gate)
  const handleConfirmAndBuildPlan = async () => {
    setIsLoading(true);
    trackEvent('consultation_confirmed_build_plan');
    try {
      const state = createInitialProjectState({
        briefText: consultationBrief,
        images: consultationImages,
      });

      // Incorporate understanding into state
      if (understanding) {
        state.consultationUnderstanding = understanding;
      }
      state.consultationStage = 'report';

      setProjectState(state);
      setConsultationStage('report');
      if (state.spaces[0] && state.spaces[0].lengthM.value && state.spaces[0].widthM.value) {
        setEditLength(String(state.spaces[0].lengthM.value));
        setEditWidth(String(state.spaces[0].widthM.value));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger real AI visual generation asynchronously
      fetch('/api/visualiser/generate-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          sourceImageUrl: state.visualConcept?.sourceImage,
        }),
      })
        .then((r) => r.json())
        .then((genJson) => {
          if (genJson.success && genJson.data) {
            setProjectState((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                visualConcept: {
                  ...prev.visualConcept,
                  currentConceptImage: genJson.data.imageUrl,
                  generatedConceptImage: genJson.data.imageUrl,
                  generationProvider: genJson.data.provider,
                  generationId: genJson.data.generationId,
                  generationVersion: genJson.data.generationVersion,
                  conceptType: genJson.data.conceptType,
                  disclaimer: genJson.data.disclaimer,
                  visualHistory: [genJson.data.visualHistoryItem],
                  status: genJson.data.isFallback ? 'failed' : 'completed',
                },
              };
            });
          }
        })
        .catch((err) => console.warn('Async visual generation error:', err));
    } catch (err) {
      console.error('Failed to build project plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Natural Language Changes on Report
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
        const local = applyProjectChange(projectState, changePrompt, [
          {
            operationType: 'GENERAL_MODIFICATION',
            description: changePrompt,
          },
        ]);
        setProjectState(local);
      }
    } catch (err) {
      const local = applyProjectChange(projectState, changePrompt, [
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

  // Handle Version Restore
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

  // Handle Undo
  const handleUndo = () => {
    if (!projectState || projectState.versions.length <= 1) return;
    const currentVerIndex = projectState.versions.length - 1;
    const targetVer = projectState.versions[currentVerIndex - 1];
    if (targetVer) {
      handleRestoreVersion(targetVer.versionNumber);
    }
  };

  // Handle Structural Engineer Spec Save
  const handleSaveEngineerSpec = (spec: StructuralEngineerSpec) => {
    if (!projectState) return;
    const updated = JSON.parse(JSON.stringify(projectState)) as ProjectState;
    updated.structuralEngineerSpec = spec;
    handleApplyChange(
      `Verified structural engineer specification: ${spec.sectionDesignation} (${spec.massPerMetre}kg/m) across ${spec.memberLength}m opening`
    );
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
    trackEvent('finish_tier_selected', { tier });
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
  const handleAnswerTechnicalQuestion = (questionId: string, answer: string) => {
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
    if (confirm('Start a new project consultation? Your current draft will be cleared.')) {
      setProjectState(null);
      setConsultationStage('input');
      setConsultationBrief('');
      setConsultationImages([]);
      setUnderstanding(null);
      setAnsweredQuestions([]);
      setCurrentQuestion(null);
    }
  };

  const isUnknownProject = projectState?.projectTypes.includes('unknown');
  const navSections = viewMode === 'homeowner' ? HOMEOWNER_NAV_SECTIONS : TECHNICAL_NAV_SECTIONS;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 relative">
      {/* ========================================================= */}
      {/* FIXED VIDEO BACKGROUND (Long video 1)                     */}
      {/* ========================================================= */}
      {consultationStage !== 'report' && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center"
            aria-hidden="true"
          >
            <source src="/videos/Long video 1_1.mp4" type="video/mp4" />
            <source src="/videos/long-video-1-1.mp4" type="video/mp4" />
            <source src="/videos/Long video 1.mp4" type="video/mp4" />
          </video>
          {/* Homepage-Style Gradient & Overlay for Crisp, Cinematic Video */}
          <div className="absolute inset-0 bg-slate-950/25 pointer-events-none" aria-hidden="true" />
          <div
            className="absolute bottom-0 inset-x-0 h-64 sm:h-96 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-950/60 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 1: INITIAL NATURAL LANGUAGE BRIEF (Part 1)          */}
      {/* ========================================================= */}
      {consultationStage === 'input' && !projectState && (
        <div className="relative z-10">
          <VisualiserLandingInput
            onStart={handleStartConsultation}
            isLoading={isLoading}
            initialPrompt={promptParam}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 2: SHORT INTELLIGENT CONSULTATION (Parts 4-20)       */}
      {/* ========================================================= */}
      {consultationStage === 'consultation' && currentQuestion && !projectState && (
        <div className="relative z-10">
          <ConsultationQuestionCard
            question={currentQuestion}
            onAnswer={handleAnswerConsultationQuestion}
            onSkip={handleSkipConsultationQuestion}
            onBack={handleBackConsultationQuestion}
            onReset={handleResetConsultation}
            onAddNaturalLanguageNote={handleAddNaturalLanguageNote}
            isProcessing={isProcessingConsultation}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 3: "HERE'S WHAT YOU'RE PLANNING" (Parts 21 & 22)    */}
      {/* ========================================================= */}
      {consultationStage === 'confirmation' && understanding && !projectState && (
        <div className="relative z-10">
          <PlanConfirmationCard
            understanding={understanding}
            onConfirm={handleConfirmAndBuildPlan}
            onChangeSomething={handleChangeSomething}
            onBack={handleBackConsultationQuestion}
            onReset={handleResetConsultation}
            isBuildingPlan={isLoading}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* STAGE 4: PERSONALISED PROJECT BUYING REPORT (Parts 23-58) */}
      {/* ========================================================= */}
      {consultationStage === 'report' && projectState && (
        <div className="space-y-10 animate-in fade-in duration-300">
          {/* Top Sticky Tool Bar */}
          <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
            <Container className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="hidden sm:inline">ST Contractors</span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="text-[#FFAA4F]">Project Buying Plan</span>
                  </span>
                </div>

                {/* Center: Mode Switcher */}
                <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('homeowner');
                      trackEvent('report_view_mode_changed', { mode: 'homeowner' });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'homeowner'
                        ? 'bg-[#FFAA4F] text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Homeowner Plan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('technical');
                      trackEvent('report_view_mode_changed', { mode: 'technical' });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'technical'
                        ? 'bg-[#FFAA4F] text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Technical Detail</span>
                  </button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                  {projectState.versions.length > 1 && (
                    <Button
                      type="button"
                      onClick={handleUndo}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-slate-300 hover:text-white hidden sm:flex"
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
                    className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold"
                    leftIcon={<FileCheck2 className="h-3.5 w-3.5 text-[#FFAA4F]" />}
                  >
                    Builder Brief
                  </Button>
                  <Button
                    type="button"
                    onClick={handleResetToLanding}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-200 text-xs font-medium"
                    leftIcon={<RotateCcw className="h-3 w-3" />}
                  >
                    New
                  </Button>
                </div>
              </div>

              {/* Sub-Navigation Bar */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60 text-xs">
                {navSections.map((sec) => (
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

          {/* Unknown Project Clarification Banner */}
          {isUnknownProject && (
            <Container className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-6 rounded-3xl bg-amber-500/15 border-2 border-[#FFAA4F] text-amber-200 space-y-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#FFAA4F]" />
                  <h3 className="text-base font-bold text-white">
                    Let&apos;s Pinpoint Your Exact Project
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  We noticed your project intent is open-ended. To generate an accurate structural scope, bill of quantities, and architectural concept, tell us what you are planning:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    'Garage Conversion',
                    'Garage Access Door Installation',
                    'Bathroom Renovation',
                    'Rear Extension & Kitchen',
                    'Kitchen Renovation',
                    'Loft Conversion',
                    'Driveway & Paving',
                  ].map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleApplyChange(`I am planning a ${choice}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-[#FFAA4F]/40 hover:bg-[#FFAA4F] hover:text-slate-950 text-xs font-bold text-white transition-all cursor-pointer"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            </Container>
          )}

          {/* Main Content Area */}
          <Container className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {viewMode === 'homeowner' ? (
              /* ========================================================= */
              /* HOMEOWNER BUYING REPORT (Parts 24–58)                      */
              /* ========================================================= */
              <div className="space-y-16">
                {/* 1. YOUR PROJECT (Snapshot & Hero Definition) */}
                <div id="section-overview" className="space-y-8">
                  <ProjectHeroSection
                    projectState={projectState}
                    onOpenReviewModal={() => setShowReviewModal(true)}
                    onOpenBriefModal={() => setShowBriefModal(true)}
                    onOpenModifyDrawer={() => setShowModifyDrawer(true)}
                    onOpenAskDrawer={() => setShowAskDrawer(true)}
                  />

                  {/* Project Map at a Glance */}
                  {roadmap && (
                    <ProjectGlanceBanner
                      glance={roadmap.glance}
                      onScrollToRoadmap={() => {
                        const el = document.getElementById('section-roadmap');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    />
                  )}

                  {/* Project Snapshot Grid */}
                  <ProjectSnapshotGrid projectState={projectState} />

                  {/* Our Initial View (Contractor Perspective) */}
                  <OurInitialViewSection projectState={projectState} />
                </div>

                {/* 2. THE VISUAL PROJECT ROADMAP (Stage 4 - Heart of the Product) */}
                {roadmap && (
                  <div id="section-roadmap">
                    <VisualRoadmapSection
                      stages={roadmap.stages}
                      onSelectChoice={handleSelectRoadmapChoice}
                      onOpenReviewModal={() => setShowReviewModal(true)}
                    />
                  </div>
                )}

                {/* 3. YOUR OPTIONS & COSTS (Finish Levels & Packages - Stage 5) */}
                <div id="section-finishes" className="space-y-12">
                  {roadmap && (
                    <BuyingPackagesSection
                      packages={roadmap.packages}
                      onOpenReviewModal={() => setShowReviewModal(true)}
                    />
                  )}

                  <div id="section-included">
                    <WhatCouldBeIncludedSection
                      projectTypes={projectState.projectTypes}
                      briefText={projectState.originalBrief}
                      spaces={projectState.spaces}
                    />
                  </div>

                  <HomeownerFinishTiers
                    projectState={projectState}
                    onSelectTier={handleSelectGlobalTier}
                  />
                </div>

                {/* 4. INDICATIVE BUDGET & INTERACTIVE COST GUIDE (Stage 6) */}
                <div id="section-budget" className="space-y-12">
                  {roadmap && (
                    <InteractiveCostSection
                      budgetBreakdown={roadmap.budgetBreakdown}
                      totalEarlyBudget={roadmap.totalEarlyBudget}
                      costDrivers={roadmap.costDrivers}
                      customerChoices={roadmap.customerChoices}
                      onSelectOption={handleSelectCategoryOption}
                      onOpenReviewModal={() => setShowReviewModal(true)}
                    />
                  )}

                  <HomeownerBudgetCard
                    projectState={projectState}
                    onOpenReviewModal={() => setShowReviewModal(true)}
                    onOpenModifyDrawer={() => setShowModifyDrawer(true)}
                  />

                  <WorkTimelineSection projectState={projectState} />
                </div>

                {/* 5. CHECKS & DECISIONS (Stages 7 & 8) */}
                <div id="section-checks" className="space-y-12">
                  {roadmap && (
                    <ThingsWeConfirmSection checks={roadmap.checksToConfirm} />
                  )}

                  <WhatNeedsConfirmingSection projectState={projectState} />

                  {roadmap && (
                    <CustomerDecisionsSection
                      choices={roadmap.customerChoices}
                      onSelectOption={handleSelectCategoryOption}
                      onApplyPreferencePreset={handleApplyPreferencePreset}
                    />
                  )}

                  <DecisionsToMakeSection
                    projectTypes={projectState.projectTypes}
                    briefText={projectState.originalBrief}
                  />

                  <ProjectConfiguratorSection
                    projectTypes={projectState.projectTypes}
                    briefText={projectState.originalBrief}
                    onConfigChange={(s) => handleApplyChange(s)}
                  />

                  <ThingsWorthKnowingSection projectState={projectState} />

                  <ProjectFactorsSection projectState={projectState} />
                </div>

                {/* 6. VISUAL RESULT & SIMILAR PROJECTS (Stage 9 & Real Case Studies) */}
                <div className="space-y-12">
                  <RenovationVisualShowcase
                    conceptImageUrl={projectState.visualConcept?.currentConceptImage}
                    sourceImageUrl={projectState.uploadedAssets?.[0]?.url}
                    projectTitle={projectState.spaces?.[0]?.name || 'Your Renovation'}
                    onSelectDirection={(dir) => handleApplyChange(`Adjust style direction to ${dir}`)}
                  />

                  {roadmap?.relevantCaseStudy && (
                    <SimilarProjectShowcase
                      caseStudy={roadmap.relevantCaseStudy}
                      onOpenReviewModal={() => setShowReviewModal(true)}
                    />
                  )}

                  {/* Stage 10: How ST Contractors Delivers Your Build */}
                  <ContractorJourneySection onOpenReviewModal={() => setShowReviewModal(true)} />
                </div>

                {/* 7. NEXT STEP & LEAD CONVERSION (Stage 10 & Conversion) */}
                <div id="section-review">
                  <ProjectReviewSection
                    state={projectState}
                    onOpenReviewModal={() => setShowReviewModal(true)}
                    onOpenBriefModal={() => setShowBriefModal(true)}
                  />
                </div>

                {/* 8. Contextual Related Resources */}
                <RelatedResourcesSection projectTypes={projectState.projectTypes} />
              </div>
            ) : (
              /* ========================================================= */
              /* TECHNICAL DETAIL VIEW (BoQ, Spec Tree, Quantities, Feas) */
              /* ========================================================= */
              <TechnicalDetailView
                projectState={projectState}
                onToggleScopeItem={handleToggleScopeItem}
                onUpdateSpecOption={handleUpdateSpecOption}
                onSetNotDecided={handleSetNotDecided}
                onEditDimensions={() => setShowEditDimsModal(true)}
                onSaveEngineerSpec={handleSaveEngineerSpec}
                onConfirmAssumption={handleConfirmAssumption}
                onChangeAssumption={handleChangeAssumption}
                onRemoveAssumption={handleRemoveAssumption}
                onAnswerQuestion={handleAnswerTechnicalQuestion}
                onOpenBriefModal={() => setShowBriefModal(true)}
              />
            )}
          </Container>

          {/* Sticky Project Summary Panel (Part 51) */}
          <StickyProjectSummaryPanel
            projectState={projectState}
            onOpenReviewModal={() => setShowReviewModal(true)}
            onOpenModifyDrawer={() => setShowModifyDrawer(true)}
            onOpenAskDrawer={() => setShowAskDrawer(true)}
          />
        </div>
      )}

      {/* Modify Project Slide-Over Drawer */}
      {showModifyDrawer && projectState && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full p-6 overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold">
                <Sliders className="w-5 h-5 text-[#FFAA4F]" />
                <h3 className="text-base font-bold">Modify Project Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModifyDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ProjectChangeInput
              onApplyChange={(p) => {
                handleApplyChange(p);
                setShowModifyDrawer(false);
              }}
              isLoading={isApplyingChange}
              versions={projectState.versions}
              onRestoreVersion={handleRestoreVersion}
            />
          </div>
        </div>
      )}

      {/* Ask About Project Slide-Over Drawer */}
      {showAskDrawer && projectState && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full p-6 overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold">
                <MessageSquare className="w-5 h-5 text-[#FFAA4F]" />
                <h3 className="text-base font-bold">Ask ST Contractors</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAskDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <AskAboutProjectChat
              chatHistory={projectState.chatHistory}
              onSendMessage={handleSendMessage}
              isLoading={isSendingChat}
            />
          </div>
        </div>
      )}

      {/* Edit Dimensions Modal */}
      {showEditDimsModal && projectState && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Physical Dimensions</h3>
              <button
                type="button"
                onClick={() => setShowEditDimsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveDimensions} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Length (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editLength}
                  onChange={(e) => setEditLength(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFAA4F]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Width (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editWidth}
                  onChange={(e) => setEditWidth(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFAA4F]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditDimsModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Dimensions
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Property Context Modal */}
      {showPropertyModal && projectState && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Property Context</h3>
              <button
                type="button"
                onClick={() => setShowPropertyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSavePropertyInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Building Era
                </label>
                <select
                  value={selectedPropertyEra}
                  onChange={(e) => setSelectedPropertyEra(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFAA4F]"
                >
                  <option value="victorian">Victorian (1837–1901)</option>
                  <option value="edwardian">Edwardian (1901–1914)</option>
                  <option value="georgian">Georgian</option>
                  <option value="1930s">1930s Semi/Terrace</option>
                  <option value="post_war">Post-War (1945–1980)</option>
                  <option value="modern">Modern (1980+)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Property Type
                </label>
                <select
                  value={selectedPropertyType}
                  onChange={(e) => setSelectedPropertyType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFAA4F]"
                >
                  <option value="terraced">Terraced House</option>
                  <option value="semi_detached">Semi-Detached House</option>
                  <option value="detached">Detached House</option>
                  <option value="flat">Conversion Flat</option>
                  <option value="maisonette">Maisonette</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPropertyModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Context
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Review Modal */}
      {projectState && (
        <ProjectReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          state={projectState}
        />
      )}

      {/* Builder Brief Modal */}
      {projectState && (
        <BuilderReadyBriefModal
          isOpen={showBriefModal}
          onClose={() => setShowBriefModal(false)}
          state={projectState}
        />
      )}
    </div>
  );
}
