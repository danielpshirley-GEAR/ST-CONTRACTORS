import { NextRequest, NextResponse } from 'next/server';
import {
  interpretHomeownerBriefWithAI,
  analyzeUploadedAsset,
} from '@/lib/ai/visualiser-ai';
import { createInitialProjectState } from '@/lib/visualiser/project-state-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      briefText,
      images,
      dimensions,
      propertyType,
      propertyEra,
      location,
      budget,
      desiredCompletion,
    } = body;

    if (!briefText && (!images || images.length === 0)) {
      return NextResponse.json(
        { error: 'Please provide a project description or upload an image to begin.' },
        { status: 400 }
      );
    }

    // 1. Analyze uploaded images if present
    const imageAnalyses = [];
    if (images && Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        const analysis = await analyzeUploadedAsset({
          url: img.url,
          filename: img.filename || 'uploaded-photo.jpg',
        });
        imageAnalyses.push(analysis);
      }
    }

    // 2. Structured LLM Brief Interpretation
    const aiExtraction = await interpretHomeownerBriefWithAI({
      briefText: briefText || '',
      dimensions,
      propertyType,
      propertyEra,
      location,
      budget,
      desiredCompletion,
      imageAnalyses,
    });

    // 3. Hydrate state with deterministic engineering & calculation engine
    const effectiveBrief = briefText?.trim()
      ? briefText.trim()
      : images && images.length > 0
      ? 'Space assessment from uploaded photograph'
      : '';

    const state = createInitialProjectState({
      briefText: effectiveBrief,
      images,
      dimensions,
      propertyType,
      propertyEra,
      location,
      budget,
      desiredCompletion,
      aiExtraction,
      imageAnalyses,
    });

    return NextResponse.json({
      success: true,
      projectState: state,
    });
  } catch (error) {
    console.error('Error interpreting visualiser brief:', error);
    return NextResponse.json(
      { error: 'Failed to interpret project brief. Please try again.' },
      { status: 500 }
    );
  }
}
