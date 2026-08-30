import { NextRequest, NextResponse } from 'next/server';
import { interpretProjectDescription } from '@/lib/ai/planner';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 });
    }

    const interpretation = interpretProjectDescription(text);
    return NextResponse.json({
      success: true,
      ...interpretation,
    });
  } catch (error) {
    console.error('Error interpreting description:', error);
    return NextResponse.json({ error: 'Failed to interpret project description' }, { status: 500 });
  }
}
