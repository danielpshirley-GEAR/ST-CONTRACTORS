import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId') || undefined;

  const documents = await db.getCustomerDocuments(session.user.id, projectId);
  return NextResponse.json({
    success: true,
    documents,
  });
}

export async function POST(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { projectId, fileName, fileSize, fileType, category, fileUrl, notes } = body;

    if (!fileName || !category) {
      return NextResponse.json({ error: 'fileName and category are required' }, { status: 400 });
    }

    const doc = await db.uploadCustomerDocument(session.user.id, {
      projectId,
      fileName,
      fileSize: fileSize || 1024 * 500,
      fileType: fileType || 'application/pdf',
      category,
      fileUrl: fileUrl || `/uploads/${fileName.toLowerCase().replace(/\s+/g, '-')}`,
      notes,
    });

    return NextResponse.json({
      success: true,
      document: doc,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to upload document' }, { status: 500 });
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

  const success = await db.deleteCustomerDocument(id, session.user.id);
  return NextResponse.json({ success });
}
