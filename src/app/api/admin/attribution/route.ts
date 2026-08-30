import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { getAttributionOverviewReport } from '@/lib/attribution/engine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminAuth();
    if (!session.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const report = getAttributionOverviewReport();

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Error fetching attribution overview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
