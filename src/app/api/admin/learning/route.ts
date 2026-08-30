import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';
import { getLearningCalibrationOverview, logProjectOutturn } from '@/lib/learning/engine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminAuth();
    if (!session.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const overview = getLearningCalibrationOverview();

    return NextResponse.json({
      success: true,
      overview,
    });
  } catch (error) {
    console.error('Error fetching learning overview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminAuth();
    if (!session.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.referenceCode || !body.customerName || !body.quotedContractValueGbp) {
      return NextResponse.json({ error: 'Missing required outturn fields' }, { status: 400 });
    }

    const record = logProjectOutturn(body);

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (error) {
    console.error('Error logging project outturn:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
