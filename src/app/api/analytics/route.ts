import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isCommercialConversion } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, metadata, sessionId, category, label, value, attribution, firstTouchAttribution, url } = body;

    if (!eventName) {
      return NextResponse.json({ error: 'eventName is required' }, { status: 400 });
    }

    const resolvedSessionId =
      sessionId ||
      req.cookies.get('st_session_id')?.value ||
      req.cookies.get('apex_session_id')?.value ||
      'anonymous';

    const resolvedCategory = category || (isCommercialConversion(eventName) ? 'Commercial' : 'Micro');

    await db.logAnalyticsEvent({
      sessionId: resolvedSessionId,
      eventName,
      category: resolvedCategory,
      label,
      value,
      metadata: {
        ...(metadata || {}),
        url,
        attribution,
        firstTouchAttribution,
      },
    });

    return NextResponse.json({ success: true, eventName, category: resolvedCategory });
  } catch (error) {
    console.error('[API/ANALYTICS] Error:', error);
    return NextResponse.json({ error: 'Failed to record event', details: String(error) }, { status: 500 });
  }
}
