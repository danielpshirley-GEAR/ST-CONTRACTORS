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
      const list = (prev[questionId] as string[]) || [];
      const isParentSelected = list.includes(parentOptionId);
      const updatedList = isParentSelected ? list : [...list, parentOptionId];

      const subMapKey = `${questionId}_suboptions_map`;
      const currentMap = { ...((prev[subMapKey] as Record<string, string>) || {}) };

      if (currentMap[parentOptionId] === subOptionId) {
        delete currentMap[parentOptionId];
      } else {
        currentMap[parentOptionId] = subOptionId;
      }

      const flatSubs = Object.values(currentMap);
      const subKey = `${questionId}_suboptions`;

      return {
        ...prev,
        [questionId]: updatedList,
        [subMapKey]: currentMap,
        [subKey]: flatSubs,
      };
    });
  };

  // Validation for Current Step
  const isCurrentStepValid = (): boolean => {
    if (!currentQuestion) return false;
    const val = answers[currentQuestion.id];

    if (currentQuestion.type === 'single_choice' || currentQuestion.type === 'dimension_input') {
      return Boolean(val);
    }
    if (currentQuestion.type === 'multiple_choice') {
      return Array.isArray(val) && val.length > 0;
    }
    if (currentQuestion.type === 'property_and_postcode') {
      return Boolean(answers.postcode && answers.property_style);
    }
    if (currentQuestion.type === 'timeline_and_stage') {
      return Boolean(answers.timeline && answers.project_stage);
    }
    return true;
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

  // Final Synthesis & Scope Generation
  const handleCompleteQuiz = () => {
    if (!selectedProjectType) return;

    let finishTier: FinishLevel = 'premium';
    const finishAns = answers.specification_tier || answers.finish_level;
    if (finishAns === 'luxury' || finishAns === 'master') finishTier = 'luxury';
    if (finishAns === 'essential' || finishAns === 'standard') finishTier = 'standard';

    let lengthMeters = 5.0;
    let widthMeters = 4.0;
    const dimAns = answers.extension_size || answers.room_size || answers.dimension_size;

    if (dimAns === 'small') {
      lengthMeters = 4.0;
      widthMeters = 3.0;
    } else if (dimAns === 'medium') {
      lengthMeters = 5.0;
      widthMeters = 4.0;
    } else if (dimAns === 'large') {
      lengthMeters = 6.5;
      widthMeters = 4.5;
    } else if (dimAns === 'exact') {
      lengthMeters = customLength;
      widthMeters = customWidth;
    }

    const glazingList = (answers.glazing_features_suboptions || answers.glazing_features || []) as string[];
    const structuralList = (answers.structural_works_suboptions || answers.structural_works || []) as string[];
    const interiorList = (answers.interior_finishes_suboptions || answers.interior_finishes || []) as string[];
    const heatingElectricsList = (answers.heating_electrics_suboptions || answers.heating_electrics || []) as string[];
    const externalList = (answers.external_cladding_suboptions || answers.external_cladding || []) as string[];

    const plannerInput: ComprehensivePlannerInput = {
      projectType: selectedProjectType,
      customerGoals: (answers.detected_goals as string[]) || ['High quality finish', 'Optimal space layout'],
      postcode: answers.postcode || 'W4 1PR',
      propertyType: answers.property_style || 'terraced',
      propertyAge: answers.property_age || 'pre_1900',
      finishLevel: finishTier,
      timeline: answers.timeline || '1_3_months',
      projectStatus: answers.project_stage || 'starting_to_plan',
      budgetRange: 'guide_indicative',
      selectedAreas: [
        {
          id: `room_${Date.now()}`,
          name: PROJECT_TYPE_OPTIONS.find((p) => p.id === selectedProjectType)?.label || 'Main Project Area',
          sizeCategory: dimAns === 'small' ? 'small' : dimAns === 'large' ? 'large' : 'medium',
          lengthMeters,
          widthMeters,
        },
      ],
      structuralFeatures: structuralList,
      glazingChoices: glazingList,
      interiorSpecialties: interiorList,
      heatingElectrics: heatingElectricsList,
      externalFinishes: externalList,
    };

    const generatedScope = generateRoomByRoomScope(plannerInput, answers);
    const generatedRecs = generateContextualRecommendations(plannerInput);

    setScopeItems(generatedScope);
    setRecommendations(generatedRecs);
    setIsQuizComplete(true);

    try {
      updateActiveProjectProfile({
        projectTypes: [selectedProjectType as any],
        propertyType: plannerInput.propertyType as any,
        propertyEra: plannerInput.propertyAge as any,
        location: { postcode: plannerInput.postcode },
      });
      trackEvent('planner_quiz_completed', {
        project_type: selectedProjectType,
        finish_level: finishTier,
        scope_items_count: generatedScope.length,
      });
    } catch (e) {
      // safe fallback
    }
  };

  // =========================================================================
  // VIEW: QUOTE CONFIGURATOR / RESULT SCREEN
  // =========================================================================
  if (isQuizComplete && selectedProjectType) {
    const plannerInput: ComprehensivePlannerInput = {
      projectType: selectedProjectType,
      customerGoals: (answers.detected_goals as string[]) || ['High quality finish', 'Optimal space layout'],
      postcode: answers.postcode || 'W4 1PR',
      propertyType: answers.property_style || 'terraced',
      propertyAge: answers.property_age || 'pre_1900',
      finishLevel: (answers.specification_tier === 'luxury' ? 'luxury' : answers.specification_tier === 'essential' ? 'standard' : 'premium') as FinishLevel,
      timeline: answers.timeline || '1_3_months',
      projectStatus: answers.project_stage || 'starting_to_plan',
      budgetRange: 'guide_indicative',
      selectedAreas: [
        {
          id: 'area_1',
          name: PROJECT_TYPE_OPTIONS.find((p) => p.id === selectedProjectType)?.label || 'Main Project Area',
          sizeCategory: 'medium',
          lengthMeters: customLength,
          widthMeters: customWidth,
        },
      ],
    };

    return (
      <QuoteConfigurator
        initialInput={plannerInput}
        initialScopeItems={scopeItems}
        initialRecommendations={recommendations}
        answers={answers}
        onBackToWizard={() => setIsQuizComplete(false)}
      />
    );
  }

  // =========================================================================
  // VIEW: STEP 0 — PROJECT TYPE SELECTOR & NATURAL PROMPT
  // =========================================================================
  if (!selectedProjectType) {
    return (
      <div className="w-full text-white text-left space-y-8">
        {/* Header */}
        <div className="text-left space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-heading">
            What are you building or changing?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
            Select your project type below to get a tailored estimate with questions specific to your home.
          </p>
        </div>

        <div className="w-full space-y-8">
          {/* Natural Language Prompt Card */}
          <div className="rounded-2xl border-2 border-slate-700 bg-slate-800 p-5 sm:p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#FFAA4F]" />
                <span>Not sure? Describe what you&apos;re thinking</span>
              </label>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                Instant AI match
              </span>
            </div>

            <textarea
              rows={3}
              placeholder="e.g. I want to renovate my family bathroom, install a walk-in rainfall shower, underfloor heating and new wall tiles..."
              value={naturalText}
              onChange={(e) => setNaturalText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-900 text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F] focus:border-[#FFAA4F] transition-all leading-relaxed shadow-inner"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <p className="text-xs text-slate-400">
                Type your description to auto-select your project category.
              </p>
              {naturalText.trim().length > 3 && (
                <Button
                  type="button"
                  onClick={handleInterpretDescription}
                  disabled={isInterpretingText}
                  variant="primary"
                  size="sm"
                  className="bg-[#FFAA4F] text-slate-950 hover:bg-[#F59E3F] text-xs font-bold px-4 py-2 shrink-0 self-end sm:self-auto border border-[#E69335] shadow-md"
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
              <div className="w-full border-t border-slate-750" />
            </div>
            <div className="relative inline-block bg-slate-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 border border-slate-700 shadow-xs">
              Or choose your project type
            </div>
          </div>

          {/* Core Project Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROJECT_TYPE_OPTIONS.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setSelectedProjectType(item.id as ProjectType);
                  setActiveQuestionIndex(0);
                }}
                className="p-5 rounded-2xl border-2 border-slate-700 bg-slate-800 hover:bg-slate-750 hover:border-slate-500 transition-all text-left flex items-start justify-between gap-4 group cursor-pointer shadow-lg"
              >
                <div className="space-y-1">
                  <div className="font-bold text-white text-base font-heading group-hover:text-[#FFAA4F] transition-colors">
                    {item.label}
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.desc}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#FFAA4F] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
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
    <div className="w-full text-white text-left space-y-6">
      {/* Transferred AI Assistant Banner */}
      {transferredAssistantProject && (
        <div className="p-4 rounded-2xl bg-amber-950/70 border-2 border-amber-500/60 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg text-left">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-[#FFAA4F] flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#FFAA4F] shrink-0" />
              <span>Pre-filled from AI Assistant: {transferredAssistantProject.projectTypeDisplay}</span>
            </div>
            <p className="text-xs text-slate-200 font-normal line-clamp-1">
              &quot;{transferredAssistantProject.originalDescription}&quot;
            </p>
          </div>

          <button
            type="button"
            onClick={handleCompleteQuiz}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer border border-[#E69335] shrink-0"
          >
            <span>View Full Estimate Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Progress & Category Banner */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{activeTypeInfo?.label}</span>
            <span>•</span>
            <span>Question {activeQuestionIndex + 1} of {totalQuestions}</span>
          </div>
          <span className="font-bold text-[#FFAA4F]">{currentProgress}%</span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
          <div
            className="bg-[#FFAA4F] h-full transition-all duration-300 rounded-full"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>

      {/* Dynamic Question Container */}
      <div className="w-full bg-slate-800/90 rounded-2xl border-2 border-slate-700 shadow-xl p-6 sm:p-8 text-left">
        {currentQuestion && (
          <div className="space-y-6">
            {/* Question Header */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#FFAA4F] uppercase tracking-wider block">
                Step {activeQuestionIndex + 1}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
                {currentQuestion.title}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-xs sm:text-sm text-slate-300 pt-0.5 font-normal leading-relaxed">
                  {currentQuestion.subtitle}
                </p>
              )}
            </div>

            {/* 1. SINGLE CHOICE QUESTION */}
            {currentQuestion.type === 'single_choice' && currentQuestion.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => handleSingleSelect(currentQuestion.id, opt.id)}
                      className={clsx(
                        'p-5 rounded-2xl border-2 text-left transition-all duration-150 flex items-start justify-between gap-3 cursor-pointer shadow-md',
                        isSelected
                          ? 'border-[#FFAA4F] bg-amber-950/40 text-white ring-2 ring-[#FFAA4F]'
                          : 'border-slate-700 bg-slate-900/90 text-white hover:border-slate-500 hover:bg-slate-900'
                      )}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-white text-sm sm:text-base font-heading">
                          {opt.label}
                        </div>
                        {opt.desc && (
                          <div className="text-xs text-slate-300 leading-relaxed font-normal">
                            {opt.desc}
                          </div>
                        )}
                      </div>
                      <div
                        className={clsx(
                          'h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                          isSelected
                            ? 'border-[#FFAA4F] bg-[#FFAA4F] text-slate-950'
                            : 'border-slate-500 bg-slate-800'
                        )}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-slate-950" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. MULTIPLE CHOICE QUESTION (With Clean Sub-Options) */}
            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <div className="space-y-3.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                          'p-5 rounded-2xl border-2 text-left transition-all duration-150 flex flex-col justify-between cursor-pointer space-y-3 shadow-md',
                          isSelected
                            ? 'border-[#FFAA4F] bg-amber-950/40 ring-2 ring-[#FFAA4F]'
                            : 'border-slate-700 bg-slate-900/90 hover:border-slate-500 hover:bg-slate-900'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="font-bold text-white text-sm sm:text-base font-heading">
                              {opt.label}
                            </div>
                            {opt.desc && (
                              <div className="text-xs text-slate-300 leading-relaxed font-normal">
                                {opt.desc}
                              </div>
                            )}
                          </div>
                          <div
                            className={clsx(
                              'h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                              isSelected
                                ? 'bg-[#FFAA4F] border-[#FFAA4F] text-slate-950 font-bold'
                                : 'border-slate-500 bg-slate-800'
                            )}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Sub-Options Tray */}
                        {optSubs.length > 0 && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="pt-3 border-t border-slate-700/80 space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                              <span>Choose 1 option:</span>
                              {selectedSubCount > 0 && (
                                <span className="text-slate-950 font-bold bg-[#FFAA4F] px-2 py-0.5 rounded-full text-[10px]">
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
                                      'px-3 py-1.5 rounded-xl text-xs transition-all text-left flex items-center gap-1.5 cursor-pointer border',
                                      isSubActive
                                        ? 'bg-[#FFAA4F] text-slate-950 border-[#E69335] font-bold shadow-sm'
                                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750 hover:text-white'
                                    )}
                                  >
                                    {isSubActive ? (
                                      <Check className="h-3 w-3 stroke-[3] text-slate-950 shrink-0" />
                                    ) : (
                                      <span className="text-slate-500 text-xs">•</span>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => handleSingleSelect(currentQuestion.id, opt.id)}
                        className={clsx(
                          'p-5 rounded-2xl border-2 text-left transition-all cursor-pointer space-y-1 shadow-md',
                          isSelected
                            ? 'border-[#FFAA4F] bg-amber-950/40 ring-2 ring-[#FFAA4F] text-white'
                            : 'border-slate-700 bg-slate-900/90 text-white hover:border-slate-500 hover:bg-slate-900'
                        )}
                      >
                        <div className="font-bold text-white text-sm sm:text-base font-heading">{opt.label}</div>
                        {opt.desc && <div className="text-xs text-slate-300 leading-relaxed font-normal">{opt.desc}</div>}
                      </button>
                    );
                  })}
                </div>

                {/* Exact measurements */}
                {answers[currentQuestion.id] === 'exact' && (
                  <div className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2 shadow-inner">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-[#FFAA4F]" />
                      <span className="text-xs sm:text-sm font-bold text-white">
                        Room Dimensions:
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-300 font-medium">Length:</span>
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
                          className="w-16 px-2.5 py-1.5 rounded-lg border-2 border-slate-700 text-xs font-bold text-center bg-slate-800 text-white focus:border-[#FFAA4F]"
                        />
                        <span className="text-xs text-slate-300">m</span>
                      </div>

                      <span className="text-slate-500">×</span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-300 font-medium">Width:</span>
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
                          className="w-16 px-2.5 py-1.5 rounded-lg border-2 border-slate-700 text-xs font-bold text-center bg-slate-800 text-white focus:border-[#FFAA4F]"
                        />
                        <span className="text-xs text-slate-300">m</span>
                      </div>

                      <span className="text-xs font-bold text-slate-950 bg-[#FFAA4F] px-3 py-1.5 rounded-lg border border-[#E69335] shadow-sm">
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
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-700 bg-slate-900 text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFAA4F] focus:border-[#FFAA4F] leading-relaxed shadow-inner"
                />
                <p className="text-xs text-slate-400">
                  Optional: Provide any specific details or preferences for your project.
                </p>
              </div>
            )}

            {/* 5. PROPERTY STYLE & POSTCODE (Shared Closing Step) */}
            {currentQuestion.type === 'property_and_postcode' && (
              <div className="space-y-6 pt-1">
                {/* Property Style */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    1. Property Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {PROPERTY_STYLES.map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setAnswers((prev) => ({ ...prev, property_style: p.id }))}
                        className={clsx(
                          'p-3.5 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer shadow-sm',
                          answers.property_style === p.id
                            ? 'border-[#FFAA4F] bg-amber-950/40 text-white ring-2 ring-[#FFAA4F]'
                            : 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-850 hover:border-slate-500'
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
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    2. Approximate Property Era
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {PROPERTY_AGES.map((age) => (
                      <button
                        type="button"
                        key={age.id}
                        onClick={() => setAnswers((prev) => ({ ...prev, property_age: age.id }))}
                        className={clsx(
                          'p-3.5 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer shadow-sm',
                          answers.property_age === age.id
                            ? 'border-[#FFAA4F] bg-amber-950/40 text-white ring-2 ring-[#FFAA4F]'
                            : 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-850 hover:border-slate-500'
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
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    3. Project Postcode (London Borough Calibration)
                  </label>
                  <div className="flex items-center gap-2 max-w-xs">
                    <MapPin className="h-4 w-4 text-[#FFAA4F] shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. W4 1PR, SW13 9AA, W5 2UP"
                      value={answers.postcode || ''}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, postcode: e.target.value.toUpperCase() }))}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-700 bg-slate-900 text-sm font-bold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#FFAA4F] focus:border-[#FFAA4F] focus:outline-hidden"
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
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    1. Ideal Construction Start Timeline
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TIMELINE_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setAnswers((prev) => ({ ...prev, timeline: opt.id }))}
                        className={clsx(
                          'p-3.5 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer shadow-sm',
                          answers.timeline === opt.id
                            ? 'border-[#FFAA4F] bg-amber-950/40 text-white ring-2 ring-[#FFAA4F]'
                            : 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-850 hover:border-slate-500'
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
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    2. Current Planning &amp; Architectural Stage
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {STAGE_OPTIONS.map((stage) => (
                      <button
                        type="button"
                        key={stage.id}
                        onClick={() => setAnswers((prev) => ({ ...prev, project_stage: stage.id }))}
                        className={clsx(
                          'p-4 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer shadow-sm',
                          answers.project_stage === stage.id
                            ? 'border-[#FFAA4F] bg-amber-950/40 text-white ring-2 ring-[#FFAA4F]'
                            : 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-850 hover:border-slate-500'
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
            <div className="pt-6 border-t border-slate-700 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 rounded-xl border-2 border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 hover:bg-slate-750 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <Button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
                variant="primary"
                className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 text-xs font-extrabold px-8 py-3.5 shadow-md disabled:opacity-40 border border-[#E69335]"
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
