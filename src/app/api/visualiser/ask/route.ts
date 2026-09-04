import { NextRequest, NextResponse } from 'next/server';
import { askProjectAssistantWithAI } from '@/lib/ai/visualiser-ai';
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

    // Call context-grounded AI Assistant with safety guardrails (Item 12, 13, 14)
    const answer = await askProjectAssistantWithAI(
      projectState as ProjectState,
      question
    );

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error('Error answering project question:', error);
    return NextResponse.json(
      { error: 'Failed to answer question.' },
      { status: 500 }
    );
  }
}
