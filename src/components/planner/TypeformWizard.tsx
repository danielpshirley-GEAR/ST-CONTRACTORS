'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ComprehensivePlannerInput,
  FinishLevel,
  ProjectScopeItem,
  RecommendedWorkItem,
} from '@/lib/ai/types';
import {
  ProjectType,
  PROJECT_TYPE_OPTIONS,
  getQuestionsForProject,
  QuizQuestion,
} from '@/lib/planner/quiz-engine';
import {
  generateRoomByRoomScope,
  generateContextualRecommendations,
} from '@/lib/ai/planner';
import { QuoteConfigurator } from './QuoteConfigurator';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  MapPin,
  Ruler,
} from 'lucide-react';
import { clsx } from 'clsx';
import { getActiveProjectProfile, updateActiveProjectProfile } from '@/lib/planner/project-sync';
import { trackEvent } from '@/lib/analytics';

const PROPERTY_STYLES = [
  { id: 'terraced', label: 'Terraced House' },
  { id: 'semi-detached', label: 'Semi-Detached House' },
  { id: 'detached', label: 'Detached House' },
  { id: 'bungalow', label: 'Bungalow' },
  { id: 'flat', label: 'Apartment / Flat' },
  { id: 'other', label: 'Period / Other Property' },
];

const PROPERTY_AGES = [
  { id: 'pre_1900', label: 'Victorian / Georgian (Pre-1900)' },
  { id: '1900_1930', label: 'Edwardian (1900–1930)' },
  { id: '1930_1960', label: '1930s – 1950s Semi' },
  { id: '1960_1990', label: '1960s – 1980s' },
  { id: '1990_plus', label: 'Modern Build (1990s+)' },
  { id: 'unknown', label: "I'm not sure" },
];

const TIMELINE_OPTIONS = [
  { id: 'asap', label: 'As soon as possible' },
  { id: '1_3_months', label: 'Within 1–3 months' },
  { id: '3_6_months', label: 'Within 3–6 months' },
  { id: '6_12_months', label: 'Within 6–12 months' },
  { id: 'not_sure', label: "I'm not sure yet" },
];

const STAGE_OPTIONS = [
  { id: 'exploring_ideas', label: 'Exploring ideas & initial budgeting' },
  { id: 'starting_to_plan', label: 'Ready to begin architectural design' },
  { id: 'drawings_completed', label: 'Architectural drawings already completed' },
  { id: 'planning_approved', label: 'Planning permission already approved' },
  { id: 'ready_to_appoint', label: 'Ready to appoint our construction team' },
];

