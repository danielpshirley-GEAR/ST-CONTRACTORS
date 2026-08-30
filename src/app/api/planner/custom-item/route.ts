import { NextRequest, NextResponse } from 'next/server';
import { classifyCustomUserItem } from '@/lib/ai/planner';
import { FinishLevel } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  try {
    const { text, areaName, finishLevel } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Item description is required' }, { status: 400 });
    }

    const item = classifyCustomUserItem(text, areaName || 'Custom Work', (finishLevel as FinishLevel) || 'standard');
    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error('Error classifying custom item:', error);
    return NextResponse.json({ error: 'Failed to classify custom item' }, { status: 500 });
  }
}
