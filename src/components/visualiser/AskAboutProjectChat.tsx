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
  isSending?: boolean;
  isLoading?: boolean;
}

export const SAMPLE_QUESTIONS = [
  'Why might I need a structural engineer?',
  'Where could we reduce the specification to save budget?',
  'What should I know about Thames Water drainage?',
  'What are the key planning checks for this project?',
];

export function AskAboutProjectChat({
  chatHistory,
  onSendMessage,
  isSending,
  isLoading,
}: AskAboutProjectChatProps) {
  const [question, setQuestion] = useState('');
  const loading = isLoading !== undefined ? isLoading : isSending || false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onSendMessage(question.trim());
    setQuestion('');
  };

  return (
    <div id="section-ask-ai" className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4 text-white">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#FFAA4F] text-slate-950 flex items-center justify-center font-bold">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-white">
              Ask AI About Your Project
            </h3>
            <span className="text-[10px] text-slate-400">
              Context-grounded technical guidance
            </span>
          </div>
        </div>
      </div>

      {/* Chat Transcript */}
      <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar p-1">
        {chatHistory.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 text-center space-y-1.5">
            <Bot className="h-6 w-6 text-[#FFAA4F] mx-auto" />
            <p className="text-xs text-slate-300 font-medium">
              Have a technical question about your design, costs, party walls, or construction phases?
            </p>
            <span className="text-[11px] text-slate-500 block">
              Answers are grounded in your active project scope.
            </span>
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                msg.role === 'user'
                  ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30 ml-4'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700 mr-4'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] opacity-70">
                <span className="font-bold flex items-center gap-1">
                  {msg.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3 text-[#FFAA4F]" />}
                  {msg.role === 'user' ? 'You' : 'ST Technical Assistant'}
                </span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))
        )}

        {loading && (
          <div className="p-3.5 rounded-2xl bg-slate-800/90 text-slate-400 border border-slate-700 text-xs flex items-center gap-2 mr-4">
            <span className="h-2 w-2 rounded-full bg-[#FFAA4F] animate-ping" />
            <span>Analyzing active project scope and technical parameters...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Frequently Asked Questions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => onSendMessage(q)}
              className="text-[11px] text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-1">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a technical or planning question..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FFAA4F]"
        />
        <Button
          type="submit"
          disabled={loading || !question.trim()}
          variant="primary"
          size="sm"
          className="bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 font-bold text-xs px-3.5 border border-[#E69335] shrink-0"
          rightIcon={<Send className="h-3 w-3" />}
        >
          Ask
        </Button>
      </form>
    </div>
  );
}
