import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const project = await db.getCustomerProjectById(params.id, session.user.id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const [documents, consultations] = await Promise.all([
    db.getCustomerDocuments(session.user.id, params.id),
    db.getCustomerConsultations(session.user.id),
  ]);

  const linkedConsultation = consultations.find((c) => c.projectId === params.id || c.leadId === project.leadId);

  return NextResponse.json({
    success: true,
    project,
    documents,
    consultation: linkedConsultation,
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updates = await req.json();
    const updated = await db.updateCustomerProject(params.id, session.user.id, updates);

    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      project: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const success = await db.deleteCustomerProject(params.id, session.user.id);
  if (!success) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Project deleted successfully' });
}
