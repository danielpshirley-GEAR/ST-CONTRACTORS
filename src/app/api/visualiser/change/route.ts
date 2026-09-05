/**
 * POST /api/visualiser/change
 * Parses conversational change requests into atomic operations and updates ProjectState.
 * Complies with Phase 7C Specification (Items 7, 8, 9, 10).
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseProjectChangeWithAI } from '@/lib/ai/visualiser-ai';
import { generateVisualConcept } from '@/lib/ai/visual-generator';
import { applyProjectChange, restoreProjectVersion } from '@/lib/visualiser/project-state-engine';
import { ProjectState } from '@/types/visualiser-scope';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectState, changePrompt, restoreVersionNumber } = body;

    if (!projectState) {
      return NextResponse.json(
        { error: 'projectState is required.' },
        { status: 400 }
      );
    }

    // Handle true immutable version restoration (Item 8)
    if (restoreVersionNumber !== undefined) {
      const restored = restoreProjectVersion(projectState as ProjectState, Number(restoreVersionNumber));
      return NextResponse.json({
        success: true,
        projectState: restored,
      });
    }

    if (!changePrompt) {
      return NextResponse.json(
        { error: 'changePrompt is required.' },
        { status: 400 }
      );
    }

    // 1. Parse natural language change into structured operations via LLM (Item 9, 10)
    const changeResponse = await parseProjectChangeWithAI(
      changePrompt,
      projectState as ProjectState
    );

    // 2. Generate new visual if modification affects visual appearance (Item 7)
    let generatedVisual: any = undefined;
    const isRestart = Boolean(body.restartFromOriginal);
    if (isRestart || changeResponse.requiresVisualRegeneration || changePrompt.toLowerCase().includes('cabinet') || changePrompt.toLowerCase().includes('floor') || changePrompt.toLowerCase().includes('navy') || changePrompt.toLowerCase().includes('oak') || changePrompt.toLowerCase().includes('original')) {
      const visualOutput = await generateVisualConcept({
        state: projectState as ProjectState,
        modificationInstruction: changePrompt,
        restartFromOriginal: isRestart,
      });
      generatedVisual = {
        imageUrl: visualOutput.imageUrl,
        generationId: visualOutput.generationId,
        generationVersion: visualOutput.generationVersion,
        provider: visualOutput.provider,
        prompt: visualOutput.prompt,
        conceptType: visualOutput.conceptType,
        historyItem: visualOutput.visualHistoryItem,
      };
    }

    // 3. Apply controlled atomic mutations and dependency recalculation
    const updatedState = applyProjectChange(
      projectState as ProjectState,
      changePrompt,
      changeResponse.operations,
      generatedVisual
    );

    return NextResponse.json({
      success: true,
      projectState: updatedState,
      summaryOfChange: changeResponse.summaryOfChange,
      affectedModules: changeResponse.affectedModules,
    });
  } catch (error) {
    console.error('Error applying visualiser project change:', error);
    return NextResponse.json(
      { error: 'Failed to update project state.' },
      { status: 500 }
    );
  }
}
