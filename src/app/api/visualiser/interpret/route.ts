import { NextRequest, NextResponse } from 'next/server';
import { createInitialProjectState } from '@/lib/visualiser/project-state-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { briefText, images, dimensions, propertyType, propertyEra, location, budget, desiredCompletion } = body;

    if (!briefText && (!images || images.length === 0)) {
      return NextResponse.json(
        { error: 'Please provide a project description or upload an image to begin.' },
        { status: 400 }
      );
    }

    const state = createInitialProjectState({
      briefText: briefText || 'Transform existing space with modern architectural finishes',
      images,
      dimensions,
      propertyType,
      propertyEra,
      location,
      budget,
      desiredCompletion,
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
