import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { geminiSeoService } from '@/lib/seo/gemini';

export async function POST(req: NextRequest) {
  const session = await verifyAdminAuth();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { keyword, volume, intent, position } = await req.json();
    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    const brief = await geminiSeoService.generateContentBrief({
      targetKeyword: keyword,
      monthlyVolume: volume,
      intent,
      currentPosition: position,
    });

    return NextResponse.json({
      success: true,
      brief,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate content brief' }, { status: 500 });
  }
}
