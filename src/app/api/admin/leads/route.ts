import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminAuth();
    if (!session.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const stage = searchParams.get('stage') || undefined;
    const scoreBand = searchParams.get('scoreBand') || undefined;
    const search = searchParams.get('search') || undefined;

    const leads = await db.getLeads({ stage, scoreBand, search });

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error('Error fetching admin leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
