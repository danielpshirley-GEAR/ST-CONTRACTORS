import { NextRequest, NextResponse } from 'next/server';
import { generateBudgetOptimizationOptions } from '@/lib/ai/planner';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inputData, currentEstimatedTotal, targetBudget } = body;

    if (!inputData) {
      return NextResponse.json({ error: 'inputData is required' }, { status: 400 });
    }

    const options = generateBudgetOptimizationOptions(
      inputData,
      currentEstimatedTotal || 70000,
      targetBudget
    );

    return NextResponse.json({
      success: true,
      options,
      totalPotentialSavingsGbp: {
        low: options.reduce((acc, o) => acc + o.estimatedSavingMinGbp, 0),
        high: options.reduce((acc, o) => acc + o.estimatedSavingMaxGbp, 0),
      },
    });
  } catch (error) {
    console.error('Error optimizing budget:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
