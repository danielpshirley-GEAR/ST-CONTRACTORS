import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { auditContentQuality } from '@/lib/content/quality-audit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await verifyAdminAuth();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content, slug } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'title and content are required' }, { status: 400 });
    }

    const report = auditContentQuality(title, content, slug);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Error auditing content quality:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
