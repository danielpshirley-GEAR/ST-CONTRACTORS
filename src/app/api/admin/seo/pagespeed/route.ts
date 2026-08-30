import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { pageSpeedService } from '@/lib/seo/pagespeed';

export async function POST(req: NextRequest) {
  const session = await verifyAdminAuth();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { url = '/', device = 'MOBILE' } = await req.json();
    const result = await pageSpeedService.auditPageSpeed(url, device);

    return NextResponse.json({
      success: true,
      audit: result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to run PageSpeed audit' }, { status: 500 });
  }
}
