import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { dataForSeoService } from '@/lib/seo/dataforseo';

export async function POST(req: NextRequest) {
  const session = await verifyAdminAuth();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { keyword } = await req.json();
    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    const [metric, competitors] = await Promise.all([
      dataForSeoService.researchKeyword(keyword),
      dataForSeoService.findKeywordCompetitors(keyword),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        metric,
        competitors,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to research keyword' }, { status: 500 });
  }
}
