import { NextRequest, NextResponse } from 'next/server';
import { ProjectState } from '@/types/visualiser-scope';
import { constructionKnowledgeBank } from '@/lib/knowledge/knowledge-bank';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectState, question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'A question is required.' }, { status: 400 });
    }

    const state = projectState as ProjectState;
    const lowerQ = question.toLowerCase();

    // Contextual responses based on state & London builder knowledge
    let answer = '';

    if (lowerQ.includes('engineer') || lowerQ.includes('structural') || lowerQ.includes('steel') || lowerQ.includes('rsj')) {
      answer = `For your ${state.projectTypes.map(t => t.replace(/-/g, ' ')).join(' & ')}, a structural engineer is necessary whenever load-bearing walls are altered or large glazing spans are created. In London Victorian homes, the engineer calculates exact Universal Column/Beam (RSJ) sizing and concrete padstones to prevent ceiling deflection and ensure Building Control Part A compliance.`;
    } else if (lowerQ.includes('cost') || lowerQ.includes('budget') || lowerQ.includes('price') || lowerQ.includes('reduce') || lowerQ.includes('save')) {
      answer = `Your current indicative range is ${state.budgetAlignment.indicativeCostRange.formatted}. To optimise the budget without compromising structural quality: (1) Keep primary foul drainage close to existing drops to avoid extensive underground pipework; (2) Standardise kitchen cabinetry modules; (3) Prioritise high-performance Low-E solar glass and subfloor joist sistering over cosmetic luxury fixtures initially.`;
    } else if (lowerQ.includes('living') || lowerQ.includes('stay') || lowerQ.includes('occupy') || lowerQ.includes('noise')) {
      answer = `Over 80% of our clients stay in the property during ground-floor extensions and kitchen renovations. We erect sealed dust-barrier screens and heavy-duty floor cladding, while maintaining a temporary cooking/utility station in another room with water and microwave facilities.`;
    } else if (lowerQ.includes('party wall') || lowerQ.includes('neighbour')) {
      answer = `Under the Party Wall etc. Act 1996, you must serve formal notice to adjoining neighbours at least 2 months prior to excavating foundations within 3m or inserting steel beams into a shared wall. We recommend serving notices during the architectural drawing stage so awards are signed before builders arrive on site.`;
    } else if (lowerQ.includes('drain') || lowerQ.includes('sewer') || lowerQ.includes('thames water') || lowerQ.includes('manhole')) {
      answer = `If your extension sits within 3m of a shared sewer pipe, Thames Water requires a formal Build-Over Agreement. During initial strip-out, we run a CCTV drainage survey from the nearest inspection chamber to verify pipe depth and install double-sealed airtight internal manhole covers where necessary.`;
    } else {
      answer = `Regarding your plan for ${state.originalBrief}: Based on our construction experience with ${state.property.type.value} properties in London, the key priorities are ensuring structural load paths are engineered early, ordering long-lead glazing 4–6 weeks ahead, and verifying subfloor joist levelness before fitting finished surfaces.`;
    }

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error('Error answering project question:', error);
    return NextResponse.json(
      { error: 'Failed to answer question.' },
      { status: 500 }
    );
  }
}
