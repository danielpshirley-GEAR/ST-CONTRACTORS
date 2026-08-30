import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, metadata } = body;

    if (!eventName) {
      return NextResponse.json({ error: 'eventName is required' }, { status: 400 });
    }

    await db.logAnalyticsEvent({
      sessionId: req.cookies.get('apex_session_id')?.value || 'anonymous',
      eventName,
      metadata: metadata || {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
  }
}
