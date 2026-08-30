import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { checkAllIntegrationHealth } from '@/lib/seo/health';

export async function GET(req: NextRequest) {
  const session = await verifyAdminAuth();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const healthResults = await checkAllIntegrationHealth();
    return NextResponse.json({
      success: true,
      services: healthResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to check health' }, { status: 500 });
  }
}
