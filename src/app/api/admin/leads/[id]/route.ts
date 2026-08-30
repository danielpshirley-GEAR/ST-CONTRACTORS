import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';
import { CrmStage } from '@/lib/db/schema';
import { dispatchLeadWebhook } from '@/lib/crm/webhook-dispatcher';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifyAdminAuth();
    if (!session.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const lead = await db.getLeadById(id);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const project = await db.getProjectByLeadId(lead.id);

    return NextResponse.json({
      success: true,
      lead,
      project,
    });
  } catch (error) {
    console.error('Error fetching lead details:', error);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifyAdminAuth();
    if (!session.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    if (body.stage) {
      const updated = await db.updateLeadStage(id, body.stage as CrmStage);
      if (!updated) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
    }

    if (body.newNote && body.author) {
      const updated = await db.addLeadNote(id, body.author, body.newNote);
      if (!updated) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
    }

    const lead = await db.getLeadById(id);
    const project = await db.getProjectByLeadId(lead?.id || id);

    if (body.stage && lead) {
      await dispatchLeadWebhook({
        event: 'stage_changed',
        lead,
      });
    }

    return NextResponse.json({
      success: true,
      lead,
      project,
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
