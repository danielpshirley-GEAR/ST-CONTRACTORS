/**
 * POST /api/visualiser/generate-visual
 * Generates real visual concepts and performs conversational image modifications.
 * Complies with Phase 7C Specification (Items 4, 5, 6, 7, 8).
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateVisualConcept } from '@/lib/ai/visual-generator';
import { ProjectState } from '@/types/visualiser-scope';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const state = body.state as ProjectState;

    if (!state || !state.projectTypes) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing project state payload' },
        { status: 400 }
      );
    }

    const result = await generateVisualConcept({
      state,
      customPromptOverride: body.customPromptOverride,
      sourceImageUrl: body.sourceImageUrl,
      modificationInstruction: body.modificationInstruction,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[API generate-visual] Error generating visual concept:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Failed to generate visual concept',
      },
      { status: 500 }
    );
  }
}
