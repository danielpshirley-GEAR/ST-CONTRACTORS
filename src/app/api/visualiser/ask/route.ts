/**
 * POST /api/visualiser/ask
 * Context-grounded technical Q&A route with construction safety guardrails.
 * Complies with Phase 7C Specification (Items 9, 10, 11).
 */

import { NextRequest, NextResponse } from 'next/server';
import { askVisualiserAI } from '@/lib/ai/visualiser-ai';
import { ProjectState } from '@/types/visualiser-scope';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectState, question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'A question is required.' }, { status: 400 });
    }

    if (!projectState) {
      return NextResponse.json({ error: 'Project context is required.' }, { status: 400 });
    }

    // Call context-grounded AI Assistant with safety guardrails
    const result = await askVisualiserAI({
      question,
      projectState: projectState as ProjectState,
    });

    return NextResponse.json({
      success: true,
      answer: result.answer,
      relevantStages: result.relevantStages,
      safetyNotes: result.safetyNotes,
      suggestedAction: result.suggestedAction,
    });
  } catch (error) {
    console.error('Error answering project question:', error);
    return NextResponse.json(
      { error: 'Failed to answer question.' },
      { status: 500 }
    );
  }
}
