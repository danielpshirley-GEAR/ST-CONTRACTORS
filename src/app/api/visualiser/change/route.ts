import { NextRequest, NextResponse } from 'next/server';
import { applyProjectChange } from '@/lib/visualiser/project-state-engine';
import { ProjectState } from '@/types/visualiser-scope';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectState, changePrompt } = body;

    if (!projectState || !changePrompt) {
      return NextResponse.json(
        { error: 'Both projectState and changePrompt are required.' },
        { status: 400 }
      );
    }

    const updatedState = applyProjectChange(projectState as ProjectState, changePrompt);

    return NextResponse.json({
      success: true,
      projectState: updatedState,
    });
  } catch (error) {
    console.error('Error applying visualiser project change:', error);
    return NextResponse.json(
      { error: 'Failed to update project state.' },
      { status: 500 }
    );
  }
}
