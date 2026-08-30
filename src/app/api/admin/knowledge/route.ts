import { NextRequest, NextResponse } from 'next/server';
import { constructionKnowledgeBank } from '@/lib/knowledge/knowledge-bank';
import { ConstructionKnowledgeRecord } from '@/types/knowledge-bank';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      records: constructionKnowledgeBank,
    });
  } catch (error) {
    console.error('Error fetching knowledge records:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ConstructionKnowledgeRecord>;

    if (!body.title || !body.problemSummary || !body.tradeSolution) {
      return NextResponse.json({ error: 'Title, problem summary, and trade solution are required' }, { status: 400 });
    }

    const newRecord: ConstructionKnowledgeRecord = {
      id: body.id || `kb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: body.category || 'structural',
      title: body.title,
      serviceSlugs: body.serviceSlugs || ['full-renovation'],
      propertyTypes: body.propertyTypes || ['terraced'],
      propertyEras: body.propertyEras || ['victorian'],
      boroughs: body.boroughs || ['London & South East'],
      problemSummary: body.problemSummary,
      rootCause: body.rootCause || 'Age-related material fatigue and historic installation standards.',
      howIdentifiedOnSite: body.howIdentifiedOnSite || 'Visual inspection during strip-out.',
      warningSignsForHomeowners: body.warningSignsForHomeowners || ['Visible cracking or moisture staining.'],
      tradeSolution: body.tradeSolution,
      whyThisSolution: body.whyThisSolution || 'Restores structural integrity and complies with Building Regulations.',
      recommendedMaterials: body.recommendedMaterials || [],
      materialsToAvoid: body.materialsToAvoid || [],
      tradeSequence: body.tradeSequence || [],
      estimatedCostImpact: body.estimatedCostImpact || '£1,000 – £2,500',
      estimatedDelayImpact: body.estimatedDelayImpact || '+2–4 days',
      riskIfIgnored: body.riskIfIgnored || 'Structural failure, water ingress, or non-compliance.',
      builderObservationQuote: body.builderObservationQuote,
      surveyorInspectionChecklist: body.surveyorInspectionChecklist || [],
      frequentlyAskedCustomerQuestion: body.frequentlyAskedCustomerQuestion,
      verifiedBuilderAnswer: body.verifiedBuilderAnswer,
      verifiedBy: body.verifiedBy || 'Senior Construction Project Manager',
      approvedForPublicContent: body.approvedForPublicContent ?? true,
      isInternalOnly: body.isInternalOnly ?? false,
      dateAdded: new Date().toISOString().split('T')[0],
      lastVerified: new Date().toISOString().split('T')[0],
    };

    constructionKnowledgeBank.unshift(newRecord);

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error) {
    console.error('Error saving knowledge record:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
