'use client';

import React, { useState } from 'react';
import { ConsultationQuestion, ConsultationQuestionOption } from '@/types/visualiser-scope';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ArrowLeft, RotateCcw, Check, HelpCircle, Sparkles, MessageSquare } from 'lucide-react';

interface ConsultationQuestionCardProps {
  question: ConsultationQuestion;
  onAnswer: (answer: {
    questionId: string;
    questionText: string;
    answerValue: string;
    answerLabel: string;
  }) => void;
  onSkip?: () => void;
  onBack?: () => void;
  onReset?: () => void;
  onAddNaturalLanguageNote?: (note: string) => void;
  isProcessing?: boolean;
}

export function ConsultationQuestionCard({
  question,
  onAnswer,
  onSkip,
  onBack,
  onReset,
  onAddNaturalLanguageNote,
  isProcessing = false,
}: ConsultationQuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [naturalNote, setNaturalNote] = useState('');
  const [showNoteBar, setShowNoteBar] = useState(false);

  const handleOptionClick = (option: ConsultationQuestionOption) => {
    setSelectedOption(option.value);

    // Auto-advance if single choice (Part 8)
    if (option.autoAdvance !== false) {
      setTimeout(() => {
        onAnswer({
          questionId: question.id,
          questionText: question.question,
          answerValue: option.value,
          answerLabel: option.label,
        });
        setSelectedOption(null);
        setCustomText('');
        setShowCustomInput(false);
      }, 250);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    onAnswer({
      questionId: question.id,
      questionText: question.question,
      answerValue: customText.trim(),
      answerLabel: customText.trim(),
    });
    setCustomText('');
    setShowCustomInput(false);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalNote.trim()) return;
    if (onAddNaturalLanguageNote) {
      onAddNaturalLanguageNote(naturalNote.trim());
      setNaturalNote('');
      setShowNoteBar(false);
    }
  };

  return (
    <div className="min-h-[65vh] flex flex-col justify-center items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-2xl mx-auto space-y-5">
        {/* Top Navigation Bar: [Back] [Stage Badge] [Reset] [Skip] */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/80 shadow-sm transition-all active:scale-95"
                title="Go back to previous question"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-[#FFAA4F]" />
                <span>Back</span>
              </button>
            )}

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-[#FFAA4F] text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" />
              <span>{question.stageLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 shadow-sm transition-all active:scale-95"
                title="Start over from beginning"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                <span>Reset</span>
              </button>
            )}

            {question.allowSkip && onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="text-xs font-semibold text-slate-300 hover:text-white px-2 py-1 transition-colors"
              >
                {question.skipLabel || 'Skip'}
              </button>
            )}
          </div>
        </div>

        {/* Question Card (Part 6) */}
        <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-2xl space-y-6 text-left transition-all">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight tracking-tight">
              {question.question}
            </h2>
            {question.subtitle && (
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {question.subtitle}
              </p>
            )}
          </div>

          {/* Suggested Answer Chips (Parts 5, 7, 8) */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {question.options.map((opt) => {
              const isSelected = selectedOption === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleOptionClick(opt)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-4 group ${
                    isSelected
                      ? 'bg-[#FFAA4F]/15 border-[#FFAA4F] text-slate-950 ring-2 ring-[#FFAA4F]/40 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-sm sm:text-base font-bold text-slate-900 font-heading group-hover:text-slate-950 flex items-center gap-2">
                      <span>{opt.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-[#FFAA4F] flex-shrink-0" />}
                    </div>
                    {opt.description && (
                      <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                        {opt.description}
                      </p>
                    )}
                  </div>
                  <div className="pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4 text-[#FFAA4F]" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Answer Option (Part 7) */}
          {question.allowCustomInput && !showCustomInput && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="text-xs font-bold text-[#FFAA4F] hover:text-amber-700 flex items-center gap-1.5 focus:outline-none transition-colors"
              >
                <span>+ Something else? Type your own answer</span>
              </button>
            </div>
          )}

          {/* Custom Text Field */}
          {showCustomInput && (
            <form onSubmit={handleCustomSubmit} className="space-y-3 pt-2 border-t border-slate-100 animate-in fade-in duration-200">
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">
                Your Answer in Your Own Words
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={question.customInputPlaceholder || 'Tell us what you have in mind...'}
                  className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-[#FFAA4F] focus:outline-none focus:ring-2 focus:ring-[#FFAA4F]/20"
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!customText.trim() || isProcessing}
                  className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold px-5"
                >
                  Continue
                </Button>
              </div>
            </form>
          )}

          {/* Why We Ask (Optional Builder Insight) */}
          {question.impactReason && (
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span>Why we ask: {question.impactReason}</span>
            </div>
          )}
        </div>

        {/* Continuous Natural Language Input at Any Time (Part 17) */}
        <div className="text-center pt-2">
          {!showNoteBar ? (
            <button
              type="button"
              onClick={() => setShowNoteBar(true)}
              className="text-xs font-medium text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 mx-auto transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Have an extra detail or change to mention? Click here</span>
            </button>
          ) : (
            <form onSubmit={handleNoteSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex gap-2 max-w-xl mx-auto animate-in fade-in duration-200">
              <input
                type="text"
                value={naturalNote}
                onChange={(e) => setNaturalNote(e.target.value)}
                placeholder="e.g. 'I also want built-in cupboards' or 'I only have £30k'..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#FFAA4F]"
                autoFocus
              />
              <button
                type="submit"
                disabled={!naturalNote.trim()}
                className="px-3 py-2 rounded-xl bg-[#FFAA4F] text-slate-950 text-xs font-bold hover:bg-[#F59E3F] transition-colors"
              >
                Add Detail
              </button>
              <button
                type="button"
                onClick={() => setShowNoteBar(false)}
                className="px-2 py-2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