export const TypeformWizard: React.FC = () => {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service');

  // Active Project Type (Initial step)
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType | null>(null);

  // Dynamic Question Index (0-indexed within active project questions)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // Answers State
  const [answers, setAnswers] = useState<Record<string, any>>({
    postcode: 'W4 1PR',
    property_style: 'terraced',
    property_age: 'pre_1900',
    timeline: '1_3_months',
    project_stage: 'starting_to_plan',
  });

  // Natural Language Description in Step 0
  const [naturalText, setNaturalText] = useState('');
  const [isInterpretingText, setIsInterpretingText] = useState(false);

  // Exact Dimension Inputs (if exact chosen in dimension question)
  const [customLength, setCustomLength] = useState<number>(5);
  const [customWidth, setCustomWidth] = useState<number>(4);

  // Final Generated State
  const [scopeItems, setScopeItems] = useState<ProjectScopeItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedWorkItem[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [transferredAssistantProject, setTransferredAssistantProject] = useState<any | null>(null);

  // Check for transferred AI Assistant data from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('ai_assistant_transfer');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.projectType) {
          setTransferredAssistantProject(parsed);
          setSelectedProjectType(parsed.projectType);
          if (parsed.initialAnswers) {
            setAnswers((prev) => ({
              ...prev,
              ...parsed.initialAnswers,
              custom_notes: parsed.originalDescription,
              detected_goals: parsed.initialAnswers.goals || ['Open-plan layout', 'More space', 'Modern turnkey build'],
            }));
          }
          if (parsed.initialAnswers?.extension_length) {
            setCustomLength(Number(parsed.initialAnswers.extension_length));
          }
          if (parsed.initialAnswers?.extension_width) {
            setCustomWidth(Number(parsed.initialAnswers.extension_width));
          }
          if (parsed.originalDescription) {
            setNaturalText(parsed.originalDescription);
          }
        }
      } else {
        // Inspect active unified project profile from calculators/previous visits
        const profile = getActiveProjectProfile();
        if (profile) {
          if (profile.location?.postcode) {
            setAnswers((prev) => ({
              ...prev,
              postcode: profile.location.postcode || prev.postcode,
              property_style: profile.propertyType || prev.property_style,
              property_age: profile.propertyEra || prev.property_age,
            }));
          }
          if (profile.rooms && profile.rooms.length > 0) {
            const firstRoom = profile.rooms[0];
            if (firstRoom.lengthMeters) setCustomLength(firstRoom.lengthMeters);
            if (firstRoom.widthMeters) setCustomWidth(firstRoom.widthMeters);
          }
          if (profile.projectTypes && profile.projectTypes.length > 0 && !selectedProjectType) {
            const pt = profile.projectTypes[0];
            const valid = PROJECT_TYPE_OPTIONS.find((p) => p.id === pt);
            if (valid) setSelectedProjectType(pt as any);
          }
        }
      }
    } catch (err) {
      console.warn('Error reading project profile:', err);
    }
  }, []);

  // Prepopulate from service query param if present
  useEffect(() => {
    if (initialService) {
      const mapping: Record<string, ProjectType> = {
        bathroom: 'bathroom',
        'bathroom-renovations': 'bathroom',
        kitchen: 'kitchen',
        'kitchen-renovations': 'kitchen',
        extension: 'extension',
        extensions: 'extension',
        loft: 'loft',
        'loft-conversions': 'loft',
        garden: 'garden',
        'garden-rooms': 'garden',
        landscaping: 'garden',
        driveway: 'driveway',
        driveways: 'driveway',
        renovations: 'full-renovation',
        'full-renovation': 'full-renovation',
      };
      if (mapping[initialService]) {
        setSelectedProjectType(mapping[initialService]);
      }
    }
  }, [initialService]);

  // Dynamically compute the active questions based on selected project type and current answers
  const projectQuestions = useMemo<QuizQuestion[]>(() => {
    if (!selectedProjectType) return [];
    return getQuestionsForProject(selectedProjectType, answers);
  }, [selectedProjectType, answers]);

  const currentQuestion: QuizQuestion | undefined = projectQuestions[activeQuestionIndex];

  // AI Interpretation Handler
  const handleInterpretDescription = async () => {
    if (!naturalText.trim()) return;
    setIsInterpretingText(true);
    try {
      const res = await fetch('/api/planner/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: naturalText }),
      });
      const data = await res.json();
      if (res.ok && data.suggestedProjectType) {
        setSelectedProjectType(data.suggestedProjectType);
        setAnswers((prev) => ({
          ...prev,
          custom_notes: naturalText,
          detected_goals: data.detectedGoals,
        }));
        setActiveQuestionIndex(0);
      }
    } catch (err) {
      console.error('Error interpreting description:', err);
    } finally {
      setIsInterpretingText(false);
    }
  };

  // Selection handlers
  const handleSingleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleMultiSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const list = (prev[questionId] as string[]) || [];
      const isSelected = list.includes(optionId);
      const updated = isSelected
        ? list.filter((id) => id !== optionId)
        : [...list, optionId];

      const subMapKey = `${questionId}_suboptions_map`;
      const currentMap = { ...((prev[subMapKey] as Record<string, string>) || {}) };

      // If unchecking parent card, clear its chosen sub-option
      if (isSelected) {
        delete currentMap[optionId];
      }

      const flatSubs = Object.values(currentMap);
      const subKey = `${questionId}_suboptions`;

      return {
        ...prev,
        [questionId]: updated,
        [subMapKey]: currentMap,
        [subKey]: flatSubs,
      };
    });
  };

  const handleSubOptionSelect = (questionId: string, parentOptionId: string, subOptionId: string) => {
    setAnswers((prev) => {
      const parentList = (prev[questionId] as string[]) || [];
      const subMapKey = `${questionId}_suboptions_map`;
      const currentMap = { ...((prev[subMapKey] as Record<string, string>) || {}) };

      const isCurrentlySelected = currentMap[parentOptionId] === subOptionId;

      if (isCurrentlySelected) {
        // Deselect if already active
        delete currentMap[parentOptionId];
      } else {
        // Enforce 1 choice per category (single select)
        currentMap[parentOptionId] = subOptionId;
      }

      const flatSubs = Object.values(currentMap);
      const subKey = `${questionId}_suboptions`;

      // Automatically select parent if choosing a subOption
      let updatedParents = parentList;
      if (!isCurrentlySelected && !parentList.includes(parentOptionId)) {
        updatedParents = [...parentList, parentOptionId];
      }

      return {
        ...prev,
        [questionId]: updatedParents,
        [subMapKey]: currentMap,
        [subKey]: flatSubs,
      };
    });
  };

  // Finish quiz and generate scope
  const handleCompleteQuiz = () => {
    if (!selectedProjectType) return;

    let finishLevel: FinishLevel = 'standard';
    const finishKey = `${selectedProjectType}_finish`;
    if (answers[finishKey]) {
      const f = answers[finishKey];
      if (f === 'luxury') finishLevel = 'luxury';
      else if (f === 'premium') finishLevel = 'premium';
      else if (f === 'budget' || f === 'simple') finishLevel = 'budget';
    }

    const inputData: ComprehensivePlannerInput = {
      projectType: selectedProjectType,
      customerGoals: answers.detected_goals || ['High quality renovation', 'Modern design'],
      customDescription: answers[`${selectedProjectType}_notes`] || answers.custom_notes || '',
      propertyType: answers.property_style || 'terraced',
      propertyAge: answers.property_age || 'pre_1900',
      postcode: answers.postcode || 'W4 1PR',
      selectedAreas: [
        {
          id: `area-${selectedProjectType}`,
          name: PROJECT_TYPE_OPTIONS.find((p) => p.id === selectedProjectType)?.label || 'Project Area',
          sizeCategory: 'medium',
          lengthMeters: customLength,
          widthMeters: customWidth,
        },
      ],
      finishLevel,
      projectStatus: answers.project_stage || 'starting_to_plan',
      timeline: answers.timeline || '1_3_months',
      budgetRange: '50k_100k',
    };

    const generatedScope = generateRoomByRoomScope(inputData, answers);
    const generatedRecs = generateContextualRecommendations(inputData);

    setScopeItems(generatedScope);
    setRecommendations(generatedRecs);
    setIsQuizComplete(true);

    try {
      updateActiveProjectProfile({
        projectTypes: [selectedProjectType as any],
        propertyType: answers.property_style || 'terraced',
        propertyEra: answers.property_age || 'victorian',
        location: { postcode: answers.postcode || 'W4 1PR' },
        customerDescription: answers[`${selectedProjectType}_notes`] || answers.custom_notes || '',
        customerGoals: answers.detected_goals || ['High quality renovation', 'Modern design'],
        timelineTarget: answers.timeline === 'asap' ? 'immediate' : '1_to_3_months',
        specificationTier: finishLevel === 'luxury' ? 'premium' : finishLevel === 'premium' ? 'recommended' : 'essential',
      });
      trackEvent('project_created', {
        projectType: selectedProjectType,
        propertyType: answers.property_style,
        postcode: answers.postcode,
      });
    } catch (e) {
      console.warn('Could not sync profile on quiz completion:', e);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (activeQuestionIndex < projectQuestions.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    } else {
      handleCompleteQuiz();
    }
  };

  const handleBack = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
    } else {
      setSelectedProjectType(null);
    }
  };

  // Validation
  const isCurrentStepValid = (): boolean => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'single_choice':
        return Boolean(answer);
      case 'multiple_choice':
        return Array.isArray(answer) && answer.length > 0;
      case 'dimension_input':
        return Boolean(answer);
      case 'free_text':
        return true;
      case 'property_and_postcode':
        return Boolean(answers.postcode && answers.postcode.trim().length >= 3);
      case 'timeline_and_stage':
        return Boolean(answers.timeline && answers.project_stage);
      default:
        return true;
    }
  };

  // =========================================================================
  // FINAL SCREEN: ESTIMATE & QUOTE CONFIGURATOR
  // =========================================================================
  if (isQuizComplete && selectedProjectType) {
    let finishLevel: FinishLevel = 'standard';
    const finishKey = `${selectedProjectType}_finish`;
    if (answers[finishKey]) {
      const f = answers[finishKey];
      if (f === 'luxury') finishLevel = 'luxury';
      else if (f === 'premium') finishLevel = 'premium';
      else if (f === 'budget' || f === 'simple') finishLevel = 'budget';
    }

    const inputData: ComprehensivePlannerInput = {
      projectType: selectedProjectType,
      customerGoals: answers.detected_goals || ['High quality renovation', 'Modern design'],
      customDescription: answers[`${selectedProjectType}_notes`] || answers.custom_notes || '',
      propertyType: answers.property_style || 'terraced',
      propertyAge: answers.property_age || 'pre_1900',
      postcode: answers.postcode || 'W4 1PR',
      selectedAreas: [
        {
          id: `area-${selectedProjectType}`,
          name: PROJECT_TYPE_OPTIONS.find((p) => p.id === selectedProjectType)?.label || 'Project Area',
          sizeCategory: 'medium',
          lengthMeters: customLength,
          widthMeters: customWidth,
        },
      ],
      finishLevel,
      projectStatus: answers.project_stage || 'starting_to_plan',
      timeline: answers.timeline || '1_3_months',
      budgetRange: '50k_100k',
    };

    return (
      <QuoteConfigurator
        initialInput={inputData}
        initialScopeItems={scopeItems}
        initialRecommendations={recommendations}
        answers={answers}
        onBackToWizard={() => setIsQuizComplete(false)}
      />
    );
  }

  // =========================================================================
  // SCREEN 0: SELECT PROJECT TYPE (Clean, wide, liquid glass layout)
  // =========================================================================
  if (!selectedProjectType) {
    return (
      <div className="w-full text-white text-left">
        {/* Header */}
        <div className="text-left mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-heading drop-shadow-sm">
            What are you building or changing?
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal max-w-2xl drop-shadow-xs">
            Select your project type below to get a tailored estimate with questions specific to your home.
          </p>
        </div>

        <div className="w-full space-y-8">
          {/* Natural Language Prompt (Light Clear Liquid Glass Card) */}
          <div className="rounded-2xl border border-white/35 bg-white/[0.12] backdrop-blur-xl p-5 sm:p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_24px_rgba(0,0,0,0.2)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#FFAA4F]" />
                <span>Not sure? Describe what you&apos;re thinking</span>
              </label>
              <span className="text-xs text-white/80 font-medium hidden sm:inline">
                Instant AI match
              </span>
            </div>

            <textarea
              rows={3}
              placeholder="e.g. I want to renovate my family bathroom, install a walk-in rainfall shower, underfloor heating and new wall tiles..."
              value={naturalText}
              onChange={(e) => setNaturalText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/30 bg-white/[0.12] text-sm text-white placeholder:text-white/60 focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F] focus:border-white/60 focus:bg-white/[0.2] transition-all leading-relaxed backdrop-blur-md"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <p className="text-xs text-white/80">
                Type your description to auto-select your project category.
              </p>
              {naturalText.trim().length > 3 && (
                <Button
                  type="button"
                  onClick={handleInterpretDescription}
                  disabled={isInterpretingText}
                  variant="primary"
                  size="sm"
                  className="bg-[#FFAA4F] text-neutral-950 hover:bg-[#F59E3F] text-xs font-bold px-4 py-2 shrink-0 self-end sm:self-auto border border-[#E69335] shadow-md"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  {isInterpretingText ? 'Detecting...' : 'Start Tailored Quiz'}
                </Button>
              )}
            </div>
          </div>

          {/* Subtle Divider */}
          <div className="relative text-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/25" />
            </div>
            <div className="relative inline-block bg-white/[0.2] backdrop-blur-md px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/35 shadow-xs">
              Or choose your project type
            </div>
          </div>

          {/* Core Project Cards (Clear White Liquid Glass Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROJECT_TYPE_OPTIONS.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setSelectedProjectType(item.id as ProjectType);
                  setActiveQuestionIndex(0);
                }}
                className="p-5 rounded-2xl border border-white/30 bg-white/[0.12] hover:bg-white/[0.22] hover:border-white/60 backdrop-blur-xl transition-all text-left flex items-start justify-between gap-4 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.2)]"
              >
                <div className="space-y-1">
                  <div className="font-bold text-white text-base font-heading group-hover:text-[#FFAA4F] transition-colors drop-shadow-xs">
                    {item.label}
                  </div>
                  <div className="text-xs text-white/80 leading-relaxed font-normal">
                    {item.desc}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/70 group-hover:text-[#FFAA4F] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // DYNAMIC TAILORED QUESTIONS (Screens 1 to N for the Active Project)
  // =========================================================================
  const totalQuestions = projectQuestions.length;
  const currentProgress = Math.round(((activeQuestionIndex + 1) / totalQuestions) * 100);
  const activeTypeInfo = PROJECT_TYPE_OPTIONS.find((p) => p.id === selectedProjectType);

  return (
    <div className="w-full text-white text-left">
      {/* Transferred AI Assistant Banner */}
      {transferredAssistantProject && (
        <div className="mb-6 p-4 rounded-2xl bg-[#FFAA4F]/20 border border-[#FFAA4F]/40 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.2)] text-left backdrop-blur-xl">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-[#FFAA4F] flex items-center gap-1.5 drop-shadow-xs">
              <Sparkles className="h-4 w-4 text-[#FFAA4F] shrink-0" />
              <span>Pre-filled from AI Assistant: {transferredAssistantProject.projectTypeDisplay}</span>
            </div>
            <p className="text-[11px] text-white/90 font-normal line-clamp-1">
              "{transferredAssistantProject.originalDescription}"
            </p>
          </div>

          <button
            type="button"
            onClick={handleCompleteQuiz}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#FFAA4F] hover:bg-[#F59E3F] text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer border border-[#E69335] shrink-0"
          >
            <span>View Full Estimate Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Progress & Category Banner */}
      <div className="mb-6 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-medium text-white/90 drop-shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{activeTypeInfo?.label}</span>
            <span>•</span>
            <span>Question {activeQuestionIndex + 1} of {totalQuestions}</span>
          </div>
          <span className="font-semibold text-[#FFAA4F]">{currentProgress}%</span>
        </div>

        <div className="w-full bg-white/25 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#FFAA4F] h-full transition-all duration-300 rounded-full"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>

      {/* Dynamic Question Container (Lighter Clear Liquid Glass) */}
      <div className="w-full bg-white/[0.12] backdrop-blur-2xl rounded-2xl border border-white/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_15px_35px_rgba(0,0,0,0.25)] p-6 sm:p-8 text-left">
        {currentQuestion && (
          <div className="space-y-6">
            {/* Question Header */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#FFAA4F] uppercase tracking-wider">
                Step {activeQuestionIndex + 1}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading drop-shadow-xs">
                {currentQuestion.title}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-xs sm:text-sm text-white/85 pt-0.5">
                  {currentQuestion.subtitle}
                </p>
              )}
            </div>

            {/* 1. SINGLE CHOICE QUESTION */}
            {currentQuestion.type === 'single_choice' && currentQuestion.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => handleSingleSelect(currentQuestion.id, opt.id)}
                      className={clsx(
                        'p-4 rounded-xl border text-left transition-all duration-150 flex items-start justify-between gap-3 cursor-pointer backdrop-blur-sm',
                        isSelected
                          ? 'border-[#FFAA4F] bg-[#FFAA4F]/25 text-white ring-1 ring-[#FFAA4F]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_8px_20px_rgba(255,170,79,0.25)]'
                          : 'border-white/25 bg-white/[0.10] text-white hover:border-white/50 hover:bg-white/[0.20] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]'
                      )}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-white text-sm font-heading drop-shadow-xs">
                          {opt.label}
                        </div>
                        {opt.desc && (
                          <div className="text-xs text-white/80 leading-snug font-normal">
                            {opt.desc}
                          </div>
                        )}
                      </div>
                      <div
                        className={clsx(
                          'h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                          isSelected
                            ? 'border-[#FFAA4F] bg-[#FFAA4F] text-neutral-950'
                            : 'border-white/40 bg-white/10'
                        )}
                      >
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-neutral-950" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. MULTIPLE CHOICE QUESTION (With Clean Sub-Options) */}
            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options.map((opt) => {
                    const selectedList = (answers[currentQuestion.id] as string[]) || [];
                    const isSelected = selectedList.includes(opt.id);
                    const subKey = `${currentQuestion.id}_suboptions`;
                    const activeSubs = (answers[subKey] as string[]) || [];
                    const optSubs = opt.subOptions || [];
                    const selectedSubCount = optSubs.filter((s) => activeSubs.includes(s.id)).length;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleMultiSelect(currentQuestion.id, opt.id)}
                        className={clsx(
                          'p-4 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer space-y-3 backdrop-blur-sm',
                          isSelected
                            ? 'border-[#FFAA4F] bg-[#FFAA4F]/25 ring-1 ring-[#FFAA4F]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_8px_20px_rgba(255,170,79,0.25)]'
                            : 'border-white/25 bg-white/[0.10] hover:border-white/50 hover:bg-white/[0.20] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5 flex-1">
                            <div className="font-bold text-white text-sm font-heading drop-shadow-xs">
                              {opt.label}
                            </div>
                            {opt.desc && (
                              <div className="text-xs text-white/80 leading-relaxed font-normal">
                                {opt.desc}
                              </div>
                            )}
                          </div>
                          <div
                            className={clsx(
                              'h-4.5 w-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                              isSelected
                                ? 'bg-[#FFAA4F] border-[#FFAA4F] text-neutral-950 font-bold'
                                : 'border-white/40 bg-white/10'
                            )}
                          >
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Sub-Options Tray (Single Option Selection per Feature) */}
                        {optSubs.length > 0 && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="pt-2.5 border-t border-white/20 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[11px] font-medium text-white/90">
                              <span>Choose 1 option:</span>
                              {selectedSubCount > 0 && (
                                <span className="text-neutral-950 font-bold bg-[#FFAA4F] px-2 py-0.5 rounded-full text-[10px]">
                                  1 selected
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {optSubs.map((sub) => {
                                const isSubActive = activeSubs.includes(sub.id);
                                return (
                                  <button
                                    type="button"
                                    key={sub.id}
                                    onClick={() => handleSubOptionSelect(currentQuestion.id, opt.id, sub.id)}
                                    className={clsx(
                                      'px-2.5 py-1 rounded-lg text-xs transition-all text-left flex items-center gap-1.5 cursor-pointer border',
                                      isSubActive
                                        ? 'bg-[#FFAA4F] text-neutral-950 border-[#E69335] font-bold shadow-sm'
                                        : 'bg-white/[0.14] text-white border-white/25 hover:bg-white/[0.24]'
                                    )}
                                  >
                                    {isSubActive ? (
                                      <Check className="h-3 w-3 stroke-[3] text-neutral-950 shrink-0" />
                                    ) : (
                                      <span className="text-white/60 text-xs">•</span>
                                    )}
                                    <span>{sub.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. DIMENSION / SIZE INPUT */}
            {currentQuestion.type === 'dimension_input' && currentQuestion.options && (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => handleSingleSelect(currentQuestion.id, opt.id)}
                        className={clsx(
                          'p-4 rounded-xl border text-left transition-all cursor-pointer space-y-0.5 backdrop-blur-sm',
                          isSelected
                            ? 'border-[#FFAA4F] bg-[#FFAA4F]/25 ring-1 ring-[#FFAA4F]/60 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_8px_20px_rgba(255,170,79,0.25)]'
                            : 'border-white/25 bg-white/[0.10] hover:border-white/50 hover:bg-white/[0.20] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]'
                        )}
                      >
                        <div className="font-bold text-white text-sm font-heading drop-shadow-xs">{opt.label}</div>
                        {opt.desc && <div className="text-xs text-white/80 leading-snug font-normal">{opt.desc}</div>}
                      </button>
                    );
                  })}
                </div>

                {/* Exact measurements */}
                {answers[currentQuestion.id] === 'exact' && (
                  <div className="p-4 rounded-xl bg-white/[0.14] border border-white/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-[#FFAA4F]" />
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        Room Dimensions:
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-white/90 font-medium">Length:</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="50"
                          value={customLength}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setCustomLength(isNaN(val) || val <= 0 ? 1 : Math.min(50, Math.max(0.5, val)));
                          }}
                          className="w-16 px-2 py-1.5 rounded-lg border border-white/35 text-xs font-semibold text-center bg-white/25 text-white"
                        />
                        <span className="text-xs text-white/90">m</span>
                      </div>

                      <span className="text-white/60">×</span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-white/90 font-medium">Width:</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="50"
                          value={customWidth}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setCustomWidth(isNaN(val) || val <= 0 ? 1 : Math.min(50, Math.max(0.5, val)));
                          }}
                          className="w-16 px-2 py-1.5 rounded-lg border border-white/35 text-xs font-semibold text-center bg-white/25 text-white"
                        />
                        <span className="text-xs text-white/90">m</span>
                      </div>

                      <span className="text-xs font-bold text-white bg-white/25 px-2.5 py-1.5 rounded-lg border border-white/35">
                        {(customLength * customWidth).toFixed(1)} m²
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. FREE TEXT INPUT */}
            {currentQuestion.type === 'free_text' && (
              <div className="space-y-2 pt-1">
                <textarea
                  rows={4}
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/30 bg-white/[0.12] text-sm text-white placeholder:text-white/60 focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F] focus:border-white/60 leading-relaxed backdrop-blur-md"
                />
                <p className="text-xs text-white/80">
                  Optional: Provide any specific details or preferences for your project.
                </p>
              </div>
            )}

            {/* 5. PROPERTY STYLE & POSTCODE (Shared Closing Step) */}
            {currentQuestion.type === 'property_and_postcode' && (
              <div className="space-y-6 pt-1">
                {/* Property Style */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/90 block">
                    1. Property Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {PROPERTY_STYLES.map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setAnswers((prev) => ({ ...prev, property_style: p.id }))}
                        className={clsx(
                          'p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer backdrop-blur-sm',
                          answers.property_style === p.id
                            ? 'border-[#FFAA4F] bg-[#FFAA4F]/25 text-white font-semibold ring-1 ring-[#FFAA4F]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_8px_20px_rgba(255,170,79,0.25)]'
                            : 'border-white/25 bg-white/[0.10] text-white hover:bg-white/[0.20] hover:border-white/40'
                        )}
                      >
                        <span>{p.label}</span>
                        {answers.property_style === p.id && <Check className="h-3.5 w-3.5 text-[#FFAA4F]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Era */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/90 block">
                    2. Approximate Property Era
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {PROPERTY_AGES.map((age) => (
                      <button
                        type="button"
                        key={age.id}
                        onClick={() => setAnswers((prev) => ({ ...prev, property_age: age.id }))}
                        className={clsx(
                          'p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer backdrop-blur-sm',
                          answers.property_age === age.id
                            ? 'border-[#FFAA4F] bg-[#FFAA4F]/25 text-white font-semibold ring-1 ring-[#FFAA4F]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_8px_20px_rgba(255,170,79,0.25)]'
                            : 'border-white/25 bg-white/[0.10] text-white hover:bg-white/[0.20] hover:border-white/40'
                        )}
                      >
                        <span>{age.label}</span>
                        {answers.property_age === age.id && <Check className="h-3.5 w-3.5 text-[#FFAA4F]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Postcode */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/90 block">
                    3. Project Postcode (London Borough Calibration)
                  </label>
                  <div className="flex items-center gap-2 max-w-xs">
                    <MapPin className="h-4 w-4 text-[#FFAA4F] shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. W4 1PR, SW13 9AA, W5 2UP"
                      value={answers.postcode || ''}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, postcode: e.target.value.toUpperCase() }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-white/35 bg-white/[0.14] text-sm font-semibold text-white placeholder:text-white/60 focus:ring-2 focus:ring-[#FFAA4F] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. TIMELINE & STAGE (Shared Closing Step) */}
            {currentQuestion.type === 'timeline_and_stage' && (
              <div className="space-y-6 pt-1">
                {/* Start Timeline */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/90 block">
                    1. Ideal Construction Start Timeline
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TIMELINE_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setAnswers((prev) => ({ ...prev, timeline: opt.id }))}
                        className={clsx(
                          'p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer backdrop-blur-sm',
                          answers.timeline === opt.id
                            ? 'border-[#FFAA4F] bg-[#FFAA4F]/25 text-white font-semibold ring-1 ring-[#FFAA4F]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_8px_20px_rgba(255,170,79,0.25)]'
                            : 'border-white/25 bg-white/[0.10] text-white hover:bg-white/[0.20] hover:border-white/40'
                        )}
                      >
                        <span>{opt.label}</span>
                        {answers.timeline === opt.id && <Check className="h-3.5 w-3.5 text-[#FFAA4F]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Planning / Design Stage */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/90 block">
                    2. Current Planning & Architectural Stage
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {STAGE_OPTIONS.map((stage) => (
                      <button
                        type="button"
                        key={stage.id}
                        onClick={() => setAnswers((prev) => ({ ...prev, project_stage: stage.id }))}
                        className={clsx(
                          'p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer backdrop-blur-sm',
                          answers.project_stage === stage.id
                            ? 'border-[#FFAA4F] bg-[#FFAA4F]/25 text-white font-semibold ring-1 ring-[#FFAA4F]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_8px_20px_rgba(255,170,79,0.25)]'
                            : 'border-white/25 bg-white/[0.10] text-white hover:bg-white/[0.20] hover:border-white/40'
                        )}
                      >
                        <span>{stage.label}</span>
                        {answers.project_stage === stage.id && <Check className="h-3.5 w-3.5 text-[#FFAA4F]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="pt-6 border-t border-white/20 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-white/30 bg-white/[0.10] text-xs font-semibold text-white hover:bg-white/[0.20] transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <Button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
                variant="primary"
                className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-neutral-950 text-xs font-bold px-6 py-2.5 shadow-md disabled:opacity-50 border border-[#E69335]"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                {activeQuestionIndex === totalQuestions - 1 ? 'Generate Detailed Estimate' : 'Continue'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
