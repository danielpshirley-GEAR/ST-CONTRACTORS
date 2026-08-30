import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projects = await db.getCustomerProjects(session.user.id);
  return NextResponse.json({
    success: true,
    projects,
  });
}

export async function POST(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, inputData, scopeItems, recommendations, estimateResult, notes } = body;

    if (!inputData || !scopeItems || !estimateResult) {
      return NextResponse.json({ error: 'inputData, scopeItems, and estimateResult are required' }, { status: 400 });
    }

    const savedProject = await db.saveProjectForCustomer(session.user.id, {
      title,
      inputData,
      scopeItems,
      recommendations: recommendations || [],
      estimateResult,
      notes,
    });

    return NextResponse.json({
      success: true,
      project: savedProject,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save project' }, { status: 500 });
  }
}
