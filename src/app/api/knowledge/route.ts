import { NextRequest, NextResponse } from 'next/server';
import { constructionKnowledgeBank } from '@/lib/knowledge/knowledge-bank';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const service = searchParams.get('service');
    const propertyType = searchParams.get('propertyType');
    const borough = searchParams.get('borough');
    const category = searchParams.get('category');

    let records = constructionKnowledgeBank.filter((r) => r.approvedForPublicContent);

    if (service) {
      records = records.filter((r) => r.serviceSlugs.includes(service as any));
    }
    if (propertyType) {
      records = records.filter((r) => r.propertyTypes.includes(propertyType as any));
    }
    if (borough) {
      records = records.filter((r) => !r.boroughs || r.boroughs.includes(borough));
    }
    if (category) {
      records = records.filter((r) => r.category === category);
    }

    return NextResponse.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    console.error('Error querying knowledge bank:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
