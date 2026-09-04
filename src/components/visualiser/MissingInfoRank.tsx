'use client';

import React, { useState } from 'react';
import { MissingInfoItem } from '@/types/visualiser-scope';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface MissingInfoRankProps {
  missingInfo: MissingInfoItem[];
  completenessScore: number;
  onAnswerQuestion: (questionId: string, answer: string) => void;
}

export function MissingInfoRank({
  missingInfo,
  completenessScore,
  onAnswerQuestion,
}: MissingInfoRankProps) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [customAnswer, setCustomAnswer] = useState('');

  const unresolved = missingInfo.filter((m) => !m.resolved);
  const activeQuestion = unresolved.find((m) => m.id === activeQuestionId) || unresolved[0];

  const handleSelectOption = (option: string) => {
    if (activeQuestion) {
      onAnswerQuestion(activeQuestion.id, option);
      setActiveQuestionId(null);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeQuestion && customAnswer.trim()) {
      onAnswerQuestion(activeQuestion.id, customAnswer.trim());
      setCustomAnswer('');
      setActiveQuestionId(null);
    }
  };

  return (
    <div id="section-missing-info" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Progressive Refinement
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Information That Would Improve This Plan
          </h2>
        </div>

        {/* Completeness Bar */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 px-4 rounded-2xl border border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs gap-4">
              <span className="font-bold text-slate-700">Brief Completeness</span>
              <span className="font-extrabold text-[#FFAA4F] tabular-numbers">{completenessScore}%</span>
            </div>
            <div className="h-2 w-36 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FFAA4F] rounded-full transition-all duration-500"
                style={{ width: `${completenessScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {unresolved.length > 0 ? (
        <div className="space-y-4">
          {/* Active Question Focus Card */}
          {activeQuestion && (
            <div className="p-6 rounded-2xl bg-amber-50/60 border-2 border-amber-300 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant={activeQuestion.impact === 'HIGH' ? 'warning' : 'slate'}
                  className="text-[10px] font-bold"
                >
                  {activeQuestion.impact} IMPACT DETAIL
                </Badge>
                <span className="text-[11px] font-bold text-amber-900">
                  Category: {activeQuestion.category}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  {activeQuestion.question}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Why we&apos;re asking: </strong>
                  {activeQuestion.whyWeAsk}
                </p>
              </div>

              {/* Options or custom answer */}
              {activeQuestion.options && activeQuestion.options.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#FFAA4F] hover:bg-amber-50 text-xs font-bold text-slate-800 transition-all shadow-xs"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                    placeholder="Enter details..."
                    className="flex-1 rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs px-4"
                  >
                    Save Detail
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* Remaining Ranked List */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Remaining Missing Details (Ranked by Scope Impact):
            </span>
            <div className="space-y-2">
              {unresolved.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        item.impact === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : item.impact === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.impact}
                    </span>
                    <span className="font-semibold text-slate-800">{item.question}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveQuestionId(item.id)}
                    className="text-xs font-bold text-[#FFAA4F] hover:text-amber-800 shrink-0"
                  >
                    Answer This
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-center space-y-1">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-sm">Brief is 100% Comprehensive!</h3>
          <p className="text-xs text-emerald-800">
            All high, medium, and low-impact project details have been confirmed.
          </p>
        </div>
      )}
    </div>
  );
}
