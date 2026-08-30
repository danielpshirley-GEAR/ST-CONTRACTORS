import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const consultations = await db.getCustomerConsultations(session.user.id);
  return NextResponse.json({
    success: true,
    consultations,
  });
}

export async function POST(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { projectId, type, requestedDate, requestedTimeSlot, notes } = body;

    if (!type) {
      return NextResponse.json({ error: 'Consultation type is required' }, { status: 400 });
    }

    const consultation = await db.requestCustomerConsultation(session.user.id, {
      projectId,
      type,
      requestedDate,
      requestedTimeSlot,
      notes,
    });

    return NextResponse.json({
      success: true,
      consultation,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to book consultation' }, { status: 500 });
  }
}
