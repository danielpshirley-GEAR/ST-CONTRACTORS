import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { opportunityEngineService } from '@/lib/seo/opportunity-engine';
import { OpportunityPriority, OpportunityType } from '@/lib/seo/types';

export async function GET(req: NextRequest) {
  const session = await verifyAdminAuth();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const priority = searchParams.get('priority') as OpportunityPriority | null;
  const type = searchParams.get('type') as OpportunityType | null;

  try {
    const opportunities = await opportunityEngineService.getUnifiedOpportunities({
      priority: priority || undefined,
      type: type || undefined,
    });

    return NextResponse.json({
      success: true,
      opportunities,
      total: opportunities.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch opportunities' }, { status: 500 });
  }
}
