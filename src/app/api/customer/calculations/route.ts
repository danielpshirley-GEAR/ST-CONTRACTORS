import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const calculations = await db.getCustomerCalculations(session.user.id);
  return NextResponse.json({
    success: true,
    calculations,
  });
}

export async function POST(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { calculatorSlug, calculatorTitle, category, inputs, outputs } = body;

    if (!calculatorSlug || !calculatorTitle || !outputs) {
      return NextResponse.json({ error: 'calculatorSlug, calculatorTitle, and outputs are required' }, { status: 400 });
    }

    const saved = await db.saveCalculationForCustomer(session.user.id, {
      calculatorSlug,
      calculatorTitle,
      category: category || 'general',
      inputs: inputs || {},
      outputs,
    });

    return NextResponse.json({
      success: true,
      calculation: saved,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save calculation' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const success = await db.deleteCustomerCalculation(id, session.user.id);
  return NextResponse.json({ success });
}
