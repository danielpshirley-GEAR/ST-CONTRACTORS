import { NextRequest, NextResponse } from 'next/server';
import { generateEraSpecificBuilderChecklist } from '@/lib/ai/planner';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const era = searchParams.get('era') || 'victorian';
    const projectType = searchParams.get('projectType') || 'extension';

    const checklist = generateEraSpecificBuilderChecklist(era, projectType);

    return NextResponse.json({
      success: true,
      propertyEra: era,
      projectType,
      checklist,
    });
  } catch (error) {
    console.error('Error generating builder checklist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
