'use client';

import React, { useState } from 'react';
import { ProjectState } from '@/types/visualiser-scope';
import { Button } from '@/components/ui/Button';
import {
  HelpCircle,
  Send,
  MessageSquare,
  Sparkles,
  User,
  Bot,
} from 'lucide-react';

interface AskAboutProjectChatProps {
  chatHistory: { role: 'user' | 'assistant'; message: string; timestamp: string }[];
  onSendMessage: (question: string) => void;
  isSending: boolean;
}

export const SAMPLE_QUESTIONS = [
  'Why might I need a structural engineer?',
  'Where could we reduce the specification to save budget?',
  'How will staying in the house affect the build?',
  'What is the biggest risk for this project?',
];

export function AskAboutProjectChat({
  chatHistory,
  onSendMessage,
  isSending,
}: AskAboutProjectChatProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onSendMessage(question.trim());
    setQuestion('');
  };

  return (
    <div id="section-ask-ai" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFAA4F] block">
            Interactive Consultation
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
            Ask About Your Project
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Sparkles className="h-4 w-4 text-[#FFAA4F]" />
          <span>Grounded in Your Active Scope</span>
        </div>
      </div>

      {/* Chat Transcript */}
      <div className="space-y-3 max-h-72 overflow-y-auto p-4 rounded-2xl bg-slate-50 border border-slate-200">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 text-xs ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="h-7 w-7 rounded-lg bg-[#FFAA4F] text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`p-3.5 rounded-2xl max-w-md leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white font-medium'
                  : 'bg-white border border-slate-200 text-slate-800 shadow-xs'
              }`}
            >
              <div className="text-[10px] opacity-70 mb-1 block">
                {msg.role === 'user' ? 'You' : 'ST Contractors Project Assistant'} • {msg.timestamp}
              </div>
              <p>{msg.message}</p>
            </div>
            {msg.role === 'user' && (
              <div className="h-7 w-7 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-slate-500 animate-pulse">
            <Bot className="h-4 w-4 text-[#FFAA4F]" />
            <span>Consulting construction knowledge bank...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Frequently Asked for this Scope:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(q)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Question Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about structure, timelines, trades, or costs..."
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FFAA4F] focus:bg-white"
        />
        <Button
          type="submit"
          disabled={isSending || !question.trim()}
          variant="primary"
          size="sm"
          className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs px-5 border border-[#E69335]"
          rightIcon={<Send className="h-3.5 w-3.5" />}
        >
          Ask
        </Button>
      </form>
    </div>
  );
}
