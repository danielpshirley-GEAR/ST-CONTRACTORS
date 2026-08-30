import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UnifiedProjectProfile } from '@/types/project-profile';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const sessionId = searchParams.get('sessionId');

    if (!id && !sessionId) {
      return NextResponse.json({ error: 'id or sessionId is required' }, { status: 400 });
    }

    const profile = await db.getUnifiedProfile(id || sessionId!);
    if (!profile) {
      return NextResponse.json({ error: 'Project profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching project profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<UnifiedProjectProfile>;
    const saved = await db.saveUnifiedProfile(body);
    return NextResponse.json({ success: true, profile: saved });
  } catch (error) {
    console.error('Error saving project profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
